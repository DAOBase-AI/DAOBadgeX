<template>
  <div class="my-2 lg:my-0 flex-item flex items-center mr-4">
    <div v-if="title" class="mr-4 text-white-070 text-body">
      {{ props.title }}
    </div>
    <div class="flex space-x-2" :class="{ 'space-x-4': buttonLg }">
      <div
        class="hover:text-white-070 text-whitebase font-bold"
        :style="`
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 72px;
          padding: 0 16px;
          font-size:${buttonLg ? '16' : '12'}px;
          height:${buttonLg ? '40' : '32'}px;
          border-radius:${buttonLg ? '8' : '8'}px;
       
          border: ${selectedIndex == i ? '0px' : '1px'} solid ${
          selectedIndex == i ? 'transparent' : buttonLg ? '#FFFFFF' : '#2a2e33'
        };
          cursor: pointer;`"
        :class="{
          'active-button': selectedIndex == i,
        }"
        v-for="(option, i) in props.options"
        :key="i"
        @click="$emit('change', i)"
      >
        <img v-if="option.icon" class="w-5 h-5" :src="option.icon" alt="" />
        <i
          v-if="option.iconFont"
          class="font-12 mr-0.5 icon iconfont text-whitebase"
          :class="option.iconFont"
        ></i>
        {{ option.label ? option.label : option.name }}
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  buttonLg: { type: Boolean, default: false },
  title: { type: String, required: true },
  options: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 },
});

defineEmits(['change']);
</script>
<style></style>
