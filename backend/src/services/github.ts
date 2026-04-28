import axios from "axios";
import { GitHubRepo, GitHubUser, GitHubRepoDetail } from '../types/index';
import { config } from "../config/env";

const GITHUB_BASE_URL = 'https://api.github.com';

const githubHeaders = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: `Bearer ${config.githubToken}`,
};

const githubGraphQLHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.githubToken}`,
};

// ─── Basic User Info ───────────────────────────────────────────────────────────
export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await axios.get(`${GITHUB_BASE_URL}/users/${username}`, {
      headers: githubHeaders,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`GitHub user "${username}" not found`);
    }
    throw new Error(`Failed to fetch GitHub user: ${error.message}`);
  }
};

// ─── All Repos ────────────────────────────────────────────────────────────────
export const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
  try {
    const response = await axios.get(`${GITHUB_BASE_URL}/users/${username}/repos`, {
      params: { per_page: 100, sort: 'updated' },
      headers: githubHeaders,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`GitHub user "${username}" not found`);
    }
    throw new Error(`Failed to fetch GitHub repos: ${error.message}`);
  }
};

// ─── Readme Check ─────────────────────────────────────────────────────────────
export const fetchRepoReadme = async (username: string, repoName: string): Promise<boolean> => {
  try {
    await axios.get(`${GITHUB_BASE_URL}/repos/${username}/${repoName}/readme`, {
      headers: githubHeaders,
    });
    return true;
  } catch {
    return false;
  }
};

// ─── Contribution Heatmap (full year, daily) via GraphQL ──────────────────────
export const fetchContributionHeatmap = async (
  username: string
): Promise<Record<string, number>> => {
  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query, variables: { username } },
      { headers: githubGraphQLHeaders }
    );

    const weeks =
      response.data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

    const heatmap: Record<string, number> = {};
    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        heatmap[day.date] = day.contributionCount;
      });
    });

    return heatmap; // e.g. { "2025-04-01": 3, "2025-03-28": 0, ... }
  } catch {
    return {};
  }
};

// ─── Monthly Commits Count (last 30 days) ─────────────────────────────────────
export const fetchMonthlyCommits = async (username: string): Promise<number> => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const response = await axios.get(
      `${GITHUB_BASE_URL}/search/commits?q=author:${username}+author-date:>=${since.toISOString().split('T')[0]}`,
      {
        headers: {
          ...githubHeaders,
          Accept: 'application/vnd.github.clover-preview+json',
        },
      }
    );
    return response.data.total_count || 0;
  } catch {
    return 0;
  }
};

// ─── Recent Repos with Full Detail (pinned to top of results) ─────────────────
export const fetchRecentReposDetail = async (
  username: string,
  repos: GitHubRepo[]
): Promise<GitHubRepoDetail[]> => {
  // Take top 6 most recently updated non-forked repos
  const topRepos = repos
    .filter(r => !r.fork)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 6);

  const detailed = await Promise.all(
    topRepos.map(async (repo) => {
      // Check if readme exists
      const hasReadme = await fetchRepoReadme(username, repo.name);

      // Fetch languages breakdown
      let languagesBreakdown: Record<string, number> = {};
      try {
        const langResponse = await axios.get(
          `${GITHUB_BASE_URL}/repos/${username}/${repo.name}/languages`,
          { headers: githubHeaders }
        );
        languagesBreakdown = langResponse.data;
      } catch {
        if (repo.language) languagesBreakdown = { [repo.language]: 100 };
      }

      // Fetch recent commits count (last 30 days)
      let recentCommits = 0;
      try {
        const since = new Date();
        since.setDate(since.getDate() - 30);
        const commitsRes = await axios.get(
          `${GITHUB_BASE_URL}/repos/${username}/${repo.name}/commits`,
          {
            params: {
              since: since.toISOString(),
              per_page: 100,
            },
            headers: githubHeaders,
          }
        );
        recentCommits = commitsRes.data.length;
      } catch {
        recentCommits = 0;
      }

      return {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        languagesBreakdown,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        homepage: repo.homepage,
        hasReadme,
        recentCommits,
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at,
        topics: repo.topics || [],
        size: repo.size,
        isLive: !!(repo.homepage && repo.homepage.startsWith('http') && !repo.homepage.includes('github.com')),
      } as GitHubRepoDetail;
    })
  );

  return detailed;
};