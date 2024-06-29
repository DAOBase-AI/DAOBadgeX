/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
// import { badgeABI } from "./abi";
import { privateKeyToAccount } from "viem/accounts";
import {
  Hex,
  createWalletClient,
  encodeFunctionData,
  http,
  parseAbi,
} from "viem";
import { sepolia } from "viem/chains";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";

const CHAINID = "11155111";

const bundlerUrl = `https://bundler.biconomy.io/api/v2/${CHAINID}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`;
import { createSystem, colors } from "frog/ui";
import { isValidEthAddress, shortEthAddress} from "@/app/utils";

const { Box, Columns, Divider, Heading, Spacer, Image, Text, VStack, HStack, vars } = createSystem({
  colors: colors.dark,
});

const privateKey = process.env.PRIVATE_KEY!;
const paymasterApiKey = process.env.PAYMASTER_API_KEY!;

const app = new Frog({
  title: 'daobadge',
  headers: {
    'cache-control': 'max-age=0',
  },
  assetsPath: "/",
  basePath: "/api",
  ui: { vars },
  imageOptions: { height: 600, width: 600 },
  imageAspectRatio: "1:1",
});


app.frame("/address/:address", async (c) => {

  let userAddress = '0xf43f7d19a81087de6fbf1c5d33e4b946202d9a15';
  const paramsAddress = c.req.param('address');

  if (isValidEthAddress(paramsAddress)) {
    userAddress = paramsAddress;
  } else {
    console.log('Invalid query ...');
  }

  console.log('userAddress ----- ::', userAddress);
  console.log('what is c.req ----- ? ::', c.req.url);

  const res1 = await fetch(`https://api.daobase.ai/profile/daoProposalsStats/${userAddress}`);
  const resProfile = await res1.json();
  const { logo, name, description, daos, proposalsCreated, proposals, delegations, vpr } = resProfile.data;
  // console.log('resProfile --- ::', resProfile);

  const res2 = await fetch(`https://api.daobase.ai/user/userRankScore/${userAddress}`);
  const resRankScore = await res2.json();
  const { score, rank, rankRatio } = resRankScore.data;
  console.log('resRankScore --- ::', resRankScore);

  // let userName = name;
  let showImg = logo;

  if (logo.includes('cdn.stamp.fyi')) {
    showImg = `https://effigy.im/a/${userAddress}.png`;
  }

  return c.res({
    // action: "/create_account",
    image: (
      <Box grow backgroundColor="background" padding="56">
        <VStack gap="4">
          <Image src={showImg} width="80"></Image>
          <Text color="text" size="32">
           { isValidEthAddress(name) ? shortEthAddress(name) : name }
          </Text>
          <Text color="text400" size="14">
           {description}
           {/* Your all-in-one DAO data and analytics platform  Powered by AI  Simplifying governance, investment, contributions, and beyond  */}
          </Text>
          {/* <Spacer size="20" /> */}
          <Spacer size="10" />
          <Text color="text" size="24">
            DAO Badge
          </Text>
          <Spacer size="10" />
          <HStack gap="8">
            <VStack gap="4" alignVertical="center">
              <HStack gap="8">
              <VStack gap="4">
                <Text color="text" size="20">
                  {daos.length || '0'}
                </Text>
                <Text color="text300" size="12">
                  Related DAOs
                </Text>
              </VStack>
              <VStack gap="4" alignHorizontal="center">
                <Text color="text" size="20">
                  {proposalsCreated || '0'}
                </Text>
                <Text color="text300" size="12">
                  Votes
                </Text>
              </VStack>
              </HStack>
              <HStack gap="8">
                <VStack gap="4">
                  <Text color="text" size="20">
                    {proposals || '0'}
                  </Text>
                  <Text color="text300" size="12">
                    Proposals
                  </Text>
                </VStack>
                <VStack gap="4" alignHorizontal="center">
                  <Text color="text" size="20">
                    {delegations || '0'}
                  </Text>
                  <Text color="text300" size="12">
                    delegations
                  </Text>
                </VStack>
              </HStack>
              <VStack gap="4">
                <Text color="text" size="20">
                  {vpr.toLocaleString()}
                </Text>
                <Text color="text300" size="12">
                  Voting weight valuation
                </Text>
              </VStack>
              <Spacer size="10" />
              <Text color="text300" size="14">
                Score
              </Text>
              <Text color="text" size="24">
                {score.toFixed(2)}
              </Text>
              {/* <Spacer size="10" /> */}
              <Divider color="gray400" />
              {/* <Spacer size="10" /> */}
              <Text color="text300" size="14">
                Rank
              </Text>
              <Columns grow gap="2" alignVertical="center">
                <Text color="text" size="24">
                  {rank}
                </Text>
                <Text color="text" size="12">
                  ({(rankRatio * 100).toFixed(2) + '%'})
                </Text>
              </Columns>
            </VStack>
            <Spacer size="40" />
            <Image borderRadius="12" src={`https://daobase-public.s3.ap-east-1.amazonaws.com/preview/${userAddress}`} width="256"></Image>
          </HStack>
        </VStack>
      </Box>
    ),
    // imageOptions: { height: 1200, width: 1200 },
    intents: [
      // TODO: new name-> Free Mint 
      // <Button>Create account</Button>,
      <Button.Link href="https://daobase.ai/point/leaderboard">
        🏆Leaderboard
      </Button.Link>,
      <Button.Link href="https://docs.daobase.ai/daobase/tutorials-and-guides/introducing-daobadgex-a-customized-on-chain-reputation-for-web3-governance-users">
        📃About
      </Button.Link>,
      <Button.Transaction target="/mint">👉Mint</Button.Transaction>,
    ],
  });
});

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

app.transaction("/mint", (c) => {
  // Contract transaction response.
  return c.contract({
    abi: badgeABI,
    chainId: "eip155:8453",
    functionName: "safeMint",
    to: badgeAddress,
    args: [],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
