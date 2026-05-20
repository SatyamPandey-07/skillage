# SkillChain — Complete Hackathon Build Plan
### AI Tutor · Onchain Credentials · Gasless via UGF · Base Sepolia
**Team:** TEAM SPIRIT · Track: Minting + EdTech · Network: Base Sepolia (Chain ID: 84532)

---

## Table of Contents
1. [Project Summary](#1-project-summary)
2. [Why This Wins — Competitive Edge](#2-why-this-wins--competitive-edge)
3. [Full Feature List](#3-full-feature-list)
4. [System Architecture](#4-system-architecture)
5. [Smart Contract Design](#5-smart-contract-design)
6. [Claude AI Integration](#6-claude-ai-integration)
7. [UGF Gasless Integration](#7-ugf-gasless-integration)
8. [Wallet & Auth — Privy Embedded Wallets](#8-wallet--auth--privy-embedded-wallets)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Backend Architecture](#10-backend-architecture)
11. [Database Schema](#11-database-schema)
12. [Certificate Metadata — Fully Onchain](#12-certificate-metadata--fully-onchain)
13. [Public Verification Page](#13-public-verification-page)
14. [Free Hosting Stack — Everything Free](#14-free-hosting-stack--everything-free)
15. [Environment Variables](#15-environment-variables)
16. [Deployment Guide — Step by Step](#16-deployment-guide--step-by-step)
17. [UX States & Error Handling](#17-ux-states--error-handling)
18. [Demo Script — Judging Day](#18-demo-script--judging-day)
19. [Build Timeline — Hackathon Schedule](#19-build-timeline--hackathon-schedule)
20. [All Resources & Links](#20-all-resources--links)

---

## 1. Project Summary

**SkillChain** is a gasless micro-learning platform where:
- An **AI tutor** (Claude) generates a lesson and quiz on any topic on demand
- A **learner** reads the lesson and submits open-ended answers
- **Claude grades** the answers with reasoning — not just MCQ matching
- A **≥80% score** triggers a UGF gasless mint call
- A **soulbound NFT certificate** is minted on Base Sepolia, paid in MockUSD — no ETH ever

**The core innovation:** AI is the gatekeeper for onchain actions. Claude decides *when* the blockchain transaction fires. This is not decoration — AI controls the mint logic.

**The core UX promise:** A student in any country opens a browser, types a topic, passes a quiz, and receives a permanent verifiable credential — without buying crypto, without MetaMask, without knowing what gas is.

---

## 2. Why This Wins — Competitive Edge

| Project | What they built | Weakness |
|---|---|---|
| **AKATSUKI** | Campus cert wallet, admin assigns NFTs | Human bottleneck — admin must manually create every cert. Doesn't scale. |
| **MORAX** | GasFreeBadge — anyone clicks to claim | Badge has no meaning. No verification. Anyone can get it. |
| **TEAM SPIRIT** | Heavy infra (Privy + SIWE + MongoDB) | No defined product. Great stack, no story. |
| **DEWANG / Node** | No idea defined yet | Not a threat. |
| **SkillChain** | AI-gated earned soulbound credentials | **Nobody else is doing this.** |

**Three things only SkillChain has:**
1. AI decides when the onchain action fires — not a button click
2. The badge requires demonstrating knowledge — it's earned, not claimed
3. Soulbound + fully onchain metadata = verifiable, unfakeable, permanent

**What we borrow from competition:**
- **Privy embedded wallets** (from TEAM SPIRIT's stack) — email login, no MetaMask required
- **SIWE authentication** (from TEAM SPIRIT) — wallet-native users sign in with their wallet
- **Public verification page** (inspired by AKATSUKI) — shareable URL to display all earned certs

---

## 3. Full Feature List

### Core Learning Flow
- [ ] Topic input — user types any subject (e.g., "Solidity basics", "DeFi", "Python loops")
- [ ] AI lesson generation — Claude returns structured lesson content + 5 open-ended quiz questions
- [ ] Lesson view — clean readable lesson card with key points
- [ ] Quiz form — 5 open-ended text inputs (not MCQ)
- [ ] AI grading — Claude grades each answer with per-question feedback + reasoning
- [ ] Pass/fail result — score breakdown, per-question feedback, overall encouragement
- [ ] Retry on fail — learner can re-attempt with new questions on same topic
- [ ] Difficulty selector — Beginner / Intermediate / Advanced (changes question complexity)

### Onchain Credential
- [ ] UGF mint trigger — fires only on ≥80% score
- [ ] UGF lifecycle UI — quote → settle → execute stages shown visually
- [ ] Soulbound NFT minted to learner's wallet on Base Sepolia
- [ ] Fully onchain metadata — topic, score, date, learner address, all in tokenURI
- [ ] BaseScan link — direct link to transaction after mint

### Auth & Wallet
- [ ] Privy embedded wallets — email/Google login auto-creates a wallet, no MetaMask needed
- [ ] SIWE (Sign-In With Ethereum) — wallet-native users sign in with MetaMask/any wallet
- [ ] Both auth paths converge to same session model
- [ ] Wallet address shown in top-right corner after login
- [ ] MockUSD balance display — shows how much TYI MockUSD the user has

### Dashboard & Verification
- [ ] Personal dashboard — grid of all earned NFT certificates with topic, score, date
- [ ] Public verification page — `/verify/:walletAddress` — shareable, no login needed
- [ ] Verification badge — shows "Verified via SkillChain on Base Sepolia" with tx link
- [ ] Copy-to-clipboard share link for each certificate
- [ ] Leaderboard (optional) — top learners by number of certs earned

### UX Polish
- [ ] Faucet link — direct link to MockUSD faucet shown before first quiz
- [ ] Mobile responsive — works on phones
- [ ] Loading skeletons — every async state has a skeleton loader
- [ ] Error boundary — every UGF error code surfaced with human-readable message
- [ ] Dark/light mode toggle

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                                                             │
│  React + Vite (Vercel)                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Privy   │  │  react-  │  │  wagmi   │  │  React    │  │
│  │  Auth    │  │   ugf    │  │  +viem   │  │  Router   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────────┘  │
└───────┼─────────────┼─────────────┼───────────────────────-┘
        │             │             │
        ▼             ▼             ▼
┌───────────────────────────────────────────────────────────-┐
│               BACKEND — Express + Node.js (Render)         │
│                                                            │
│  POST /api/lesson     →  Claude API (lesson generation)   │
│  POST /api/grade      →  Claude API (answer grading)      │
│  POST /api/mint       →  UGF Client (quote→settle→exec)   │
│  GET  /api/certs/:addr →  Base Sepolia RPC (read NFTs)    │
│  POST /auth/siwe      →  SIWE signature verification      │
│  GET  /auth/nonce     →  SIWE nonce generation            │
└────────────────┬───────────────────────────────────────────┘
                 │
        ┌────────┼──────────────────┐
        ▼        ▼                  ▼
  MongoDB     Claude API       UGF Gateway
  Atlas M0    Anthropic        (universalgasframework.com)
  (free)      (API key)              │
                                     ▼
                            Base Sepolia RPC
                            (https://sepolia.base.org — free)
                                     │
                                     ▼
                            SkillChainCert.sol
                            (deployed on Base Sepolia)
```

**Data flow for a mint:**
1. Frontend → `POST /api/grade` → Claude grades answers → score returned
2. Frontend shows result; if ≥80% → Frontend → `POST /api/mint`
3. Backend: `UGFClient.auth.login(backendWallet)` → `client.quote.get()` → `client.payment.x402.execute()` → `client.chains.evm.sponsorAndExecute()`
4. `sponsorAndExecute` calls `mintCertificate()` on Base Sepolia
5. `userTxHash` returned to frontend → shown to user

---

## 5. Smart Contract Design

**File:** `contracts/SkillChainCert.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SkillChainCert is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    struct Certificate {
        string topic;
        string difficulty;
        uint8 score;
        uint256 issuedAt;
        address learner;
    }

    mapping(uint256 => Certificate) public certificates;
    // Track certs per learner for dashboard reads
    mapping(address => uint256[]) public learnerCerts;

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed learner,
        string topic,
        uint8 score
    );

    constructor() ERC721("SkillChain Certificate", "SKILLCERT") Ownable(msg.sender) {}

    // Soulbound: block all transfers except from address(0) (minting)
    function _update(address to, uint256 tokenId, address auth)
        internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "SkillChain: certificates are soulbound and non-transferable");
        return super._update(to, tokenId, auth);
    }

    function mintCertificate(
        address learner,
        string memory topic,
        string memory difficulty,
        uint8 score
    ) external onlyOwner returns (uint256) {
        require(score >= 80, "SkillChain: score below passing threshold of 80");
        require(bytes(topic).length > 0, "SkillChain: topic cannot be empty");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(learner, tokenId);

        certificates[tokenId] = Certificate({
            topic: topic,
            difficulty: difficulty,
            score: score,
            issuedAt: block.timestamp,
            learner: learner
        });
        learnerCerts[learner].push(tokenId);

        emit CertificateMinted(tokenId, learner, topic, score);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "SkillChain: token does not exist");
        Certificate memory cert = certificates[tokenId];

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name":"SkillChain: ', cert.topic, '",',
            '"description":"Earned by ', Strings.toHexString(uint256(uint160(cert.learner)), 20),
            ' with a score of ', Strings.toString(cert.score), '/100 on ',
            cert.topic, ' (', cert.difficulty, '). Issued on Base Sepolia via SkillChain.',
            '","attributes":[',
            '{"trait_type":"Topic","value":"', cert.topic, '"},',
            '{"trait_type":"Difficulty","value":"', cert.difficulty, '"},',
            '{"trait_type":"Score","value":', Strings.toString(cert.score), '},',
            '{"trait_type":"Passing Threshold","value":80},',
            '{"trait_type":"Platform","value":"SkillChain"},',
            '{"trait_type":"Network","value":"Base Sepolia"},',
            '{"display_type":"date","trait_type":"Issued","value":', Strings.toString(cert.issuedAt), '}',
            ']}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getCertsByLearner(address learner) external view returns (uint256[] memory) {
        return learnerCerts[learner];
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
```

**Deploy with Hardhat:**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts

npx hardhat compile
npx hardhat run scripts/deploy.js --network base_sepolia
```

**hardhat.config.js:**
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    base_sepolia: {
      url: "https://sepolia.base.org",   // Free public RPC — no API key needed
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 84532,
    }
  },
  etherscan: {
    apiKey: {
      "base-sepolia": process.env.BASESCAN_API_KEY  // Free at basescan.org
    },
    customChains: [{
      network: "base-sepolia",
      chainId: 84532,
      urls: {
        apiURL: "https://api-sepolia.basescan.org/api",
        browserURL: "https://sepolia.basescan.org"
      }
    }]
  }
};
```

**Deploy & verify:**
```bash
# Deploy
npx hardhat run scripts/deploy.js --network base_sepolia

# Verify on BaseScan (free — just needs a free BaseScan API key)
npx hardhat verify --network base_sepolia <DEPLOYED_ADDRESS>
```

> **Testnet ETH for deployment:** Get free Base Sepolia ETH from https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet or https://faucet.quicknode.com/base/sepolia

---

## 6. Claude AI Integration

All Claude API calls happen **server-side** in the Express backend. The API key never touches the frontend.

### 6.1 Lesson Generation — `POST /api/lesson`

```javascript
// backend/routes/lesson.js
const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/lesson", async (req, res) => {
  const { topic, difficulty = "Beginner" } = req.body;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: `You are a concise, engaging educator. Given a topic and difficulty level,
return ONLY a valid JSON object. No markdown, no preamble, JSON only.
Schema:
{
  "title": "string — punchy lesson title",
  "summary": "string — 3-4 sentence beginner-friendly explanation",
  "keyPoints": ["string", "string", "string"],
  "funFact": "string — one surprising or memorable fact",
  "questions": [
    { "id": 1, "question": "string — open-ended, requires understanding not recall" },
    { "id": 2, "question": "string" },
    { "id": 3, "question": "string" },
    { "id": 4, "question": "string" },
    { "id": 5, "question": "string — harder, tests deeper understanding" }
  ]
}
Difficulty guide:
- Beginner: plain English, no assumed knowledge, practical analogies
- Intermediate: assumes basics, introduces nuance and edge cases
- Advanced: expects solid foundation, tests depth and trade-offs`,
    messages: [{ role: "user", content: `Topic: ${topic}\nDifficulty: ${difficulty}` }]
  });

  const raw = response.content[0].text.replace(/```json|```/g, "").trim();
  res.json(JSON.parse(raw));
});
```

### 6.2 Answer Grading — `POST /api/grade`

```javascript
// backend/routes/grade.js
router.post("/grade", async (req, res) => {
  const { topic, difficulty, lessonSummary, questions, answers } = req.body;

  const qaBlock = questions.map((q, i) => (
    `Q${q.id}: ${q.question}\nA${q.id}: ${answers[i]?.answer || "(no answer)"}`
  )).join("\n\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    system: `You are a strict but fair quiz grader for a learning platform.
Return ONLY valid JSON. No markdown, no preamble.
Schema:
{
  "scores": [
    {
      "questionId": number,
      "score": number (0-20),
      "feedback": "string — 1 sentence: what was right or what was missed"
    }
  ],
  "totalScore": number (0-100),
  "passed": boolean (true if totalScore >= 80),
  "overallFeedback": "string — 1-2 sentences of encouragement or key improvement tip",
  "strongestAnswer": number (questionId of best answer),
  "weakestAnswer": number (questionId of worst answer)
}
Scoring rubric per question (max 20 pts):
- 20: Complete, accurate, shows genuine understanding
- 15: Mostly correct, minor gaps
- 10: Partially correct, core idea present
- 5: Vague or tangential but not entirely wrong
- 0: Wrong, off-topic, or blank
Award partial credit generously for partially correct answers.`,
    messages: [{
      role: "user",
      content: `Topic: ${topic}\nDifficulty: ${difficulty}\nLesson: ${lessonSummary}\n\n${qaBlock}`
    }]
  });

  const raw = response.content[0].text.replace(/```json|```/g, "").trim();
  res.json(JSON.parse(raw));
});
```

### 6.3 Retry Questions — `POST /api/retry`
On retry, generate 5 fresh questions on same topic to prevent answer memorisation:
```javascript
// Same as lesson endpoint but returns only new questions array
// Add to system prompt: "Generate 5 DIFFERENT questions from the previous set.
// Focus on aspects of the topic not covered by the original questions."
```

---

## 7. UGF Gasless Integration

### 7.1 Install

```bash
# Frontend
npm install @tychilabs/react-ugf @tychilabs/ugf-testnet-js ethers

# Backend
npm install @tychilabs/ugf-testnet-js ethers
```

### 7.2 React UGF Provider (Frontend)

```jsx
// src/main.jsx
import { UGFProvider } from "@tychilabs/react-ugf";
import { PrivyProvider } from "@privy-io/react-auth";

<PrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID}>
  <UGFProvider>
    <App />
  </UGFProvider>
</PrivyProvider>
```

### 7.3 Full Mint Flow — Backend (Most Secure)

The mint is triggered from the **backend** using a backend signer wallet. This prevents users from calling `mintCertificate` directly on the contract (only the backend's `onlyOwner` wallet can call it).

```javascript
// backend/routes/mint.js
const { UGFClient, TYI_USD_PAYMENT_COIN } = require("@tychilabs/ugf-testnet-js");
const { ethers } = require("ethers");

router.post("/mint", verifySession, async (req, res) => {
  const { learnerAddress, topic, difficulty, score } = req.body;

  // Only mint if score verified server-side
  if (score < 80) return res.status(400).json({ error: "Score below passing threshold" });

  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const backendWallet = new ethers.Wallet(process.env.BACKEND_SIGNER_PK, provider);
  const client = new UGFClient();

  // 1. Authenticate backend wallet with UGF
  await client.auth.login(backendWallet);

  // 2. Encode the mint call
  const iface = new ethers.Interface([
    "function mintCertificate(address,string,string,uint8) returns (uint256)"
  ]);
  const calldata = iface.encodeFunctionData("mintCertificate", [
    learnerAddress, topic, difficulty, score
  ]);

  // 3. Get quote from UGF
  const quote = await client.quote.get({
    payer_address: backendWallet.address,
    tx_object: JSON.stringify({
      from: backendWallet.address,
      to: process.env.CONTRACT_ADDRESS,
      data: calldata,
      value: "0"
    })
  });

  // 4. Settle — ERC-3009 signature, no on-chain tx from backend wallet
  await client.payment.x402.execute({ quote, signer: backendWallet });

  // 5. Execute — UGF sponsors ETH, sends the mintCertificate tx
  const { userTxHash } = await client.chains.evm.sponsorAndExecute(
    quote.digest,
    backendWallet,
    async () => ({
      to: process.env.CONTRACT_ADDRESS,
      data: calldata,
      value: 0n
    })
  );

  // Save cert record to MongoDB
  await CertRecord.create({
    learner: learnerAddress, topic, difficulty, score,
    txHash: userTxHash, mintedAt: new Date()
  });

  res.json({ txHash: userTxHash, explorerUrl: `https://sepolia.basescan.org/tx/${userTxHash}` });
});
```

### 7.4 UGF Lifecycle UI (Frontend)

Show users exactly what's happening during the 4-stage UGF flow:

```jsx
const UGF_STAGES = [
  { key: "quoting",   label: "Getting gas quote",       icon: "💬" },
  { key: "settling",  label: "Authorizing payment",      icon: "✍️" },
  { key: "executing", label: "Sending transaction",      icon: "⚡" },
  { key: "confirmed", label: "Certificate minted!",      icon: "🎓" },
];
```

### 7.5 UGF Error Handling

| UGF Error Code | User-facing message |
|---|---|
| `UNSUPPORTED_TESTNET_ROUTE` | "Network issue — only Base Sepolia is supported" |
| `QUOTE_ERROR` | "Couldn't get a gas quote. Try again in a moment." |
| `NO_PROVIDER` | "Wallet not connected. Please reconnect." |
| `SETTLEMENT_ERROR` | "Payment authorization failed. Check your MockUSD balance." |
| `EXECUTION_ERROR` | "Transaction stopped before completion. Try again." |
| `COMPLETION_TIMEOUT` | "Confirmation timed out. Check BaseScan for your tx." |

---

## 8. Wallet & Auth — Privy Embedded Wallets

**Why Privy:** Users who've never heard of MetaMask can sign up with email or Google. Privy auto-creates a wallet for them under the hood. They never see a seed phrase. They never install an extension.

**Privy free tier:** Up to 499 MAU free, 50K signatures/month free — more than enough for a hackathon.

### 8.1 Install

```bash
npm install @privy-io/react-auth
```

### 8.2 Privy Setup

```jsx
// src/main.jsx
import { PrivyProvider } from "@privy-io/react-auth";

<PrivyProvider
  appId={import.meta.env.VITE_PRIVY_APP_ID}
  config={{
    loginMethods: ["email", "google", "wallet"],  // wallet = MetaMask/injected
    appearance: {
      theme: "light",
      accentColor: "#6366f1",    // indigo — matches SkillChain brand
      logo: "/logo.png"
    },
    defaultChain: {
      id: 84532,
      name: "Base Sepolia",
      network: "base-sepolia",
      rpcUrls: { default: { http: ["https://sepolia.base.org"] } }
    }
  }}
>
```

### 8.3 PrivyBridge — Privy wallet → ethers signer

```javascript
// src/hooks/useEthersSigner.js
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";

export function useEthersSigner() {
  const { wallets } = useWallets();

  const getSigner = async () => {
    const wallet = wallets[0];
    if (!wallet) throw new Error("No wallet connected");
    await wallet.switchChain(84532);  // Ensure Base Sepolia
    const provider = await wallet.getEthersProvider();
    return provider.getSigner();
  };

  return { getSigner };
}
```

### 8.4 SIWE (Sign-In With Ethereum) — for wallet-native users

```javascript
// backend/routes/auth.js
const { SiweMessage } = require("siwe");

// 1. Get nonce
router.get("/nonce", (req, res) => {
  req.session.nonce = Math.random().toString(36).slice(2);
  res.json({ nonce: req.session.nonce });
});

// 2. Verify SIWE signature
router.post("/siwe", async (req, res) => {
  const { message, signature } = req.body;
  const siweMessage = new SiweMessage(message);
  const result = await siweMessage.verify({
    signature,
    nonce: req.session.nonce
  });
  if (result.success) {
    req.session.walletAddress = result.data.address;
    req.session.authMethod = "siwe";
    res.json({ success: true, address: result.data.address });
  } else {
    res.status(401).json({ error: "Invalid signature" });
  }
});
```

### 8.5 Auth Flow Summary

```
Email/Google login  →  Privy creates embedded wallet  →  Session issued
MetaMask login      →  SIWE signature verification    →  Session issued
Both paths          →  Same session model on backend  →  Same app experience
```

---

## 9. Frontend Architecture

```
src/
├── main.jsx                    # Privy + UGFProvider wrappers
├── App.jsx                     # Router
│
├── pages/
│   ├── Home.jsx                # Landing — topic input + hero
│   ├── Lesson.jsx              # Lesson view + quiz form
│   ├── Result.jsx              # Score, feedback, mint trigger
│   ├── Dashboard.jsx           # Personal cert grid (requires login)
│   └── Verify.jsx              # /verify/:address — public, no login
│
├── components/
│   ├── TopicInput.jsx          # Topic text field + difficulty selector
│   ├── LessonCard.jsx          # Summary + key points + fun fact
│   ├── QuizForm.jsx            # 5 open-ended textareas
│   ├── GradeResult.jsx         # Score ring, per-question feedback
│   ├── MintProgress.jsx        # 4-stage UGF lifecycle progress bar
│   ├── CertCard.jsx            # Single cert card (topic, score, date, tx link)
│   ├── WalletHeader.jsx        # Address + MockUSD balance + faucet link
│   ├── VerifyCard.jsx          # Public verification display card
│   └── Skeleton.jsx            # Loading skeleton used everywhere
│
├── hooks/
│   ├── useLesson.js            # POST /api/lesson
│   ├── useGrade.js             # POST /api/grade
│   ├── useMint.js              # POST /api/mint → polls for txHash
│   ├── useCertificates.js      # GET /api/certs/:address
│   └── useEthersSigner.js      # Privy → ethers signer bridge
│
├── context/
│   ├── AuthContext.jsx         # Unified auth state (Privy + SIWE)
│   └── Web3Context.jsx         # Signer + wallet address
│
└── utils/
    ├── ugfErrors.js            # UGF error code → human message map
    ├── formatScore.js          # Score → grade letter (A/B/C)
    └── shortenAddress.js       # 0x1234...5678
```

---

## 10. Backend Architecture

```
backend/
├── index.js                    # Express server entry point
├── .env                        # All secrets (never commit)
│
├── routes/
│   ├── lesson.js               # POST /api/lesson  → Claude
│   ├── grade.js                # POST /api/grade   → Claude
│   ├── mint.js                 # POST /api/mint    → UGF → Base Sepolia
│   ├── certs.js                # GET  /api/certs/:address → contract read
│   └── auth.js                 # GET  /auth/nonce, POST /auth/siwe
│
├── middleware/
│   ├── verifySession.js        # Checks session token before mint
│   ├── rateLimiter.js          # Prevents abuse (5 lesson reqs/min per IP)
│   └── cors.js                 # Allow Vercel frontend origin
│
├── models/
│   └── CertRecord.js           # MongoDB schema for cert records
│
└── lib/
    ├── claude.js               # Anthropic SDK instance
    ├── ugf.js                  # UGFClient factory
    └── contract.js             # Ethers contract read helpers
```

**Express server setup:**
```javascript
// backend/index.js
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 }
}));

mongoose.connect(process.env.MONGODB_URI);

app.use("/api", require("./routes/lesson"));
app.use("/api", require("./routes/grade"));
app.use("/api", require("./routes/mint"));
app.use("/api", require("./routes/certs"));
app.use("/auth", require("./routes/auth"));

// Health check — keep Render free tier alive with UptimeRobot
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(process.env.PORT || 4000);
```

---

## 11. Database Schema

```javascript
// backend/models/CertRecord.js
const mongoose = require("mongoose");

const certSchema = new mongoose.Schema({
  learner:    { type: String, required: true, index: true },  // wallet address
  topic:      { type: String, required: true },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  score:      { type: Number, min: 80, max: 100 },
  txHash:     { type: String, unique: true },
  tokenId:    { type: Number },
  mintedAt:   { type: Date, default: Date.now },
}, { timestamps: true });

// For leaderboard
certSchema.index({ learner: 1, mintedAt: -1 });
```

**MongoDB Atlas M0 (Free tier):**
- 512 MB storage — enough for ~500,000 cert records
- No credit card required
- Never expires
- Up to 500 concurrent connections

---

## 12. Certificate Metadata — Fully Onchain

Every NFT's metadata is returned by `tokenURI()` as a base64-encoded JSON string stored directly in the contract. No IPFS, no external calls, no link rot.

```json
{
  "name": "SkillChain: Solidity Basics",
  "description": "Earned by 0xAbCd...1234 with a score of 94/100 on Solidity Basics (Intermediate). Issued on Base Sepolia via SkillChain.",
  "attributes": [
    { "trait_type": "Topic",             "value": "Solidity Basics" },
    { "trait_type": "Difficulty",        "value": "Intermediate" },
    { "trait_type": "Score",             "value": 94 },
    { "trait_type": "Passing Threshold", "value": 80 },
    { "trait_type": "Platform",          "value": "SkillChain" },
    { "trait_type": "Network",           "value": "Base Sepolia" },
    { "display_type": "date", "trait_type": "Issued", "value": 1749600000 }
  ]
}
```

**Why fully onchain matters for the demo:**
- Open the NFT on BaseScan → metadata visible right there, no external calls
- Judges can verify without needing IPFS gateway
- Certificates survive forever — no backend dependency

---

## 13. Public Verification Page

**Route:** `/verify/:walletAddress`
**No login required.** Anyone can paste a wallet address and see all SkillChain certs.

```jsx
// src/pages/Verify.jsx
export default function Verify() {
  const { address } = useParams();
  const { certs, loading } = useCertificates(address);

  return (
    <div>
      <h1>Certificates for {shortenAddress(address)}</h1>
      <p>Verified onchain · Base Sepolia · SkillChain</p>
      {loading ? <Skeleton /> : (
        certs.length === 0
          ? <p>No certificates found for this wallet.</p>
          : certs.map(cert => <CertCard key={cert.tokenId} cert={cert} />)
      )}
    </div>
  );
}
```

**Share URL format:**
```
https://skillchain.vercel.app/verify/0xAbCd...1234
```

Each certificate card includes:
- Topic name + difficulty badge
- Score ring (visual gauge)
- Issue date
- Direct BaseScan link to the mint transaction
- "Verify on BaseScan" button
- Copy share link button

---

## 14. Free Hosting Stack — Everything Free

> Every service below has a permanently free tier. No credit card required for the hackathon.

### Frontend — Vercel (Hobby tier, free forever)

| What | Details |
|---|---|
| **Service** | Vercel Hobby |
| **Cost** | $0 — free forever |
| **Credit card** | Not required |
| **Limits** | 100 GB bandwidth/month, 100 GB-hours serverless, unlimited projects |
| **What's hosted** | React + Vite frontend |
| **Deploy** | Push to GitHub → auto-deploys |
| **Domain** | `skillchain.vercel.app` (free subdomain) |
| **Sign up** | https://vercel.com |

```bash
# Deploy frontend
npm install -g vercel
vercel --prod
```

### Backend — Render (Free Web Service)

| What | Details |
|---|---|
| **Service** | Render Free Web Service |
| **Cost** | $0 |
| **Credit card** | Not required |
| **Limits** | 750 hours/month (enough for 1 service running 24/7), sleeps after 15 min inactivity |
| **Cold start** | ~30 seconds on first request after sleep |
| **What's hosted** | Express + Node.js backend |
| **Deploy** | Connect GitHub repo → auto-deploys on push |
| **Keep-alive hack** | Use UptimeRobot (free) to ping `/health` every 5 minutes → server never sleeps |
| **Sign up** | https://render.com |

```yaml
# render.yaml (auto-config)
services:
  - type: web
    name: skillchain-backend
    env: node
    buildCommand: npm install
    startCommand: node index.js
    envVars:
      - key: NODE_ENV
        value: production
```

**UptimeRobot setup (free):**
1. Sign up at https://uptimerobot.com (free, no credit card)
2. Add monitor → HTTP(S) → URL: `https://skillchain-backend.onrender.com/health`
3. Interval: 5 minutes
4. Your Render backend never sleeps again. Free.

### Database — MongoDB Atlas M0 (Free forever)

| What | Details |
|---|---|
| **Service** | MongoDB Atlas M0 Free Cluster |
| **Cost** | $0 — free forever, no expiry |
| **Credit card** | Not required |
| **Storage** | 512 MB (fits ~500,000 cert records) |
| **Connections** | Up to 500 concurrent |
| **Sign up** | https://cloud.mongodb.com |

```bash
# Connection string format
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/skillchain
```

### Smart Contract — Base Sepolia (Free testnet)

| What | Details |
|---|---|
| **Network** | Base Sepolia testnet |
| **Cost** | Free (testnet) |
| **RPC** | `https://sepolia.base.org` — free public RPC, no API key needed |
| **Testnet ETH** | Free from faucets (see below) |
| **Contract verification** | BaseScan free API key at https://basescan.org |
| **Explorer** | https://sepolia.basescan.org |

**Free testnet ETH faucets:**
- https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet (0.1 ETH/day)
- https://faucet.quicknode.com/base/sepolia
- https://faucet.alchemy.com/faucet/base-sepolia (requires Alchemy account — free)

### MockUSD (TYI) — UGF Faucet

| What | Details |
|---|---|
| **Token** | TYI_MOCK_USD on Base Sepolia |
| **Cost** | Free |
| **Faucet** | https://universalgasframework.com/faucets |
| **Used for** | Backend signer wallet — pays UGF gas in MockUSD |

### AI API — Anthropic (API credits needed)

| What | Details |
|---|---|
| **Service** | Anthropic Claude API |
| **Model** | `claude-sonnet-4-20250514` |
| **Free trial** | New accounts get $5 in free credits — enough for hundreds of lessons |
| **Sign up** | https://console.anthropic.com |
| **Estimated cost** | ~$0.01 per full lesson + grade cycle at Sonnet pricing |

### Wallet Auth — Privy (Free developer tier)

| What | Details |
|---|---|
| **Service** | Privy embedded wallets |
| **Cost** | $0 up to 499 MAU, 50K signatures/month |
| **Credit card** | Not required |
| **Sign up** | https://dashboard.privy.io |
| **Note** | Privy was acquired by Stripe (June 2025) but free tier unchanged |

### Full Free Stack Summary

```
Frontend    →  Vercel Hobby          →  Free forever
Backend     →  Render Free           →  Free (keep alive with UptimeRobot)
Database    →  MongoDB Atlas M0      →  Free forever
Contract    →  Base Sepolia testnet  →  Free testnet
AI          →  Anthropic API         →  $5 free credits (new account)
Wallets     →  Privy                 →  Free up to 499 MAU
MockUSD     →  UGF Faucet            →  Free
Keep-alive  →  UptimeRobot           →  Free
Total cost  →  $0.00
```

---

## 15. Environment Variables

### Frontend (`.env` in Vite project)

```env
VITE_PRIVY_APP_ID=clxxxxxxxxxxxxxx
VITE_API_URL=https://skillchain-backend.onrender.com
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=84532
```

### Backend (`.env` in Express project / Render dashboard)

```env
# Server
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://skillchain.vercel.app
SESSION_SECRET=<random 32-char string>

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Wallet (backend signer — owns the contract, calls mintCertificate)
BACKEND_SIGNER_PK=0x...           # Private key of deployer wallet
CONTRACT_ADDRESS=0x...            # Deployed SkillChainCert address

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/skillchain

# Network
RPC_URL=https://sepolia.base.org  # Free public Base Sepolia RPC
```

> **Security:** Never commit `.env` to GitHub. Add `.env` to `.gitignore`. Set all vars in Render's dashboard environment tab.

---

## 16. Deployment Guide — Step by Step

### Step 1 — Set up MongoDB Atlas

1. Go to https://cloud.mongodb.com → Create free account
2. Build a Database → Free (M0) → Choose region closest to you
3. Create database user (remember username/password)
4. Network Access → Add IP Address → Allow access from anywhere (`0.0.0.0/0`)
5. Connect → Drivers → Copy connection string → paste in `.env` as `MONGODB_URI`

### Step 2 — Get Privy App ID

1. Go to https://dashboard.privy.io → Create new app
2. Settings → App ID → Copy to `VITE_PRIVY_APP_ID`
3. Settings → Allowed origins → add `https://skillchain.vercel.app`

### Step 3 — Get Anthropic API Key

1. Go to https://console.anthropic.com → Sign up
2. API Keys → Create Key → Copy to `ANTHROPIC_API_KEY`
3. New accounts get $5 in free credits automatically

### Step 4 — Deploy Smart Contract

```bash
# 1. Get testnet ETH
# Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

# 2. Get MockUSD for backend wallet
# Visit: https://universalgasframework.com/faucets

# 3. Deploy
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network base_sepolia
# Copy deployed address to .env as CONTRACT_ADDRESS

# 4. Verify on BaseScan (optional but impressive for judges)
npx hardhat verify --network base_sepolia <ADDRESS>
```

### Step 5 — Deploy Backend to Render

1. Push backend code to GitHub
2. Go to https://render.com → New Web Service
3. Connect GitHub repo → select backend folder
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add all environment variables from Step 15
7. Deploy → copy the `.onrender.com` URL → set as `VITE_API_URL` in frontend

### Step 6 — Set Up UptimeRobot (Keep Render alive)

1. Go to https://uptimerobot.com → Free account
2. Add New Monitor → HTTP(S)
3. URL: `https://your-app.onrender.com/health`
4. Monitoring Interval: 5 minutes
5. Done — backend stays awake permanently

### Step 7 — Deploy Frontend to Vercel

```bash
cd frontend
# Set VITE_ env vars in Vercel dashboard after first deploy
vercel --prod

# Or connect via GitHub:
# vercel.com → New Project → Import Git Repository → Deploy
```

### Step 8 — Seed backend signer with MockUSD

1. Note the backend signer wallet address (from `BACKEND_SIGNER_PK`)
2. Visit https://universalgasframework.com/faucets
3. Connect that wallet, claim MockUSD
4. This wallet pays UGF gas in MockUSD for every mint

### Step 9 — End-to-end test

1. Open `https://skillchain.vercel.app`
2. Sign up with email (Privy creates wallet)
3. Type topic → complete quiz → verify mint fires
4. Check BaseScan for the tx
5. Open `/verify/<your-wallet-address>` — cert should appear

---

## 17. UX States & Error Handling

| Stage | UI shown |
|---|---|
| Initial | Topic input + difficulty selector + "Get MockUSD" faucet button |
| Generating lesson | Skeleton cards + "AI is preparing your lesson…" |
| Lesson ready | Lesson card (summary + key points + fun fact) + quiz form |
| Grading | Spinner + "Claude is reviewing your answers…" |
| Score < 80 | Red score ring + per-question breakdown + retry button (new questions) |
| Score ≥ 80 | Green score ring + "Minting your certificate…" |
| UGF: quoting | Progress bar step 1/4 + "Getting gas quote" |
| UGF: settling | Progress bar step 2/4 + "Authorizing payment (no ETH needed)" |
| UGF: executing | Progress bar step 3/4 + "Sending transaction to Base Sepolia" |
| UGF: confirmed | Progress bar step 4/4 ✓ + confetti + certificate card + BaseScan link |
| Error: no MockUSD | "Your wallet needs MockUSD. [Get from faucet →]" |
| Error: SETTLEMENT_ERROR | "Payment failed. Check MockUSD balance." + faucet link |
| Error: EXECUTION_ERROR | "Transaction failed. Try again." + support link |
| Error: COMPLETION_TIMEOUT | "Timed out. Check BaseScan manually." + tx hash shown |
| Error: API down | "AI service temporarily unavailable. Try in a minute." |
| Wallet not connected | Redirect to login with "Connect wallet to mint your certificate" |

---

## 18. Demo Script — Judging Day

**Total time: ~4 minutes. Every step is live and verifiable.**

1. **Open** `https://skillchain.vercel.app` — show clean landing page
2. **Sign up with email** — Privy creates embedded wallet instantly. No MetaMask, no extension
3. **Show MockUSD balance** — "This wallet has MockUSD from the UGF faucet. Zero ETH."
4. **Type topic:** "How does Ethereum gas work?" → Difficulty: Beginner
5. **Watch lesson generate** — "Claude is writing this lesson right now, on demand"
6. **Read lesson** — 30 seconds. Show key points. Point out it's AI-generated live.
7. **Submit answers** — deliberately answer question 3 poorly
8. **Show fail state:** Score 72/100 — "AI graded each answer with reasoning, not just MCQ"
9. **Show per-question feedback** — "Claude explains what was missing in question 3"
10. **Click Retry** — "New questions, same topic. Can't memorise last answers."
11. **Submit all 5 answers correctly** — Score: 94/100 — Passed
12. **Watch UGF lifecycle UI** — quote → settle → execute. Each step labelled.
    - "Step 1: Getting gas quote from UGF"
    - "Step 2: Authorizing MockUSD payment — no ETH, no MetaMask popup"
    - "Step 3: Sending mint transaction to Base Sepolia"
    - "Step 4: Confirmed ✓"
13. **Certificate appears** in dashboard — show topic, score, timestamp
14. **Click BaseScan link** — show live transaction on `sepolia.basescan.org`
15. **Show tokenURI on BaseScan** — fully onchain metadata. No IPFS. No backend.
16. **Open verification page** — `skillchain.vercel.app/verify/<address>` — "Anyone can verify this cert with just a wallet address"
17. **Try to transfer from MetaMask** — transaction reverts. "Soulbound. Cannot be sold or transferred."
18. **Closing line:** "One quiz, one earned credential, zero ETH. That's SkillChain."

---

## 19. Build Timeline — Hackathon Schedule

| Hour | Task | Output |
|---|---|---|
| **0–0.5** | Set up all accounts: MongoDB, Privy, Anthropic, Render, Vercel, BaseScan | All API keys ready |
| **0.5–1.5** | Write + deploy `SkillChainCert.sol` to Base Sepolia, verify on BaseScan | Contract address |
| **1.5–3** | Build backend: lesson + grade routes + Claude integration, test locally | `/api/lesson` and `/api/grade` working |
| **3–4** | Build backend: mint route with full UGF lifecycle + SIWE auth | `/api/mint` working |
| **4–5.5** | Build frontend: TopicInput → LessonCard → QuizForm | Core learning flow |
| **5.5–6.5** | Build frontend: GradeResult + MintProgress + UGF lifecycle UI | Full flow end-to-end |
| **6.5–7** | Privy embedded wallet integration + PrivyBridge hook | Email login working |
| **7–7.5** | Dashboard + CertCard + public Verify page | `/verify/:address` working |
| **7.5–8** | Deploy: Render (backend) + Vercel (frontend) + UptimeRobot keepalive | Live URLs |
| **8–8.5** | End-to-end test on live deployment, fix bugs | Demo-ready |
| **8.5–9** | Record demo video, write README, gather testnet tx proof | Submission ready |

---

## 20. All Resources & Links

### UGF / Tychi Labs
| Resource | URL |
|---|---|
| Tychi Labs | https://tychilabs.com |
| UGF Overview Docs | https://universalgasframework.com/docs/overview |
| UGF Testnet Quickstart | https://universalgasframework.com/docs/testnet |
| MockUSD Faucet | https://universalgasframework.com/faucets |
| UGF Transaction Explorer | https://ugfscan.com |
| UGF Testnet SDK (npm) | https://www.npmjs.com/package/@tychilabs/ugf-testnet-js |
| UGF Testnet SDK (GitHub) | https://github.com/TychiWallet/ugf-testnet-js |
| React UGF SDK (npm) | https://www.npmjs.com/package/@tychilabs/react-ugf |
| React UGF SDK (GitHub) | https://github.com/TychiWallet/react-ugf |
| React UGF Demo App | https://github.com/TychiWallet/demo_react_ugf |
| Live dApp Integration Example | https://universalgasframework.com/dapp-integration |
| UGF Whitepaper | https://universalgasframework.com/assets/whitepaper/ugf-whitepaper.pdf |

### Base Sepolia
| Resource | URL |
|---|---|
| Base Sepolia Public RPC | https://sepolia.base.org (free, no key) |
| Base Sepolia Explorer | https://sepolia.basescan.org |
| BaseScan API (free) | https://basescan.org/register |
| Base Faucet (Coinbase) | https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet |
| Base Faucet (Alchemy) | https://faucet.alchemy.com/faucet/base-sepolia |
| Base Docs | https://docs.base.org |

### Free Hosting
| Service | URL | Free Limit |
|---|---|---|
| Vercel (frontend) | https://vercel.com | 100 GB bandwidth, unlimited projects |
| Render (backend) | https://render.com | 750 hrs/month Web Service |
| MongoDB Atlas (database) | https://cloud.mongodb.com | 512 MB, forever free |
| UptimeRobot (keepalive) | https://uptimerobot.com | 50 monitors, 5-min intervals |

### Auth & Wallets
| Resource | URL |
|---|---|
| Privy Dashboard | https://dashboard.privy.io |
| Privy React Docs | https://docs.privy.io |
| Privy Free Tier | Up to 499 MAU, 50K signatures/month — $0 |
| SIWE (siwe npm) | https://www.npmjs.com/package/siwe |

### AI
| Resource | URL |
|---|---|
| Anthropic Console | https://console.anthropic.com |
| Claude API Docs | https://docs.anthropic.com |
| Claude SDK (npm) | https://www.npmjs.com/package/@anthropic-ai/sdk |
| Free credits | $5 on signup — enough for ~500 lesson/grade cycles |

### Smart Contracts
| Resource | URL |
|---|---|
| OpenZeppelin Contracts | https://docs.openzeppelin.com/contracts |
| Hardhat | https://hardhat.org |
| Remix IDE (no install) | https://remix.ethereum.org |

---

*Built for the UGF Hackathon · Base Sepolia · All services free · Total cost: $0.00*
