<template>
  <div v-if="currentPage === 0 && itemType === 2">
    <div v-if="item[0] == 'mirror'">
      <div class="mb-2 flex items-center">
        <img
          src="@/assets/logo/mirror.png"
          class="w-6 h-6 overflow-hidden rounded-full mr-2"
          alt="mirror logo"
        />
        <div class="font-semibold text-xs">Mirror</div>
      </div>
    </div>
  </div>
  <div
    v-if="currentPage === 0"
    class="rounded-lg bg-white-005"
    style="box-shadow: 0px 0px 8px 0px rgba(18, 20, 22, 0.2)"
  >
    <div
      v-if="itemType === 1"
      class="p-4 rounded-lg"
      :class="{
        'hover:bg-white-010 cursor-pointer':
          type === 'daoProfile' ||
          type === 'collection' ||
          type === 'memberProfile' ||
          type === 'artistProfile',
      }"
      @click="
        () => {
          if (type === 'daoProfile') handleUrlRedirect(item.daoPath, 'dao');
          else if (type === 'collection')
            handleUrlRedirect(item.name, 'collection');
          else if (type === 'memberProfile')
            handleUrlRedirect(item.address, 'memberProfile');
          else if (type === 'artistProfile')
            handleUrlRedirect(item.name, 'artist');
        }
      "
    >
      <div class="flex">
        <div class="w-max mr-2">
          <UiImg
            :src="item.logo"
            class="rounded-full"
            style="width: 64px; height: 64px"
          />
        </div>
        <div>
          <div class="flex mb-2">
            <div class="font-bold text-sm">
              {{
                item.name?.length > 20 ? formatAddress(item.name, 6) : item.name
              }}
            </div>
            <div class="text-sm ml-1">
              {{
                `- DAO BASE ${
                  type === 'daoProfile'
                    ? 'DAO'
                    : type === 'artistProfile'
                    ? 'Artist'
                    : type === 'memberProfile'
                    ? 'Member'
                    : type === 'collection'
                    ? 'Collection'
                    : ''
                } Profile`
              }}
            </div>
            <div
              class="ml-1 text-xs px-2 rounded bg-white-010"
              v-if="type === 'daoProfile'"
            >
              {{ item.daoType }}
            </div>
          </div>
          <div class="text-white-070 text-xs break-all">
            {{ item.intro }}
          </div>
          <div v-if="item.daos || item.daoList">
            <div class="text-sm mt-4 mb-2">Collected Daos</div>
            <div class="flex gap-4 flex-wrap">
              <div v-for="(dao, j) in item.daos || item.daoList" :key="j">
                <UiImg
                  @click.stop="() => handleUrlRedirect(dao.daoPath, 'dao')"
                  :src="dao.logo"
                  class="rounded-full cursor-pointer"
                  style="width: 40px; height: 40px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="itemType === 3 && (item.name || item.logo)">
      <div
        class="hover:bg-white-010 cursor-pointer rounded-lg"
        @click="() => handleUrlRedirect(item.daoPath, 'governance')"
      >
        <div class="flex items-center border-b border-white-010 p-4">
          <UiImg
            v-if="item.logo"
            :src="item.logo"
            class="rounded-full mr-2"
            style="width: 48px; height: 48px"
          />
          <div class="text-sm font-bold">
            {{
              item.name?.length > 20 ? formatAddress(item.name, 6) : item.name
            }}
          </div>
        </div>
        <div class="flex p-4">
          <div
            v-for="(item, i) in baseInfo"
            :key="i"
            class="flex-1"
            style="width: 140px"
          >
            <div
              v-if="item.value"
              class="font-bold text-base md:text-xl flex"
              style="line-height: 1.75rem"
            >
              <CountUp :value="item.value" :isLocale="true" />
              <CountUp
                v-if="item.value2"
                :value="item.value2"
                :has-brackets="true"
              />

              <!-- {{ item.value }}{{ item.value2 ? ' (' + item.value2 + ')' : '' }} -->
            </div>
            <div v-if="item.links" class="space-x-2 flex h-7 items-center">
              <div
                v-for="(link, j) in item.links"
                :key="j"
                class="rounded-full w-6 h-6 flex items-center justify-center"
              >
                <tippy
                  :content="
                    link.platform.charAt(0).toUpperCase() +
                    link.platform.slice(1)
                  "
                  :arrow="false"
                >
                  <a :href="link.link" target="_blank">
                    <img
                      class=""
                      :src="linkLogos[link.platform?.toLowerCase()]"
                      :alt="`${link.platform} logo`"
                    />
                  </a>
                </tippy>
              </div>
            </div>
            <div class="text-xs text-gray-level whitespace-nowrap">
              {{
                item.name?.length > 20 ? formatAddress(item.name, 6) : item.name
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="itemType === 4 && (item.name || item.logo)" class="relative">
      <div
        class="p-4 hover:bg-white-010 cursor-pointer rounded-lg"
        @click="() => handleUrlRedirect(item.daoPath, 'treasury')"
      >
        <div class="flex items-center gap-2 mb-2">
          <UiImg :src="item.logo" class="w-12 h-12 rounded-full" />
          <div class="font-bold text-sm">
            {{
              item.name?.length > 20 ? formatAddress(item.name, 6) : item.name
            }}
          </div>
          <div class="text-xs px-2 rounded bg-white-010" v-if="item.daoType">
            {{ item.daoType }}
          </div>
        </div>
        <div class="border rounded-lg border-white-010 py-2">
          <SecondaryTitle
            class="rounded px-4"
            :secondaryStat="item.treasuryRate"
            :isSecondarySuffix="true"
            :secondaryStateCondition="item.treasuryRate != 0"
            :secondaryStyle="`ml-2 text-sm`"
            :isSecondaryRate="true"
            style="width: 170px; height: 42px"
            title="Treasury"
            :isPrimaryMonetary="true"
            :primaryStat="item.treasury"
          />
          <SecondaryTitle
            class="rounded py-2 px-4 mb-2"
            style="width: 170px; height: 42px"
            title="NFT Vault"
            :isPrimaryMonetary="true"
            :primaryStat="item.nftValue"
          />
          <SecondaryTitle
            class="rounded px-4"
            style="width: 170px; height: 42px"
            title="FT Vault"
            :isPrimaryMonetary="true"
            :primaryStat="item.ftValue"
          />

          <div class="absolute w-80 h-28" style="bottom: 15%; right: 15%">
            <Pie
              :data="[
                { value: item.nftValue, name: 'NFT Vault' },
                { value: item.ftValue, name: 'FT Vault' },
              ]"
            ></Pie>
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div class="text-xs">Treasury</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="itemType === 5 || (itemType === 6 && (item.name || item.logo))"
      class="p-4"
    >
      <div
        @click="
          () => {
            if (item.name)
              if (itemType === 5) handleUrlRedirect(item.name, 'artist');
              else if (itemType === 6)
                handleUrlRedirect(item.name, 'collection');
          }
        "
        class="hover:bg-white-010 cursor-pointer rounded-lg"
      >
        <div class="flex items-center gap-2 mb-2">
          <UiImg :src="item.logo" class="w-12 h-12 rounded-full" />
          <div class="font-bold text-sm">{{ item.name }}</div>
        </div>
        <div class="flex mb-4">
          <div class="px-2" style="width: 141px; height: 42px">
            <div class="font-bold text-sm">
              {{
                itemType === 5
                  ? item.countWork
                    ? item.countWork
                    : '-'
                  : item.items
                  ? item.items
                  : '-'
              }}
            </div>
            <div class="text-xs text-white-040">
              {{ itemType === 5 ? 'Artworks' : 'Items' }}
            </div>
          </div>
          <div class="px-2" style="width: 141px; height: 42px">
            <div class="font-bold text-xs flex">
              <i class="iconfont icon-ETH2-24" style="font-size: inherit"></i
              >{{
                itemType === 5
                  ? item.totalSales
                    ? item.totalSales?.toLocaleString()
                    : '-'
                  : item.totalVolume
                  ? item.totalVolume?.toLocaleString()
                  : '-'
              }}
            </div>
            <div class="text-xs text-white-040">
              {{ itemType === 5 ? 'Volume' : 'Total Volume' }}
            </div>
          </div>
          <div class="px-2" style="width: 141px; height: 42px">
            <div class="font-bold text-xs flex">
              <i class="iconfont icon-ETH2-24" style="font-size: inherit"></i>
              {{
                itemType === 5
                  ? item.artValueMarketCap
                    ? item.artValueMarketCap?.toFixed(1)
                    : '-'
                  : item.floorPrice
                  ? item.floorPrice?.toFixed(1)
                  : '-'
              }}
            </div>
            <div class="text-xs text-white-040">
              {{ itemType === 5 ? 'Market Cap' : 'Floor Price' }}
            </div>
          </div>
          <div
            class="px-2"
            style="width: 141px; height: 42px"
            v-if="itemType === 5 || (itemType === 6 && item.holders)"
          >
            <div class="font-bold text-xs flex" v-if="itemType === 5">
              <i class="iconfont icon-ETH2-24" style="font-size: inherit"></i>
              {{ item.artworkValuationMax?.toFixed(1) }} -
              {{ item.artworkValuationMin?.toFixed(1) }}
            </div>
            <div class="font-bold text-xs flex" v-if="itemType === 6">
              <i class="iconfont icon-ETH2-24" style="font-size: inherit"></i>
              {{ item.holders ? item.holders?.toLocaleString() : '-' }}
            </div>
            <div class="text-xs text-white-040">
              {{ itemType === 5 ? 'Evaluation' : 'Collectors' }}
            </div>
          </div>
        </div>
      </div>
      <ScatterChart
        :isNft="itemType === 5 ? false : true"
        v-if="item.tradeChartPoints?.length > 0"
        :data="[item.tradeChartPoints]"
      />
    </div>
  </div>
  <div v-if="loading && itemType !== 1">
    <div v-for="(loadingItem, i) in [1, 2]" :key="i">
      <Skeletor class="w-full mb-3 h-14 rounded-lg"></Skeletor>
    </div>
  </div>
  <div v-if="item?.detail && !loading && hasDetails" class="space-y-2">
    <div v-for="(detail, i) in displayedItems" :key="i">
      <div
        v-if="itemType === 2 || detail.itemType === 2"
        @click="() => handleUrlRedirect(detail.url)"
        class="rounded-lg p-4 bg-white-005 cursor-pointer hover:bg-white-010"
        style="box-shadow: 0px 0px 8px 0px rgba(18, 20, 22, 0.2)"
      >
        <div class="flex text-sm">
          <div class="w-max mr-2">
            <UiImg
              v-if="detail.dlogo"
              :src="detail.dlogo"
              class="w-6 h-6 rounded-full"
            />
            <UiImg v-else :src="item.logo" class="w-6 h-6 rounded-full" />
          </div>
          <div>
            <div class="flex mb-2 gap-2">
              <div class="font-bold">
                {{
                  detail.dname
                    ? detail.dname?.length > 20
                      ? formatAddress(detail.dname, 6)
                      : detail.dname
                    : item.name?.length > 20
                    ? formatAddress(item.name, 6)
                    : item.name
                }}
              </div>
              <div class="text-white-070">Published</div>
              <div class="font-semibold line-clamp-1">
                {{ detail.title }}
              </div>
            </div>
            <div class="text-xs text-white-070 mb-2 break-all line-clamp-3">
              {{ detail.body }}
            </div>
            <div class="text-white-040">
              {{ formatDate(detail.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="itemType === 3 || detail.itemType === 3"
        class="rounded-lg p-4 bg-white-005 text-xs relative mt-2"
        style="box-shadow: 0px 0px 8px 0px rgba(18, 20, 22, 0.2)"
        :class="{
          'bg-white-005': detail.type == 'active',
        }"
        :style="{
          border: detail.type != 'active' ? '1px solid #ffffff1a' : '',
        }"
      >
        <div class="flex items-center mb-4">
          <UiImg
            v-if="detail.dlogo"
            class="w-10 h-10 overflow-hidden rounded-full mr-2"
            :src="detail.dlogo"
          ></UiImg>
          <UiImg
            v-else
            class="w-10 h-10 overflow-hidden rounded-full mr-2"
            :src="item.logo"
          ></UiImg>
          <div class="flex-1 min-w-0">
            <div class="flex">
              <div class="flex flex-col">
                <div class="flex items-center">
                  By
                  <span class="text-secondary-7 mx-2">
                    <EnsAddress
                      :address="detail.author"
                      :size="5"
                      :isCore="detail.isCore"
                    ></EnsAddress>
                  </span>
                </div>
                <div>
                  <span style="color: #ffffff66">
                    {{
                      detail.state === 'active'
                        ? 'Closes'
                        : detail.state === 'pending'
                        ? 'Starts'
                        : 'Closed'
                    }}
                    {{ formatDateText(detail.end * 1000) }}
                  </span>
                </div>
              </div>
              <div
                class="flex-1"
                @click="
                  (e) => {
                    handleProposalClick(e, detail.id);
                  }
                "
              ></div>
              <div class="flex items-center">
                <div>
                  <a
                    v-if="detail.platform"
                    :href="detail.proposalUrl"
                    target="_blank"
                    class="z-top"
                  >
                    <i
                      class="iconfont text-xl z-top cursor-pointer"
                      :class="platformIconOnlyStyle(detail.platform)"
                    ></i
                  ></a>
                </div>
                <div
                  class="h-6 ml-6 w-max px-2 flex items-center justify-center rounded font-bold capitalize"
                  :style="
                    detail.state == 'active'
                      ? ''
                      : detail.state == 'pending'
                      ? ''
                      : 'background:#FFFFFF1A;color:#FFFFFF66;'
                  "
                  :class="{
                    'bg-inputActive': activeType.indexOf(detail.state) !== -1,
                    'bg-inputActive-70': detail.state == 'pending',
                  }"
                >
                  {{ detail.state.toLowerCase() }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          @click="
            (e) => {
              handleProposalClick(e, detail.id);
            }
          "
        >
          <span
            v-if="detail.category"
            class="h-5 text-xs uppercase rounded px-2 py-1 mr-2 bg-white-010 whitespace-nowrap"
            >{{ detail.category }}</span
          >
          <div class="cursor-pointer">
            <div class="my-4 hover:underline">{{ detail.title }}</div>
            <div class="space-y-4">
              <div
                class="relative w-full h-8"
                v-for="(choice, j) in detail.choices"
                :key="j"
              >
                <BarLoadingEffect
                  :fillColor="'bg-secondary-7'"
                  :value="choice.score"
                  :total="detail.scoresTotal"
                />

                <div
                  class="relative z-30 flex w-full h-full justify-between rounded items-center px-4 text-xs bg-white-005 text-white-040"
                >
                  <div>
                    <span class="font-bold mr-4 text-whitebase">{{
                      choice.choice
                    }}</span>
                    {{ choice.voterCount }} Votes /
                    {{ formatVal(choice.score, { omit: true }) }}
                  </div>
                  <div class="font-bold text-whitebase">
                    {{
                      choice.score === 0 || detail.scoresTotal == 0
                        ? 0
                        : ((choice.score / detail.scoresTotal) * 100).toFixed(
                            2,
                          )
                    }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="
          itemType === 4 ||
          itemType === 7 ||
          detail.itemType === 4 ||
          detail.itemType === 7
        "
        class="mt-4"
      >
        <div>
          <div class="flex gap-2 mb-2">
            <span
              class="icon iconfont"
              v-if="detail.status.toLowerCase() === 'buy'"
              >&#xe68e;</span
            >
            <span
              class="icon iconfont"
              v-if="detail.status.toLowerCase() === 'sell'"
              >&#xe68d;</span
            >
            <img
              class="w-6 h-6 rounded-full"
              :src="chainIcon[detail.chain]"
              alt="chain icon"
            />
            <div class="text-sm text-white-040">
              {{ formatDate(detail.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
          <div
            class="rounded-lg bg-white-005 p-4 cursor-pointer hover:bg-white-010"
            style="box-shadow: 0px 0px 8px 0px rgba(18, 20, 22, 0.2)"
            @click="
              () =>
                handleAddressClick(detail.transactionHash, detail.chain, 'tx')
            "
          >
            <div class="flex justify-between items-center mb-2">
              <div class="flex text-xs items-center">
                <UiImg
                  v-if="detail.dlogo"
                  class="w-6 h-6 rounded-full mr-1"
                  :src="detail.dlogo"
                  alt="chain icon"
                />
                <UiImg
                  v-else
                  class="w-6 h-6 rounded-full mr-1"
                  :src="item.logo"
                  alt="chain icon"
                />
                <div class="mr-2 font-bold">
                  {{
                    detail.dname
                      ? detail.dname?.length > 20
                        ? formatAddress(detail.dname, 6)
                        : detail.dname
                      : item.name?.length > 20
                      ? formatAddress(item.name, 6)
                      : item.name
                  }}
                </div>
                <div class="mr-2 text-white-070">
                  {{
                    detail.status.toLowerCase() === 'buy'
                      ? 'Recieved From'
                      : detail.status.toLowerCase() === 'sell'
                      ? 'Transferred To'
                      : detail.status
                  }}
                </div>
                <div
                  class="mr-2 text-secondary-0 cursor-pointer hover:underline"
                  @click.stop="
                    () => handleAddressClick(detail.fromAddress, detail.chain)
                  "
                >
                  {{
                    formatAddress(
                      detail.status.toLowerCase() === 'buy'
                        ? detail.fromAddress
                        : detail.toAddress,
                      4,
                    )
                  }}
                </div>
              </div>
              <div v-if="detail.type === 'FT'" class="flex items-center">
                <UiImg
                  class="w-4 h-4 rounded-full mr-1"
                  :src="detail.tokenLogo"
                  alt="chain icon"
                />
                <div class="font-bold text-sm">
                  {{
                    parseFloat(
                      Number(detail.amount).toFixed(4),
                    ).toLocaleString()
                  }}&nbsp;{{ detail.tokenName }}
                </div>
              </div>
            </div>
            <div
              v-if="detail.type === 'NFT'"
              class="flex flex-1 text-sm items-center"
            >
              <UiImg
                :src="detail.tokenLogo"
                class="rounded-lg w-16 h-16 mr-3"
              />
              <div class="w-full">
                <div class="mb-2 font-bold">{{ detail.tokenName }}</div>
                <div class="w-full flex justify-between">
                  <div class="text-white-070">*{{ detail.amount }}</div>
                  <div class="flex">
                    <div class="text-white-070">Valuation:&nbsp;</div>
                    <div>
                      $&nbsp;{{
                        parseFloat(
                          Number(detail.usdValue)?.toFixed(4),
                        ).toLocaleString()
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="
          itemType === 5 ||
          itemType === 6 ||
          detail.itemType === 5 ||
          detail.itemType === 6
        "
      >
        <div class="flex gap-2 mb-2">
          <span class="icon iconfont icon-qiehuan-36 w-4 h-4"></span>
          <div class="text-sm text-white-040">
            {{ formatDate(detail.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
        <div
          class="rounded-lg bg-white-005 p-4"
          style="box-shadow: 0px 0px 8px 0px rgba(18, 20, 22, 0.2)"
        >
          <div class="flex mb-2 items-center">
            <UiImg
              v-if="detail.dlogo"
              :src="detail.dlogo"
              class="w-6 h-6 mr-1 rounded-full"
            />
            <UiImg v-else :src="item.logo" class="w-6 h-6 mr-1 rounded-full" />
            <div class="mr-2 text-xs font-bold">
              {{
                detail.dname
                  ? detail.dname?.length > 20
                    ? formatAddress(detail.dname, 6)
                    : detail.dname
                  : item.name?.length > 20
                  ? formatAddress(item.name, 6)
                  : item.name
              }}
            </div>
            <div class="mr-2 text-xs text-white-070">
              {{
                itemType === 5 || detail.itemType === 5
                  ? `Artwork ${detail.tokenName}`
                  : 'A transaction took place at NFT'
              }}
            </div>
            <div class="text-xs" v-if="itemType === 5 || detail.itemType === 5">
              Transaction Occurred
            </div>
          </div>
          <div class="flex items-center gap-4">
            <UiImg
              v-if="itemType === 5 || detail.itemType === 5"
              :src="detail.image"
              class="rounded-lg w-16 h-16"
            />
            <UiImg
              v-if="itemType === 6 || detail.itemType === 6"
              :src="detail.logo"
              class="rounded-lg w-16 h-16"
            />
            <div class="text-xs flex-1">
              <div
                class="flex justify-between"
                v-if="itemType === 6 || detail.itemType === 6"
              >
                <div class="font-bold">{{ detail.tokenName }}</div>
              </div>
              <div
                class="flex justify-between"
                v-if="itemType === 5 || detail.itemType === 5"
              >
                <div class="text-white-070">Platform:</div>
                <div>{{ detail.plat }}</div>
              </div>
              <div class="flex justify-between">
                <div class="text-white-070">Last Price:</div>
                <div
                  class="flex text-secondary-0 cursor-pointer"
                  @click="
                    () =>
                      handleAddressClick(
                        detail.transactionHash,
                        detail.chain,
                        'tx',
                      )
                  "
                >
                  <i
                    class="iconfont icon-ETH2-24"
                    style="font-size: inherit"
                  ></i
                  >{{
                    itemType === 5 || detail.itemType === 5
                      ? detail.lastPrice
                      : detail.price
                  }}
                </div>
              </div>
              <div class="flex justify-between">
                <div class="text-white-070">Evaluation</div>
                <div class="flex">
                  <i
                    class="iconfont icon-ETH2-24"
                    style="font-size: inherit"
                  ></i>
                  {{
                    itemType === 5 || detail.itemType === 5
                      ? detail.valuation
                      : detail.evaluation
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="itemType === 8 || detail.itemType === 8">
        <div class="flex items-center mb-2 text-sm">
          <img
            class="rounded-full w-6 h-6 mr-2"
            :src="linkLogos[detail.platform?.toLowerCase()]"
            :alt="`${detail.platform} logo`"
          />
          <div class="text-white-040">
            {{ formatDate(detail.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
        <div
          class="rounded-lg bg-white-005 p-4 text-xs"
          style="box-shadow: 0px 0px 8px 0px rgba(18, 20, 22, 0.2)"
        >
          <div class="flex flex-wrap text-white-070 gap-1">
            <div
              class="text-secondary-0 hover:underline cursor-pointer mr-2"
              @click.stop="handleUrlRedirect(detail.proposalId, 'proposal')"
            >
              {{ formatAddress(detail.proposalId, 6) }}
            </div>
            Voted&nbsp;"
            <span v-for="(choice, i) in detail.choice" :key="i">
              {{ choice }}
            </span>
            "
            <div
              class="font-bold ml-1 text-whitebase hover:underline cursor-pointer"
              @click.stop="jumpSnapshot(detail.space, detail.proposalId)"
            >
              {{ detail.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <Pagination
    v-if="
      showPaginationOverride ||
      (item.detail &&
        showPagination &&
        (totalPages > 1 || Math.ceil(item.detail?.length / 10) > 1))
    "
    :currentPage="currentPage"
    @update-page="handlePageUpdate"
    :total-pages="totalPages || Math.ceil(item.detail?.length / 10)"
  /> -->

  <!-- <el-pagination
    v-if="
      showPaginationOverride ||
      (item.detail &&
        showPagination &&
        (totalPages > 1 || Math.ceil(item.detail?.length / 10) > 1))
    "
    layout="prev, pager, next"
    :currentPage="state.currentPage"
    :pageCount="totalPages || Math.ceil(item.detail?.length / 10)"
    @update:current-page="handleStatePageChange"
  /> -->
</template>
<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { Skeletor } from 'vue-skeletor';
import UiImg from './UiImg.vue';
import ScatterChart from './ScatterChart.vue';
import Pagination from './Pagination.vue';
import CountUp from './CountUp.vue';
import EnsAddress from '@/components/Home/EnsAddress.vue';
import { useRouter } from 'vue-router';
import { formatDateText, formatVal, formatDate, formatAddress } from '@/utils';
import BarLoadingEffect from '@/components/DaoPage/BarLoadingEffect.vue';
import Pie from '@/components/Chart/Pie.vue';
import SecondaryTitle from '@/components/LeaderBoard/SecondaryTitle.vue';
import { chainIcon, NetworkSymbol } from '@/constants';
import { eventBus } from '@/libs/event-bus';
import { toExploreAddress } from '@/utils';
import { linkLogos } from '@/constants/index.ts';
import { platformIconOnlyStyle } from '@/constants/platforms';

const props = defineProps({
  type: String,
  item: Object,
  isDetailed: { type: Boolean, default: true },
  isFuzzySearch: { type: Boolean, default: false },
  showPagination: { type: Boolean, default: true },
  showPaginationOverride: { type: Boolean, default: false },
  selectedPage: Number,
  totalPages: Number,
  allData: Object,
  loading: Boolean,
  displayedItem: Object,
  itemsPerPage: { type: Number, default: 10 },
  hasDetails: { type: Boolean, default: true },
});

const currentPage = ref(0);
const $router = useRouter();
const $emits = defineEmits(['updatePage']);
const activeType = ['active', 'succeeded', 'queued'];
const state = reactive({
  currentPage: 1,
});
const handleStatePageChange = (a) => {
  state.currentPage = a;
};
const handlePageUpdate = (page) => {
  currentPage.value = page;
  $emits('updatePage', page);
};
watch(
  () => props.selectedPage,
  () => {
    currentPage.value = props.selectedPage - 1;
  },
);
const displayedItems = computed(() => {
  if (currentPage.value === 0) {
    if (props.isDetailed) {
      return props.item.detail.slice(0, props.itemsPerPage);
    }
    if (Array.isArray(props.item)) {
      if (props.item[0] == 'mirror') {
        return props.item.detail.slice(0, 2);
      }
    }

    return props.item.detail.slice(0, 5);
  } else {
    if (Array.isArray(props.item)) {
      if (props.item[0] == 'mirror') {
        const start = 2 + (currentPage.value - 1) * props.itemsPerPage;
        const end = start + props.itemsPerPage;

        return props.item.detail.slice(start, end);
      }
      return props.item.detail.slice(0, 5);
    } else if (props.isDetailed) {
      const start =
        props.itemsPerPage + (currentPage.value - 1) * props.itemsPerPage;
      const end = start + props.itemsPerPage;

      return props.item.detail.slice(start, end);
    } else {
      const start = 5 + (currentPage.value - 1) * props.itemsPerPage;
      const end = start + props.itemsPerPage;

      return props.item.detail.slice(start, end);
    }
  }
});
const handleProposalClick = (e, id) => {
  // if (e.target.id !== 'ENS' || e.target.id !== 'platform')
  eventBus.emit('componentClose');
  $router.replace(`/proposal/details/${id}`);
};

const baseInfo = computed(() => {
  return [
    {
      name: 'Proposals (Core)',
      value: props.item.proposals,
      value2: props.item.coreProposals,
    },
    {
      name: 'Voters',
      value: props.item.voters,
    },
    {
      name: 'Votes',
      value: props.item.votes,
    },
    {
      name: 'Platform',
      links: props.item.links,
    },
  ];
});

const handleUrlRedirect = (url, type = 'none') => {
  if (type === 'dao') {
    eventBus.emit('componentClose');
    $router.replace(`/dao/${url}/DAOPage`);
  } else if (type === 'treasury') {
    eventBus.emit('componentClose');
    $router.replace(`/dao/${url}/treasury`);
  } else if (type === 'governance') {
    eventBus.emit('componentClose');
    $router.replace(`/dao/${url}/governance`);
  } else if (type === 'memberProfile') {
    eventBus.emit('componentClose');
    $router.replace(`/address/details/${url}`);
  } else if (type === 'proposal') {
    eventBus.emit('componentClose');
    $router.replace(`/address/details/${url}`);
  } else if (type === 'collection') {
    window.open(
      `https://nftvalue.thepass.to/#/Collectables/${url.replace(/\s/g, '')}`,
      '_blank',
    );
  } else if (type === 'artist') {
    window.open(`https://nftvalue.thepass.to/#/Art/${url}/ethereum`, '_blank');
  } else window.open(url, '_blank');
};
const handleAddressClick = (address, network, type = 'address') => {
  toExploreAddress(address, network, type);
  // if (type === 'tx')
  //   window.open(`https://etherscan.io/tx/${address}`, '_blank');
  // else window.open(`https://etherscan.io/address/${address}`, '_blank');
};
const jumpSnapshot = (space, proposalId) => {
  window.open(
    `https://snapshot.org/#/${space}/proposal/${proposalId}`,
    '_blank',
  );
};

const itemType = computed(() => {
  if (
    props.type === 'daoProfile' ||
    props.type === 'collection' ||
    props.type === 'memberProfile' ||
    props.type === 'artistProfile'
  ) {
    return 1;
  } else if (props.type === 'social') {
    return 2;
  } else if (props.type === 'governance') {
    return 3;
  } else if (props.type === 'treasury') {
    return 4;
  } else if (props.type === 'artwork') {
    return 5;
  } else if (props.type === 'nfts') {
    return 6;
  } else if (props.type === 'transaction') {
    return 7;
  } else if (props.type === 'proposal') {
    return 8;
  } else {
    return null;
  }
});
onMounted(() => {
  currentPage.value = props.selectedPage - 1;
});
</script>
<style></style>
