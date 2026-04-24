import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { Agent } from './agent.interface.js';
import { editorPrompt } from '../prompts/editor.prompt.js';

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
      model: google('gemini-1.5-flash'),
      prompt: editorPrompt(input),
    });

    return { content: result.text };
  }
}
