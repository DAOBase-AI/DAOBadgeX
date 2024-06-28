<template>
  <div class="flex items-center">
    <div v-if="title" class="mr-1 xl:mr-4 text-whiteBase text-xs">
      {{ props.title }}
    </div>

    <div class="flex">
      <div
        class="button items-center font-bold text-xs h-10 flex"
        :class="{
          'border-t border-b border-white-010': selectedIndex !== i,
          'hover:bg-white-005': selectedIndex !== i,

          'border-l border-white-010': selectedIndex !== i && i === 0,
          'border-r border-white-010':
            selectedIndex !== i && i === props.options.length - 1,
        }"
        v-for="(option, i) in props.options"
        :key="i"
        @click="$emit('change', i)"
        :style="`
        background: ${
          selectedIndex == i &&
          'linear-gradient(315deg, #FF5585 0%, #268CFF 100%)'
        };

      
border-radius: ${
          i === 0
            ? '8px 0px 0px 8px'
            : i === props.options.length - 1
            ? '0px 8px 8px 0px'
            : '0px'
        };`"
      >
        <img v-if="option.icon" class="w-5 h-5" :src="option.icon" alt="" />
        <i
          v-if="option.iconFont"
          class="font-12 mr-0.5 icon iconfont text-whitebase"
          :class="option.iconFont"
        ></i>
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  options: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 },
});
defineEmits(['change']);
</script>
<style scoped>
.radio {
  position: relative;
}

.button {
  width: auto;

  cursor: pointer;
  padding: 6px 12px 9px 12px;
}

.button_active {
  background-image: linear-gradient(180deg, #ff5585ff, #ff5585ff);
  color: #fff;
}
.radio input:before {
  content: attr(label);
  display: inline-block;
  text-align: center;
  width: 100%;
}
</style>
