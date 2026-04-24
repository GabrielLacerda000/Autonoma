import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  @Get(':id/trends')
  getTrends(@Param('id') id: string) {
    return this.projectsService.findTrends(id);
  }

  @Get(':id/posts')
  getPosts(@Param('id') id: string, @Query('stage') stage?: string) {
    return this.projectsService.findPosts(id, stage);
  }
}
