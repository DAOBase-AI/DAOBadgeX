<template>
  <div
    class="p-10 mt-12 flex items-center justify-between rounded bg-white-005 text-whitebase text-sm"
  >
    <div class="flex space-y-2">
      <div class="flex items-center">
        <UploadAvatar
          v-model="icon"
          avatarClass="w-20 h-20 mr-6 flex-shrink-0"
          @success="onUploadSuccess"
        ></UploadAvatar>
        <div class="flex-col space-y-4 justify-center w-96">
          <div class="flex items-center">
            <span>Username&nbsp;&nbsp;&nbsp;</span>
            <div class="flex-1 font-bold">
              {{ nickname }}
            </div>
            <i
              class="iconfont icon-bianji ml-6 cursor-pointer hover:opacity-80"
              @click="show = true"
            ></i>
          </div>

          <div class="flex items-center">
            <span>Address&nbsp;&nbsp;&nbsp;</span>
            <div class="flex-1 text-strong-blue text-xs">
              {{ token }}
            </div>
            <i
              class="iconfont icon-fuzhi2-29 cursor-pointer hover:opacity-80"
              @click="copyAddress"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex space-x-4 text-center">
        <div class="flex-col justify-center mr-6">
          <div class="text-4xl font-bold">
            {{ daoJoined }}
          </div>

          <div class="text-xs text-tip-0">DAO Joined</div>
        </div>
        <div class="text-center w-40">
          <div class="text-4xl font-bold">
            {{ daoCreated }}
          </div>

          <div class="text-xs text-tip-0">DAO Created</div>
        </div>
      </div>
    </div>
  </div>

  <UsernameDialog v-model="show" :username="nickname"></UsernameDialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { PlaceHolderImage } from '@/constants';
import { mapActions, mapGetters, mapState } from 'vuex';
import UsernameDialog from '@/components/Dialogs/Username.vue';
import UploadAvatar from '@/components/Framework/UploadAvatar.vue';
import { notify } from '@kyvg/vue3-notification';

/* 
  getUserInfo
 */

export default defineComponent({
  name: 'UserCard',
  data: () => ({
    show: false,
    avatarPicker: false,
  }),
  computed: {
    ...mapState({
      nickname: (state: any) => state.user.nickname,
      address: (state: any) => state.user.address,
      id: (state: any) => state.user.id,
      icon: (state: any) => {
        return state.user.icon;
      },
      token: (state: any) => state.wallet.token,
      daoCreated: (state: any) => state.user.daoCreated,
      daoJoined: (state: any) => state.user.daoJoined,
    }),
    ...mapGetters('user', ['shortAddress']),
  },
  components: {
    UploadAvatar,
    UsernameDialog,
  },
  methods: {
    ...mapActions('user', [
      'getUser',
      'setNickname',
      'updateUser',
      'getDAOCreated',
      'getUserInfo',
    ]),
    async onUploadSuccess(data: any) {
      try {
        await this.updateUser({
          avatarUrl: data,
        });
        notify({ text: 'Change avatar success.', duration: 5000 });
      } catch (error) {
        console.error(error);
        // this.popupErrorNotification(error);
      }
    },
    copyAddress() {
      navigator.clipboard.writeText(this.token);
      notify({
        text: 'Copy successfully',
        duration: 1200,
      });
      // this.showNotification = true;
      // setTimeout(() => {
      //   this.showNotification = false;
      // }, 5000);
    },
  },
  created() {
    this.getUserInfo();
  },
  setup() {
    const open = ref(false);

    return {
      editDialog: open,
      placeholderUrl: PlaceHolderImage,
    };
  },
});
</script>

<style scoped></style>
