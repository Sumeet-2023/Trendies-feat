import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'The ID of the user creating the rating',
    example: 42,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'The ID of the product being rated',
    example: 1,
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    description: 'Rating value from 1 to 5 stars',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @ApiProperty({
    description: 'Optional comment about the product',
    example: 'Great product, exactly as described!',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
