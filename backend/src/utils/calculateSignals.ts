import { GitHubRepo, GitHubUser, GitHubSignals, GitHubRepoDetail, LeetCodeData, LeetCodeSignals } from '../types/index';

const TUTORIAL_KEYWORDS = [
  'tutorial', 'practice', 'clone', 'course', 'learn', 'basic',
  'beginner', 'demo', 'test', 'sample', 'example', 'todo', 'weather',
];

const isLiveLink = (url: string | null): boolean => {
  if (!url) return false;
  return url.startsWith('http') && !url.includes('github.com');
};

const isTutorialRepo = (name: string, description: string | null): boolean => {
  const text = `${name} ${description || ''}`.toLowerCase();
  return TUTORIAL_KEYWORDS.some(keyword => text.includes(keyword));
};

const getCommitConsistency = (repos: GitHubRepo[]): string => {
  const monthActivity: Record<string, number> = {};
  repos.forEach(r => {
    const date = new Date(r.pushed_at);
    const key  = `${date.getFullYear()}-${date.getMonth()}`;
    monthActivity[key] = (monthActivity[key] || 0) + 1;
  });
  const activeMonths        = Object.keys(monthActivity).length;
  const totalActivity       = Object.values(monthActivity).reduce((s, v) => s + v, 0);
  const avgActivityPerMonth = activeMonths > 0 ? totalActivity / activeMonths : 0;
  if (activeMonths >= 8 && avgActivityPerMonth >= 2) return 'excellent';
  if (activeMonths >= 5 && avgActivityPerMonth >= 2) return 'good';
  if (activeMonths >= 3 && avgActivityPerMonth >= 1) return 'moderate';
  return 'poor';
};

const getAccountAgeDays = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now     = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
};

export const calculateGitHubSignals = (
  user: GitHubUser,
  repos: GitHubRepo[],
  monthlyCommits: number,
  contributionHeatmap: Record<string, number> = {},
  recentRepos: GitHubRepoDetail[] = [],
): GitHubSignals => {
  const originalRepos      = repos.filter(r => !r.fork);
  const forkedRepos        = repos.filter(r => r.fork);
  const reposWithLiveLinks = originalRepos.filter(r => isLiveLink(r.homepage));
  const tutorialRepos      = originalRepos.filter(r => isTutorialRepo(r.name, r.description));
  const realProjectRepos   = originalRepos.filter(r => !isTutorialRepo(r.name, r.description));

  // Language count per repo
  const languageCount: Record<string, number> = {};
  originalRepos.forEach(r => {
    if (r.language) {
      languageCount[r.language] = (languageCount[r.language] || 0) + 1;
    }
  });

  const languages       = Object.keys(languageCount);
  const mostUsedLanguage = languages.sort((a, b) => languageCount[b] - languageCount[a])[0] || 'Unknown';
  const totalStars      = originalRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const lastCommitDate  = repos.length > 0 ? new Date(repos[0].pushed_at).toDateString() : 'Unknown';
  const reposWithReadme = originalRepos.filter(r => r.description && r.description.length > 20).length;

  return {
    totalRepos: repos.length,
    originalRepos: originalRepos.length,
    forkedRepos: forkedRepos.length,
    reposWithLiveLinks: reposWithLiveLinks.length,
    reposWithReadme,
    languages,
    languageCount,
    mostUsedLanguage,
    commitConsistency: getCommitConsistency(repos),
    lastCommitDate,
    accountAgeDays: getAccountAgeDays(user.created_at),
    tutorialRepos: tutorialRepos.length,
    realProjectRepos: realProjectRepos.length,
    totalStars,
    monthlyCommits,
    contributionHeatmap,
    recentRepos,
  };
};

export const calculateLeetCodeSignals = (data: LeetCodeData): LeetCodeSignals => {
  const easyToMediumRatio = data.mediumSolved > 0
    ? Math.round((data.easySolved / data.mediumSolved) * 10) / 10
    : data.easySolved;

  const getDsaReadiness = (): 'weak' | 'moderate' | 'strong' => {
    if (data.mediumSolved >= 50 && data.hardSolved >= 10) return 'strong';
    if (data.mediumSolved >= 20) return 'moderate';
    return 'weak';
  };

  return {
    totalSolved:       data.totalSolved,
    easySolved:        data.easySolved,
    mediumSolved:      data.mediumSolved,
    hardSolved:        data.hardSolved,
    easyToMediumRatio,
    acceptanceRate:    data.acceptanceRate,
    ranking:           data.ranking,
    dsaReadiness:      getDsaReadiness(),
    totalActiveDays:   data.totalActiveDays   || 0,
    streak:            data.streak            || 0,
    submissionHeatmap: data.submissionHeatmap || {},
    monthlyBreakdown:  data.monthlyBreakdown  || {},
    monthlySubmissions: data.monthlySubmissions || 0,
  };
};