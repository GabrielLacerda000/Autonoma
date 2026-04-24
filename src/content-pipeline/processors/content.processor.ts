import { Worker, FlowProducer } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAMES } from '../../queue/queue.constants.js';
import { dispatch } from '../handlers/handler.registry.js';
import { db } from '../../db/client.js';

export function startContentWorker() {
  const connection = new IORedis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
  });

  const flowProducer = new FlowProducer({ connection });
  const deps = { flowProducer, db };

  const worker = new Worker(
    QUEUE_NAMES.CONTENT_PIPELINE,
    async (job) => dispatch(job, deps),
    { connection },
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (_, err) => {
    console.error('❌ Job failed', err);
  });

  return worker;
}
