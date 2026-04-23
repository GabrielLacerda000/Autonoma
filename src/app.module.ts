import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue/queue.module';
import { ContentPipelineModule } from './content-pipeline/content-pipeline.module';

@Module({
  imports: [QueueModule, ContentPipelineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
