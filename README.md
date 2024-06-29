## (⌐■_■) Introducing DAOBadgeX: A Customized On-Chain Reputation for Web3 Governance Users

**"Decentralization isn't just a technology trend, it's a social evolution." - Naval Ravikant**

In the world of Web3, DAOs are becoming standard across native projects, with over 80% of Web3 initiatives opting to build or planning to build their DAOs. Decentralized governance, even under core team control, embodies collective empowerment and the path to freedom. However, in this process, rapid identification of suitable DAO contributors and aligning DAO users/investors with fitting opportunities is critical. Efficiently discovering the depth of DAOs and users in this journey requires robust tools and data.

**"Reputation is the shadow. Character is the tree."**

Building upon our established reputation framework encompassing various dimensions of DAO evaluation, today we introduce DAOBadgeX. Created by DAOBase and designed by Daniel Aguilar (@protozoo), DAOBadgeX is a pioneering on-chain reputation system tailored for Web3 governance users. It functions as a dynamic NFT that evolves automatically based on your DAO engagement, covering basic information, DAO memberships, voting power, proposals, votes, and delegations. This marks the first DID and on-chain reputation system designed specifically for DAO governance users, offering the most straightforward way to understand who you are through data. We may not have met you, but your past experiences are telling your story and defining who you are.

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXedBAMyVXMJFKFtzp5BEi_UpXGpdC4UNw3Lzq9SYlImc0-OKGwoUwRbFiZSYl5FQWBtVtCaleMRXQIaQd-rLV65ZA1nFP-r8Mj4wDWVGP0YLdCuk3XsjJQlB2kJy9edpl0nD8j8rdjt0g3YHzviAzHSoMo?key=yX7C0xQkKNnkWVVuz9FDYw)

### System Composition

DAOBase is a comprehensive data platform focused on DAOs, covering 7 blockchains, over 160,000 DAOs, and 6 million voters, making it the largest DAO database. It aggregates governance frameworks, providing extensive DAO data and recording user activities. The platform assigns users’ on-chain reputation scores and awards DAO badges based on:

* **Basic Information Completeness**
* **Related DAOs**
* **Proposals**
* **Votes**
* **Delegation**
* **Voting Power Valuation**

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXc50VCoZVo1bwxHS3Cfy1mDi7NTbYzO_3lXVzZNYYRkyZSHf_brESIP9tJpjLWcGSazVqTIguVSY1MH5Je3o9f6K5jh7_mu2lHz06nyTZS8lqvleMhcm-czj70IQUM9z3zm-Weflt6rwopEyxA3Ht247CW1?key=yX7C0xQkKNnkWVVuz9FDYw)

All data will be calculated and its embody will be stored on the blockchain for transparency and immutability. DAO badges reflect users' on-chain reputation, growing with active participation, and signify contributions and influence within the community. Higher scores may lead to benefits like airdrops and other privileges, encouraging users to support DAO growth.

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXeGwmV3DiEp05mnw414sqXLHqXI0OaCYrwq-fxAKSO_kWXi3iGUtFl7frUJZTlmKXJ9O4lMw_FW9kbmSV4biyHcXnJ8FJXYDDSWEpGZ_zta7VsiK-mtf6nBOlq4BWHRqymRpCHbHBojCIt9ZN0I6qBqxyY?key=yX7C0xQkKNnkWVVuz9FDYw)

### On-Chain Reputation Score Calculation Rules

A user's DAO on-chain reputation score is determined mainly by their contributions across six modules: Basic Information, Related DAOs, Votes, Proposals, Delegations, and Voting Power Valuation. We use a weighted ranking method to calculate the normalized score for each module and the CRITIC algorithm to determine the weights of each module, combining the scores and weights to derive the final governance score.

Specific Steps:

1. **Data Ranking**: Rank each data dimension.
2. **Ranking Normalization**: Normalize the ranking values to make them comparable across different dimensions.
3. **CRITIC Algorithm for Weight Calculation**: Use the CRITIC algorithm to calculate the weights for each dimension.
4. **Weighted Sum**: Perform a weighted sum of the normalized ranking values to obtain the composite score.

Example:

Step 1: Rank the data of 3 users across 6 dimensions:
![](https://lh7-us.googleusercontent.com/docsz/AD_4nXd5DuREvbrMXaDBhek7r9OnUasa33bevdizh9k8Q5a41s7bNWmvXUd8MtRvGjFrhzQ9oT9663wT-OJ5X0RVqX8rzyBjeGqccGoktX58P99-zO4dySKp5kNsBgnj9A0a5SV10xdNSHhhFcmJgwZ21QuzMXg?key=yX7C0xQkKNnkWVVuz9FDYw)

Step 2: Normalization and Inversion of User Rankings to a 0-100 Scale

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXcXjTA630KImZPb5uOPl_iqeraYtwBgPZC9WrK4UrOdisPgEuqAzhjiVtpY5uwMUDKYsEgRjJA9RSp0hm-oX6U04TuAMrIacJbLM6NH1vw5l9VODVDlBwECBojCAfeARLYuIj_oRfxTGxhpAbjfJuHMxNg?key=yX7C0xQkKNnkWVVuz9FDYw)

