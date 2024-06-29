<template>
  <div
    class="flex justify-center items-center w-full h-screen"
    v-if="state.loading"
  >
    <Spin style="width: 3em; height: 3em" class="text-black"></Spin>
  </div>
  <div class="" v-else>
    <!--    part 1-->
    <div class="w-full h-480px banner">
      <div class="w-2/3 mr-auto ml-auto bannerBox">
        <div class="flex-col flex ml-auto mr-auto box-border bannerContent">
          <div class="w-894px title text-whitebase font-bold">
            More than a Badge<br />
            Introducing the on-chain reputation<br />
            system for DAOs
          </div>
          <div class="flex items-center justify-start buttonBox">
            <span
              v-if="state.isMinted && !state.mintStateLoading"
              class="active-button bannerButton whitespace-nowrap text-sm md:text-base"
            >
              You have successfully minted your DAO Badge
            </span>
            <button
              v-if="!state.isMinted && !state.mintStateLoading"
              class="active-button"
              @click="doJumpMint()"
              style="width: 158px; height: 40px; font-size: 16px"
            >
              Mint your Badge
            </button>

            <button
              v-if="state.mintStateLoading"
              class="active-button"
              style="width: 158px; height: 40px; font-size: 16px"
            >
              Loading ...
            </button>
            <a
              v-if="state.isMinted"
              :href="state.tokenAddress"
              target="_blank"
              class="text-16px text-whitebase subButton"
              >Check now</a
            >
            <span
              v-else
              class="text-16px text-whitebase subButton"
              style="margin-left: 32px; font-size: 16px"
              >Free mint, only gas fee cost</span
            >
          </div>
        </div>
      </div>
    </div>
    <!--    part 2-->
    <div class="w-full part2">
      <div
        class="flex w-2/3 justify-between space-x-2 ml-auto mr-auto part2Content"
      >
        <div class="flex flex-col flex-1">
          <div class="part2Title text-whitebase font-bold">
            About the DAO badge
          </div>
          <div v-if="isMobile" class="my-6">
            <iframe
              src="/badge/320.html"
              frameborder="0"
              height="320"
              width="320"
            ></iframe>
          </div>
          <p class="part2Desc text-white-080">
            The DAO Badge, envisioned by
            <span class="font-bold text-black">DAOBase</span>(<a
              href="https://x.com/daobase_ai"
              target="_blank"
              class="text-mb-blue underline"
              >@daobase_ai</a
            >) and artfully created by Daniel Aguilar, serves as a dynamic
            testament to the vibrant contributions made within Decentralized
            Autonomous Organizations (DAOs). As a leading DAO aggregator,
            DAOBase leverages its unique ability to track and record
            <span class="font-bold text-black">user interactions</span> within
            DAOs, inspiring the creation of this
            <span class="font-bold text-black">reputation system</span>. The
            badge symbolizes the evolution of user engagement within the
            decentralized landscape.
            <br />
            <br />
            Inspired by the organic growth of flora, the badge begins as a
            humble seed and gradually evolves into intricate formations
            resembling petals and leaves. Vivid colors and dynamic patterns
            capture the essence of
            <span class="font-bold text-black">DAO engagement</span>, luminous
            particles symbolize the energy brought by active participants while
            the badge's roots signify the
            <span class="font-bold text-black">foundational contributions</span>
            crucial for the ecosystem's health and prosperity.
            <br />
            <br />
            The badge's size and complexity correlate with the user's
            comprehensive score, reflecting their
            <span class="font-bold text-black">level of engagement</span>.
            Attributes like seed size, particle density, and root complexity are
            influenced by user activity, such as
            <span class="font-bold text-black">basic information</span>,
            <span class="font-bold text-black">voting and delegations</span>
            respectively, showcasing the richness of contributions.
            <br />
            <br />
            More than a mere symbol, the badge represents recognition and
            gratitude for those dedicated to the DAO community's growth. As
            users continue their journey within DAOs, their badges evolve,
            reflecting their ongoing commitment and contributions.
          </p>
        </div>
        <div>
          <!-- <img
          class="w-full h-full object-cover rounded-s-3xl part2Image"
          :src="require('@/assets/images/mintbadge/gif.gif')"
          alt=""
        /> -->
          <div v-if="!isMobile" class="mt-18">
            <iframe
              src="/badge/384.html"
              frameborder="0"
              height="384"
              width="384"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    <!--  part3-->
    <div class="w-full relative part3">
      <div class="absolute par3AbsoluteImage" />
      <div class="w-2/3 ml-auto mr-auto part3List">
        <div class="w-full flex justify-between part3ListContent">
          <div
            class="box-border introduceItem"
            v-for="(item, index) in state.flipCardList"
            :key="index"
            :value="item"
            :class="item.flip ? 'card-flip' : ''"
          >
            <div
              @click="isMobile && doFlip(item, index, true)"
              @mouseover="!isMobile && doFlip(item, index, true)"
              class="front flex justify-center items-center text-whitebase"
              :style="{
                background: 'url(' + item.bg + ') center center',
                backgroundSize: 'cover',
              }"
            >
              {{ item.title }}
            </div>
            <div
              @click="isMobile && doFlip(item, index, false)"
              @mouseleave="!isMobile && doFlip(item, index, false)"
              class="back flex justify-center items-center text-white-080"
            >
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  mint badge-->
    <div class="w-full mintBadge">
      <!-- <div class="w-2/3 ml-auto mr-auto header">
      <div class="text-whitebase mintBadgeTitle">
        {{ state.isMinted ? 'My Badge' : 'Mint Badge' }}
      </div>
      <p class="text-whitebase mintBadgeDesc">
        Your DAO Badge isn't just a static symbol; it's a living testament of your involvement in the DAO ecosystem, minted on Base. It dynamically evolves based on your DAO engagement, reflecting the completeness of your profile, the number of DAOs you participate in, proposal contributions, voting frequency, delegated votes received, and the weight of your voting power. For an in-depth understanding of how your actions translate into reputation, refer to the "<a
          target="_blank"
          class="mintActionLink"
          href="https://daobase-organization.gitbook.io/thepass/core-data-and-webpage/webpage/dao-reputation-system-coming-soon"
          >Detailed Scoring Rules</a
        >" document.
      </p>
    </div> -->
      <div class="mintBadgePartBox ml-auto mr-auto">
        <div
          class="w-2/3 ml-auto mr-auto mintBadgePart bg-white-005 box-border"
        >
          <div
            v-if="state.mintStateLoading"
            class="flex w-full justify-center items-center pt-20 pb-20"
          >
            <Spin class="text-white-080"></Spin>
          </div>
          <div class="">
            <div class="text-whitebase mintBadgeTitle">
              {{ state.isMinted ? 'My Badge' : 'Mint Badge' }}
            </div>
            <p class="text-whitebase mintBadgeDesc">
              Your DAO Badge isn't just a static symbol; it's a living testament
              of your involvement in the DAO ecosystem, minted on Base. It
              dynamically evolves based on your DAO engagement, reflecting the
              completeness of your profile, the number of DAOs you participate
              in, proposal contributions, voting frequency, delegated votes
              received, and the weight of your voting power. For an in-depth
              understanding of how your actions translate into reputation, refer
              to the "<a
                target="_blank"
                class="mintActionLink"
                href="https://daobase-organization.gitbook.io/thepass/core-data-and-webpage/webpage/dao-reputation-system-coming-soon"
                >Detailed Scoring Rules</a
              >" document.
            </p>
          </div>
          <!-- <div class="checkProfileBox flex justify-end items-center">
          <router-link
            class="checkProfileLink"
            :to="`/address/details/${state.userInfo.addr}`"
            >Check my profile</router-link
          >
        </div> -->
          <div class="w-full dataBox">
            <div class="flex justify-center dataBoxFlex">
              <div
                v-if="state.isMinted && !state.mintStateLoading"
                class="flex-1 dataItem flex flex-col justify-center items-center"
                style="background: #6c2d3c"
              >
                <label class="text-white-060 dataLabel"
                  >Basic Information</label
                >
                <span class="text-whitebase dataNum"
                  >{{ state.nftData.basic }}/{{
                    state.nftData.totalBasic
                  }}</span
                >
                <div class="w-full mintedDataInfo">
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Rank:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase"
                      >{{ fmoney(state.rankScoreData.basicRank, 0) }} ({{
                        (
                          Number(state.rankScoreData.basicRankRatio || 0) * 100
                        ).toFixed(2)
                      }}%)</span
                    >
                  </div>
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Weight:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase">{{
                      Number(state.rankScoreData.basicWeight || 0).toFixed(2)
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                class="flex-1 dataItem flex flex-col justify-center items-center"
                style="background: #3c1f3a"
              >
                <label class="text-white-060 dataLabel">Related DAOs</label>
                <span class="text-whitebase dataNum">{{
                  state.nftData.relatedDaos
                }}</span>
                <div
                  v-if="state.isMinted && !state.mintStateLoading"
                  class="w-full mintedDataInfo"
                >
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Rank:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase"
                      >{{ fmoney(state.rankScoreData.relatedDaosRank, 0) }} ({{
                        (
                          Number(
                            state.rankScoreData.relatedDaosRankRatio || 0,
                          ) * 100
                        ).toFixed(2)
                      }}%)</span
                    >
                  </div>
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Weight:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase">{{
                      state.rankScoreData.relatedDaosWeight.toFixed(2)
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                class="flex-1 dataItem flex flex-col justify-center items-center"
                style="background: #6c2d3c"
              >
                <label class="text-white-060 dataLabel">Votes</label>
                <span class="text-whitebase dataNum">{{
                  state.nftData.votes
                }}</span>
                <div
                  v-if="state.isMinted && !state.mintStateLoading"
                  class="w-full mintedDataInfo"
                >
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Rank:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase"
                      >{{ fmoney(state.rankScoreData.votesRank, 0) }} ({{
                        (
                          Number(state.rankScoreData.votesRankRatio || 0) * 100
                        ).toFixed(2)
                      }}%)</span
                    >
                  </div>
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Weight:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase">{{
                      state.rankScoreData.votesWeight.toFixed(2)
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                class="flex-1 dataItem flex flex-col justify-center items-center"
                style="background: #3c1f3a"
              >
                <label class="text-white-060 dataLabel">Proposals</label>
                <span class="text-whitebase dataNum">{{
                  state.nftData.createdProposals
                }}</span>
                <div
                  v-if="state.isMinted && !state.mintStateLoading"
                  class="w-full mintedDataInfo"
                >
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Rank:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase"
                      >{{
                        fmoney(state.rankScoreData.createdProposalsRank, 0)
                      }}
                      ({{
                        (
                          Number(
                            state.rankScoreData.createdProposalsRankRatio || 0,
                          ) * 100
                        ).toFixed(2)
                      }}%)</span
                    >
                  </div>
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Weight:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase">{{
                      state.rankScoreData.createdProposalsWeight.toFixed(2)
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                class="flex-1 dataItem flex flex-col justify-center items-center"
                style="background: #6c2d3c"
              >
                <label class="text-white-060 dataLabel">Delegations</label>
                <span class="text-whitebase dataNum">{{
                  state.nftData.delegations
                }}</span>
                <div
                  v-if="state.isMinted && !state.mintStateLoading"
                  class="w-full mintedDataInfo"
                >
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Rank:</label
                    >
                    <span
                      class="mintedDataInfoValue text-whitebase flex justify-between items-center"
                      >{{ fmoney(state.rankScoreData.delegationsRank, 0) }} ({{
                        (
                          Number(
                            state.rankScoreData.delegationsRankRatio || 0,
                          ) * 100
                        ).toFixed(2)
                      }}%)</span
                    >
                  </div>
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Weight:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase">{{
                      state.rankScoreData.delegationsWeight.toFixed(2)
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                class="flex-1 dataItem flex flex-col justify-center items-center"
                style="background: #3c1f3a"
              >
                <label class="text-white-060 dataLabel"
                  >Voting Power Valuation</label
                >
                <span class="text-whitebase dataNum">
                  ${{
                    formatVal(state.nftData.votingPowerRatio, { omit: true })
                  }}
                </span>
                <div
                  v-if="state.isMinted && !state.mintStateLoading"
                  class="w-full mintedDataInfo"
                >
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Rank:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase"
                      >{{
                        fmoney(state.rankScoreData.votingPowerRatioRank, 0)
                      }}
                      ({{
                        (
                          Number(
                            state.rankScoreData.votingPowerRatioRankRatio || 0,
                          ) * 100
                        ).toFixed(2)
                      }}%)</span
                    >
                  </div>
                  <div
                    class="mintedDataInfoItem flex items-center justify-between box-border"
                  >
                    <label class="mintedDataInfoLabel text-white-040"
                      >Weight:</label
                    >
                    <span class="mintedDataInfoValue text-whitebase">{{
                      state.rankScoreData.votingPowerRatioWeight.toFixed(2)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-1 checkProfileBox flex justify-end items-center">
            <router-link
              class="checkProfileLink"
              :to="`/address/details/${state.userInfo.addr}`"
              >Check my profile</router-link
            >
          </div>
          <div
            v-if="!state.isMinted && !state.mintStateLoading"
            class="w-full mintBadgePartHeader"
          >
            <div class="text-whitebase mintBadgePartTitle">
              Basic Information<span
                v-if="!state.isMinted && !state.mintStateLoading"
                >({{ state.nftData.basic }}/{{
                  state.nftData.totalBasic
                }})</span
              >
            </div>
            <p class="text-white-080 mintBadgePartDesc">
              The more information settings you complete, the higher your
              reputation score will be.
            </p>
          </div>
          <div
            v-if="!state.isMinted && !state.mintStateLoading"
            class="w-full mint"
          >
            <div class="w-full mintForm">
              <div class="w-full flex justify-between mintFormBox">
                <div class="mintFormItem flex-1">
                  <div class="label text-whitebase">Name</div>
                  <UiInput
                    ref="nameInput"
                    v-model="state.userInfo.name"
                    placeholder="Enter Name"
                    :maxLength="60"
                    :rules="['normalStr']"
                    :hasDeleteIcon="false"
                  ></UiInput>
                </div>
                <div class="mintFormItem flex-1">
                  <div class="label text-whitebase">
                    <tippy
                      content="Share more about yourself and enhance your chances of being discovered!"
                      :arrow="false"
                    >
                      Brief&nbsp;<i class="iconfont icon-Wiki" />
                    </tippy>
                  </div>
                  <UiInput
                    ref="descInput"
                    v-model="state.userInfo.description"
                    placeholder="Enter Brief"
                    :maxLength="300"
                    :hasDeleteIcon="false"
                  ></UiInput>
                </div>
                <div class="text-whitebase mintFormItem flex-1">
                  <div class="label">
                    <tippy
                      content="Choose vour skills to enable others to discover you by filtering for specitic expertise."
                      :arrow="false"
                    >
                      Skills&nbsp;<i class="iconfont icon-Wiki" />
                    </tippy>
                  </div>
                  <Multiselect
                    v-model="state.userInfo.skills"
                    :options="SkillOptions"
                    mode="tags"
                    :close-on-select="false"
                    :hideSelected="false"
                    placeholder="Select"
                    class="mintMultiSelect"
                    :searchable="true"
                    :create-option="true"
                    ><template #option="{ option }">
                      <div class="flex items-center justify-between w-full">
                        <div
                          :class="{
                            'text-xs rounded-lg bg-white-010 px-2 py-1.5':
                              !option.disabled,
                          }"
                        >
                          {{ option.label }}
                        </div>
                        <span
                          v-if="state.userInfo.skills?.includes(option.label)"
                          class="icon iconfont icon-gou"
                        ></span></div></template
                  ></Multiselect>
                </div>
              </div>
            </div>
            <div class="w-full flex items-center justify-start saveAction">
              <div
                class="w-16 h-8 rounded text-whitebase bg-mb-red font-bold text-xs flex items-center justify-center cursor-pointer saveButton"
                @click="doSave()"
              >
                Save
              </div>
              <router-link
                class="text-whitebase moreSettings"
                to="/settings/profile?back=true"
                >More Settings →</router-link
              >
            </div>
          </div>
          <div
            v-if="!state.isMinted && !state.mintStateLoading"
            class="w-full flex flex-col items-end mintAction"
          >
            <button
              class="active-button mintButton"
              style="width: 158px; height: 40px"
              @click="doMint()"
            >
              {{ state.minting ? 'Minting...' : 'Mint Your Badge' }}
            </button>
            <!-- <p class="mintActionDesc text-white-040">
            DAOBase Reputation Badge Contract(Optimism):<a
              class="mintActionLink"
              target="_blank"
              href="https://optimistic.etherscan.io/address/0xe31baa13df378338071106af5bb92de463bd6d89"
              >0xe31baa13df37...2de463bd6d89</a
            >
          </p> -->
            <p class="mintActionDesc text-white-040">
              DAOBase Reputation Badge Contract(Base):&nbsp;<a
                class="mintActionLink"
                target="_blank"
                href="https://basescan.org/address/0x7721693d0529199d4B68aB4c00f1213b16092Bf9"
                >0x772169...6092Bf9</a
              >
            </p>
          </div>

          <!-- minted info -->
          <div
            v-if="state.isMinted && !state.mintStateLoading"
            class="w-full mintedInfo flex justify-between"
          >
            <!-- <a
            class="mintedInfoImage relative"
            target="_blank"
            :href="state.tokenAddress"
          >
            <img
              v-if="state.rankScoreData.image"
              class="w-full h-full object-cover rounded-s-3xl mintedInfoImg"
              :src="state.rankScoreData.image"
              alt=""
            />
            <span class="viewOn absolute flex items-center text-white-040"
              >view on &nbsp;
              <img :src="require('@/assets/images/mintbadge/OPlogo_mark.png')"
            /></span>
          </a> -->
            <div v-if="!isMobile">
              <iframe
                :src="iframeUrl462"
                frameborder="0"
                width="462"
                height="462"
              ></iframe>
            </div>
            <div v-else>
              <iframe
                :src="iframeUrl320"
                frameborder="0"
                width="320"
                height="320"
              ></iframe>
            </div>
            <div class="mintedInfoContent flex-1">
              <div class="mintedInfoTitle text-whitebase text-bold">
                You have successfully minted your DAO badge!
              </div>
              <div class="w-full mintedInfoDetail">
                <div
                  class="w-full mintedInfoItem flex justify-between items-center"
                >
                  <label class="mintedInfoLabel text-white-080">Score:</label>
                  <span class="text-bold text-whitebase mintedInfoValue">{{
                    Number(state.rankScoreData.score || 0).toFixed(2)
                  }}</span>
                </div>
                <div
                  class="w-full mintedInfoItem flex justify-between items-center"
                  style="border-bottom: none"
                >
                  <label class="mintedInfoLabel text-white-080">Rank:</label>
                  <span class="text-bold text-whitebase mintedInfoValue"
                    >{{ fmoney(state.rankScoreData.rank, 0) }} ({{
                      (
                        Number(state.rankScoreData.rankRatio || 0) * 100
                      ).toFixed(2)
                    }}%)</span
                  >
                </div>
              </div>
              <div
                v-if="state.isMinted && !state.mintStateLoading"
                class="flex justify-end mintedInfoFoot"
              >
                <!-- <p class="mintedInfoDes text-white-040">
                DAOBase Reputation Badge Contract(Optimism):<a
                  target="_blank"
                  href="https://optimistic.etherscan.io/address/0xe31baa13df378338071106af5bb92de463bd6d89"
                  >0xe31baa13df37833...2de463bd6d89</a
                >
              </p> -->
                <p class="mintActionDesc text-white-040">
                  DAOBase Reputation Badge Contract(Base):&nbsp;<a
                    class="mintActionLink"
                    target="_blank"
                    href="https://basescan.org/address/0x7721693d0529199d4B68aB4c00f1213b16092Bf9"
                    >0x772169...6092Bf9</a
                  >
                </p>
              </div>
              <div class="updateTime flex justify-end">
                <button
                  class="active-button font-bold rounded-lg h-10 px-4"
                  @click="jumpInvite"
                >
                  Check Points
                </button>
                <!-- <span class="text-white-040"
                >updated on &nbsp;
                {{
                  dayjs(state.rankScoreData.updateTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                }}</span
              > -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- part4 -->
    <div class="w-full part4 relative">
      <div class="absolute part4AbsoluteImage" />
      <div
        v-if="state.mintStateLoading"
        class="flex w-full justify-center items-center pt-20 pb-20"
      >
        <Spin class="text-white-080"></Spin>
      </div>
      <div
        v-if="state.isMinted && !state.mintStateLoading"
        class="w-2/3 ml-auto mr-auto part4Content"
      >
        <div class="qaHead">
          <i class="iconfont icon-duihua-01 text-whitebase" />
          <span class="qaHeadTitle text-whitebase font-bold">Q&A</span>
        </div>
        <div class="qaList">
          <div
            v-for="(item, index) in state.qaList"
            :key="index"
            :value="item"
            class="qaItem"
          >
            <div
              class="qaItemTitle flex justify-between items-center text-whitebase font-bold"
              @click="qaAction(item, index)"
            >
              <span>{{ item.title }}</span
              ><i
                class="iconfont"
                :class="item.isActive ? 'icon-jia' : 'icon-jian'"
              />
            </div>
            <div v-if="item.isActive" class="qaItemDesc text-white-080">
              {{ item.desc
              }}<a v-if="item.link" target="_blank" :href="item.link">{{
                item.linkWord
              }}</a
              ><span v-if="item.link">.</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!state.isMinted && !state.mintStateLoading"
        class="w-2/3 ml-auto mr-auto part4Content"
      >
        <div class="part4Title text-center text-whitebase font-bold">
          Tips for Improving Reputation
        </div>
        <div class="part4Content flex justify-center items-center">
          <div class="part4Image" />
          <div class="part4ContentInfo">
            <div class="text-whitebase part4ContentTxt">
              -Complete additional profile information.
            </div>
            <div class="text-whitebase part4ContentTxt">
              -Participate in high-quality DAOs.
            </div>
            <div class="text-whitebase part4ContentTxt">
              -Actively propose initiatives.
            </div>
            <div class="text-whitebase part4ContentTxt">
              -Engage with popular proposals.
            </div>
            <div class="text-whitebase part4ContentTxt">
              -Proactively delegate your tokens to trusted representatives.
            </div>
            <div class="text-whitebase part4ContentTxt">
              -Acquire more governance tokens.
            </div>
          </div>
        </div>
      </div>
    </div>

    <teleport to="#app">
      <transition name="fade">
        <div
          v-if="state.show"
          class="fixed inset-0 bg-masked opacity-100 z-top modal flex items-center"
          @click.self="closeModal()"
        >
          <div
            class="modalContent p-4 md:p-8 ml-auto mr-auto flex flex-col items-center relative"
          >
            <button
              class="iconfont icon-guanbi absolute text-white-080"
              @click="closeModal()"
            />
            <div class="w-full flex justify-between modalContentBox">
              <div v-if="!isMobile" class="relative">
                <div
                  class="card"
                  :class="{
                    card_show: state.flipped,
                  }"
                >
                  <div v-if="state.showFlip" class="card-front"></div>
                  <div v-if="state.showFlip" class="card-back"></div>
                  <iframe
                    id="myIframe"
                    :src="iframeUrl320"
                    frameborder="0"
                    width="320"
                    height="320"
                  ></iframe>
                </div>
                <div class="absolute bottom-0 w-full h-15">
                  <span class="absolute bottom-3 right-32 text-black">Share on:</span>
                  <button
                    class="absolute bottom-3 right-18 buttonShare flex items-center space-x-2 text-xs font-bold px-4 p-2"
                    @click="shareTweets"
                  >
                    <!-- <i class="iconfont icon-Twitter2" style="color: #472A91" /> -->
                    <img src="@/assets/icons/twitter-x.png" alt="" width="16" height="16" />
                  </button>
                  <button
                    class="absolute bottom-3 right-4 buttonShare flex items-center space-x-2 text-xs font-bold px-4 p-2"
                    @click="shareFarcaster"
                  >
                    <i class="iconfont icon-Farcaster-01" style="color: #472A91" />
                  </button>
                </div>
              </div>
              <div class="mintedBadgeInfo flex flex-1 flex-col">
                <div class="text-whitebase font-bold text-4xl mb-4">
                  Congratulations!
                </div>
                <div class="text-white-080 mintedBadgeInfoDesc">
                  You have successfully minted your DAO Badge. This marks the
                  beginning of building your on-chain governance reputation!
                </div>
                <div class="mintedBadgeInfoData">
                  <div
                    class="mintedBadgeInfoDataItem w-full items-center flex justify-between borderBottom"
                  >
                    <label class="mintedBadgeInfoDataLabel text-white-080"
                      >Score:</label
                    >
                    <span class="mintedBadgeInfoDataValue text-whitebase">{{
                      Number(state.rankScoreData.score || 0).toFixed(2)
                    }}</span>
                  </div>
                  <div
                    class="mintedBadgeInfoDataItem w-full items-center flex justify-between"
                  >
                    <label class="mintedBadgeInfoDataLabel text-white-080"
                      >Rank:</label
                    >
                    <span class="mintedBadgeInfoDataValue text-whitebase"
                      >{{ fmoney(state.rankScoreData.rank || 0, 0) }} ({{
                        ((state.rankScoreData.rankRatio || 0) * 100).toFixed(2)
                      }}%)</span
                    >
                  </div>
                </div>
                <div v-if="isMobile" class="relative my-4">
                  <div
                    class="card"
                    :class="{
                      card_show: state.flipped,
                    }"
                  >
                    <div v-if="state.showFlip" class="card-front"></div>
                    <div v-if="state.showFlip" class="card-back"></div>
                    <iframe
                      :src="iframeUrl320"
                      frameborder="0"
                      width="320"
                      height="320"
                    ></iframe>
                  </div>
                  <div class="absolute bottom-0 w-full h-15">
                    <button
                      class="absolute bottom-3 left-28 buttonShare flex items-center space-x-2 text-xs font-bold text-mb-blue px-4 p-2"
                      @click="shareTweets"
                    >
                      <i class="iconfont icon-fenxiang2" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
                <div
                  class="mt-8 flex justify-center md:justify-end space-x-4 items-center toPointButtonInModal"
                >
                  <div
                    class="max-w-207px whitespace-nowrap active-button font-bold rounded-lg h-10 text-xs leading-10 px-4"
                  >
                    <!-- Check Points -->
                    <a href="https://daobase.ai/point" target="_blank">
                      Check Points
                    </a>
                  </div>
                  <div class="flex justify-end">
                    <button
                      class="max-w-207px whitespace-nowrap flex items-center bg-white-010 font-bold text-xs h-9 md:h-10 text-black rounded-lg px-4 border border-white-005"
                      @click="closeModal()"
                    >
                      <!-- <a
                        href="https://daobase-organization.gitbook.io/thepass/core-data-and-webpage/webpage/dao-reputation-system-coming-soon"
                        target="_blank"
                      > -->
                      Check Badge
                      <!-- </a> -->
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
    <div v-if="store.state.user.address !== '' && !state.isInvited">
      <Cypher />
    </div>
    <Footer />
  </div>
