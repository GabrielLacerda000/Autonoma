import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAMES } from '../../queue/queue.constants';
import { FlowProducer } from 'bullmq';

export function startContentWorker() {
  const connection = new IORedis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
  });

  const flowProducer = new FlowProducer({ connection });

  const worker = new Worker(
    QUEUE_NAMES.CONTENT_PIPELINE,
    async (job) => {
      switch (job.name) {
        case 'generate_trends':
          console.log('📈 Generating trends...');
          await new Promise((r) => setTimeout(r, 2000));
          break;

        case 'generate_calendar': {
          console.log('📅 Generating calendar...');

          // simulando saída do agent
          const calendarItems = [
            { id: 1, topic: 'Post sobre IA' },
            { id: 2, topic: 'Post sobre produtividade' },
            { id: 3, topic: 'Post sobre SaaS' },
          ];

          console.log(`🧠 Calendar created with ${calendarItems.length} posts`);

          // 🔥 aqui nasce o fan-out
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

          break;
        }

        case 'generate_draft_post':
          console.log('✍️ Writing post:', job.data.topic);
          await new Promise((r) => setTimeout(r, 2000));
          break;

        case 'edit_post':
          console.log('📝 Editing post:', job.data.topic);
          await new Promise((r) => setTimeout(r, 1500));
          break;

        case 'optimize_post_seo':
          console.log('🔎 Optimizing SEO:', job.data.topic);
          await new Promise((r) => setTimeout(r, 1000));
          break;
      }
    },
    { connection },
  );

  worker.on('completed', (job) => {
    console.log(`🎉 Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error('❌ Job failed', err);
  });

  return worker;
}
