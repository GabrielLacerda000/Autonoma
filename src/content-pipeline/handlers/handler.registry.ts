import { Job } from 'bullmq';
import { JobHandler, HandlerDeps } from './handler.interface.js';
import { GenerateTrendsHandler } from './generate-trends.handler.js';
import { GenerateDraftPostHandler } from './generate-draft-post.handler.js';
import { EditPostHandler } from './edit-post.handler.js';
import { OptimizePostSeoHandler } from './optimize-post-seo.handler.js';

const registry: Record<string, JobHandler> = {
  generate_trends: new GenerateTrendsHandler(),
  generate_draft_post: new GenerateDraftPostHandler(),
  edit_post: new EditPostHandler(),
  optimize_post_seo: new OptimizePostSeoHandler(),
};

const ORCHESTRATION_PREFIXES = ['post_pipeline_', 'generate_content_for_project'];

export async function dispatch(job: Job, deps: HandlerDeps): Promise<void> {
  const handler = registry[job.name];

  if (!handler) {
    const isOrchestration = ORCHESTRATION_PREFIXES.some((prefix) =>
      job.name.startsWith(prefix),
    );
    if (isOrchestration) return;
    throw new Error(`No handler registered for job: ${job.name}`);
  }

  await handler.execute(job, deps);
}
