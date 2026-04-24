import { Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { projects, trends, posts, stageEnum } from '../../db/schema.js';
import { CreateProjectDto } from './dto/create-project.dto.js';

@Injectable()
export class ProjectsService {
  async create(dto: CreateProjectDto) {
    const [project] = await db
      .insert(projects)
      .values({
        name: dto.name,
        niche: dto.niche,
        targetAudience: dto.targetAudience,
        toneOfVoice: dto.toneOfVoice,
      })
      .returning();
    return project;
  }

  async findById(id: string) {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project ?? null;
  }

  async findTrends(projectId: string) {
    return db.select().from(trends).where(eq(trends.projectId, projectId));
  }

  async findPosts(projectId: string, stage?: string) {
    const projectTrends = await db
      .select()
      .from(trends)
      .where(eq(trends.projectId, projectId));

    if (projectTrends.length === 0) return [];

    const trendIds = projectTrends.map((t) => t.id);

    const stageFilter = stage
      ? eq(posts.stage, stage as (typeof stageEnum.enumValues)[number])
      : undefined;

    return db
      .select()
      .from(posts)
      .where(and(inArray(posts.trendId, trendIds), stageFilter));
  }
}
