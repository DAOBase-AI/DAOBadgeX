<template>
  <div>
    <!-- Month navigation -->
    <div
      class="mb-2 gap-2 md:gap-0 flex flex-wrap md:flex-nowrap justify-between items-center"
    >
      <div class="flex gap-6">
        <UiDropdown
          style="width: 92px"
          class="text-base"
          size="base"
          v-model="selectedYear"
          :isBetween="false"
          textCapital
          :options="yearOptions"
        ></UiDropdown>

        <div
          class="flex justify-between p-2 h-10 rounded-lg border border-white-010"
          style="width: 211px"
        >
          <button @click="changeMonth(-1)">
            <span class="icon iconfont icon-left"></span>
          </button>
          <span class="font-bold">{{ months[selectedMonth] }} </span>
          <button @click="changeMonth(1)">
            <span class="icon iconfont icon-right"></span>
          </button>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex items-center" @click="daoProposal = !daoProposal">
          <div
            :class="{
              'bg-daoProposal': daoProposal,
              'bg-white-010': !daoProposal,
            }"
            class="w-3 h-3 rounded mr-1"
          ></div>
          <div>Proposal Starts</div>
        </div>
        <div class="flex items-center" @click="meeting = !meeting">
          <div
            :class="{
              'bg-meeting': meeting,
              'bg-white-010': !meeting,
            }"
            class="w-3 h-3 rounded mr-1"
          ></div>
          <div>Meeting</div>
        </div>
        <div class="flex items-center" @click="twitterSpace = !twitterSpace">
          <div
            :class="{
              'bg-twitterSpace': twitterSpace,
              'bg-white-010': !twitterSpace,
            }"
            class="w-3 h-3 rounded mr-1"
          ></div>
          <div>Twitter Space</div>
        </div>
      </div>
    </div>
    <!-- Days of the week -->
    <div class="calendar-container relative">
      <div class="weekdays border-b border-white-010">
        <div v-for="day in weekDays" :key="day">{{ day }}</div>
      </div>
      <div
        v-if="loading"
        class="absolute blur-xl flex justify-center items-center w-full h-full"
      >
        <Spin size="3em"></Spin>
      </div>
      <!-- Calendar dates -->
      <!--  
        " -->
      <div class="dates">
        <div
          class="dates-container"
          v-for="date in calendarDatesWithEvents"
          :key="date.fullDate"
        >
          <div :class="{ 'not-current-month': !date.isCurrentMonth }">
            <el-popover
              hide-after="100"
              v-if="Object.keys(date.events).length > 0"
              width="320px"
              :show-arrow="false"
              :title="addOrdinalIndicator(date.fullDate)"
            >
              <template #reference>
                <CalendarDate :date="date" />
              </template>
              <template #default>
                <div class="overflow-y-auto" style="max-height: 240px">
                  <div
                    v-for="(eventGroup, eventType) in date.events"
                    :key="eventType"
                    class="event-group mb-2 flex flex-col justify-center text-whitebase"
                  >
                    <div
                      class="mb-2 cursor-pointer"
                      v-for="event in eventGroup"
                      :key="event.startTime"
                      @click="handleRedirect(event.link)"
                    >
                      <div
                        class="text-xs font-bold px-2 flex items-center"
                        :class="{ ['bg-' + eventType]: eventType }"
                      >
                        <div>
                          {{
                            eventType == 'daoProposal'
                              ? 'Proposal Start'
                              : eventType === 'twitterSpace'
                              ? 'Twitter Space'
                              : 'Meeting'
                          }}
                        </div>
                        <div class="ml-2 font-normal">
                          ({{ formatMeetingTime(event, eventType) }})
                        </div>
                      </div>
                      <div class="bg-white-010 p-2">
                        <div
                          class="text-sm"
                          :class="{
                            'hover:underline': eventType == 'daoProposal',
                          }"
                        >
                          {{ event.title }}
                        </div>
                        <div
                          class="text-xs"
                          v-if="eventType === 'twitterSpace'"
                        >
                          {{ event.creator }}
                          <span class="px-2 bg-inputActive rounded"> Host</span>
                        </div>
                        <div
                          class="text-sm"
                          v-if="event.description && eventType == 'meeting'"
                        >
                          <div class="text-sm text-white-040">
                            Instructions:
                          </div>
                          <div
                            class="text-sm"
                            v-html="formatDescription(event.description)"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-popover>
            <CalendarDate v-else :date="date" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReq } from '@/hooks';
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { getEvents } from '@/api/dao';
import { useRoute } from 'vue-router';
import CalendarDate from './CalendarDate.vue';
import Spin from '@/components/Spin.vue';
import UiDropdown from '@/components/UiDropdown.vue';

