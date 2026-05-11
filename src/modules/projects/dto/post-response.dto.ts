import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() trendId: string;
  @ApiProperty() version: number;
  @ApiProperty({ enum: ['draft', 'edited', 'seo'] }) stage:
    | 'draft'
    | 'edited'
    | 'seo';
  @ApiProperty() content: string;
  @ApiProperty() createdAt: Date;
}
