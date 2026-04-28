# AM I HIREABLE? 🖥️

> **Know if you're hireable. No sugarcoating.**

A brutally honest developer profile analyzer that scans your GitHub and LeetCode, then uses AI to tell you exactly whether you're ready to get hired at a startup or product company — with a specific score, roast, and 30-day fix plan.

---

## 🚀 What It Does

- Fetches your **real GitHub data** — repos, live links, languages, commit consistency, tutorial vs real projects
- Fetches your **real LeetCode data** — easy/medium/hard breakdown, DSA readiness
- Sends everything to **Groq AI (LLaMA 3.3 70B)** with a detailed recruiter prompt
- Returns a **score out of 100**, category breakdown, strengths, weaknesses, roast, and action plan
- Two modes: **Startup Mode** (projects matter more) vs **Product Company Mode** (DSA matters more)
- Three tiers in product mode: Tier 1 (Google/Microsoft), Tier 2 (Zepto/Razorpay/CRED), Tier 3 (Funded startups)

---

## 📸 Features

- Terminal/hacker aesthetic UI
- Animated loading terminal with step-by-step scan logs
- Circular score ring with overall readiness score
- GitHub language pie chart
- GitHub contribution heatmap
- LeetCode difficulty breakdown chart
- Shareable result card (download as image)
- Brutal AI roast based on your actual data

---

## 🛠️ Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | Server |
| TypeScript | Type safety |
| GitHub REST API | Fetch repo data |
| LeetCode API (third party) | Fetch LC stats |
| Groq API (LLaMA 3.3 70B) | AI analysis |
| Axios | HTTP requests |

### Frontend
| Tech | Purpose |
|------|---------|
| React + TypeScript | UI |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Recharts | Pie chart + bar charts |
| html2canvas | Share card download |
| JetBrains Mono | Font |

---

## 📁 Folder Structure

```
am-i-hireable/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts              ← loads & validates env vars
│   │   ├── routes/
│   │   │   └── analyze.ts          ← POST /api/analyze
│   │   ├── services/
│   │   │   ├── github.ts           ← GitHub API calls
│   │   │   ├── leetcode.ts         ← LeetCode API calls
│   │   │   └── openai.ts           ← Groq AI analysis
│   │   ├── utils/
│   │   │   ├── buildPrompt.ts      ← builds AI prompt per mode/tier
│   │   │   └── calculateSignals.ts ← processes raw data into signals
│   │   ├── types/
│   │   │   └── index.ts            ← all TypeScript interfaces
│   │   └── index.ts                ← Express server entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── nodemon.json
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── InputForm.tsx        ← landing page + form
    │   │   ├── LoadingTerminal.tsx  ← animated scan logs
    │   │   ├── ResultsPage.tsx      ← full results layout
    │   │   ├── ScoreRing.tsx        ← circular progress ring
    │   │   ├── ScoreBars.tsx        ← category bar charts
    │   │   ├── GitHubPanel.tsx      ← github signals + pie chart
    │   │   ├── GitHubHeatmap.tsx    ← contribution heatmap
    │   │   ├── LeetCodePanel.tsx    ← leetcode signals + chart
    │   │   ├── ShareCard.tsx        ← downloadable result card
    │   │   └── TerminalBox.tsx      ← reusable terminal container
    │   ├── types.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/azhanhashmi/am-i-hireable.git
cd am-i-hireable
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token
```

**Getting API keys:**
- **Groq** — free at [console.groq.com](https://console.groq.com), no card needed
- **GitHub Token** — GitHub → Settings → Developer Settings → Personal Access Tokens → check `public_repo`

Run the backend:

```bash
npx ts-node src/index.ts
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`
Backend runs at `http://localhost:5000`

---

## 🔌 API Reference

### POST /api/analyze

**Request body:**
```json
{
  "githubUsername": "string",
  "leetcodeUsername": "string",
  "mode": "startup | product",
  "tier": "tier1 | tier2 | tier3"
}
```
> `tier` only required when `mode` is `product`

**GET /health**
```json
{ "status": "ok" }
```

---

## 🧠 How The AI Analysis Works

**1. Signal calculation** — raw data converted into meaningful signals:
- `commitConsistency` — checks spread across months AND average activity per month
- `tutorialRepos` — scans repo names for keywords like "clone", "practice", "todo"
- `dsaReadiness` — weak / moderate / strong based on medium + hard count

**2. Prompt engineering** — AI prompt includes real India 2025 hiring benchmarks, mode-specific scoring categories, and strict JSON output format.

---

## 📊 Scoring

### Startup Mode (25 pts each)
| Category | What It Checks |
|----------|---------------|
| Shipped Projects Quality | Live URLs, real problems, not tutorials |
| GitHub Consistency | Commit pattern, account age, recent activity |
| Tech Breadth | Variety of languages, fullstack experience |
| Documentation Habits | READMEs, descriptions, clean names |

### Product Company Mode (25 pts each)
| Category | What It Checks |
|----------|---------------|
| LeetCode Depth | Medium/hard ratio, not just easy grind |
| DSA Pattern Coverage | Graphs, DP, trees, sliding window |
| Code Quality Signals | TypeScript, project structure |
| Overall Consistency | Regular activity, real projects alongside DSA |

---

## 🚢 Deployment

**Backend → Render**
**Frontend → Vercel**

---

## ⚠️ Known Limitations

- LeetCode public API is unreliable — analysis still runs with 0 LC data if it fails
- GitHub rate limit: 5000 req/hour with token
- Groq free tier: if you get 429, wait 1 minute

---

## 📄 License

MIT

---

## 👨‍💻 Built By

**Azhan Hashmi**
