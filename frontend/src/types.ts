export type Mode = 'startup' | 'product';
export type Tier = 'tier1' | 'tier2' | 'tier3';
export type Verdict = 'Hired' | 'Not Yet' | 'Close';
export type CommitConsistency = 'excellent' | 'good' | 'moderate' | 'poor';
export type DsaReadiness = 'weak' | 'moderate' | 'strong';

export interface CategoryScore {
  name: string;
  score: number;
  max: number;
}
export interface GitHubRepoDetail {
  name: string;
  description: string | null;
  language: string | null;
  languagesBreakdown: Record<string, number>;
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
  mostUsedLanguage: string;
  commitConsistency: CommitConsistency;
  lastCommitDate: string;
  accountAgeDays: number;
  tutorialRepos: number;
  realProjectRepos: number;
  totalStars: number;
  languageCount: Record<string, number>;
monthlyCommits: number;
contributionHeatmap: Record<string, number>;
recentRepos: GitHubRepoDetail[];
}

export interface LeetCodeSignals {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyToMediumRatio: number;
  acceptanceRate: number;
  ranking: number;
  dsaReadiness: DsaReadiness;
  totalActiveDays: number;
streak: number;
submissionHeatmap: Record<string, number>;
monthlyBreakdown: Record<string, number>;
monthlySubmissions: number;
}

export interface AnalysisResult {
  githubUsername: string;
  leetcodeUsername: string;
  mode: Mode;
  tier: Tier;
  scores: {
    overall: number;
    category1: CategoryScore;
    category2: CategoryScore;
    category3: CategoryScore;
    category4: CategoryScore;
  };
  strengths: string[];
  weaknesses: string[];
  actionPlan: string[];
  roast: string;
  verdict: Verdict;
  verdictExplanation: string;
  githubSignals: GitHubSignals;
  leetcodeSignals: LeetCodeSignals;
}

export interface FormData {
  githubUsername: string;
  leetcodeUsername: string;
  mode: Mode;
  tier: Tier;
}