const events = ref([]); // New ref to store events
const twitterSpace = ref(true);
const daoProposal = ref(true);
const meeting = ref(true);

const selectedYear = ref({
  label: new Date().getFullYear(),
  value: new Date().getFullYear(),
});
const selectedMonth = ref(new Date().getMonth());

const formatDescription = (description) => {
  return description.replace(/\n/g, '<br>');
};
const formatMeetingTime = (event, eventType) => {
  if (eventType !== 'meeting') {
    return getHour(event.startTime);
  }

  let startTime = new Date(event.startTime * 1000);
  let endTime = new Date(event.endTime * 1000);

  // Check if the event is on the same day
  if (
    startTime.getDate() === endTime.getDate() &&
    startTime.getMonth() === endTime.getMonth() &&
    startTime.getFullYear() === endTime.getFullYear()
  ) {
    // Same day: display time range
    return `${getHour(event.startTime)} - ${getHour(event.endTime)}`;
  } else {
    // Different days: display date range
    return formatDateRange(startTime, endTime);
  }
};
const formatDateRange = (startDate, endDate) => {
  let startFormat = addOrdinalIndicatorShort(startDate);
  let endFormat = addOrdinalIndicatorShort(endDate);

  return `${startFormat} - ${endFormat}`;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const state = reactive({
  type: String,
  events: [],
  eventsValue: [],
  loading: false,
  selectedIndex: 0,
  timeType: 0,
});

const $route = useRoute();
const handleRedirect = (url) => {
  window.open(url);
};

const getHour = (unixTimestamp) => {
  let date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  // Get hours and minutes
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Convert to 12-hour format
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Format the time in "HH:MM AM/PM" format
  let formattedTime = hours + ':' + minutes + ' ' + ampm;
  return formattedTime;
};

const yearOptions = [
  { label: '2017', value: 2017 },
  { label: '2018', value: 2018 },
  { label: '2019', value: 2019 },
  { label: '2020', value: 2020 },
  { label: '2021', value: 2021 },
  { label: '2022', value: 2022 },
  { label: '2023', value: 2023 },
  { label: '2024', value: 2024 },
];

const addOrdinalIndicatorShort = (date) => {
  const nth = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const dayWithOrdinal = nth(date.getDate());
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${month} ${dayWithOrdinal}, ${year}`;
};
const addOrdinalIndicator = (date) => {
  const nth = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const dayWithOrdinal = nth(date.getDate());
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${month} ${dayWithOrdinal}, ${year}`;
};
const { loadData, loading } = useReq(async () => {
  // state.a = true;
  let firstVisibleDate = new Date(
    selectedYear.value.value,
    selectedMonth.value,
    1,
  );
  firstVisibleDate.setDate(
    firstVisibleDate.getDate() - firstVisibleDate.getDay(),
  );
  let lastVisibleDate = new Date(
    selectedYear.value.value,
    selectedMonth.value + 1,
    0,
  );
  lastVisibleDate.setDate(
    lastVisibleDate.getDate() + (6 - lastVisibleDate.getDay()),
  );

  const startDate = firstVisibleDate.getTime() / 1000;
  const endDate = lastVisibleDate.getTime() / 1000;
  getEvents($route.params.name, startDate, endDate).then((response) => {
    console.log('total events for the month: ', response);
    state.events = response;
    state.eventsValue = [
      ...(response['twitterSpace'] || []),
      ...(response['daoProposal'] || []),
      ...(response['googleMeeting'] || []),
    ];
    //   ...response['twitterSpace'],
    //   ...response['daoProposal'],
    //   ...response['googleMeeting'],
    // ];
  });
});
function determineEventType(event) {
  if (state.events['twitterSpace']?.includes(event)) return 'twitterSpace';
  if (state.events['daoProposal']?.includes(event)) return 'daoProposal';
  if (state.events['googleMeeting']?.includes(event)) return 'meeting';
  return null;
}
const startOfDay = (date) => {
  let newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const calendarDatesWithEvents = computed(() => {
  return calendarDates.value.map((date) => {
    const currentDate = startOfDay(date.fullDate);

    const dateEvents = state.eventsValue.filter((event) => {
      const eventStartDate = startOfDay(new Date(event.startTime * 1000));
      const eventEndDate = startOfDay(new Date(event.endTime * 1000));
      const isMeeting = determineEventType(event) === 'meeting';

      // For meetings, check if the current date is within the event's duration
      // For other events, just check if the start date matches
      return isMeeting
        ? currentDate >= eventStartDate && currentDate <= eventEndDate
        : currentDate.getTime() === eventStartDate.getTime();
    });

    const groupedEvents = dateEvents.reduce((acc, event) => {
      const eventType = determineEventType(event);
      if (eventType === 'daoProposal' && !daoProposal.value) return acc;
      if (eventType === 'meeting' && !meeting.value) return acc;
      if (eventType === 'twitterSpace' && !twitterSpace.value) return acc;
      if (!acc[eventType]) {
        acc[eventType] = [];
      }
      acc[eventType].push(event);
      return acc;
    }, {});

    return { ...date, events: groupedEvents };
  });
});

const calendarDates = computed(() => {
  let dates = [];
  let firstDay = new Date(selectedYear.value.value, selectedMonth.value, 1);
  let lastDay = new Date(selectedYear.value.value, selectedMonth.value + 1, 0);

  for (let i = firstDay.getDay(); i > 0; i--) {
    let prevMonthDate = new Date(
      selectedYear.value.value,
      selectedMonth.value,
      -i + 1,
    );
    dates.push({
      date: prevMonthDate.getDate(),
      fullDate: prevMonthDate,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    let date = new Date(selectedYear.value.value, selectedMonth.value, i);
    dates.push({ date: i, fullDate: date, isCurrentMonth: true });
  }

  let nextMonthDayCount = 6 - lastDay.getDay();
  for (let i = 1; i <= nextMonthDayCount; i++) {
    dates.push({
      date: i,
      fullDate: new Date(selectedYear.value.value, selectedMonth.value + 1, i),
      isCurrentMonth: false,
    });
  }

  return dates;
});

function changeMonth(step) {
  selectedMonth.value += step;
  if (selectedMonth.value < 0) {
    selectedMonth.value = 11;
  } else if (selectedMonth.value > 11) {
    selectedMonth.value = 0;
  }
}

onMounted(() => {
  loadData();
  watch(
    () => [selectedYear.value, selectedMonth.value],
    () => {
      loadData();
    },
  );
});
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
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  padding-top: 8px;
  padding-left: 16px;
  padding-bottom: 8px;
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

/* Color for dates in the current month */
.dates div:not(.not-current-month) {
  color: white; /* or any color you prefer */
}

/* Color for dates not in the current month */
.not-current-month {
  opacity: 0.4; /* or any color you prefer */
}
.dates div.dates-container {
  min-height: 100px;
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
