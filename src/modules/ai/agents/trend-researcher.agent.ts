import { generateText, Output } from 'ai';
import { z } from 'zod';
import { AI_MODEL } from '../ai.constants.js';
import { Agent } from './agent.interface.js';
import { trendPrompt } from '../prompts/trend.prompt.js';

const TrendItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  score: z.number().int().min(1).max(10),
});

export type TrendInput = {
  niche: string;
  targetAudience: string;
};

export type TrendOutput = z.infer<typeof TrendItemSchema>[];

export class TrendResearcherAgent implements Agent<TrendInput, TrendOutput> {
  name = 'TrendResearcher';

  async execute({ niche, targetAudience }: TrendInput): Promise<TrendOutput> {
    const result = await generateText({
      model: AI_MODEL,
      prompt: trendPrompt(niche, targetAudience),
      output: Output.array({ element: TrendItemSchema }),
    });

    return result.output;
  }
}
