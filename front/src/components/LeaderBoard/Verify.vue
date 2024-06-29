<template>
  <Page :bottomPadding="false">
    <div
      class="text-whitebase flex-col md:flex-row flex md:justify-between items-center w-full h-full"
    >
      <div class="w-full md:w-2/5 md:mr-10">
        <BackBtn></BackBtn>
        <div class="mt-6 p-8 rounded" style="background: #ffffff0d">
          <div class="text-center font-bold text-4xl mb-14">
            {{ $route.params.daoName }}
          </div>
          <div class="grid grid-cols-2 gap-6">
            <a href="javascript:void(0);" @click="jumpTweets">
              <div class="comeon-left hover:opacity-80 transition-opacity">
                <div class="text-xl font-bold mb-2 text-center">
                  <i class="iconfont icon-Twitter2 text-2xl mr-2"></i> Share
                </div>

                <div class="text-center">
                  Be our guardian and invite the DAO to claim their profile!
                </div>
              </div>
            </a>

            <div
              class="comeon-right transition-opacity cursor-pointer"
              :class="{
                'comeon-right__active': state.loading,
              }"
              @click="verify"
            >
              <div
                class="text-xl font-bold mb-2 flex justify-center items-center"
              >
                <i class="iconfont icon-Twitter2 text-2xl mr-2"></i> Claim
                <div>
                  <Spin v-if="state.loading" class="mx-auto"></Spin>
                </div>
              </div>
              <div class="text-center">This DAO belongs to us.</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-4 md:mt-0"
        :style="isDesktop ? 'width:600px;height:600px' : ''"
      >
        <!-- <LottieAnimation
          :animationData="json"
          :height="'100%'"
          :width="'100%'"
        ></LottieAnimation> -->
      </div>
    </div>
  </Page>
</template>

<script setup>
import { reactive } from 'vue';
import Page from '@/components/Page.vue';
// import { json } from '@/assets/lottie/data2.js';
import BackBtn from '@/components/BackBtn.vue';
import { useRoute } from 'vue-router';
import { twVerify, twVerifyByPath } from '@/api/dao';
import Spin from '@/components/Spin.vue';
import { withThrottling } from '@/utils/with';
import { useDesktop } from '@/hooks';
import { startTask } from '@/api/user';

const isDesktop = useDesktop();

const $route = useRoute();

const state = reactive({
  loading: false,
});

const jumpTweets = async () => {

  if($route.query.path.includes('taskId=3')) {
    const taskRes = await startTask(3);
    console.log("task done::", taskRes);
  }
  
  const twTitle = `Hey @${$route.params.twName}! check out your treasury and governance dashboards on DAOBase! Claim and verify your profile to earn the verification checkmark and join hundreds of other DAOs on the platform. %0a`;

  const twUrl = `${location.origin}/dao/${$route.query.path}`;

  window.open(
    `https://twitter.com/intent/tweet?text=${twTitle}&url=${twUrl}`,
    '_blank',
  );
};

const verify = withThrottling(async () => {

  state.loading = true;

  const x = await twVerifyByPath(
    $route.query.path,
    `${window.location.origin}/twoauth/${$route.params.daoName}`,
  );
  console.log('twverifyres', x);
  state.loading = false;
  if (x) window.location.href = x;
});
</script>

<style scoped>
.comeon-left {
  padding: 48px 16px 24px;
  border-radius: 4px;
  min-height: 192px;
  background: #ff5585;
}
.comeon-right {
  padding: 48px 16px 24px;
  border: 1px solid #fff;
  border-radius: 4px;
  min-height: 192px;
  transition: all 0.3s;
}
.comeon-right:hover,
.comeon-right__active {
  border: 1px solid #fff;
  background: white;
  color: black;
}
</style>
