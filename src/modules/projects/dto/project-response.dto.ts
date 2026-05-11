import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() niche: string;
  @ApiProperty({ required: false, nullable: true }) targetAudience?:
    | string
    | null;
  @ApiProperty({ required: false, nullable: true }) toneOfVoice?: string | null;
  @ApiProperty() createdAt: Date;
}