Step 3: Calculate weights using the CRITIC algorithm. The steps include:

* **Standardizing the Decision Matrix**: Standardize the original decision matrix to eliminate dimensional effects.
* **Calculating Standard Deviation**: Compute the standard deviation for each criterion, reflecting the variability of criterion values.
* **Calculating Correlation Matrix**: Compute the correlation coefficient between each pair of criteria to indicate the correlation between criteria.
* **Calculating Information Quantity**: Compute the information quantity for each criterion, which is a function of the standard deviation and correlation.
* **Calculating Weights:** Calculate the weights for each criterion based on the normalized information quantity.

And the specific formula is as follows:

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXfm_YhKUTqTkKgYPop5h5IkC-5Y2ej7EJokCBicwBR7adtYIAM2aUag_XfuxBvWj8tXI-iSk3mYmrILPHTdm-u5gQalZx_qXA3yrRu0eKFolih8emub2sa1jamXufHAYAErGzwuPnUCWwevr76zHtLpRDc?key=yX7C0xQkKNnkWVVuz9FDYw)

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXdV2HnkUEJmEjEQKnbZ_mUBit6Zur58WhenB7JDG2ANc4DjfxD4bS8o-SkjreqSEHxCDWe32cvmw5XFPxNmPnLmonkf154I9_rcJFDH2QP6HuO0a4MpQ1lZazXNshlv_Tvh3K5b8VOe7aDW8dDXqeeASN8?key=yX7C0xQkKNnkWVVuz9FDYw)

Finally, we obtain the following weights for the six dimensions (weights vary with user data changes):![](https://lh7-us.googleusercontent.com/docsz/AD_4nXfgmSgpZIujNRfyU4NS2rYweItMuxWnCNsCXwf7MiZFH0qXmapj0SAQ85pFjJMMCkjREC-ic4EONHF4OqIvCy_UD_mTlOIGucKDU_ecZcwtFjL3djk79c4pOj4b1GsmtbYs0_IkkDvMg7UcVkXUIYOS-hrv?key=yX7C0xQkKNnkWVVuz9FDYw)

Step 4: Perform a weighted sum. The composite score S is calculated as follows:

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXfD0bssFt2y_joQDiZ_GMHASenKlMhFafWnFZh-tF_QdDO_Fn91g9FlyYYScWw6rUEmMBzwph-p593VoD42yV0BHFKxIlNiSD1fxH1Dkn6c79Fi4skxjQ7vY42Ycq38jcpJNQ71u8oxSM6O8IGrx9fwEbpP?key=yX7C0xQkKNnkWVVuz9FDYw)

Calculate the composite score for each user:

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXcxJb51d3HPuqjrhnt5IlDndRflhLREqcU5thfbbmaPD7sv9cCZwTouuryDbG8kYCOVjE784oCVGJSpzNxl_nd54LDuTV4bJCg54qS9SbVudRjj5Yo1hQ2pN7-Fuyil6EPIUUbF0ffRJ-OUJ9ho0zE2fBmX?key=yX7C0xQkKNnkWVVuz9FDYw)

Rank users based on their composite scores.

### 4. Artistic Representation of DAO Badges

The DAO Badge, envisioned by DAOBase and artfully created by Daniel Aguilar, serves as a dynamic testament to the vibrant contributions made within DAOs.

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXdhR2ScrUTcMS-i7OstMuP7D9HlyBrgiUoB7DqMcjQ6Uri-d7HmveXipJRFHC9A03oY1Q6QYOSfcqXpFNTbHEy4Wcd2BSb34de1TFhDpLg_7PPBea7wvjKUE4qCbb_hwZukgX3DLoml1bJ2c3751blboIfF?key=yX7C0xQkKNnkWVVuz9FDYw)

Inspired by the organic growth of flora, the badge begins as a humble seed and gradually evolves into intricate formations resembling petals and leaves. Vivid colors and dynamic patterns capture the essence of DAO engagement, luminous particles symbolize the energy brought by active participants while the badge's roots signify the foundational contributions crucial for the ecosystem's health and prosperity.

The badge's size and complexity correlate with the user's comprehensive score, reflecting their level of engagement. Attributes like seed size, particle density, and root complexity are influenced by user activity, such as basic information, voting, and delegations, respectively, showcasing the richness of contributions.

