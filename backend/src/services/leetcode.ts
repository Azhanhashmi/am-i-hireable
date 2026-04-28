import axios from 'axios';
import { LeetCodeData } from '../types/index';

const LEETCODE_GQL = 'https://leetcode.com/graphql';
const GQL_HEADERS = {
  'Content-Type': 'application/json',
  'Referer': 'https://leetcode.com',
};

export const fetchLeetCodeData = async (username: string): Promise<LeetCodeData> => {
  try {
    // ── Single request with both queries merged ──────────────────────────────
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
          }
          userCalendar {
            submissionCalendar
            totalActiveDays
            streak
          }
        }
      }
    `;

    const response = await axios.post(
      LEETCODE_GQL,
      { query, variables: { username } },
      { headers: GQL_HEADERS }
    );

    const user = response.data?.data?.matchedUser;
    if (!user) throw new Error(`LeetCode user "${username}" not found`);

    // ── Solved counts ────────────────────────────────────────────────────────
    const stats = user.submitStats.acSubmissionNum;
    const easySolved   = stats.find((s: any) => s.difficulty === 'Easy')?.count   || 0;
    const mediumSolved = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved   = stats.find((s: any) => s.difficulty === 'Hard')?.count   || 0;
    const totalSolved  = easySolved + mediumSolved + hardSolved;

    // ── Calendar / heatmap ───────────────────────────────────────────────────
    const calendar     = user.userCalendar;
    const totalActiveDays = calendar?.totalActiveDays || 0;
    const streak          = calendar?.streak          || 0;

    // submissionCalendar is a JSON string: { "unix_timestamp": count, ... }
    const rawCalendar: Record<string, number> =
      JSON.parse(calendar?.submissionCalendar || '{}');

    // Convert unix timestamps → "YYYY-MM-DD" keys
    const submissionHeatmap: Record<string, number> = {};
    Object.entries(rawCalendar).forEach(([ts, count]) => {
      const date = new Date(Number(ts) * 1000);
      const key  = date.toISOString().split('T')[0]; // "2025-04-01"
      submissionHeatmap[key] = (submissionHeatmap[key] || 0) + count;
    });

    // Group by month for chart: { "2025-04": 23, "2025-03": 8, ... }
    const monthlyBreakdown: Record<string, number> = {};
    Object.entries(submissionHeatmap).forEach(([date, count]) => {
      const month = date.slice(0, 7); // "YYYY-MM"
      monthlyBreakdown[month] = (monthlyBreakdown[month] || 0) + count;
    });

    // Last 30 days count
    const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;
    const monthlySubmissions = Object.entries(rawCalendar)
      .filter(([ts]) => Number(ts) >= thirtyDaysAgo)
      .reduce((sum, [, count]) => sum + count, 0);

    return {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      acceptanceRate: 0,
      ranking: user.profile?.ranking || 0,
      contributionPoints: 0,
      totalActiveDays,
      streak,
      submissionHeatmap,
      monthlyBreakdown,
      monthlySubmissions,
    };

  } catch (error: any) {
    if (error.message.includes('not found')) {
      throw new Error(`LeetCode user "${username}" not found`);
    }
    throw new Error(`Failed to fetch LeetCode data: ${error.message}`);
  }
};