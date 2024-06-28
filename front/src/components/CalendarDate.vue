<template>
  <div
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    :class="{
      'bg-white-005': visible && Object.keys(date.events).length < 1,
    }"
  >
    <div
      class="pb-2"
      :class="{
        'bg-white-005': visible && Object.keys(date.events).length > 0,
        'pl-4 pt-2 ': !isToday(date.fullDate),
        ' pl-2 pt-1 ': isToday(date.fullDate),
      }"
    >
      <div
        :class="{
          'rounded-full bg-inputActive w-7 h-7 flex items-center justify-center':
            isToday(date.fullDate),
        }"
      >
        {{ date.date }}
      </div>
    </div>
    <div class="event-container relative">
      <div
        v-for="(eventGroup, eventType, i) in date.events"
        :key="eventType"
        class="event-group flex flex-col justify-center relative"
        :class="{
          'h-15': Object.keys(date.events).length === 1,
          'h-7.5': Object.keys(date.events).length === 2,
          'h-5': Object.keys(date.events).length === 3,
        }"
        :style="`background:${
          eventType === 'daoProposal'
            ? '#12D3A21A'
            : eventType === 'meeting'
            ? '#F725851A'
            : '#4895EF1A'
        }`"
      >
        <div
          v-for="event in eventGroup.slice(
            0,
            Object.keys(date.events).length > 1 ? 1 : 3,
          )"
          :key="event.startTime"
        >
          <span class="line-clamp-1">{{ event.title }}</span>
        </div>
        <div
          class="w-1 absolute left-0 z-10"
          :class="{
            'top-0 h-15': Object.keys(date.events).length === 1,

            'top-0 h-7.5': Object.keys(date.events).length === 2,
            'top-7.5 ': Object.keys(date.events).length === 2 && i === 1,
            'top-0 h-5': Object.keys(date.events).length === 3,
            'top-5 h-5': Object.keys(date.events).length === 3 && i === 1,
            'top-10 h-5': Object.keys(date.events).length === 3 && i === 2,
            ['bg-' + eventType]: eventType,
          }"
        ></div>
        <div
          v-if="
            (Object.keys(date.events).length === 1 && eventGroup.length > 3) ||
            (Object.keys(date.events).length > 1 && eventGroup.length > 1)
          "
          class="absolute right-0 bottom-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
          style="background: #41cb4bdf"
        >
          +{{
            Object.keys(date.events).length === 1 && eventGroup.length > 3
              ? eventGroup.length - 3
              : Object.keys(date.events).length > 1 && eventGroup.length > 1
              ? eventGroup.length - 1
              : ''
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';

const visible = ref(false);
const props = defineProps({ date: {} });

const today = new Date();
today.setHours(0, 0, 0, 0); // Reset time part to compare only dates
const isToday = (date) => {
  return date.setHours(0, 0, 0, 0) === today.getTime();
};
</script>
<style>
.el-popper {
  --el-popover-title-text-color: #ffffffff;
}
.el-popover__title {
  font-weight: bold;
}
.el-popper.is-light {
  border: none !important;
  background: transparent !important;
  backdrop-filter: blur(10px) !important;
}
.el-input {
  --el-component-size: 52px;
  --el-border: #2a2e33;
  --el-border-color: #2a2e33;
  --el-color-primary: #2a2e33;
  --el-text-color-regular: white;
}
.calendar-container {
  max-width: 100%;
  margin: auto;
  text-align: center;
  border: 1px solid red;
  border-radius: 8px;
}

.calendar-container button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.weekdays,
.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.date-label {
  margin-top: 16px;
  margin-left: 16px;
  margin-bottom: 8px;
}
.weekdays div {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  height: 64px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(255, 255, 255, 0.05);
}

.dates div {
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* .dates div:hover {
  background-color: #f0f0f0;
} */

/* Color for dates in the current month */
.dates div:not(.not-current-month) {
  color: white; /* or any color you prefer */
}

/* Color for dates not in the current month */
.not-current-month {
  color: rgba(255, 255, 255, 0.4) !important; /* or any color you prefer */
}
.dates div.dates-container {
  min-height: 101px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.1),
    inset 1px 0 0 0 rgba(255, 255, 255, 0.1); /* Inner borders */

  position: relative; /* Needed for z-index */
  z-index: 1;
}
/* Styles to manage the outer borders */
/* Remove left border for the leftmost column */
.dates div.dates-container:nth-child(7n + 1) {
  box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
}

/* Remove bottom border for the bottommost row */
.dates div.dates-container:nth-last-child(-n + 7) {
  box-shadow: inset 1px 0 0 0 rgba(255, 255, 255, 0.1);
}

/* Remove left and bottom border for the bottom leftmost cells */
.dates div.dates-container:nth-child(7n + 1):nth-last-child(-n + 7) {
  box-shadow: none;
}
/* Adjust the top border for the first row */

.dates div.event-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Fixed height for each date */
  overflow: hidden;
  height: 60px;
  font-size: 12px;
}

.dates div.event-group {
  padding-left: 12px;
  padding-right: 8px;
  overflow: hidden;
}
</style>
