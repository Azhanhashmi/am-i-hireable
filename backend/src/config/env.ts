import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['GROQ_API_KEY', 'PORT', 'GITHUB_TOKEN'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const config = {
  port: process.env.PORT || 5000,
  openaiApiKey: process.env.GROQ_API_KEY as string,
  githubToken: process.env.GITHUB_TOKEN as string,
};