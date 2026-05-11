import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Emitfy' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'SaaS financeiro para freelancers' })
  @IsString()
  niche: string;

  @ApiProperty({ example: 'freelancers iniciantes', required: false })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiProperty({ example: 'simples e educativo', required: false })
  @IsOptional()
  @IsString()
  toneOfVoice?: string;
}
