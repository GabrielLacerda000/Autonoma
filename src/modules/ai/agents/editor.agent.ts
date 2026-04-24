import { generateText } from 'ai';
import { Agent } from './agent.interface.js';
import { editorPrompt } from '../prompts/editor.prompt.js';
import { AI_MODEL } from '../ai.constants.js';

export type EditorInput = {
  content: string;
  title: string;
  keywords: string[];
  toneOfVoice: string;
};

export type EditorOutput = { content: string };

export class EditorAgent implements Agent<EditorInput, EditorOutput> {
  name = 'Editor';

  async execute(input: EditorInput): Promise<EditorOutput> {
    const result = await generateText({
      model: AI_MODEL,
      prompt: editorPrompt(input),
    });

    return { content: result.text };
  }
}
