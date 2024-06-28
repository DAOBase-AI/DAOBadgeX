<template>
  <div class="bg-white relative z-10">
    <div
      class="mt-20 relative text-whitebase"
      style="
        background: rgba(255, 255, 255, 0.05);
        border-radius: 32px 32px 0px 0px;
      "
    >
      <div class="home-padding">
        <div
          class="relative items-center pt-8 md:pt-10 pb-4 md:pb-8 border-b border-white-010 flex justify-between gap-4 flex-col md:flex-row"
        >
          <div
            class="text-base md:text-xl font-bold text-whitebase"
            style="max-width: 500px"
          >
            Stay ahead of the game with DAO BASE updates. Subscribe now!
          </div>
          <div class="flex items-center gap-2 md:gap-4">
            <el-input
              class="emailInputFooter md:w-460px"
              v-model="state.email"
              :style="`width:${isLGScreen ? 'auto' : '225px'};height: ${
                isLGScreen ? '56px' : '40px'
              }`"
              placeholder="Enter your email"
            >
              <template #prefix>
                <span class="icon iconfont icon-renshu"></span>
              </template>
            </el-input>
            <button
              @click="doSend"
              class="daobase-btn"
              :style="`width:  ${isLGScreen ? '126px' : '110px'}; height: ${
                isLGScreen ? '56px' : '40px'
              }`"
            >
              Subscribe
            </button>
          </div>
        </div>
        <div class="footer-line">
          <div class="max-w-7xl mx-auto mt-10 text-whitebase">
            <div class="mb-3 flex flex-col justify-between md:flex-row">
              <div
                class="flex flex-col md:items-center justify-center mb-6 md:block md:mb-0"
              >
                <img
                  class="block mb-4 md:mb-6"
                  src="@/assets/images/logo.avif"
                  alt=""
                  style="width: 112px"
                />
                <div class="font-16 font-bold mb-3 md:hidden">DAO BASE</div>
                <div
                  style="max-width: 476px"
                  class="font-12 max-w-2xl"
                >
                  DAOBase is a comprehensive DAO aggregator and search engine.
                  It assists DAOs and users in building their own reputation
                  layer by aggregating fundamental information, social data,
                  treasury assets, governance details, and more. With DAOBase,
                  you can seamlessly monitor and evaluate the performance of
                  DAOs, enabling you to gather valuable insights and make
                  well-informed decisions.
                </div>

                <!-- <div class="flex space-x-6 items-center mt-8">
            <div class="text-xl font-bold">SOCIAL MEDIA</div>
            <a
              href="https://twitter.com/thepass_to"
              target="_blank"
              class="iconfont icon-twittershise font-20 cursor-pointer"
            ></a>
            <a
              href="https://discord.gg/N6f25tPs9W"
              target="_blank"
              class="iconfont icon-discrodshise font-30 cursor-pointer"
            ></a>
            <a
              href="https://t.me/daobase_ai"
              target="_blank"
              class="iconfont icon-telegramshise font-30 cursor-pointer"
            ></a>
            <a
              href="https://medium.com/@thepass_to"
              target="_blank"
              class="iconfont icon-hulu font-30 cursor-pointer"
            ></a>
          </div> -->
              </div>

              <div class="flex">
                <div
                  class="home-mr-100 space-y-4 flex-1 flex flex-col items-start"
                >
                  <div class="md:text-xl font-bold">SUPPORT</div>
                  <router-link
                    class="block lighter-text text-sm md:text-base whitespace-nowrap"
                    to="/partners"
                  >
                    Supported Platforms
                  </router-link>
                  <a
                    class="ligter-text block lighter-text text-sm md:text-base"
                    href="https://docs.daobase.ai/daobase"
                    target="_blank"
                    >Wiki</a
                  >
                  <a
                    class="ligter-text block lighter-text text-sm md:text-base"
                    href="https://daobase.notion.site/DAO-BASE-Development-and-Operation-Footprints-8c85c5ed3a8e4a2f8dbb6188def3d3ba"
                    target="_blank"
                    >Footprints</a
                  >

                  <a
                    class="ligter-text block lighter-text text-sm md:text-base"
                    v-for="text in [
                      { text: 'Github', link: 'https://github.com/DAOBase-AI' },
                    ]"
                    :key="text"
                    :href="text.link"
                    target="_blank"
                    >{{ text.text }}</a
                  >
                  <router-link
                    class="block lighter-text text-sm md:text-base"
                    to="/brand"
                  >
                    Brand
                  </router-link>
                </div>
                <div class="space-y-4 flex-1 flex flex-col items-start">
                  <div class="md:text-xl font-bold">PRODUCTS</div>

                  <div
                    v-for="text in [
                      { text: 'Ecology', link: '/ecology' },
                      { text: 'DAO100', link: '/dao100' },
                      {
                        text: 'NFT Value',
                        link: 'https://nftvalue.thepass.to',
                        target: '_blank',
                      },
                      {
                        text: 'Podcast',
                        link: 'https://anchor.fm/thepass-to',
                        target: '_blank',
                      },
                      { text: 'Metaverse IP', link: '/0xSaya' },
                    ]"
                    :key="text.link"
                  >
                    <tippy
                      content="coming soon"
                      :arrow="false"
                      v-if="text.disabled"
                    >
                      <div
                        class="cursor-not-allowed text-sm md:text-base"
                        style="color: #ffffff99"
                      >
                        {{ text.text }}
                      </div>
                    </tippy>

                    <a
                      class="text-sm md:text-base lighter-text"
                      :href="text.link"
                      v-else-if="text.target"
                      :target="text.target"
                    >
                      {{ text.text }}
                    </a>

                    <router-link
                      v-else
                      class="block lighter-text text-sm md:text-base whitespace-nowrap"
                      :to="text.link"
                      >{{ text.text }}</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex flex-col md:flex-row justify-between md:items-center pt-3 border-t border-white-010"
            >
              <div
                class="md:h-10 font-10 md:font-bold md:text-center footer-text"
              >
                @2021-2024, DAO BASE . All Rights Reserved.
              </div>
              <div>
                <div class="flex md:justify-center">
                  <div
                    class="md:home-mt-24 md:home-mb-32 grid grid-cols-4 gap-4"
                  >
                    <a
                      href="https://twitter.com/daobase_ai"
                      target="_blank"
                      class="iconfont icon-Twitter2 font-20 cursor-pointer"
                    ></a>
                    <a
                      href="https://discord.gg/N6f25tPs9W"
                      target="_blank"
                      class="iconfont icon-discrod2 font-20 cursor-pointer"
                    ></a>
                    <a
                      href="https://t.me/daobase_ai"
                      target="_blank"
                      class="iconfont icon-telegram font-20 cursor-pointer"
                    ></a>
                    <a
                      href="https://medium.com/@daobase_ai"
                      target="_blank"
                      class="iconfont icon-hulu font-20 cursor-pointer"
                    ></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { subscribeEmail } from '@/api/dao';
import { withThrottling } from '@/utils/with';
import { notify } from '@kyvg/vue3-notification';
import { reactive } from '@vue/reactivity';
import { useMediaQuery } from '@vueuse/core';

const isLGScreen = useMediaQuery('(min-width: 1024px)');
const props = defineProps({
  hasSocialMediaLinks: { type: Boolean, default: true },
});
const doSend = withThrottling(async () => {
  state.loading = true;
  try {
    await subscribeEmail(state.email);
    state.visible = false;
    notify({
      type: 'success',
      text: 'Subscribe Success.',
    });
  } catch (error) {
    notify({
      type: 'error',
      text: 'Subscribe Failed.',
    });
  }

  state.loading = false;
});
const state = reactive({
  emailView: false,
  email: '',
});
</script>

<style>
@media (min-width: 768px) {
  .emailInputFooter {
    --el-input-width: 460px;
  }
}
.emailInputFooter {
  --el-input-bg-color: transparent;
  --el-border-color: rgba(255, 255, 255, 0.1);
  --el-text-color-regular: white;
  --el-border-radius-base: 8px;
}
.emailInputFooter input[type='text'] {
  background-color: transparent;
}
.footer-allright {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.text-gray {
  color: rgba(255, 255, 255, 0.5);
}

.home-mb-64 {
  margin-bottom: 4.4vw;
}

.home-mr-100 {
  margin-right: 6.94vw;
}

.footer-text {
  color: #ffffff80;
}

@media screen and (max-width: 768px) {
  .footer-text {
    color: #5e6873;
    border: none;
  }
}

.home-email {
  width: 11.1vw;
  height: 11.1vw;
  background: #fff;
}
.home-email:hover .home-email-bg {
  height: 11.1vw;
}
.home-email:hover i {
  color: white;
}
.home-email-bg {
  height: 0;
  transition: all 0.6s;
}

.home-logo {
  width: 36.1vw;
  height: 10.7vw;
}
.home-size {
  font-size: 16px;
}
.home-size-20 {
  font-size: 1.38vw;
}
.home-size-36 {
  font-size: 2.5vw;
}
.home-size-72 {
  font-size: 5vw;
}
.home-btn {
  white-space: nowrap;
}

.home-mb-16 {
  margin-bottom: 1.11vw;
}
.home-mt-24 {
  margin-top: 1.67vw;
}
.home-mt-40 {
  margin-top: 2.78vw;
}
.home-pb-40 {
  padding-bottom: 2.78vw !important;
}
.home-mb-40 {
  margin-bottom: 2.78vw;
}
.home-mb-64 {
  margin-bottom: 4.4vw;
}
.home-mt-200 {
  margin-top: 13.89vw;
}
.home-mt-352 {
  margin-top: 24.4vw;
}
.home-mb-32 {
  margin-bottom: 2.2vw;
}
.home-my-56 {
  margin: 3.89vw 0;
}
.home-mr-100 {
  margin-right: 6.94vw;
}
.home-pb-32 {
  padding-top: 2.2vw;
}

.home-email {
  width: 11.1vw;
  height: 11.1vw;
  background: #fff;
}
.home-email:hover .home-email-bg {
  height: 11.1vw;
}
.home-email:hover i {
  color: white;
}
.home-email-bg {
  height: 0;
  transition: all 0.6s;
}

.mounted-logo {
  opacity: 0;
  transform: rotateX(90deg);
  transition-property: all;
  transition-duration: 1.2s;
  transition-timing-function: cubic-bezier(0.26, 1, 0.48, 1);
  transform-origin: center bottom;
  perspective: 20vw;
}

.mounted-logo-animated {
  opacity: 1;
  transform: rotateX(0deg);
}

.mounted-btn {
  opacity: 0;
  transform: translateY(50%);
  transition-property: all;
  transition-duration: 1s;
}
.mounted-btn-animated {
  opacity: 1;
  transform: translateY(0);
}

.mounted-intro {
  opacity: 0;
  transform: translateY(80%);
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.26, 1, 0.48, 1);
  transition-duration: 1.2s;
  transition-delay: 125ms;
}
.mounted-intro-animated {
  opacity: 1;
  transform: translateY(0);
}

/* Go animated Go */
.mounted-logo-inner {
  transform: translateY(110%);
  transition-duration: 1.2s;
  transition-timing-function: cubic-bezier(0.26, 1, 0.48, 1);
  transition-property: opacity, transform;
  transform-origin: center bottom;
}

.mounted-logo-inner__animated {
  transform: translateY(0);
}

.mounted-logo-outter {
  transform: rotateX(90deg);
  transition-duration: 1.2s;
  transition-timing-function: cubic-bezier(0.26, 1, 0.48, 1);
  transition-property: opacity, transform;
}

.mounted-logo-outter__animated {
  transform: rotateX(0deg);
}

.mounted-logo-box {
  transform: rotateX(-90deg) rotateY(0deg);
  transition-duration: 1.2s;
  transition-timing-function: cubic-bezier(0.26, 1, 0.48, 1);
  transition-property: opacity, transform;
}

.footer-text {
  color: #ffffff80;
}
.logo-word {
  width: 68px;
  height: 154px;
  transition: all 0.3s;
}
@media screen and (max-width: 768px) {
  .logo-word {
    width: 35px;
    height: 80px;
  }
  .footer-text {
    color: #5e6873;
    border: none;
    margin-bottom: 8px;
  }
}

.mounted-logo-box__animated {
  transform: rotateX(0deg);
}
</style>