</template>

<script setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import confetti from 'canvas-confetti';
import { onMounted, reactive, watch, computed } from 'vue';
import { mittContractBadge, mittLoading } from '../../libs/event';
import Cypher from './Cypher.vue';
import Footer from '@/components/Framework/Footer.vue';
// import BigNumber from 'bignumber.js';
import UiInput from '@/views/CreateFlow/component/UiInput.vue';
import Multiselect from '@vueform/multiselect';
import { SkillOptions, contracts, chains } from '@/constants/index';
import { balanceOfBadge, mintBadge } from '@/constants/contract';
import {
  getDynamicNftData,
  getMintedPersonalData,
  getMintedTokenId,
  getProfile,
  getRankScoreData,
  updateProfile,
} from '@/api/dao';
import { notify } from '@kyvg/vue3-notification';
import { getNetworkName, getWalletType, switchEthChain } from '@/utils/wallet';
import { fmoney, isMobilePage } from '@/utils/index';
import Spin from '@/components/Spin.vue';
import { useNetwork } from '@/hooks';
import dayjs from 'dayjs';
import { isInvitationCodeBound, startTask, updateBadge } from '@/api/user';
import { useStore } from 'vuex';
import { formatVal } from '@/utils';
import { useRouter } from 'vue-router';
import { smartWalletConfig } from '@/config/smartWallet';
import { writeContracts } from '@wagmi/core/experimental';
import { switchChain, writeContract } from '@wagmi/core';
import { base } from '@wagmi/core/chains';
import { useConnect } from '@wagmi/vue';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

