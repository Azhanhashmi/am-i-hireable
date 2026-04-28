import { AnalysisMode, ProductTier, GitHubSignals, LeetCodeSignals } from '../types/index';

const tierLabels: Record<string, string> = {
  tier1: 'Tier 1 (Google, Microsoft, Amazon)',
  tier2: 'Tier 2 (Zepto, Razorpay, CRED, Swiggy)',
  tier3: 'Tier 3 (Funded startups 50-500 people)',
};

const startupBenchmarks = `
BENCHMARKS FOR HIRED STARTUP DEVELOPERS IN INDIA 2026:

PROJECTS:
- 5–8 strong original projects (quality > quantity)
- 3–5 deployed live projects (at least 1 full-stack)
- 3–5 high-quality READMEs (features, setup, screenshots)
- Maximum 2 tutorial/clone projects

SKILLS:
- Strong in at least one stack (e.g., MERN)
- Backend + API + database understanding required

ACTIVITY:
- Good or excellent consistency
- Recent activity (last 30–60 days is critical)

DSA (OPTIONAL BUT HELPFUL):
- 20–40 medium problems
- 5–10 hard (bonus)
`;

const productBenchmarks: Record<string, string> = {
  tier1: `
BENCHMARKS FOR TIER 1 PRODUCT COMPANIES (GOOGLE/MICROSOFT/AMAZON) – INDIA 2026:

DSA (PRIMARY):
- LeetCode medium: 150+
- LeetCode hard: 40–60
- Strong problem-solving ability (not memorization)
- Must solve unseen problems in interviews

CORE CS:
- Strong in DSA, OOP, DBMS, OS basics

PROJECTS (SECONDARY):
- 2–4 solid projects (not a major factor)

CONSISTENCY:
- Long-term consistent practice (not bursts)
`,

  tier2: `
BENCHMARKS FOR TIER 2 PRODUCT COMPANIES (ZEPTO/RAZORPAY/CRED) – INDIA 2026:

DSA:
- LeetCode medium: 70–120
- LeetCode hard: 15–30

PROJECTS:
- 4–6 original projects
- 2–3 deployed (at least 1 full-stack)

CONSISTENCY:
- Moderate to good activity

BONUS:
- Low-level design (LLD basics)
`,

  tier3: `
BENCHMARKS FOR TIER 3 / STARTUPS – INDIA 2026:

PROJECTS (PRIMARY):
- 5–8 real projects
- 3–5 deployed
- At least 1 strong full-stack project

SKILLS:
- Strong in one stack
- API + DB + auth knowledge

DSA:
- 20–50 medium problems (basic understanding)

CONSISTENCY:
- Active GitHub (recent commits)
`,
};

const startupCategories = `
SCORING CATEGORIES FOR STARTUP MODE (25 points each):

1. Project Quality & Depth
   - Real-world complexity (auth, APIs, DB)
   - Not just clones or tutorials

2. Deployment & Usability
   - Live working apps
   - Proper UI + production readiness

3. Consistency & Recency
   - Spread across months
   - Recent activity (last 30–60 days)

4. Engineering Practices
   - Clean code, READMEs, naming, structure
`;

const productCategories = `
SCORING CATEGORIES FOR PRODUCT COMPANY MODE (25 points each):

1. DSA Depth
   - Medium vs hard ratio
   - Problem-solving ability

2. Pattern Coverage
   - DP, graphs, trees, sliding window, etc.

3. Problem Solving Consistency
   - Regular solving, not burst practice

4. Supporting Signals
   - Projects, GitHub activity, code quality
`;

export const buildPrompt = (
  githubSignals: GitHubSignals,
  leetcodeSignals: LeetCodeSignals,
  mode: AnalysisMode,
  tier?: ProductTier
): string => {
  const isStartup = mode === 'startup';
  const tierLabel = tier ? tierLabels[tier] : '';
  const benchmarks = isStartup ? startupBenchmarks : productBenchmarks[tier || 'tier3'];
  const categories = isStartup ? startupCategories : productCategories;
  const target = isStartup ? 'an Indian startup' : `a ${tierLabel} company`;

  return `
You are a senior engineering recruiter in India who has evaluated 1000+ candidates.
You are direct, data-driven, and brutally honest. No fluff.

A developer wants to know if they are ready to get hired at ${target}.

Here is their data:

GITHUB SIGNALS:
- Total repos: ${githubSignals.totalRepos}
- Original repos: ${githubSignals.originalRepos}
- Forked repos: ${githubSignals.forkedRepos}
- Live deployed repos: ${githubSignals.reposWithLiveLinks}
- Repos with good READMEs: ${githubSignals.reposWithReadme}
- Languages: ${githubSignals.languages.join(', ') || 'None'}
- Primary language: ${githubSignals.mostUsedLanguage}
- Consistency: ${githubSignals.commitConsistency}
- Last activity: ${githubSignals.lastCommitDate}
- Account age: ${githubSignals.accountAgeDays} days
- Tutorial repos: ${githubSignals.tutorialRepos}
- Real projects: ${githubSignals.realProjectRepos}
- Total stars: ${githubSignals.totalStars}

LEETCODE SIGNALS:
- Total solved: ${leetcodeSignals.totalSolved}
- Easy: ${leetcodeSignals.easySolved}
- Medium: ${leetcodeSignals.mediumSolved}
- Hard: ${leetcodeSignals.hardSolved}
- Easy/Medium ratio: ${leetcodeSignals.easyToMediumRatio}
- Acceptance rate: ${leetcodeSignals.acceptanceRate}%
- Ranking: ${leetcodeSignals.ranking}
- DSA readiness: ${leetcodeSignals.dsaReadiness}

${benchmarks}

${categories}

Strict instructions:
- Use ACTUAL numbers from the data
- Compare directly against benchmarks
- No generic advice
- Be precise and actionable

Return ONLY valid JSON:

{
  "scores": {
    "overall": <0-100>,
    "category1": { "name": "<name>", "score": <0-25>, "max": 25 },
    "category2": { "name": "<name>", "score": <0-25>, "max": 25 },
    "category3": { "name": "<name>", "score": <0-25>, "max": 25 },
    "category4": { "name": "<name>", "score": <0-25>, "max": 25 }
  },
  "strengths": [
    "<must reference actual numbers>",
    "<must reference actual numbers>",
    "<must reference actual numbers>"
  ],
  "weaknesses": [
    "<must reference exact gaps>",
    "<must reference exact gaps>",
    "<must reference exact gaps>"
  ],
  "actionPlan": [
    "<clear numeric target>",
    "<clear numeric target>",
    "<clear numeric target>",
    "<clear numeric target>",
    "<clear numeric target>"
  ],
  "roast": "<one sharp but fair sentence using real data>",
  "verdict": "<Hired OR Not Yet OR Close>",
  "verdictExplanation": "<clear reasoning based on benchmark gap>"
}

Rules:
- If below benchmarks → "Not Yet"
- If close but missing few things → "Close"
- If meets benchmarks → "Hired"
- Be strict, not generous
`;
};
