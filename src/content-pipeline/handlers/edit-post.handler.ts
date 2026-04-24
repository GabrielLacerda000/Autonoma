import { Job } from 'bullmq';
import { and, eq } from 'drizzle-orm';
import { JobHandler, HandlerDeps } from './handler.interface.js';
import { posts, trends, projects } from '../../db/schema.js';
import { EditorAgent } from '../../modules/ai/agents/editor.agent.js';

export class EditPostHandler implements JobHandler {
  async execute(job: Job, { db }: HandlerDeps): Promise<void> {
    const { trendId } = job.data as { trendId: string };

    const [draftPost] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.trendId, trendId), eq(posts.stage, 'draft')));
    if (!draftPost)
      throw new Error(`Draft post not found for trendId: ${trendId}`);

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

    console.log('✏️ Editing draft post for trend:', trend.title);

    const agent = new EditorAgent();
    const result = await agent.execute({
      content: draftPost.content,
      title: trend.title,
      keywords: (trend.keywords as string[]) ?? [],
      toneOfVoice: project.toneOfVoice ?? 'neutro',
    });

    await db.insert(posts).values({
      trendId,
      stage: 'edited',
      content: result.content,
      version: draftPost.version + 1,
    });

    console.log(`✅ Post editado salvo para trend: ${trend.title}`);
  }
}
