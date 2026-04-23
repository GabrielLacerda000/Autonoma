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
      console.log('🚀 Processing job:', job.name);
      console.log('Payload:', job.data);

      if (job.name === 'generate_content_for_project') {
        await new Promise((r) => setTimeout(r, 3000));
        console.log('✅ Pipeline step finished');
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