const { connectors } = useConnect();
const $router = useRouter();
const store = useStore();

const iframeUrl320 = `/badge/320.html?scoremode=static&wallet=${store.state.user.address}`;
const iframeUrl462 = `/badge/462-gray.html?scoremode=static&wallet=${store.state.user.address}`;

const network = useNetwork();
const isMobile = isMobilePage();

const walletType = getWalletType();

const badgeAddress = '0x7721693d0529199d4B68aB4c00f1213b16092Bf9';
const badgeABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'safeMint',
    outputs: [],
  },
];

const state = reactive({
  userInfo: {
    name: '',
    description: '',
    skills: [],
    addr: '',
    isTezos: false,
  },
  network: '',
  activeIndex: -1,
  tokenAddress: '',
  flipCardList: [
    {
      title: 'Purpose and Value',
      desc: 'DAO Badges are blockchain-based records of your DAO contributions, reflecting your on-chain reputation.',
      flip: false,
      bg: require('@/assets/images/mintbadge/1.png'),
    },
    {
      title: 'How to Obtain ',
      desc: 'Actively participate in DAO activities and mint your DAO Badge on the DAOBase website.',
      flip: false,
      bg: require('@/assets/images/mintbadge/2.png'),
    },
    {
      title: 'How to Update',
      desc: 'Boost your on-chain reputation and upgrade your dynamic NFT Badge by participating in DAO governance and operations.',
      flip: false,
      bg: require('@/assets/images/mintbadge/3.png'),
    },
    {
      title: 'Future Potential',
      desc: 'High-reputation members may gain access to airdrops, additional tokens, and exclusive benefits.',
      flip: false,
      bg: require('@/assets/images/mintbadge/4.png'),
    },
  ],
  qaList: [
    // {
    //   title: "- Why isn't my dynamic NFT picture updating? ",
    //   desc: 'Your DAO Badge is a dynamic NFT that evolves in real time as you participate in DAO activities. As you become more involved with the DAO ecosystem and your data changes, your DAO Badge image will reflect your engagement and contributions.',
    //   isActive: true,
    //   link: '',
    //   linkWord: '',
    // },
    {
      title: '- How can I improve my on-chain governance score?',
      desc: 'You can improve your on-chain governance score by completing your profile information, participating in high-quality DAOs, actively initiating proposals, voting on proposals, having users delegate their tokens to you, and holding more governance tokens. For detailed rules, please refer to the',
      isActive: false,
      link: 'https://daobase-organization.gitbook.io/thepass/core-data-and-webpage/webpage/dao-reputation-system-coming-soon',
      linkWord: ' documentation',
    },
    {
      title: '- How is the badge dynamically updated?',
      desc: 'Your DAO Badge is a dynamic NFT that evolves in real time as you participate in DAO activities. As you become more involved with the DAO ecosystem and your data changes, your DAO Badge image will reflect your engagement and contributions.',
      isActive: false,
      linkWord: '',
      link: '',
    },
    {
      title: '- What is the purpose of the badge?',
      desc: 'The badge symbolizes your identity in on-chain governance. Its level reflects the depth of your governance participation and the extent of community recognition. A higher-level badge signifies deeper involvement and not only facilitates community recognition but also serves as a key basis for DAO rewards to members.',
      isActive: false,
      linkWord: '',
      link: '',
    },
    {
      title: "- I have minted, what's next?\n",
      desc: 'Did you know? Minting your DAO badge also earns you DAOBase community points. To learn more about increasing your community points, please ',
      isActive: false,
      link: '/point',
      linkWord: 'click here',
    },
  ],
  saveLoading: false,
  mintStateLoading: true,
  show: false,
  isMinted: false,
  canClose: false,
  nftData: {
    basic: 3,
    totalBasic: 10,
    relatedDaos: 0,
    createdProposals: 0,
    votes: 0,
    delegations: 0,
    votingPowerRatio: 0 || '',
  },
  rankScoreData: {
    basicRank: 0,
    basicWeight: 0,
    relatedDaosRank: 0,
    relatedDaosWeight: 0,
    createdProposalsRank: 0,
    createdProposalsWeight: 0,
    votesRank: 0,
    votesWeight: 0,
    delegationsRank: 0,
    delegationsWeight: 0,
    votingPowerRatioRank: 0,
    votingPowerRatioWeight: 0,
    votingPowerRatioRankRatio: 0,
    relatedDaosRankRatio: 0,
    delegationsRankRatio: 0,
    votesRankRatio: 0,
    createdProposalsRankRatio: 0,
    basicRankRatio: 0,
    image: '',
    score: '',
    rank: '',
    rankRatio: '',
    updateTime: '',
  },
  minting: false,
  isInvited: false,
  loading: true,
  flipped: false,
  showFlip: true,
});

