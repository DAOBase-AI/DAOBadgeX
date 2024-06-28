<template>
  <div class="grid grid-flow-row gap-6">
    <PassCell name="Network :">
      <NetworkChoose></NetworkChoose>
      <!-- <div class=" cursor-not-allowed form_cell flex text-whitebase italic text-sm pl-3 py-2 items-center">{{localNetwork}}</div> -->
    </PassCell>
    <PassCell name="PASS contract type :">
      <div
        class="cursor-not-allowed form_cell flex text-whitebase italic text-sm pl-3 py-2 items-center"
      >
        ERC721
      </div>
    </PassCell>

    <PassCell name="Supply :">
      <FormInput
        v-model="supply"
        class="mt-0"
        placeholder="Optional"
        typeMode="INT"
      ></FormInput>
    </PassCell>

    <PassCell name="Platform Commission :">
      <PlatformFee></PlatformFee>
    </PassCell>

    <PassCell name="* Receiving address :" v-if="!isFreeMint">
      <FormInput
        v-model="receivingAddress"
        class="mt-0"
        placeholder="Please enter your address"
        required
        :rules="['address']"
      ></FormInput>
    </PassCell>

    <div class="text-whitebase text-sm font-bold pl-2">Term of validity :</div>

    <div class="form-cell h-10">
      <div class="text-whitebase text-sm font-bold mr-2 flex items-center">
        <div
          @click="validityType = 'certain_period'"
          class="flex items-center cursor-pointer"
          style="width: fit-content"
        >
          <div
            class="w-3 h-3 rounded-full border-2 mr-2 ml-4 transition-colors"
            :class="{
              'bg-radio-inner border-radio-outer': !isMonth,
              'bg-main-0': isMonth,
            }"
          ></div>
          Expire after a period
        </div>
      </div>
      <div class="w-full flex" :class="{ hidden: !isMonth }">
        <FormInput
          v-model="termOfValidity"
          class="mr-4 mt-0"
          placeholder="Optional"
          typeMode="INT"
        ></FormInput>
        <div
          class="relative flex items-center bg-gradient-3 text-whitebase border-gradient-2 px-4 h-10"
        >
          Month
        </div>
      </div>
    </div>

    <div class="form-cell h-10">
      <div class="text-whitebase text-sm font-bold mr-2 flex items-center">
        <div
          @click="validityType = 'certain_time'"
          class="flex items-center cursor-pointer"
          style="width: fit-content"
        >
          <div
            class="w-3 h-3 rounded-full border-2 mr-2 ml-4 transition-colors"
            :class="{
              'bg-radio-inner border-radio-outer': isMonth,
              'bg-main-0': !isMonth,
            }"
          ></div>
          Expire at a certain time
        </div>
      </div>
      <div class="form-input-border relative flex" :class="{ hidden: isMonth }">
        <DatePicker
          v-model="certainTime"
          class="w-full"
          inputClassName="date-picker-input"
          autoApply
          is24
          dark
          hideInputIcon
          :minDate="minDate"
          format="MMMM d, yyyy HH:mm"
          position="right"
          placeholder="Please select the certain time"
          @update:modelValue="onCertainTime"
          @open="onOpenCertainTime"
        />
        <div class="px-2 font-bold text-whitebase flex items-center">(UTC)</div>
      </div>
    </div>

    <PassCell name="* Payment :">
      <FormInput v-model="payment" type="number" placeholder="Num">
        <template v-slot:trailing>
          <div class="flex-1">
            <Menu as="div" class="relative inline-block text-left w-full">
              <div>
                <MenuButton
                  class="inline-flex justify-center w-full shadow-sm px-4 bg-gradient-3 text-sm font-medium text-black focus:outline-none h-10 items-center"
                >
                  {{ payWith || $t('Claim.Select20') }}
                  <ChevronDownIcon
                    aria-hidden="true"
                    class="-mr-1 ml-2 h-5 w-5"
                  />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 shadow-lg bg-background ring-1 ring-black ring-opacity-5 focus:outline-none border border-primary z-30"
                >
                  <div class="py-1 border-primary">
                    <MenuItem
                      v-for="token in tokens"
                      :key="token.id"
                      v-slot="{ active }"
                    >
                      <div
                        :class="[
                          active ? 'bg-primary text-black' : 'text-black',
                          'block px-4 py-2 text-sm font-medium',
                        ]"
                        @click="
                          setNewDAOERC20(token.address);
                          payWith = token.symbol;
                        "
                      >
                        <span class="font-mono font-bold">{{
                          token.symbol
                        }}</span>
                        <div class="text-gray-500">
                          {{ getAddress(token.address) }}
                        </div>
                      </div>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </template>
      </FormInput>
    </PassCell>

    <div class="text-whitebase text-sm font-bold">
      If you want to create PASS at some point in the future, set the time and
      create it manually at that time.
    </div>
    <div class="form-cell h-10">
      <div class="flex mr-2">
        <ClockIcon class="w-5 h-5 text-whitebase mr-4"></ClockIcon>
        <span style="color: #831828">Scheduling ahead :</span>
      </div>

      <div class="form-input-border relative flex">
        <DatePicker
          v-model="schedulingAhead"
          class="w-full"
          inputClassName="date-picker-input"
          autoApply
          is24
          dark
          hideInputIcon
          :startDate="minDate"
          format="MMMM d, yyyy HH:mm"
          position="right"
          placeholder="Schedule Time"
          @update:modelValue="onScheduleAhead"
          @open="onOpenScheduleAhead"
        />
        <div class="px-2 font-bold text-whitebase flex items-center">(UTC)</div>
      </div>
    </div>

    <div class="text-sm">
      <div class="flex">
        <div class="text-whitebase font-bold mr-8">Whitelist Mode</div>
        <Switch v-model="isWhiteList" size="sm"></Switch>
      </div>

      <div v-if="isWhiteList">
        <div class="my-5 font-bold" style="color: #831828">
          Please insert the whitelisted addresses for claiming the NFT PASS or
          drop profile (<a
            :href="downloadUrl"
            class="font-bold text-base underline cursor-pointer"
            style="color: #ca1a2f"
            >download template</a
          >) down below.
        </div>
        <div
          class="fp-tabs mb-6"
          :class="{
            'fp-tab-active1': whiteTab == 0,
            'fp-tab-active2': whiteTab == 1,
          }"
        >
          <div class="fp-tab" @click="whiteTab = 0">Upload manually</div>
          <div class="fp-tab" @click="whiteTab = 1">Upload through file</div>
        </div>

        <div v-if="whiteTab == 0">
          <div
            class="flex items-center mt-5"
            v-for="(item, i) in whiteAddress"
            :key="item.id"
          >
            <div class="w-20 text-whitebase font-bold pl-2">
              {{ i == 0 ? 'Address:' : '' }}
            </div>
            <FormInput v-model="item.value" :rules="['address']"></FormInput
            ><Button
              class="ml-4"
              v-if="i == whiteAddress.length - 1"
              @click="whiteAdd()"
              >Add</Button
            >
            <Button error class="ml-4" v-else @click="whiteDel(i)">Del</Button>
          </div>
        </div>

        <div
          v-else
          class="flex justify-center items-center h-60 text-whitebase fp-upload mx-2"
          @dragover="whiteDragOver"
          @drop="whiteDrop"
        >
          <i
            class="text-6xl text-whitebase iconfont icon-piliangcaozuo-48 mr-56"
          ></i>
          <div class="flex flex-col items-center">
            <div class="text-whitebase font-bold mb-4">Drag Your File Here</div>
            <div style="color: #737373" class="mb-6">
              (Please use the template above)
            </div>
            <UiButton
              :loading="loading"
              style="width: fit-content"
              @click="fileInput.click()"
              >UPLOAD</UiButton
            >
            <div
              style="color: #737373"
              class="mt-6 font-bold text-center"
              v-if="excelUuid"
            >
              File upload successfully!<br />
              The ID: {{ excelUuid }}
            </div>
            <input
              ref="fileInput"
              type="file"
              @change="whiteUpload"
              class="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </div>
        </div>

        <div class="mt-5">
          <PassCell name="How many PASSes one address can mint?">
            <FormInput
              v-model="whiteNum"
              placeholder="No need to insert if there is no limitation"
              :rules="['gtZero']"
              typeMode="Int"
            ></FormInput>
          </PassCell>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapMutations, mapState } from 'vuex';
