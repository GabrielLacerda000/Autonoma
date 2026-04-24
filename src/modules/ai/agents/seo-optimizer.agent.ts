import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { Agent } from './agent.interface.js';
import { seoPrompt } from '../prompts/seo.prompt.js';

export type SeoOptimizerInput = {
  content: string;
  title: string;
  keywords: string[];
};

export type SeoOptimizerOutput = { content: string };

export class SeoOptimizerAgent implements Agent<
  SeoOptimizerInput,
  SeoOptimizerOutput
> {
  name = 'SeoOptimizer';

  async execute(input: SeoOptimizerInput): Promise<SeoOptimizerOutput> {
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: seoPrompt(input),
    });

    return { content: result.text };
  }
}
