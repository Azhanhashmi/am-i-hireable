import Groq from 'groq-sdk';
import { config } from '../config/env';
import { AnalysisResult, AnalysisMode, ProductTier, GitHubSignals, LeetCodeSignals } from '../types/index';
import { buildPrompt } from '../utils/buildPrompt';

const groq = new Groq({
  apiKey: config.openaiApiKey,
});

export const analyzeWithOpenAI = async (
  githubSignals: GitHubSignals,
  leetcodeSignals: LeetCodeSignals,
  mode: AnalysisMode,
  tier: ProductTier | undefined,
  githubUsername: string,
  leetcodeUsername: string
): Promise<AnalysisResult> => {
  const prompt = buildPrompt(githubSignals, leetcodeSignals, mode, tier);

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from Groq');
  }

  const cleaned = content.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    githubUsername,
    leetcodeUsername,
    mode,
    tier,
    scores: parsed.scores,
    strengths: parsed.strengths,
    weaknesses: parsed.weaknesses,
    actionPlan: parsed.actionPlan,
    roast: parsed.roast,
    verdict: parsed.verdict,
    verdictExplanation: parsed.verdictExplanation,
    githubSignals,
    leetcodeSignals,
  };
};