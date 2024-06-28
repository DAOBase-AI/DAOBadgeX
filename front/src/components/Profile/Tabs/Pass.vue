<template>
  <ul
    class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-6"
  >
    <li
      v-for="(project, i) in passes"
      :key="project.email"
      class="col-span-1 flex flex-col text-center divide-y divide-border mt-12"
      :class="{
        'bg-bg1': i % 2 === 0,
        'bg-bg2': i % 2 === 1,
      }"
    >
      <div
        class="flex-1 flex flex-col py-6 relative"
        v-if="(project.valid && valid === 1) || valid === 0"
      >
        <div v-if="(!project.valid && valid === 2) || valid === 0" class="mx-4">
          <div
            v-if="!project.valid"
            class="top-0 bottom-0 left-0 right-0 absolute bg-black bg-opacity-40"
          >
            <div class="mt-32">
              <div class="text-5xl text-white font-bold tracking-wider">
                {{ $t('Pass.ClaimBtn').toUpperCase() }}
              </div>
              <div class="w-8 h-1 bg-primary mx-auto my-4"></div>
              <div
                class="w-full h-12 bg-gradient-to-r from-gradientRed to-primary flex justify-center"
              >
                <div class="text-3xl font-bold text-black my-auto">
                  {{ $t('Creator.List.Tabs.PassInvalid').toUpperCase() }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="py-2 px-4 left-8 right-10 mx-auto bg-gradient-to-r text-xs font-bold from-babyblue to-babyblueGradient absolute -top-6 ml-2"
          >
            {{ $t(`Creator.Card.${project.type}`) }}
          </div>
          <img
            class="w-full flex-shrink-0 mx-auto bg-black object-cover"
            v-lazy="{
              src: 'https://picsum.photos/200/200',
              loading: placeholderUrl,
              error: placeholderUrl,
            }"
            alt=""
          />
          <h3 class="mt-2 text-gray-100 text-3xl font-bold">
            {{ project.name }}
          </h3>
          <div class="text-sm">
            <div class="flex justify-between mt-4">
              <span class="text-black">{{ $t('Profile.Pass.TokenID') }}</span>
              <span class="text-black">#{{ project.daoName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-black">{{ $t('Profile.Pass.TokenID') }}</span>
              <span class="text-babyblue"
                >#{{ (Math.random() * 10).toFixed(0) }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-black">{{ $t('Profile.Pass.ExpireAt') }}</span>
              <span class="text-primary">{{ project.expireAt }}</span>
            </div>
          </div>
          <div class="mt-2 flex justify-center space-x-2">
            <div class="bg-primary text-black font-bold px-4 w-full">
              {{ $t('Home.Projects.SquadBtn').toUpperCase() }}
            </div>
            <div
              class="bg-black text-primary font-bold px-4 w-full"
              v-if="project.type === 'bondingCurve'"
            >
              {{ $t('Home.Projects.SellBtn').toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { PlaceHolderImage } from '@/constants';
import { defineComponent } from '@vue/runtime-core';

const tabs = [
  { name: 'All', href: '/profile/pass/all', current: true },
  { name: 'Valid', href: '/profile/pass/valid', current: false },
  { name: 'Invalid', href: '/profile/pass/invalid', current: false },
];

export default defineComponent({
  name: 'PassAll',
  setup() {
    return {
      placeholderUrl: PlaceHolderImage,
      tabs,
      passes: [
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '2',
          expireAt: '2021-11-11',
          type: 'tokenBase',
          daoName: 'MiaCrap',
          valid: true,
        },
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '3',
          expireAt: '2021-11-11',
          type: 'tokenBase',
          daoName: 'MiaCrap',
          valid: false,
        },
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '4',
          expireAt: '2021-11-11',
          type: 'tokenBase',
          daoName: 'MiaCrap',
          valid: false,
        },
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '5',
          expireAt: '2021-11-11',
          type: 'tokenBase',
          daoName: 'MiaCrap',
          valid: true,
        },
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '2',
          expireAt: '2021-11-11',
          type: 'tokenBase',
          daoName: 'MiaCrap',
          valid: true,
        },
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '3',
          expireAt: '2021-11-11',
          type: 'fixedPrice',
          daoName: 'MiaCrap',
          valid: true,
        },
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '4',
          expireAt: '2021-11-11',
          type: 'bondingCurve',
          daoName: 'MiaCrap',
          valid: true,
        },
        {
          logo: 'https://picsum.photos/200/200',
          name: 'Vonda',
          id: '5',
          expireAt: '2021-11-11',
          type: 'bondingCurve',
          daoName: 'MiaCrap',
          valid: true,
        },
      ],
      valid: 0, // 0 - All, 1 - Valid, 2 - Invalid
    };
  },
});
</script>
