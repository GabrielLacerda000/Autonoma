import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../queue/queue.constants.js';
import { JobHandler, HandlerDeps } from './handler.interface.js';

const MAX_POSTS_PER_PIPELINE = 3;

export class GenerateTrendsHandler implements JobHandler {
  async execute(_job: Job, { flowProducer }: HandlerDeps): Promise<void> {
    console.log('📈 Generating trends...');

    // futuramente: resultado do TrendResearcherAgent
    const trends = [
      { id: 1, topic: 'Post sobre IA' },
      { id: 2, topic: 'Post sobre produtividade' },
      { id: 3, topic: 'Post sobre SaaS' },
    ].slice(0, MAX_POSTS_PER_PIPELINE);

    console.log(`🧠 Trends geradas: ${trends.length}`);

    for (const trend of trends) {
      await flowProducer.add({
        name: `post_pipeline_${trend.id}`,
        queueName: QUEUE_NAMES.CONTENT_PIPELINE,
        data: { trendId: trend.id },
        children: [
          {
            name: 'generate_draft_post',
            data: trend,
            queueName: QUEUE_NAMES.CONTENT_PIPELINE,
            children: [
              {
                name: 'edit_post',
                data: trend,
                queueName: QUEUE_NAMES.CONTENT_PIPELINE,
                children: [
                  {
                    name: 'optimize_post_seo',
                    data: trend,
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
