import { generateText } from 'ai';
import { Agent } from './agent.interface.js';
import { seoPrompt } from '../prompts/seo.prompt.js';
import { AI_MODEL } from '../ai.constants.js';

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
      model: AI_MODEL,
      prompt: seoPrompt(input),
    });

    return { content: result.text };
  }
}