const closeModal = () => {
  state.show = false;
};

const getIsInvited = async () => {
  const res = await isInvitationCodeBound();
  state.isInvited = res.data;
  state.loading = false;
};

const getTokenId = async () => {
  try {
    const data = await getMintedTokenId({ address: state.userInfo.addr });
    if (data?.toString()) {
      // state.tokenAddress =
      //   'https://optimistic.etherscan.io/token/0xe31baa13df378338071106af5bb92de463bd6d89?a=' +
      //   data;
      state.tokenAddress =
        'https://basescan.org/token/0x7721693d0529199d4B68aB4c00f1213b16092Bf9?a=' +
        data;
    }
  } catch (error) {
    // notify({
    //   type: 'error',
    //   text: 'query user token id error!',
    // });
    console.error('query user token id error::', error);
  }
};

const qaAction = (item, index) => {
  state.qaList[index].isActive = !item.isActive;
};

const jumpInvite = () => {
  $router.push('/point');
};

const doSave = async () => {
  if (state.saveLoading) return;
  try {
    state.saveLoading = true;
    const res = await updateProfile(state.userInfo);
    state.saveLoading = false;
    loadData();
    notify({
      type: 'success',
      text: 'Updated Profile Successfully!',
      duration: 5000,
    });
  } catch (error) {
    state.saveLoading = false;
    notify({
      type: 'error',
      text: 'Save error! ' + error.message,
      duration: 5000,
    });
  }
};

