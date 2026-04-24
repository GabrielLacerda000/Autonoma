import { Job } from 'bullmq';
import { JobHandler } from './handler.interface.js';

export class OptimizePostSeoHandler implements JobHandler {
  async execute(job: Job): Promise<void> {
    console.log('🔎 Optimizing SEO:', job.data.topic);
    await new Promise((r) => setTimeout(r, 1000));
  }
}
