import { Global, Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Global()
@Module({
  providers: [QueueService],
  controllers: [QueueController],
  exports: [QueueService],
})
export class QueueModule {}