// const saveBase64AsFile = async (base64, fileName) => {
//   // 移除 base64 字符串中的头部信息（如果有的话）
//   const base64Data = base64.replace(/^data:image\/png;base64,/, "");

//   // 将 base64 转换为 Blob
//   const byteCharacters = atob(base64Data);
//   const byteNumbers = new Array(byteCharacters.length);
//   for (let i = 0; i < byteCharacters.length; i++) {
//     byteNumbers[i] = byteCharacters.charCodeAt(i);
//   }
//   const byteArray = new Uint8Array(byteNumbers);
//   const blob = new Blob([byteArray], {type: 'image/png'});

//   // 创建下载链接
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = fileName;

//   await updateBadge();

//   // 模拟点击下载
//   link.click();

//   // 清理 URL 对象
//   URL.revokeObjectURL(link.href);
// }

async function processAndSaveBase64AsFile(base64, fileName) {
  // 移除 base64 字符串中的头部信息（如果有的话）
  const base64Data = base64.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
  // 将 base64 转换为 Blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: 'image/png'});
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('file', blob, fileName);
  try {
    // 发送请求到后端 API
    const resData = await fetch(`https://api.daobase.ai/user/uploadFile?address=${store.state.user.address}`, {
      method: 'POST',
      body: formData
    });
    const img = await resData.json();
    console.log('update image response::', img.data);
    // window.open(img.data, '_blank');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function captureIframe(iframe) {
  const canvas = document.createElement('canvas');
  canvas.width = iframe.offsetWidth;
  canvas.height = iframe.offsetHeight;
  const ctx = canvas.getContext('2d');

  await html2canvas(iframe.contentDocument.body, {
    canvas: canvas,
    width: iframe.offsetWidth,
    height: iframe.offsetHeight,
    foreignObjectRendering: true,
    scale: 1,
  });

  try {
    const bitmap = await createImageBitmap(canvas);
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = bitmap.width;
    finalCanvas.height = bitmap.height;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.drawImage(bitmap, 0, 0);

    return finalCanvas.toDataURL('image/png', 0.8);
  } catch (error) {
    console.error('Error creating ImageBitmap:', error);
    return canvas.toDataURL('image/png', 0.8);
  }
}

const doJumpMint = () => {
  if (isMobilePage()) {
    window.scrollTo({ top: 1450, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 1450, behavior: 'smooth' });
  }
};

const doMint = async () => {
  if (state.minting) return false;
  if (network.value == 'tezos') {
    notify({
      type: 'error',
      text: 'Only supports Base chain!',
    });
    return false;
  }
  const switchRes = await switchBaseChain();
  await getMintBadgeStatus(false);
  if (state.isMinted) {
    notify({
      type: 'error',
      text: 'You have successfully minted the Badge!',
    });
    return false;
  }
  if (switchRes) {
    try {
      state.minting = true;
      console.log(
        'before tx time ::',
        new Date().toLocaleString().split('/').join('-'),
      );
      if (walletType === 'coinbase') {
        const coinbaseWalletConnector = connectors.find(
          (connector) => connector.id === 'coinbaseWalletSDK',
        );
        const provider = await coinbaseWalletConnector.getProvider({
          chainId: base.id,
        });
        const signerName = provider?.signer?.constructor?.name;
        console.log('signer name::', signerName);
        if (signerName === 'SCWSigner') {
          const id = await writeContracts(smartWalletConfig, {
            chainId: base.id,
            contracts: [
              {
                address: badgeAddress,
                abi: badgeABI,
                functionName: 'safeMint',
                args: [],
              },
            ],
            capabilities: {
              paymasterService: {
                url: `${process.env.VUE_APP_PAYMASTER_RPC}`,
              },
            },
          });
        } else {
          // mobile coinbase wallet WalletLinkSigner
          const id = await writeContract(smartWalletConfig, {
            chainId: base.id,
            address: badgeAddress,
            abi: badgeABI,
            functionName: 'safeMint',
            args: [],
          });
        }
        // mittContractBadge();
      } else {
        const tx = await mintBadge(contracts.mintBadge.address);
        console.log(
          'after tx time ::',
          new Date().toLocaleString().split('/').join('-'),
        );
        console.log('tx:', tx);
        mittContractBadge(true);
        await tx.wait();
      }
      state.minting = false;
      await getRankScore();
      await getMintBadgeStatus(true);
      mittContractBadge(false);
      const taskRes = await startTask(1);
      console.log('task done::', taskRes);
    } catch (error) {
      state.minting = false;
      notify({
        type: 'error',
        text: 'mint badge error: ' + JSON.stringify(error),
      });
      console.error('coinbase error::', error);
    }
  }
};

const getRankScore = async () => {
  try {
    state.rankScoreData = await getRankScoreData({
      address: state.userInfo.addr,
    });
  } catch (error) {
    // notify({
    //   type: 'error',
    //   text: 'query personal rank score error!',
    // });
    console.error('query personal rank score error::', error);
  }
};

const switchBaseChain = async () => {
  try {
    if (walletType === 'coinbase') {
      await switchChain(smartWalletConfig, { chainId: base.id });
      console.log('coinbase wallet switch chain.');
      return true;
    } else {
      const res = await switchEthChain(chains.Base);
      console.log('switch to base chain::', res);
      if (!res) {
        notify({
          type: 'error',
          text: 'Switch to Base chain to mint your badge!',
        });
      }
      return res;
    }
  } catch (error) {
    notify({
      type: 'error',
      text: 'Switch network failed, please try again!',
    });
    console.error('Switch network failed, please try again::', error);
    return false;
  }
};

const loadData = async () => {
  // const switchRes = await switchBaseChain();
  const userInfo = await getProfile();
  state.userInfo = userInfo;
  state.nftData = await getDynamicNftData({ address: userInfo.addr });
  getRankScore();
  getTokenId();
  // getMintBadgeStatus(true);
  getIsInvited();
  getPersonalPoints();
};

const toggleFlipped = () => {
  let timer = setInterval(() => {
    state.flipped = !state.flipped;
    console.log('change flipped::', state.flipped);
  }, 800);
  setTimeout(() => {
    clearInterval(timer);
    state.showFlip = false;
  }, 3200);
};

const getMintBadgeStatus = async (showDialog) => {
  try {
    if (walletType === 'coinbase') {
      if (showDialog) {
        let timer = setInterval(() => {
          getPersonalPoints();
          if (state.isMinted) {
            state.show = true;
            animateCelebrate();
            clearInterval(timer);
          }
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          console.log('The mint is not queried within 10 seconds!');
        }, 10000);
      }
    } else {
      const userBalance = await balanceOfBadge(
        contracts.mintBadge.address,
        state.userInfo.addr,
      );
      state.isMinted = userBalance > 0;
      console.log('userBalance::', userBalance);
      if (state.isMinted && showDialog) {
        state.show = true;
        animateCelebrate();
      }
    }
  } catch (error) {
    console.log('balanceOfBadge error::', error);
  }
  state.mintStateLoading = false;
};

const animateCelebrate = () => {
  var end = Date.now() + 15 * 1000;

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const x = this;
  (function frame() {
    confetti({
      particleCount: 100,
      zIndex: 999,
      angle: 60,
      spread: 100,
      origin: { x: 0, y: 0.5 },
      // colors: colors,
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 100,
      origin: { x: 1, y: 0.5 },
      zIndex: 999,
      // colors: colors,
    });

    if (x?.cleared) {
      confetti.reset();
    }

    if (Date.now() < end && !x.cleared) {
      requestAnimationFrame(frame);
    }
  })();
};

const doFlip = (item, index, flip) => {
  // let timer: any;
  // timer && clearTimeout(timer);
  if (!flip) {
    // timer = setTimeout(() => {
    if (item.flip === true) {
      state.flipCardList[index].flip = flip;
    }
    //   clearTimeout(timer);
    // }, 300);
  } else {
    if (item.flip === false) {
      state.flipCardList[index].flip = flip;
    }
  }
};

const myInviteUrl = `https://daobase.ai/mintdaobadge?inviteId=${store.state.user.visitorToken}`;

const shareTweets = async () => {
  console.log('shareTweets ---- ');
  // const badgeImg = await captureIframe();
  const badgeImg = 'https://tinypng.com/static/images/george-account-page.webp';
  const twTittle = `🎉 I just minted my shiny new DAO badge, and I'm ranking at ${fmoney(
    state.rankScoreData.rank,
    0,
  )}! 🎉 Join the fun and mint yours now to boost your on-chain cred! 🚀 ✨ Mint your DAO badge here: `;
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twTittle,
    )}&url=${encodeURIComponent(myInviteUrl)}&image=${encodeURIComponent(
      badgeImg,
    )}&hashtags=${encodeURIComponent('DAOBadge #Base #DAOBase')}`,
    '_blank',
  );
};

const shareFarcaster = async () => {
  console.log('shareFarcaster ---- ');
  const iframe = document.getElementById('myIframe');
  const base64Png = await captureIframe(iframe);
  console.log('base64Png ---- ::', base64Png);
  await processAndSaveBase64AsFile(base64Png, `${store.state.user.address}.png`);
  const badgeImg = `https://frame.daobase.ai/api/address/${store.state.user.address}`;
  const fcTittle = `🎉 I just minted my shiny new DAO badge, and I'm ranking at ${fmoney(
    state.rankScoreData.rank,
    0,
  )}! 🎉 Join the fun and mint yours now to boost your on-chain cred! 🚀 ✨ Mint your DAO badge here: `;
  window.open(
    `https://warpcast.com/~/compose?text=${fcTittle}&embeds[]=${badgeImg}`,
    '_blank',
  );
};