import PassCell from '@/components/Framework/PassCell.vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {
  PlaceHolderImage,
  rules,
  FIXED_PRICE_OPTIONS_BY_NETWORK,
} from '@/constants';
import FormInput from '@/components/Framework/FormInput.vue';
import NetworkChoose from '@/components/CreateDAO/NetworkChoose.vue';
import mitt from '@/libs/event';
import { ClockIcon } from '@heroicons/vue/outline';
import DatePicker from 'vue3-date-time-picker';
import { getUTCTime, uuid } from '@/utils';
import dayjs from 'dayjs';
import { notify } from '@kyvg/vue3-notification';
import { utils } from 'ethers';
import PlatformFee from './PlatformFee.vue';
import { isZeroAddress } from '@/constants/contract';
import Switch from '@/components/Switch.vue';
import UiButton from '@/components/UiButton.vue';
import Button from '@/components/Button.vue';
import { uploadWhiteExcel } from '@/api/common';
import { withThrottling } from '@/utils/with';

/*
  TODO 对于这里的平台行为
    - 选择是否无穷，会加上对应的判断处理
    - 时间处理 -> 选择一个确定失效时间，以及选择多少个月后失效
    - 安排一个创建时间
 */

export default defineComponent({
  data: () => ({
    open: false,
    supply: '',
    payment: '',
    payWith: '',
    platformCommission: '',
    receivingAddress: '',
    validityType: '',
    certainTime: '',
    termOfValidity: '',
    schedulingAhead: '',
    isFreeMint: false,
    isWhiteList: false,
    whiteTab: 0,
    minDate: getUTCTime(),
    whiteAddress: [{ id: uuid(), value: '' }],
    whiteNum: '',
    whiteFileId: '',
    excelUuid: '',
    loading: false,
  }),
  components: {
    PassCell,
    FormInput,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    NetworkChoose,
    ClockIcon,
    DatePicker,
    PlatformFee,
    Switch,
    UiButton,
    Button,
  },

  methods: {
    ...mapMutations('dao', ['setNewDAOERC20']),
    ...mapMutations('form', ['setFixedPrice']),
    getAddress(address: string) {
      return isZeroAddress(address) ? '' : address;
    },
    checkForm() {
      let flag = true;
      if (this.payment === '') {
        flag = false;
      } else if (!utils.isAddress(this.receivingAddress) && !this.isFreeMint) {
        flag = false;
      } else if (this.validityType == 'certain_time') {
        /* if (!this.certainTime) {
          flag = false;
        } else */ if (
          this.certainTime &&
          this.schedulingAhead &&
          dayjs(this.schedulingAhead).isAfter(this.certainTime)
        ) {
          flag = false;
          notify({
            type: 'error',
            text: 'Schedule-Time without before Certain-Time!!!',
          });
        }
      } else if (this.isWhiteList) {
        if (+this.whiteNum < 1) {
          flag = false;
        }
      }

      mitt.emit('checkFixedPrice', flag);
    },

    onCertainTime(this: any, time: Date) {
      this.certainTime = time;
    },
    onOpenCertainTime(this: any) {
      if (!this.certainTime) {
        this.certainTime = getUTCTime();
      }
    },
    onScheduleAhead(this: any, time: Date) {
      this.schedulingAhead = time;
    },
    onOpenScheduleAhead(this: any) {
      if (!this.schedulingAhead) {
        this.schedulingAhead = getUTCTime();
      }
    },
    whiteAdd() {
      this.whiteAddress.push({
        id: uuid(),
        value: '',
      });
    },
    whiteDel(i: number) {
      this.whiteAddress.splice(i, 1);
    },
    whiteDragOver(e: any) {
      e.preventDefault();
    },
    async whiteDrop(e: any) {
      e.preventDefault();
      this.uploadFile(e.dataTransfer.files[0]);
    },
    async whiteUpload(e: any) {
      this.uploadFile(e.target.files[0]);
    },
    uploadFile: withThrottling(async function (this: any, file: any) {
      this.loading = true;
      try {
        const id = await uploadWhiteExcel(file);

        if (!id) {
          throw new Error('xxx');
        }
        this.excelUuid = id;
        notify({
          text: 'Upload successfully',
        });
      } catch (error) {
        notify({
          type: 'error',
          text: 'Upload Failed',
        });
      }
      this.fileInput.value = null;
      this.loading = false;
    }),
  },
  setup() {
    const fileInput = ref();

    return {
      placeholderUrl: PlaceHolderImage,
      rules,
      fileInput,
    };
  },
  computed: {
    ...mapState({
      newDAO: (state: any) => state.dao.newDAO,
      localNetwork: (state: any) => state.wallet.network,
      form: (state: any) => state.form.fixedPrice,
    }),
    isMonth(this: any) {
      return this.validityType == 'certain_period';
    },
    tokens() {
      const res = this.localNetwork
        ? Object.values(FIXED_PRICE_OPTIONS_BY_NETWORK(this.localNetwork))
        : [];

      if (this.isFreeMint) {
        return res.slice(3);
      }

      return res;
    },
    seeParam() {
      const {
        termOfValidity,
        supply,
        payment,
        payWith,
        platformCommission,
        receivingAddress,
        validityType,
        certainTime,
        schedulingAhead,
        isFreeMint,
        isWhiteList,
        whiteAddress,
        whiteNum,
        excelUuid,
      } = this;

      const res: any = {
        termOfValidity,
        supply,
        payment,
        payWith,
        platformCommission,
        receivingAddress,
        validityType,
        certainTime,
        schedulingAhead,
        isFreeMint,
        isWhiteList,
        whiteNum: +whiteNum,
      };

      if (isWhiteList) {
        res.whiteList = whiteAddress.map((x) => x.value).filter((x) => !!x);
        res.excelUuid = excelUuid;
      }

      return res;
    },
    downloadUrl() {
      return `${process.env.VUE_APP_API_URL}/excel/download/whiteListTemplate`;
    },
  },
  watch: {
    seeParam(val) {
      this.setFixedPrice({
        ...val,
      });
      this.checkForm();
    },
    isFreeMint(this: any, flag) {
      if (flag) {
        if (this.payment == '') this.payment = 0;
        this.payWith = this.localNetwork === 'Polygon' ? 'MATIC' : 'ETH';
        this.checkForm();
      }
    },
  },
  mounted(this: any) {
    [
      'termOfValidity',
      'supply',
      'payment',
      'payWith',
      'platformCommission',
      'receivingAddress',
      'validityType',
      'certainTime',
      'schedulingAhead',
    ].forEach((key) => {
      this[key] = this.form[key];
    });
  },
});
</script>

