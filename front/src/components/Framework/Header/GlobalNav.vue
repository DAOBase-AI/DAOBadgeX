<template>
  <div as="nav" class="relative overflow-hidden h-full hidden lg:block">
    <div class="h-full flex">
      <div class="h-full flex">
        <div
          v-for="header in globalTabs"
          class="global-nav--item h-full px-4 flex items-center whitespace-nowrap"
          :key="header.name"
          :class="{
            'global-nav--active ': $route.meta.nav == header.key,
            'global-nav--lighter': !$route.meta.nav,
            'global-nav--disabled': header.disabled,
          }"
        >
          <el-dropdown
            trigger="click"
            placement="bottom-start"
            @visible-change="handleChange"
            v-if="header.isDropDown"
          >
            <div
              class="font-bold text-base text-white-060 hover:text-whitebase"
              :class="{
                'hover-underline-animation': !header.disabled,
                'global-nav--active underline-animation':
                  $route.meta.nav == header.key,
                'global-nav--lighter': !$route.meta.nav,
                'global-nav--disabled': header.disabled,
              }"
            >
              {{ header.name
              }}<span
                class="ml-1 icon iconfont"
                :class="{
                  'icon-right': !state.isOpen,
                  'icon-xia1': state.isOpen,
                }"
              >
              </span>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(option, i) in header.dropDownLinks"
                  :key="i"
                  :command="option.link"
                  class="h-10 px-2 py-1.5 text-white-070 text-sm text-bold line-clamp-1"
                  :class="{ el_tab_active: $route.meta.type === option.key }"
                  style="min-width: 144px"
                >
                  <tippy
                    content="Coming Soon"
                    v-if="option.disabled"
                    :arrow="false"
                  >
                    <div class="text-white-040 cursor-not-allowed">
                      {{ option.name }}
                    </div>
                  </tippy>

                  <a :href="option.link" target="_self" v-else>
                    {{ option.name }}
                  </a>
                  <!-- <span class="text-white-040">
                  ({{
                    ft.chain === 'matic'
                      ? 'Polygon'
                      : ft.chain?.charAt(0).toUpperCase() + ft.chain?.slice(1)
                  }})
                </span> -->
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <tippy
            :content="header.tip"
            v-else-if="header.disabled"
            :arrow="false"
          >
            <div class="hover:text-whitebase hover-underline-animation">
              {{ header.name }}
            </div>
          </tippy>

          <router-link :to="header.link" v-else-if="!header.target">
            <div class="flex items-center">
              <div
                v-if="header.name"
                class="hover:text-whitebase"
                :class="{
                  'hover-underline-animation': !header.disabled,
                  'global-nav--active underline-animation':
                    $route.meta.nav == header.key,
                }"
              >
                {{ header.name }}
              </div>
              <img v-if="header.img" :src="header.img" class="w-5 h-5 ml-2" />
              <img
                v-if="header.imgName"
                :src="header.imgName"
                style="width: 88px"
              />
            </div>
          </router-link>

          <a v-else :href="header.link" :target="header.target">
            <div
              class="hover:text-whitebase"
              :class="{ 'hover-underline-animation': !header.disabled }"
            >
              {{ header.name }}
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();
const handleChange = (newState) => {
  state.isOpen = newState;
};
const handleClick = (link) => {
  console.log(link);
  if (link) $router.push(link);
};
const globalTabs = [
  {
    name: 'DAO Hub',
    link: '/creator',
    key: 'Creator',
  },
  {
    name: 'Leaderboard',
    img: require('@/assets/icons/hot.gif'),
    link: '/leaderboard',
    key: 'LeaderBoard',
  },
  {
    name: 'Proposal',
    link: '/proposals',
    key: 'Proposals',
  },
  // {
  //   name: 'Member',
  //   img: require('@/assets/icons/new.gif'),
  //   link: '/members',
  //   key: 'Members',
  // },
  {
    name: 'Points',
    img: require('@/assets/icons/new.gif'),
    link: '/point',
    key: 'Points',
  },
  // {
  //   name: 'Ecology',

  //   link: '/ecology',
  //   key: 'Ecology',
  // },
  // {
  //   name: 'Podcast',
  //   link: 'https://anchor.fm/thepass-to',
  //   target: '_blank',
  //   key: 'Podcast',
  // },
  // {
  //   name: 'Wiki',
  //   link: 'https://thepass.gitbook.io/the-pass/',
  //   target: '_blank',
  //   key: 'wiki',
  // },
  {
    name: 'Blogs',
    link: '/blog',
    key: 'Blog',
  },
  {
    name: 'Footprints',
    link: 'https://daobase.notion.site/DAO-BASE-Development-and-Operation-Footprints-8c85c5ed3a8e4a2f8dbb6188def3d3ba',
    target: '_blank',
    key: 'Footprints',
  },
  {
    name: 'Services',
    isDropDown: true,
    key: 'Service',
    dropDownLinks: [
      {
        name: 'DAO Audit',
        link: '/audit',
        key: 'Audit',
      },
      {
        name: 'Advertising',
        link: '',
        key: 'xx',
        disabled: true,
        tip: 'coming soon',
      },
      {
        name: 'AI Integration',
        link: '',
        key: 'xx',
        disabled: true,
        tip: 'coming soon',
      },
      {
        name: 'Data API',
        link: '',
        key: 'xx',
        disabled: true,
        tip: 'coming soon',
      },
    ],
  },
  {
    name: null,
    link: '/mintdaobadge',
    key: 'mint dao badge',
    imgName: require('@/assets/logo/daobase.png'),
  },
];

