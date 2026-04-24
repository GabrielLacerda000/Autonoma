import { Job } from 'bullmq';
import { JobHandler } from './handler.interface.js';

export class GenerateDraftPostHandler implements JobHandler {
  async execute(job: Job): Promise<void> {
    console.log('✍️ Writing post:', job.data.topic);
    await new Promise((r) => setTimeout(r, 2000));
  }
}