<style scoped>
.form-cell {
  display: flex;
}
.form-cell > div {
  flex: 1;
}
.fp-tabs {
  display: flex;
  align-items: center;
  border-radius: 2px;
  width: fit-content;
  transition: all 0.3s;
}
.fp-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  height: 36px;
  font-weight: bold;
  transition: all 0.3s;
  cursor: pointer;
}

.fp-tabs.fp-tab-active1 {
  background: linear-gradient(
    270deg,
    rgba(30, 113, 219, 0.1) 0%,
    rgba(30, 113, 219, 0.5) 100%
  );
}
.fp-tabs.fp-tab-active2 {
  background: linear-gradient(
    90deg,
    rgba(140, 27, 41, 0.1) 0%,
    rgba(140, 27, 41, 0.5) 100%
  );
}

.fp-tab-active1 .fp-tab:nth-child(1),
.fp-tab-active2 .fp-tab:nth-child(2) {
  transform: scale(1.05);
}

.fp-tab-active1 .fp-tab:nth-child(1) {
  background: linear-gradient(90deg, #1b5eb2 0%, #18447a 100%);
  border-radius: 2px;
  color: #1e7bf3;
}
.fp-tab-active1 .fp-tab:nth-child(2) {
  color: rgba(30, 123, 243, 0.5);
}
.fp-tab-active2 .fp-tab:nth-child(1) {
  color: rgba(202, 26, 47, 0.5);
}
.fp-tab-active2 .fp-tab:nth-child(2) {
  color: #ca1a2f;
  background: linear-gradient(270deg, #7f1a27 0%, #611822 100%);
}

.fp-upload {
  border-width: 1px;
  border-image: linear-gradient(
      90deg,
      rgba(140, 27, 41, 1),
      rgba(140, 27, 41, 0.2)
    )
    3 3;
}
</style>