const navAni = ref(null);
const control = ref(null);
const lineWidth = 100;

const state = reactive({
  switch: false,
  isOpen: false,
});

onMounted(() => {
  // control.value = new mojs.Timeline({
  //   repeat: 0,
  //   duration: 300,
  //   easing: 'ease.inout',
  // }).add(
  //   new mojs.Shape({
  //     parent: navAni.value,
  //     shape: 'line',
  //     stroke: '#fff',
  //     radius: lineWidth,
  //     left: '50%',
  //     top: { '50%': '80%' },
  //     isShowStart: true,
  //   }).then({
  //     left: { '50%': 0 },
  //     radius: { [lineWidth]: 0 },
  //   }),
  //   new mojs.Shape({
  //     parent: navAni.value,
  //     shape: 'line',
  //     stroke: '#fff',
  //     radius: lineWidth,
  //     left: '50%',
  //     top: { '20%': '80%' },
  //     isShowStart: true,
  //   }).then({
  //     left: { '50%': '100%' },
  //     radius: { [lineWidth]: 0 },
  //   }),
  //   new mojs.Shape({
  //     parent: navAni.value,
  //     shape: 'line',
  //     stroke: '#fff',
  //     top: '80%',
  //     opacity: { 1: 0 },
  //     isShowStart: true,
  //     isShowEnd: true,
  //   }),
  // );
});

const play = () => {
  if (state.switch) {
    return;
  }
  state.switch = true;
  console.log(state.switch);
  control.value.replay();
};

const backplay = () => {
  if (!state.switch) {
    return;
  }
  state.switch = false;
  control.value.replayBackward();
};
</script>

<style>
.el_tab_active {
  background-color: rgba(255, 255, 255, 0.07);
}
.el-popper__arrow {
  display: none !important;
}
.el-dropdown-menu__item {
  color: white !important;
}
.el-dropdown-menu {
  padding: 0 !important;

  background: #2a2e33ff !important;
}
.el-dropdown-menu__item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
.el-popper.is-light {
  border: none !important;
  background: #2a2e33ff !important;
}
.global-nav--wrapper {
  width: 16px;
  opacity: 0;
  transition: all 0.3s;
  transition-delay: 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.global-nav--wrapper__animated {
  width: 440px;
  opacity: 1;
}

.global-nav--item {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 24px;
  font-weight: bold;
}

.global-nav--item.global-nav--disabled {
  color: #ffffff99;
  cursor: not-allowed;
}

.global-nav--lighter {
  color: #ffffff;
  transition: all 0.3s;
}

.global-nav--item__hover:hover,
.global-nav--active {
  color: #ffffff;
  transition: all 0.3s;
}

.mo-nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.hover-underline-animation {
  position: relative;
}

.hover-underline-animation::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;

  background: linear-gradient(315deg, #ff5585 0%, #268cff 100%);
  transform-origin: bottom center;
  transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover::after {
  transform: scaleX(1);
  transform-origin: bottom center;
}
.underline-animation {
  position: relative;
}

.underline-animation::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;

  background: linear-gradient(315deg, #ff5585 0%, #268cff 100%);
  transform-origin: bottom center;
  transition: transform 0.25s ease-out;
  transform: scaleX(1);
  transform-origin: bottom center;
}
</style>
