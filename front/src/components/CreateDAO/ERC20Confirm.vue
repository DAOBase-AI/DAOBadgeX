<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="shadow border-2 border-masked bg-white text-whitebase" id="popup">
    <div v-for="(itemInfo, i) in displayInfo" :key="i">
      <div class="text-xl font-bold mt-6">{{ itemInfo.label }}</div>

      <div
        class="pb-2 pt-6 display-item text-xs flex items-center"
        v-for="(item, j) in itemInfo.items"
        :key="j"
      >
        <div class="flex w-full">
          <div class="pr-8 flex items-center justify-end" style="width: 40%">
            {{ item.name }}
          </div>

          <div class="break-words pr-4" style="width: 60%">
            <img
              v-if="item.type == 'img'"
              class="w-10 h-10 rounded-full"
              :src="item.value"
              alt=""
            />
            <div
              v-else-if="item.type == 'address'"
              @click="toExploreAddress(item.value, network)"
              class="text-secondary-7 underline cursor-pointer"
            >
              {{ item.value }}
            </div>
            <span v-else>
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PlaceHolderImage } from '@/constants';
import { defineComponent } from '@vue/runtime-core';
import { mapState } from 'vuex';
import { fromInteger2Float } from '@/libs';
import { useNetwork } from '@/hooks';
import { formatDateLong, toExploreAddress } from '@/utils';

export default defineComponent({
  components: {},
  data: () => ({
    decimal: 0,
  }),
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    const ele = document.getElementById('popup');
    if (ele) {
      setTimeout(() => {
        console.log('scroll');
        ele.scrollTop = 0;
      }, 1000);
    }
  },
  setup() {
    const network = useNetwork();
    return {
      toExploreAddress,
      placeholderUrl: PlaceHolderImage,
      fromInteger2Float,
      network,
    };
  },
  computed: {
    displayInfo() {
      const {
        name,
        intro,
        logo,
        daoTag,
        daoType,
        website,
        whitepaper,
        twitter,
        openseaUrl,
        superrareUrl,
        foundationUrl,
        customizeLink,
        discordLinkUrl,
        telegramLinkUrl,
        /* pass */
        passName,
        passSymbol,
        passLogo,
        passType,
        passBondingCurve,
        passFixedPrice,
        passStakingBasedDTO,
      } = this.info;

      const daoItems: any = [];

      [
        { name: 'DAO Name', value: name },
        { name: 'Intro', value: intro },
        {
          name: 'DAO Logo',
          value: logo,
          type: 'img',
        },
        {
          name: 'DAO Tags',
          value: daoTag.join(', '),
        },
        {
          name: 'DAO Type',
          value: daoType,
        },
        {
          name: 'Website',
          value: website,
        },
        {
          name: 'Twitter',
          value: twitter,
        },
        { name: 'Whitepaper', value: whitepaper },
        { name: 'Opensea', value: openseaUrl },
        { name: 'Superare', value: superrareUrl },
        { name: 'Foundation', value: foundationUrl },
        { name: 'Discord', value: discordLinkUrl },
        { name: 'Telegram', value: telegramLinkUrl },
        {
          name: 'More link',
          value: customizeLink
            .map((x: any) => `${x.name} : ${x.url}`)
            .join(', '),
        },
      ].forEach((x) => {
        if (x.value) {
          daoItems.push(x);
        }
      });

      const passItems: any = [
        { name: 'PASS Type', value: passType },
        { name: 'PASS Name', value: passName },
        {
          name: 'PASS Symbol',
          value: passSymbol,
        },
        {
          name: 'PASS Logo',
          value: passLogo,
          type: 'img',
        },
        {
          name: 'Network',
          value: this.network,
        },
        {
          name: 'PASS Contract Type',
          value: passType == 'bonding_curve' ? 'ERC1155' : 'ERC721',
        },
      ];

      if (passType == 'staking_based') {
        passItems.push({
          name: 'Staking Token Type',
          value: passStakingBasedDTO.tokenMintTheNftPass,
        });

        const isErc20 = passStakingBasedDTO.tokenMintTheNftPass === 'ERC20';

        if (isErc20) {
          passItems.push({
            name: 'Token contract address',
            value: passStakingBasedDTO.tokenContractAddress,
          });
        } else {
          passItems.push({
            name: 'NFT contract address',
            value: passStakingBasedDTO.nftContractAddress,
            type: 'address',
          });
        }
        passItems.push({
          name: 'Quantity Needed',
          value: isErc20 ? passStakingBasedDTO.tokensNeededToMintANft : 1,
        });

        passItems.push({
          name: 'Duration',
          value: passStakingBasedDTO.duration
            ? formatDateLong(passStakingBasedDTO.duration) + '(UTC)'
            : '/',
        });

        passItems.push({
          name: 'Mint Limit',
          value: passStakingBasedDTO.mintLimit
            ? passStakingBasedDTO.mintLimit
            : '∞',
        });

        passItems.push({
          name: 'Whitelist Mode',
          value: passStakingBasedDTO.excelUuid
            ? `File Name:${passStakingBasedDTO.excelUuid}`
            : passStakingBasedDTO.whiteList.length > 0
            ? passStakingBasedDTO.whiteList.join(', ')
            : '/',
        });
      }

      if (passType == 'fixed_price') {
        passItems.push({
          name: 'Total Supply',
          value: passFixedPrice.supply || '∞',
        });

        console.log(passFixedPrice.validityType);

        if (passFixedPrice.validityType == 'certain_time') {
          passItems.push({
            name: ' NFT PASS Bot Vadility',
            value: passFixedPrice.certainTime
              ? formatDateLong(passFixedPrice.certainTime) + '(UTC)'
              : '∞',
          });
        } else {
          passItems.push({
            name: 'NFT PASS Bot Vadility',
            value: passFixedPrice.termOfValidity
              ? `${passFixedPrice.termOfValidity} month`
              : '∞',
          });
        }

        passItems.push({
          name: 'Payment',
          value: `${passFixedPrice.payment} ${passFixedPrice.payWith}`,
        });

        passItems.push({
          name: 'Sale Duration',
          value: passFixedPrice.duration
            ? formatDateLong(passFixedPrice.duration) + '(UTC)'
            : '/',
        });

        passItems.push({
          name: 'Mint Limit',
          value: passFixedPrice.mintLimit ? passFixedPrice.mintLimit : '∞',
        });
        passItems.push({
          name: 'Whitelist Mode',
          value: passFixedPrice.excelUuid
            ? `File Name:${passFixedPrice.excelUuid}`
            : passFixedPrice.whiteList.length > 0
            ? passFixedPrice.whiteList.join(', ')
            : '/',
        });
      }

      if (passType == 'bonding_curve') {
        passItems.push({
          name: 'Collateral Token',
          value: passBondingCurve.collateralTokens,
        });
        passItems.push({
          name: 'Creator Fee',
          value: passBondingCurve.creatorFee + '%',
        });
        passItems.push({
          name: 'Receiving address',
          value: passBondingCurve.receivingAddress,
          type: 'address',
        });
        passItems.push({
          name: 'Initial price',
          value: passBondingCurve.initialPrice,
        });
        passItems.push({
          name: 'm',
          value: passBondingCurve.m,
        });
        passItems.push({
          name: 'n',
          value: passBondingCurve.n,
        });
      }

      return [
        {
          label: 'DAO Settings',
          items: daoItems,
        },
        {
          label: 'PASS Settings',
          items: passItems,
        },
      ];
    },
  },
});
</script>

<style scoped>
.display-item:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
