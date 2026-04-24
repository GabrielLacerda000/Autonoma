import { generateText } from 'ai';
import { Agent } from './agent.interface.js';
import { writerPrompt } from '../prompts/writer.prompt.js';
import { AI_MODEL } from '../ai.constants.js';

export type WriterInput = {
  title: string;
  description: string;
  keywords: string[];
  toneOfVoice: string;
};

export type WriterOutput = { content: string };

export class WriterAgent implements Agent<WriterInput, WriterOutput> {
  name = 'Writer';

  async execute(input: WriterInput): Promise<WriterOutput> {
    const result = await generateText({
      model: AI_MODEL,
      prompt: writerPrompt(
        input.title,
        input.description,
        input.keywords,
        input.toneOfVoice,
      ),
    });

    return { content: result.text };
  }
}
