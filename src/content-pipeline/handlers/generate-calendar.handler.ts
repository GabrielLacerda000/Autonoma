import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../queue/queue.constants.js';
import { JobHandler, HandlerDeps } from './handler.interface.js';

const MAX_POSTS_PER_PIPELINE = 3;

export class GenerateCalendarHandler implements JobHandler {
  async execute(_job: Job, { flowProducer }: HandlerDeps): Promise<void> {
    console.log('📅 Generating calendar...');

    // futuramente: resultado do ContentStrategistAgent
    const calendarItems = [
      { id: 1, topic: 'Post sobre IA' },
      { id: 2, topic: 'Post sobre produtividade' },
      { id: 3, topic: 'Post sobre SaaS' },
    ].slice(0, MAX_POSTS_PER_PIPELINE);

    console.log(`🧠 Calendar created with ${calendarItems.length} posts`);

    for (const item of calendarItems) {
      await flowProducer.add({
        name: `post_pipeline_${item.id}`,
        queueName: QUEUE_NAMES.CONTENT_PIPELINE,
        data: { calendarItemId: item.id },
        children: [
          {
            name: 'generate_draft_post',
            data: item,
            queueName: QUEUE_NAMES.CONTENT_PIPELINE,
            children: [
              {
                name: 'edit_post',
                data: item,
                queueName: QUEUE_NAMES.CONTENT_PIPELINE,
                children: [
                  {
                    name: 'optimize_post_seo',
                    data: item,
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
