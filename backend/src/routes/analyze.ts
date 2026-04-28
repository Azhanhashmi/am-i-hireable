import { Router, Request, Response } from 'express';
import { AnalyzeRequest, LeetCodeData } from '../types/index';
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  fetchMonthlyCommits,
  fetchContributionHeatmap,
  fetchRecentReposDetail,
} from '../services/github';
import { fetchLeetCodeData } from '../services/leetcode';
import { calculateGitHubSignals, calculateLeetCodeSignals } from '../utils/calculateSignals';
import { analyzeWithOpenAI } from '../services/openai';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  console.log('ROUTE HIT');
  const { githubUsername, leetcodeUsername, mode, tier }: AnalyzeRequest = req.body;

  if (!githubUsername || !leetcodeUsername || !mode) {
    return res.status(400).json({
      error: 'githubUsername, leetcodeUsername and mode are required',
    });
  }

  if (mode === 'product' && !tier) {
    return res.status(400).json({ error: 'tier is required when mode is product' });
  }

  try {
    // ── Fetch GitHub data in parallel ────────────────────────────────────────
    const [githubUser, githubRepos, monthlyCommits, contributionHeatmap] = await Promise.all([
      fetchGitHubUser(githubUsername),
      fetchGitHubRepos(githubUsername),
      fetchMonthlyCommits(githubUsername),
      fetchContributionHeatmap(githubUsername),
    ]);

    // Recent repos need repos list first
    const recentRepos = await fetchRecentReposDetail(githubUsername, githubRepos);

    // ── Fetch LeetCode data ──────────────────────────────────────────────────
    let leetcodeData: LeetCodeData;
    try {
      leetcodeData = await fetchLeetCodeData(leetcodeUsername);
    } catch (err) {
      console.log('LeetCode failed, using defaults:', err);
      leetcodeData = {
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        acceptanceRate: 0,
        ranking: 0,
        contributionPoints: 0,
        totalActiveDays: 0,
        streak: 0,
        submissionHeatmap: {},
        monthlyBreakdown: {},
        monthlySubmissions: 0,
      };
    }

    // ── Calculate signals ────────────────────────────────────────────────────
    const githubSignals  = calculateGitHubSignals(githubUser, githubRepos, monthlyCommits, contributionHeatmap, recentRepos);
    const leetcodeSignals = calculateLeetCodeSignals(leetcodeData);

    // ── AI analysis ──────────────────────────────────────────────────────────
    const result = await analyzeWithOpenAI(
      githubSignals,
      leetcodeSignals,
      mode,
      tier,
      githubUsername,
      leetcodeUsername,
    );

    return res.status(200).json(result);

  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

export default router;