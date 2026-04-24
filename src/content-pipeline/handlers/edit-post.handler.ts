import { Job } from 'bullmq';
import { JobHandler, HandlerDeps } from './handler.interface.js';

export class EditPostHandler implements JobHandler {
  async execute(job: Job, _deps: HandlerDeps): Promise<void> {
    console.log('📝 Editing post:', job.data.topic);
    await new Promise((r) => setTimeout(r, 1500));
  }
}
