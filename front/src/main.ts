import { createApp } from 'vue';
// import './registerServiceWorker';
import router from './router';
import store from './store';
import './index.css';
import VueI18n from './i18n';
import VueLazyload from 'vue3-lazyload';
// import Particles from 'particles.vue3';
import Notifications from '@kyvg/vue3-notification';
import VueClickAway from 'vue3-click-away';
import { unregister } from 'register-service-worker';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueTippy, { setDefaultProps } from 'vue-tippy';
import Vue3Marquee from 'vue3-marquee';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import veProgress from 'vue-ellipse-progress';
import Vue3Lottie from 'vue3-lottie';
import 'vue3-lottie/dist/style.css';
import Vue3Autocounter from 'vue3-autocounter';
import { Menu } from 'floating-vue';
import 'tippy.js/animations/scale.css';
import App from './App.vue';
import VueNumber from 'vue-number-animation';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import VueWordCloud from 'vuewordcloud';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { WagmiPlugin } from '@wagmi/vue';
import { smartWalletConfig } from '@/config/smartWallet';

let activeTippyInstance: any;

// hide the currently open tooltip
window.addEventListener('scroll', () => {
  if (activeTippyInstance && activeTippyInstance.state.isVisible) {
    activeTippyInstance.hide();
    activeTippyInstance.reference.blur(); // remove focus from target (fix for touch)
  }
});

setDefaultProps({
  animation: 'scale',
  duration: 300,
  onShow(instance) {
    activeTippyInstance = instance;
  },
});

const queryClient = new QueryClient();
const app = createApp(App);

// createApp(App)
app
  .use(store)
  .use(router)
  .use(WagmiPlugin, { config: smartWalletConfig })
  .use(VueQueryPlugin, { queryClient })
  .use(VueI18n)
  .use(VueLazyload, {})
  // .use(Particles)
  .use(Notifications)
  .use(VueClickAway)
  .use(PerfectScrollbar)

  .use(VueTippy, {
    animation: 'scale',
  })
  .use(VueNumber)
  .use(Vue3Marquee)
  .use(veProgress)
  .use(Vue3Lottie, { name: 'LottieAnimation' })
  .use(ElementPlus)
  .component('VMenu', Menu)
  .component(VueWordCloud.name, VueWordCloud)
  .component('vue3-autocounter', Vue3Autocounter)
  .mount('#app');

unregister();
