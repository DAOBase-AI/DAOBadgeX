<template>
  <div
    class="cursor-pointer h-60 flex items-center"
    style="background: #2a2e33"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @drop="onDrop"
    @click="onClick"
  >
    <div
      class="w-full"
      :class="{
        'pointer-events-none': !state.fileConfig || !props.successName,
      }"
    >
      <div
        v-if="!state.fileConfig && !props.successName"
        class="flex items-center justify-center"
      >
        <div
          class="w-16 h-16 rounded-full flex justify-center items-center mr-8"
          style="background: rgba(255, 255, 255, 0.1)"
        >
          <i
            class="iconfont icon-piliangcaozuo-48 text-2xl"
            v-if="!state.dragOver"
          ></i>
          <i
            class="iconfont icon-xiajiantou text-2xl transform rotate-180"
            v-else
          ></i>
        </div>

        <div class="text-xs text-center">
          <div v-if="!state.dragOver">
            <span>Drag Your File Here</span>
            <br />
            <span class="text-xs" style="color: #5e6873">
              (Please use the templete above)
            </span>
          </div>
          <div v-else>Drop your files to upload</div>
        </div>
      </div>

      <div class="w-full text-xs" v-else>
        <div
          class="mx-6 px-4 flex items-center h-20 justify-between rounded"
          style="background: rgba(255, 255, 255, 0.1)"
        >
          <div class="flex">
            <i
              v-if="state.loading"
              class="iconfont icon-xls-50 text-5xl mr-3"
              :style="{
                color: '#fff',
              }"
            ></i>
            <i
              v-if="!state.loading && (state.status || props.successName)"
              class="iconfont icon-xls-50 text-5xl mr-3"
              :style="{
                color: 'rgba(38, 170, 255, 1)',
              }"
            ></i>
            <i
              v-if="!state.loading && !state.status && !props.successName"
              class="iconfont icon-cuowuwenjian-51 text-5xl mr-3"
              :style="{
                color: '#fff',
              }"
            ></i>

            <div>
              <div class="h-6 text-sm">
                <div v-if="!!state.fileConfig">{{ state.fileConfig.name }}</div>
                <div v-else-if="props.successName">{{ props.successName }}</div>
              </div>
              <div class="h-5" style="color: rgba(94, 104, 115, 1)">
                <span v-if="state.loading"
                  >{{ state.load }} KB/{{ state.total }} KB
                </span>
                <span v-else>Uploaded now</span>
              </div>
            </div>
          </div>
          <div class="flex items-center" v-if="state.loading">
            <div class="mr-2" style="color: rgba(94, 104, 115, 1)">
              Uploading...
            </div>
            <ve-progress
              :size="32"
              :progress="state.progress"
              color="rgba(94, 255, 106, 1)"
              emptyColor="rgba(42, 46, 51, 1)"
            />
          </div>
          <div
            v-else-if="state.status || props.successName"
            class="iconfont icon-gou text-2xl"
            style="color: rgba(94, 255, 106, 1)"
          ></div>
          <div
            v-else
            class="iconfont icon-guanbi text-2xl"
            style="color: rgba(255, 38, 64, 1)"
          ></div>
        </div>
        <div class="flex justify-center mt-10">
          <UiButton
            class="inline-table"
            type="outline"
            size="sm"
            @click="onDelete"
            >DELETE</UiButton
          >
        </div>
      </div>
    </div>

    <!-- <UiButton
      type="outline"
      @click="onClick"
      :loading="state.loading"
      :disabled="state.loading"
      >UPLOAD</UiButton
    > -->
    <input
      ref="fileInput"
      type="file"
      @change="(e) => uploadFile(e.target.files[0])"
      class="hidden"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    />
  </div>
  <!-- <div class="mt-3 text-xs" v-if="state.fileName">
    {{ state.fileName }} <span v-if="state.loading">uploading...</span>
    <span v-else-if="state.status">upload successfully!</span>
    <span v-else> upload failed!</span>
  </div> -->
</template>

<script setup>
import UiButton from '@/components/UiButton.vue';
import { withThrottling } from '@/utils/with';
import { notify } from '@kyvg/vue3-notification';
import { reactive, defineProps, ref } from 'vue';

const fileInput = ref(null);

const props = defineProps({
  onUpload: Function,
  onSuccess: Function,
  onDelete: Function,
  accepts: {
    type: String,
    default: 'excel',
  },
  successName: String,
});

const state = reactive({
  dragOver: false,
  loading: false,
  status: false,
  fileConfig: null,
  progress: 0,
  load: 0,
  total: 0,
});

const onProgress = (progressConfig) => {
  state.total = Math.round(progressConfig.total / 1000);
  state.load = Math.round(progressConfig.loaded / 1000);

  state.progress = Math.round(
    (progressConfig.loaded * 100) / progressConfig.total,
  );
};

const uploadFile = withThrottling(async (file) => {
  state.loading = true;
  state.status = false;

  if (props.accepts && !new RegExp(props.accepts).test(file.type)) {
    notify({
      type: 'error',
      text: 'File Format Wrong',
    });
    state.dragOver = false;
  } else {
    state.fileConfig = file;
    try {
      const res = await props.onUpload(file, onProgress);
      if (props.onSuccess) {
        props.onSuccess(res, file.name);
      }
      notify({
        text: 'Upload successfully',
      });
      state.status = true;
    } catch (error) {
      notify({
        type: 'error',
        text: error.message,
      });
    }
  }

  fileInput.value.value = null;
  state.loading = false;
});

const onDragOver = (e) => {
  e.preventDefault();
  state.dragOver = true;
};

const onDragLeave = (e) => {
  e.preventDefault();
  console.log('leave!!!');
  state.dragOver = false;
};

const onDrop = (e) => {
  e.preventDefault();
  if (state.loading || state.fileConfig || props.successName) {
    return;
  }
  uploadFile(e.dataTransfer.files[0]);
};

const onDelete = (e) => {
  e.stopPropagation();
  state.fileConfig = null;
  state.dragOver = false;
  if (props.onDelete) {
    props.onDelete();
  }
};

const onClick = () => {
  if (state.loading || state.fileConfig || props.successName) {
    return;
  }
  fileInput.value.click();
};
</script>

<style scoped></style>
