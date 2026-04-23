import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAMES } from './queue.constants';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private connection: IORedis;
  public contentQueue: Queue;

  constructor() {
    this.connection = new IORedis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });

    this.contentQueue = new Queue(QUEUE_NAMES.CONTENT_PIPELINE, {
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

  async onModuleDestroy() {
    await this.connection.quit();
  }
}
