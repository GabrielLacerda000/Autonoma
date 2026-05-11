import { ApiProperty } from '@nestjs/swagger';

export class TrendResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() projectId: string;
  @ApiProperty() title: string;
  @ApiProperty({ required: false, nullable: true }) description?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
    type: 'array',
    items: { type: 'string' },
  })
  keywords?: string[] | null;
  @ApiProperty({ required: false, nullable: true }) source?: string | null;
  @ApiProperty({ required: false, nullable: true }) score?: number | null;
  @ApiProperty() createdAt: Date;
}
