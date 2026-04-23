import { Controller, Post, Param } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';

@Controller('pipeline')
export class PipelineController {
  constructor(private queue: QueueService) {}

  @Post(':projectId')
  async run(@Param('projectId') projectId: string) {
    await this.queue.addContentJob('generate_content_for_project', {
      projectId,
    });

    return { message: 'Pipeline started 🚀' };
  }
}
