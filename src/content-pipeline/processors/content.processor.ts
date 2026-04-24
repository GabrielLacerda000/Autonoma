import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAMES } from '../../queue/queue.constants';

export function startContentWorker() {
  const connection = new IORedis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
  });

  const worker = new Worker(
    QUEUE_NAMES.CONTENT_PIPELINE,
    async (job) => {
      switch (job.name) {
        case 'generate_trends':
          console.log('📈 Generating trends...');
          await new Promise((r) => setTimeout(r, 2000));
          break;

        case 'generate_calendar':
          console.log('📅 Generating calendar...');
          await new Promise((r) => setTimeout(r, 2000));
          break;

        case 'generate_content_for_project':
          console.log('🌳 Pipeline root created');
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
