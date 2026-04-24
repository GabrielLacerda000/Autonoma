import { Job } from 'bullmq';
import { JobHandler, HandlerDeps } from './handler.interface.js';
import { GenerateTrendsHandler } from './generate-trends.handler.js';
import { GenerateCalendarHandler } from './generate-calendar.handler.js';
import { GenerateDraftPostHandler } from './generate-draft-post.handler.js';
import { EditPostHandler } from './edit-post.handler.js';
import { OptimizePostSeoHandler } from './optimize-post-seo.handler.js';

const registry: Record<string, JobHandler> = {
  generate_trends: new GenerateTrendsHandler(),
  generate_calendar: new GenerateCalendarHandler(),
  generate_draft_post: new GenerateDraftPostHandler(),
  edit_post: new EditPostHandler(),
  optimize_post_seo: new OptimizePostSeoHandler(),
};

export async function dispatch(job: Job, deps: HandlerDeps): Promise<void> {
  const handler = registry[job.name];
  if (!handler) throw new Error(`No handler registered for job: ${job.name}`);
  await handler.execute(job, deps);
}
