import { Job } from 'bullmq';
import { JobHandler } from './handler.interface.js';

export class GenerateTrendsHandler implements JobHandler {
  async execute(_job: Job): Promise<void> {
    console.log('📈 Generating trends...');
    await new Promise((r) => setTimeout(r, 2000));
  }
}
