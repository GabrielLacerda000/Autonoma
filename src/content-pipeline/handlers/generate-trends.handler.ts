import { Job } from 'bullmq';
import { eq } from 'drizzle-orm';
import { QUEUE_NAMES } from '../../queue/queue.constants.js';
import { JobHandler, HandlerDeps } from './handler.interface.js';
import { projects, trends } from '../../db/schema.js';
import { TrendResearcherAgent } from '../../modules/ai/agents/trend-researcher.agent.js';

const MAX_POSTS_PER_PIPELINE = 3;

export class GenerateTrendsHandler implements JobHandler {
  async execute(job: Job, { flowProducer, db }: HandlerDeps): Promise<void> {
    console.log('📈 Generating trends...');

    const { projectId } = job.data as { projectId: string };

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const agent = new TrendResearcherAgent();
    const trendResults = await agent.execute({
      niche: project.niche,
      targetAudience: project.targetAudience ?? '',
    });

    const savedTrends = await db
      .insert(trends)
      .values(
        trendResults.map((t) => ({
          projectId,
          title: t.title,
          description: t.description,
          keywords: t.keywords,
          source: 'gemini',
          score: t.score,
        })),
      )
      .returning();

    console.log(`🧠 Trends geradas: ${savedTrends.length}`);

    for (const trend of savedTrends.slice(0, MAX_POSTS_PER_PIPELINE)) {
      await flowProducer.add({
        name: `post_pipeline_${trend.id}`,
        queueName: QUEUE_NAMES.CONTENT_PIPELINE,
        data: { trendId: trend.id },
        children: [
          {
            name: 'generate_draft_post',
            data: { trendId: trend.id, title: trend.title },
            queueName: QUEUE_NAMES.CONTENT_PIPELINE,
            children: [
              {
                name: 'edit_post',
                data: { trendId: trend.id },
                queueName: QUEUE_NAMES.CONTENT_PIPELINE,
                children: [
                  {
                    name: 'optimize_post_seo',
                    data: { trendId: trend.id },
                    queueName: QUEUE_NAMES.CONTENT_PIPELINE,
                  },
                ],
              },
            ],
          },
        ],
      });
    }
  }
}
