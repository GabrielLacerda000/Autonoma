import { Job } from 'bullmq';
import { and, eq } from 'drizzle-orm';
import { JobHandler, HandlerDeps } from './handler.interface.js';
import { posts, trends } from '../../db/schema.js';
import { SeoOptimizerAgent } from '../../modules/ai/agents/seo-optimizer.agent.js';

export class OptimizePostSeoHandler implements JobHandler {
  async execute(job: Job, { db }: HandlerDeps): Promise<void> {
    const { trendId } = job.data as { trendId: string };

    const [editedPost] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.trendId, trendId), eq(posts.stage, 'edited')));
    if (!editedPost)
      throw new Error(`Edited post not found for trendId: ${trendId}`);

    const [trend] = await db
      .select()
      .from(trends)
      .where(eq(trends.id, trendId));
    if (!trend) throw new Error(`Trend not found: ${trendId}`);

    console.log('🔎 Optimizing SEO for trend:', trend.title);

    const agent = new SeoOptimizerAgent();
    const result = await agent.execute({
      content: editedPost.content,
      title: trend.title,
      keywords: (trend.keywords as string[]) ?? [],
    });

    await db.insert(posts).values({
      trendId,
      stage: 'seo',
      content: result.content,
      version: editedPost.version + 1,
    });

    console.log(`✅ Post SEO salvo para trend: ${trend.title}`);
  }
}
