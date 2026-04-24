import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAMES } from './queue.constants';
import { FlowProducer } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private connection: IORedis;
  public contentQueue: Queue;
  public flowProducer: FlowProducer;

  constructor() {
    this.connection = new IORedis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });

    this.contentQueue = new Queue(QUEUE_NAMES.CONTENT_PIPELINE, {
      connection: this.connection,
    });

    this.flowProducer = new FlowProducer({
      connection: this.connection,
    });
  }

  async addContentJob(name: string, data: any) {
    return this.contentQueue.add(name, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: true,
    });
  }

  async startContentPipeline(projectId: string) {
    await this.flowProducer.add({
      name: 'generate_content_for_project',
      queueName: QUEUE_NAMES.CONTENT_PIPELINE,
      data: { projectId },

      children: [
        {
          name: 'generate_trends',
          data: { projectId },
          queueName: QUEUE_NAMES.CONTENT_PIPELINE,
        },
      ],
    });
  }

  async onModuleDestroy() {
    await this.connection.quit();
  }
}
