// Mode types
export type AnalysisMode = 'startup' | 'product';
export type ProductTier = 'tier1' | 'tier2' | 'tier3';

// Request type
export interface AnalyzeRequest {
  githubUsername: string;
  leetcodeUsername: string;
  mode: AnalysisMode;
  tier?: ProductTier;
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  topics: string[];
  has_pages: boolean;
  homepage: string | null;
  pushed_at: string;
  created_at: string;
  size: number;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string | null;
}

// Full detail for recent repos (top 6)
export interface GitHubRepoDetail {
  name: string;
  description: string | null;
  language: string | null;
  languagesBreakdown: Record<string, number>; // { "JavaScript": 4200, "CSS": 1200 }
  stars: number;
  forks: number;
  homepage: string | null;
  hasReadme: boolean;
  recentCommits: number;
  pushedAt: string;
  createdAt: string;
  topics: string[];
  size: number;
  isLive: boolean;
}

export interface GitHubSignals {
  totalRepos: number;
  originalRepos: number;
  forkedRepos: number;
  reposWithLiveLinks: number;
  reposWithReadme: number;
  languages: string[];
  languageCount: Record<string, number>; // { "JavaScript": 8, "TypeScript": 3 }
  mostUsedLanguage: string;
  commitConsistency: string;
  lastCommitDate: string;
  accountAgeDays: number;
  tutorialRepos: number;
  realProjectRepos: number;
  totalStars: number;
  monthlyCommits: number;
  contributionHeatmap: Record<string, number>; // { "2025-04-01": 3, ... }
  recentRepos: GitHubRepoDetail[];
}

// ─── LeetCode ─────────────────────────────────────────────────────────────────

export interface LeetCodeData {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  totalActiveDays: number;
  streak: number;
  submissionHeatmap: Record<string, number>; // { "2025-04-01": 3, ... }
  monthlyBreakdown: Record<string, number>;  // { "2025-04": 23, ... }
  monthlySubmissions: number;
}

export interface LeetCodeSignals {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyToMediumRatio: number;
  acceptanceRate: number;
  ranking: number;
  dsaReadiness: 'weak' | 'moderate' | 'strong';
  totalActiveDays: number;
  streak: number;
  submissionHeatmap: Record<string, number>;
  monthlyBreakdown: Record<string, number>;
  monthlySubmissions: number;
}

// ─── Scores ───────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  overall: number;
  category1: { name: string; score: number; max: number };
  category2: { name: string; score: number; max: number };
  category3: { name: string; score: number; max: number };
  category4: { name: string; score: number; max: number };
}

// ─── Final Result ─────────────────────────────────────────────────────────────

export interface AnalysisResult {
  githubUsername: string;
  leetcodeUsername: string;
  mode: AnalysisMode;
  tier?: ProductTier;
  scores: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  actionPlan: string[];
  roast: string;
  verdict: 'Hired' | 'Not Yet' | 'Close';
  verdictExplanation: string;
  githubSignals: GitHubSignals;
  leetcodeSignals: LeetCodeSignals;
}

// ─── Frontend form ────────────────────────────────────────────────────────────

export type Mode = 'startup' | 'product';
export type Tier = 'tier1' | 'tier2' | 'tier3';

export interface FormData {
  githubUsername: string;
  leetcodeUsername: string;
  mode: Mode;
  tier: Tier;
}