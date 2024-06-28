<template>
  <router-link
    :to="`/squad-details/${props.info.id}`"
    custom
    v-slot="{ navigate }"
    class=""
  >
    <div class="flex pt-6 relative">
      <div class="h-full mr-6">
        <div class="left-line mt-3"></div>
      </div>
      <div class="flex-1 bg-pass-bg bg-opacity-25 box-bg">
        <div class="px-4">
          <div class="flex pt-6">
            <div class="w-14 h-14 rounded-full overflow-hidden mr-4">
              <img
                v-if="props.info.user"
                class="w-full h-full"
                :src="props.info.user.avatarUrl"
                alt=""
              />
            </div>
            <div class="flex-1">
              <div class="flex justify-between mt-2 mb-4">
                <div class="flex items-center">
                  <div class="font-bold text-secondary-7 mr-4">
                    {{ props.info.user ? props.info.user.name : 'Unkonw' }}
                  </div>
                  <div class="text-strong-gray italic text-xs">
                    {{ formatSquadDate(props.info.createTime) }}
                  </div>
                </div>

                {{ props.info.userId }}{{ userInfo.id
                }}{{ props.info.userId == userInfo.id }}

                <SquadOptions
                  v-if="
                    props.dao.creatorName === userInfo.nickname ||
                    props.info.userId == userInfo.id
                  "
                  :isAdmin="props.dao.creatorName === userInfo.nickname"
                  :isMine="props.info.userId == userInfo.id"
                  :isTop="props.info.isTop"
                  @top="doTop(info)"
                  @delete="doDelete(info)"
                ></SquadOptions>
              </div>

              <div
                class="mb-4 font-bold cursor-pointer"
                v-if="!!props.info.title"
                @click="navigate"
              >
                {{ props.info.title }}
              </div>

              <ContentView
                class="text-sm leading-6 text-justify"
                @contentCick="navigate"
                :value="props.info.content"
              >
              </ContentView>
              <!-- <div>
              附件 Moon and Sixpence
            </div> -->
              <div v-if="props.info.imagesList.length > 0" class="mt-4">
                <ImgBox :imgs="props.info.imagesList"></ImgBox>
              </div>
            </div>
          </div>
          <div class="bg-pass-border mt-10" style="height: 1px"></div>
          <div class="flex py-4 pl-16">
            <div
              v-for="(item, i) in [
                {
                  icon: state.showComment
                    ? require('@/assets/images/squad_commetx.avif')
                    : require('@/assets/images/squad_commet.avif'),
                  count: props.info.commentCount,
                  behavior: clickComment,
                },
                {
                  icon: props.info.like
                    ? require('@/assets/images/squad_like.avif')
                    : require('@/assets/images/squad_unlike.avif'),
                  count: props.info.likeCount,
                  behavior: clickLike,
                },
                {
                  icon: require('@/assets/images/squad_share.avif'),
                  behavior: clickShare,
                },
              ]"
              class="flex items-center mr-14 cursor-pointer text-sm"
              @click="item.behavior(props.info)"
              :key="i"
            >
              <img class="w-4 h-4 mr-3" :src="item.icon" alt="" />
              <span v-if="item.count != undefined">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <div v-if="state.showComment" class="px-4 mt-4">
          <CommentInput
            :tableId="props.info.id"
            @published="onPublished"
          ></CommentInput>
          <div v-if="props.info.comments">
            <CommentItem
              :info="comment"
              v-for="(comment, i) in props.info.comments.slice(
                0,
                state.showCommentCount,
              )"
              :key="i"
            ></CommentItem>
          </div>
          <div
            v-if="
              props.info.comments &&
              props.info.comments.length > 2 &&
              state.showCommentCount < props.info.comments.length
            "
            class="py-4 text-center font-semibold cursor-pointer hover:underline"
            @click="showAll"
          >
            VIEW MORE COMMENTS >
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { reactive, defineProps, defineEmits, onMounted } from 'vue';
import EmojiPicker from '@/components/EmojiPicker.vue';
import SquadOptions from '@/views/SQUAD/SquadOptions.vue';
import { useUserInfo } from '@/hooks';
import { formatSquadDate } from '@/utils';
import { delSquad, querySquadComment, squadLike, topSquad } from '@/api/squad';
import { notify } from '@kyvg/vue3-notification';
import ContentView from '@/views/SQUAD/component/ContentView.vue';
import CommentInput from '@/views/SQUAD/component/CommentInput.vue';
import CommentItem from '@/views/SQUAD/component/CommentItem.vue';
import ImgBox from '@/components/ImageBox.vue';

const userInfo = useUserInfo();

const state = reactive({
  showComment: false,
  showCommentCount: 2,
  like: false,
});

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
  dao: {
    type: Object,
    default: () => ({}),
  },
  isMine: Boolean,
});

const emits = defineEmits(['top', 'del']);

const refreshComment = async (info) => {
  info.comments = await querySquadComment(info.id);
};

const clickComment = async (info) => {
  if (state.showComment) {
    state.showComment = false;
    return;
  }
  state.showComment = true;
  refreshComment(info);
};

const clickLike = async (info) => {
  await squadLike(info.id);
  info.like = !info.like;
  info.likeCount = info.likeCount + (info.like ? 1 : -1);
};

const clickShare = () => {
  /*  */
};

const doTop = async (info) => {
  await topSquad(info.id, props.isMine ? 'user' : 'admin');
  emits('top');
  /* 刷新列表 */
};

const doDelete = async (info) => {
  await delSquad(info.id);
  emits('del');

  /* 刷新列表 */
};

const onPublished = async () => {
  await refreshComment(props.info);
  // eslint-disable-next-line vue/no-mutating-props
  props.info.commentCount += 1;
};

const showAll = (info) => {
  state.showCommentCount = Math.min(
    state.showCommentCount + 10,
    props.info.comments.length,
  );
  state.showCommentCount += 10;
};

onMounted(() => {
  console.log(props.info);
});
</script>

<style scoped>
.input-style {
  background: #232526;
  box-shadow: -8px -8px 15px 0px rgba(0, 0, 0, 0.1),
    8px 8px 15px 0px rgba(0, 0, 0, 0.1);
}
.left-line {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 80%;
  background: linear-gradient(180deg, #8c1b29 0%, rgba(140, 27, 41, 0.2) 100%);
}
.divide-line {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.img-offset {
  margin-right: 0.48rem;
}
</style>
