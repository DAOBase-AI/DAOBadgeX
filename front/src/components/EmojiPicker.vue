<template>
  <Popper :placement="props.placement">
    <slot></slot>
    <template v-slot:content="{ close }">
      <div>
        <div
          ref="scroll"
          class="h-40 p-2 bg-whitebase overflow-y-scroll rounded overscroll-contain"
          style="width: 19rem"
        >
          <div class="" ref="bodyInner">
            <div
              class=""
              v-for="(group, key) in localEmojis"
              :id="key"
              :key="key"
            >
              <!-- <h5>{{ GROUP_NAMES[key] }}</h5> -->
              <div>
                <button
                  @click="
                    close();
                    handleClick(emoji);
                  "
                  v-for="emoji in group"
                  :key="emoji.u"
                  class="mr-2"
                >
                  <img
                    class="w-6 h-6"
                    :src="EMOJI_REMOTE_SRC + `/${emoji.u}.png`"
                    :alt="emoji.n[0]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script setup>
import { defineEmits, ref, defineProps } from 'vue';
import Popper from 'vue3-popper';
import emojis from '@/constants/emojis.json';

const EMOJI_REMOTE_SRC =
  'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@6.0.1/img/apple/64';

const GROUP_NAMES = {
  smileys_people: 'Smiles & People',
  animals_nature: 'Animals & Nature',
  food_drink: 'Food & Drink',
  activities: 'Activities',
  travel_places: 'Travel places',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
};

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom',
  },
});

const scroll = ref(null);

const emits = defineEmits(['select']);

const filterEmojis = () => {
  const _emojiData = {};
  Object.keys(emojis).forEach((key) => {
    const _emojis = emojis[key].filter((emoji) => {
      return emoji.n[0].includes('');
    });
    if (_emojis.length) {
      _emojiData[key] = _emojis;
    }
  });
  return _emojiData;
};
const localEmojis = filterEmojis();

function handleClick(emoji) {
  emits('select', {
    ...emoji,
    i: emoji.u
      .split('-')
      .map((hex) => parseInt(hex, 16))
      .map((hex) => String.fromCodePoint(hex))
      .join(''),
  });
  setTimeout(() => {
    scroll.value.scrollTop = 0;
  });
}
</script>

<style lang="scss" scoped></style>