More than a mere symbol, the badge represents recognition and gratitude for those dedicated to the DAO community's growth. As users continue their journey within DAOs, their badges evolve, reflecting their ongoing commitment and contributions.

## Technologies Used

* **Smart Contract Language**: Solidity
* **Frontend**:Ethers.js、Three.js、WebGL、Canvas、Smart Contract、iframe
* **DAO Badge Generation Art Code**：
  * **Logic**: Javascript, JSX, Webgl
  * **Libraries**: Threejs, React-Fiber
  * **Data**: HTTP API, JSON
* **Farcaster**：Frames

## How to Use

### Prerequisites

* Node.js version 20 or above installed on your computer
* Yarn installed globally using npm:

```shell notranslate position-relative overflow-auto
npm install -g yarn
```

### Getting Started


* Clone the repository:

```shell notranslate position-relative overflow-auto
git clone git@github.com:DAOBase-AI/DAOBadge.git
```

* Navigate into the cloned directory:

```shell notranslate position-relative overflow-auto
cd front
```

* To set up environment variables, apply for your own Alchemy API key and Coinbase Paymaster API key. Then, create and configure the `env` file:

```shell notranslate position-relative overflow-auto
cp env.example env
```

Open the `env` file and fill in the required API keys.

* To start the frontend project, run:

```shell notranslate position-relative overflow-auto
yarn serve
```

* To build the frontend project, run:

```shell notranslate position-relative overflow-auto
yarn build
```

## Demo Links

* **DAO Badge Playground**:[ https://badge.daobase.ai/](https://badge.daobase.ai/)You can test different badge styles by entering various addresses, for example:[](https://badge.daobase.ai/)[https://badge.daobase.ai/?wallet=0xe9ff9e087d10266aa4afb352faea299d4adcd24d](https://badge.daobase.ai/?wallet=0xe9ff9e087d10266aa4afb352faea299d4adcd24d)
* **DAOBadge Contract Address**:[https://basescan.org/address/0x7721693d0529199d4B68aB4c00f1213b16092Bf9](https://basescan.org/address/0x7721693d0529199d4B68aB4c00f1213b16092Bf9)
* **DAOBase DAO Badge Claiming** 👇

  DAOBase Official Page:[ https://daobase.ai/mintdaobadge?inviteId=1QZFZP](https://daobase.ai/mintdaobadge?inviteId=1QZFZP)
  
  Farcaster Page：[https://warpcast.com/~/developers/frames?url=https%3A%2F%2Fframe.daobase.ai%2Fapi%2F0xe9ff9e087d10266aa4afb352faea299d4adcd24d](https://warpcast.com/~/developers/frames?url=https%3A%2F%2Fframe.daobase.ai%2Fapi%2F0xe9ff9e087d10266aa4afb352faea299d4adcd24d)

* **DAO Badge Introduction Video**：
* **DAO Badge Claiming Tutorial Video**:[ ·https://daobase-public.s3.ap-east-1.amazonaws.com/DAOBadge_Mint.mp4](https://daobase-public.s3.ap-east-1.amazonaws.com/mint_badge.mp4)
* **DAO Badge Claiming Text Guide**:[https://docs.daobase.ai/daobase/tutorials-and-guides/how-to-claim-the-dao-badges](https://docs.daobase.ai/daobase/tutorials-and-guides/how-to-claim-the-dao-badges)
  
**⚠️ *Warning: Claiming DAOBadgeX may result in sudden bursts of joy and unexpected applause from your peers.* 👀**

## About Us

DAOBase is an AI-driven data and infrastructure platform specifically tailored for DAOs. Through advanced algorithms, we help DAOs and voters establish on-chain and off-chain data reputation layers. This empowers users to intelligently monitor DAO governance, make better decisions, and explore the future of work.

DAOBase has integrated with 6 blockchains, encompassing over 160k DAOs and 6 million voters, making it the largest DAO aggregator and analysis platform in the market.

👭Trusted by: MakerDAO, MeebitsDAO, BanklessDAO, Yearn.Finance, KyberDAO, Solv, ApecoinDAO, MoonDAO, Decentraland DAO, The Sandbox DAO, CityDAO, PizzaDAO, BitDAO, Jenny MetaverseDAO, ArtsDAO, Foreverlands, Kapital DAO, and more.

🏠Website:[ https://daobase.ai/](https://daobase.ai/)

🐦Social:[ https://twitter.com/daobase_ai](https://twitter.com/daobase_ai)

💬Discord:[https://discord.gg/N6f25tPs9W](https://discord.gg/N6f25tPs9W)

🙋Telegram: [https://t.me/daobase_ai](https://t.me/daobase_ai)

***Welcome to join our community and contact us! If you're interested in DAOs, we're already friends! 🐝***
