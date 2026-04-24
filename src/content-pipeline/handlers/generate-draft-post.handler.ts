import { Job } from 'bullmq';
import { eq } from 'drizzle-orm';
import { JobHandler, HandlerDeps } from './handler.interface.js';
import { trends, projects, posts } from '../../db/schema.js';
import { WriterAgent } from '../../modules/ai/agents/writer.agent.js';

export class GenerateDraftPostHandler implements JobHandler {
  async execute(job: Job, { db }: HandlerDeps): Promise<void> {
    const { trendId } = job.data as { trendId: string };

    const [trend] = await db
      .select()
      .from(trends)
      .where(eq(trends.id, trendId));
    if (!trend) throw new Error(`Trend not found: ${trendId}`);

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, trend.projectId));
    if (!project) throw new Error(`Project not found: ${trend.projectId}`);

    console.log('✍️ Writing draft post for trend:', trend.title);

    const agent = new WriterAgent();
    const result = await agent.execute({
      title: trend.title,
      description: trend.description ?? '',
      keywords: (trend.keywords as string[]) ?? [],
      toneOfVoice: project.toneOfVoice ?? 'neutro',
    });

    await db.insert(posts).values({
      trendId,
      stage: 'draft',
      content: result.content,
      version: 1,
    });

    console.log(`📝 Draft post salvo para trend: ${trend.title}`);
  }
}
