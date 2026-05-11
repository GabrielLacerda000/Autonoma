import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { ProjectResponseDto } from './dto/project-response.dto.js';
import { TrendResponseDto } from './dto/trend-response.dto.js';
import { PostResponseDto } from './dto/post-response.dto.js';
import { ProjectsService } from './projects.service.js';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, type: ProjectResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  @Get(':id/trends')
  @ApiOperation({ summary: 'Get all trends for a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, type: [TrendResponseDto] })
  getTrends(@Param('id') id: string) {
    return this.projectsService.findTrends(id);
  }

  @Get(':id/posts')
  @ApiOperation({ summary: 'Get all posts for a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiQuery({
    name: 'stage',
    required: false,
    enum: ['draft', 'edited', 'seo'],
  })
  @ApiResponse({ status: 200, type: [PostResponseDto] })
  getPosts(@Param('id') id: string, @Query('stage') stage?: string) {
    return this.projectsService.findPosts(id, stage);
  }
}