const getPersonalPoints = async () => {
  try {
    const res = await getMintedPersonalData();
    console.log('/task/mint/status res ::', res);
    if (res) {
      state.isMinted = true;
    } else {
      state.isMinted = false;
    }
  } catch (error) {
    // notify({
    //   type: 'error',
    //   text:  'could not get mint status!',
    // });
    console.error('could not get mint status::', error);
  }
  state.mintStateLoading = false;
};

watch(
  () => state.show,
  () => {
    if (state.show) toggleFlipped();
  },
);

onMounted(() => {
  loadData();
});
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.w-2\/3 {
  width: 80rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}
body {
  position: relative;
}
.banner {
  background: url('~@/assets/images/mintbadge/banner.png') center center
    no-repeat;
  background-size: cover;
  height: 480px;
}
@media screen and (max-width: 800px) {
  .mintBadgePartBox {
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .w-2\/3 {
    width: 90% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .banner {
    height: 240px !important;
  }
  .bannerContent {
    padding-top: 50px !important;
    padding-bottom: 0 !important;
  }
  .title {
    width: 100% !important;
    font-size: 20px !important;
    line-height: 30px !important;
  }
  .bannerBox {
    width: 90% !important;
  }
  .buttonBox {
    flex-direction: column;
    align-items: flex-start !important;
  }
  .subButton {
    margin-left: 0 !important;
    margin-top: 10px;
  }
  .part2 {
    padding-top: 50px !important;
  }
  .part2Content {
    width: 90% !important;
    gap: 0 !important;
  }
  .part2Title {
    font-size: 20px !important;
    margin-bottom: 10px !important;
    font-weight: bold;
  }
  .part2Desc {
    font-size: 13px !important;
  }
  .part2Image {
    display: none;
    width: 150px !important;
    height: 150px !important;
    border-radius: 12px !important;
  }
  .part3 {
    margin-top: 40px !important;
    padding-top: 15px !important;
    padding-bottom: 15px !important;
  }
  .part3List {
    width: 95% !important;
    overflow-x: auto !important;
  }
  .part3ListContent {
    width: 833px;
    justify-content: flex-start;
    gap: 15px;
  }
  .introduceItem {
    width: 195px !important;
    min-height: 130px !important;
    padding: 10px !important;
  }
  .mintBadge {
    padding-top: 40px !important;
  }
  .mintBadgeTitle {
    font-size: 20px !important;
  }
  .mintBadgeDesc {
    font-size: 12px !important;
    margin-top: 8px !important;
  }
  .mintBadgePart {
    width: 90% !important;
    margin-top: 12px !important;
    border-radius: 12px !important;
    padding: 12px !important;
  }
  .mintBadge .header {
    width: 90% !important;
  }
  .mintBadgePartTitle {
    font-size: 12px !important;
  }
  .mintBadgePartDesc {
    font-size: 10px !important;
  }
  .dataBox {
    margin-top: 8px;
    width: 100%;
    overflow-x: auto;
  }
  .dataBoxFlex {
    gap: 10px;
    width: 1100px;
    justify-content: flex-start;
  }
  .dataLabel {
    font-size: 12px !important;
  }
  .mintedInfo {
    gap: 10px !important;
    padding-top: 10px !important;
    margin-top: 12px !important;
    flex-direction: column !important;
    align-items: center;
  }
  .mintedInfoImg {
    width: 150px !important;
    height: 150px !important;
    border-radius: 12px !important;
  }
  .mintedInfoImage {
    width: 150px !important;
    height: 150px !important;
    border-radius: 12px !important;
    background: rgba(255, 255, 255, 0.05);
  }
  .mintedInfoTitle {
    font-size: 14px !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }
  .mintedInfoItem {
    height: 40px !important;
  }
  .mintedInfoLabel {
    font-size: 12px !important;
    margin-left: 10px !important;
  }
  .mintedInfoValue {
    font-size: 12px !important;
    margin-right: 10px !important;
  }
  .mintedInfoFoot {
    flex-direction: column !important;
  }
  .toPointButton {
    height: 30px !important;
    line-height: 30px !important;
    font-size: 12px;
    margin-top: 10px !important;
  }
  .part4 {
    padding-top: 40px !important;
    padding-bottom: 60px !important;
  }
  .part4Content {
    width: 90% !important;
  }
  .part4Title {
    font-size: 24px !important;
    margin-top: 20px !important;
  }
  .part4Content {
    margin-top: 0 !important;
  }
  .part4Image {
    display: none;
    width: 342px !important;
    height: 264px !important;
    background: url('~@/assets/images/mintbadge/bottom.png') center center
      no-repeat;
    background-size: cover;
  }
  .part4ContentInfo {
    margin-left: 20px !important;
  }
  .part4ContentTxt {
    line-height: 230%;
    font-size: 14px !important;
  }
  .mint {
    width: 100% !important;

    margin-top: 10px !important;
    border-radius: 12px !important;
    padding: 16px !important;
  }
  .mintForm {
    width: 100% !important;
  }
  .mintFormBox {
    gap: 10px !important;
    flex-direction: column;
  }
  .mintDescs {
    margin-top: 0 !important;
  }
  .mintButton {
    margin-top: 10px !important;
  }
  .mintActionDesc {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: flex-end !important;
  }
  .badgeImageBox {
    width: 80px !important;
    height: 80px !important;
    border-radius: 12px;
  }
  .badgeImage {
    border-radius: 12px !important;
  }
  .modalContent {
    width: 90% !important;
    align-items: center !important;
  }
  .modalContentBox {
    gap: 12px !important;
  }
  .mintedBadgeInfoData {
    width: 100% !important;
    border-radius: 12px !important;
  }
  .mintedBadgeInfoDataItem {
    height: 40px !important;
  }
  .mintedBadgeInfoDataLabel {
    font-size: 14px !important;
    margin-left: 12px !important;
  }
  .mintedBadgeInfoDataValue {
    font-size: 14px !important;
    margin-right: 12px !important;
  }
  .toPointButtonInModal {
    margin-top: 10px !important;
    width: 100% !important;
  }
  .toPointButtonInModal .active-button {
    font-size: 12px !important;
    padding: 0 10px !important;
    height: 30px !important;
    line-height: 30px !important;
  }
  .toPointButtonInModal span {
    font-size: 8px !important;
    text-align: right;
  }
  .icon-guanbi {
    cursor: pointer;
    right: 0;
    top: 30px !important;
    font-size: 20px;
  }
  .bannerButton {
    align-items: flex-start;
  }
  .part4ContentInfo {
    margin-left: 0 !important;
  }
  .viewOn {
    bottom: 2px !important;
    right: 2px !important;
    font-size: 8px !important;
  }
  .viewOn img {
    width: 40px !important;
  }
  .introduceItem .front,
  .introduceItem .back {
    padding: 10px !important;
  }
  .introduceItem .front {
    font-size: 16px !important;
  }
  .introduceItem .back {
    font-size: 12px !important;
  }
  .qaHead {
    margin-top: 0 !important;
  }
  .par3AbsoluteImage,
  .part4AbsoluteImage {
    display: none !important;
  }
  .checkProfileBox {
    /*margin-top: 12px !important;*/
  }
  .checkProfileLink {
    font-size: 12px !important;
    line-height: 18px !important;
  }
  .buttonShare,
  .toPointButtonInModal .active-button {
    font-size: 12px !important;
    height: 36px !important;
  }
  .icon-guanbi {
    right: 18px !important;
    top: 20px !important;
  }
  .updateTime {
    margin-top: 30px !important;
  }
}
.mintedInfoImg {
  width: 100%;
  height: 100%;
  border-radius: 16px;
}
.dataLabel {
  font-size: 12px;
}
.dataNum {
  font-size: 20px;
  font-weight: bold;
}
.part2Image {
  width: 384px;
  height: 384px;
  border-radius: 24px;
}
.part2 {
  padding-top: 120px;
}
.part2Content {
  gap: 80px;
}
.part2Title {
  font-size: 36px;
  margin-bottom: 16px;
}
.part2Desc {
  font-size: 16px;
}
.title {
  font-size: 48px;
  line-height: 56px;
}
.buttonBox {
  margin-top: 24px;
}
.bannerButton {
  min-width: 158px;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
}
.subButton {
  margin-left: 32px;
  font-size: 16px;
  font-weight: bold;
}
.bannerContent {
  padding-top: 160px;
  padding-bottom: 40px;
}
.part3 {
  margin-top: 120px;
  padding-top: 25px;
  padding-bottom: 25px;
}
.introduceItem {
  width: 282px;
  min-height: 128px;
  position: relative;
  cursor: pointer;
  perspective: 1000;
  -webkit-perspective: 1000;
}
.introduceItem .front,
.introduceItem .back {
  left: 0;
  top: 0;
  position: absolute;
  background-position: center center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
  backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  border-radius: 16px;
}
.introduceItem .front {
  background: url('~@/assets/images/mintbadge/mintbadge_introduce01.png') center
    no-repeat;
  background-size: 100%;
  font-weight: bold;
  font-size: 20px;
}
.introduceItem .back {
  transform: rotate3d(0, 1, 0, -180deg);
  -ms-transform: rotate3d(0, 1, 0, -180deg);
  -moz-transform: rotate3d(0, 1, 0, -180deg);
  -webkit-transform: rotate3d(0, 1, 0, -180deg);
  z-index: 8;
  background: #262729;
  text-align: center;
  font-size: 16px;
  line-height: 24px;
}

.card-flip .front {
  transform: rotate3d(0, 1, 0, 180deg);
  -ms-transform: rotate3d(0, 1, 0, 180deg); /* IE 9 */
  -moz-transform: rotate3d(0, 1, 0, 180deg); /* Firefox */
  -webkit-transform: rotate3d(0, 1, 0, 180deg); /* Safari 和 Chrome */
  z-index: 8;
}
.card-flip .back {
  transform: rotate3d(0, 1, 0, 0deg);
  -ms-transform: rotate3d(0, 1, 0, 0deg); /* IE 9 */
  -moz-transform: rotate3d(0, 1, 0, 0deg); /* Firefox */
  -webkit-transform: rotate3d(0, 1, 0, 0deg); /* Safari 和 Chrome */
  z-index: 10;
}

.mintBadge {
  padding-top: 120px;
}
.mintBadgeTitle {
  font-size: 36px;
  font-weight: bold;
}
.mintBadgeDesc {
  font-size: 16px;
  margin-top: 16px;
}
.mintBadgePartBox {
  box-sizing: border-box;
  width: 80rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}
.mintBadgePart {
  margin-top: 24px;
  border: 1px solid #2e2e2e;
  border-radius: 26px;
  padding: 24px;
  width: 100%;
}
.mint {
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
}
.mintFormBox {
  gap: 24px;
}
.multiselect {
  min-height: 56px;
}
.label {
  margin-bottom: 8px;
}
.saveAction {
  margin-top: 24px;
}
.saveButton {
  width: 70px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
}
.moreSettings {
  font-size: 14px;
  font-weight: bold;
  margin-left: 24px;
}
.dataBox {
  margin-top: 16px;
  margin-bottom: 16px;
}
.dataBoxFlex {
  gap: 16px;
}
.dataItem {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px 0;
}
.mintedDataInfo {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 8px;
}
.mintedDataInfoItem {
  margin-top: 8px;
  padding: 0 16px;
}

.mintedDataInfoLabel {
  font-size: 12px;
}
.mintedDataInfoValue {
  font-size: 12px;
}
.mintDescs {
  margin-top: 16px;
}
.mintDesc {
  font-size: 12px;
}
.mintDescLink {
  margin-left: 8px;
  color: #268cff;
  text-decoration: underline;
}
.mintActionDesc {
  font-size: 12px;
  margin-top: 8px;
}
.mintActionLink {
  color: #268cff;
  text-decoration: underline;
}
.mintAction {
  margin-top: 16px;
}
.part4 {
  padding-bottom: 140px;
}
.part4Title {
  margin-top: 104px;
  font-size: 36px;
}
.part4Content {
  margin-top: 60px;
}
.part4Image {
  width: 342px;
  height: 264px;
  background: url('~@/assets/images/mintbadge/bottom.png') center center
    no-repeat;
  background-size: cover;
}
.part4ContentInfo {
  margin-left: 72px;
}
.part4ContentTxt {
  line-height: 230%;
  font-size: 20px;
}
.mintedInfo {
  gap: 20px;
  padding-top: 20px;
  margin-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.mintedInfoTitle {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.mintedInfoDetail {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
.mintedInfoItem {
  height: 80px;
  border-bottom: 1px solid #2e2e2e;
}
.mintedInfoLabel {
  margin-left: 20px;
}
.mintedInfoValue {
  margin-right: 20px;
}
.mintedInfoImage {
  width: 462px;
  height: 462px;
  display: block;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
}
.modal {
  background: rgba(18, 20, 22, 0.8);
  backdrop-filter: blur(10px);
  z-index: 998;
}
.mintedInfoDes {
  font-size: 12px;
}
.mintedInfoDes a {
  text-decoration: underline;
  color: #268cff;
}
.mintedInfoFoot {
  margin-top: 10px;
}
.mintedBadgeInfoTitle {
  font-weight: bold;
  font-size: 36px;
  line-height: 44px;
  margin-bottom: 16px;
}

.mintedBadgeInfoDesc {
  /* text-align: center; */
  font-size: 16px;
  line-height: 24px;
}
.modalContentBox {
  margin-top: 44px;
}

.mintedBadgeInfoData {
  //width: 486px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-top: 16px;
}
.mintedBadgeInfoDataItem {
  height: 60px;
}
.borderBottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.mintedBadgeInfoDataLabel {
  font-size: 16px;
  margin-left: 24px;
}
.mintedBadgeInfoDataValue {
  font-size: 16px;
  margin-right: 24px;
}
.modalContent {
  width: 996px;
  box-sizing: border-box;
  background: #121416;
  box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.5);
  border-radius: 16px;
}
.modalContentBox {
  gap: 24px;
}
.toPointButtonInModal {
  width: 100%;
}
.badgeImage {
  border-radius: 16px;
}

.icon-guanbi {
  cursor: pointer;
  right: 28px;
  top: 37px;
  font-size: 20px;
}
.mintBadgePartTitle {
  font-size: 16px;
  font-weight: bold;
}
.mintBadgePartDesc {
  font-size: 14px;
}
.multiselect-dropdown .multiselect-options .multiselect-option div {
  color: white !important;
}
.viewOn {
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  display: none;
}
.viewOn img {
  width: 80px;
}
.mintedInfoImage {
  cursor: pointer;
  display: block;
}
.badgeImageBox {
  width: 320px;
  height: 320px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  display: block;
  cursor: pointer;
}
.qaHead {
  margin-top: 120px;
}
.qaHeadTitle {
  font-size: 36px;
}
.qaHead .iconfont {
  margin-right: 8px;
  font-size: 30px;
}
.qaList {
  margin-top: 16px;
}
.qaItem {
  margin-bottom: 24px;
}
.qaItemTitle {
  margin-bottom: 16px;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.qaItemDesc {
  font-size: 14px;
}
.qaItemDesc a {
  color: #268cff;
  text-decoration: underline;
}
.mintBadgePartHeader {
  margin-top: 15px;
}
.par3AbsoluteImage {
  width: 208px;
  height: 332px;
  top: -130px;
  left: 0;
  /* background: url('~@/assets/images/mintbadge/leftball.png') no-repeat center center; */
  background-size: 100% 100%;
}
.part4AbsoluteImage {
  width: 258px;
  height: 410px;
  /* background: url('~@/assets/images/mintbadge/rightball.png') no-repeat center center; */
  background-size: 100% 100%;
  right: 0;
  top: 50px;
}
.checkProfileBox {
  /*margin-top: 24px;*/
  padding-right: 12px;
  box-sizing: border-box;
}
.checkProfileLink {
  color: #268cff;
  font-size: 16px;
  line-height: 24px;
}
.updateTime {
  /* font-size: 12px; */
  margin-top: 167px;
}

.mintBadge_bg {
  background-image: url('~@/assets/images/mintbadge/before-mint.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.card {
  cursor: pointer;
  height: 320px;
  perspective: 1000px;
  position: relative;
  transform-style: preserve-3d;
  transition: rotate 800ms linear;
  width: 320px;
}

.card_show {
  rotate: y 180deg;
}

.card-front,
.card-back {
  backface-visibility: hidden;
  border: 5px solid #000000;
  border-radius: 16px;
  display: grid;
  inset: 0;
  padding: 0.5em;
  place-content: center;
  position: absolute;
}

.card-front {
  /* background-color: pink; */
  background-image: url('~@/assets/images/mintbadge/before-mint.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.card-back {
  /* background-color: aliceblue; */
  background-image: url('~@/assets/images/mintbadge/before-mint.png');
  background-repeat: no-repeat;
  background-size: cover;
  rotate: y 180deg;
}
</style>
