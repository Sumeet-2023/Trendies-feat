import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post('user/:userId/product/:productId')
  @ApiOperation({ summary: 'Create a new product rating with URL parameters' })
  @ApiResponse({
    status: 201,
    description: 'The rating has been successfully created.',
  })
  createWithParams(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    createRatingDto.productId = productId;
    return this.ratingsService.create(userId, createRatingDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all ratings for a product' })
  @ApiResponse({ status: 200, description: 'List of product ratings' })
  findAllForProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.ratingsService.findAllForProduct(productId);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  findAllProduct() {
    return this.ratingsService.findAllProduct();
  }

  @Get('product/:productId/stats')
  @ApiOperation({ summary: 'Get rating statistics for a product' })
  @ApiResponse({ status: 200, description: 'Product rating statistics' })
  getProductRatingStats(@Param('productId', ParseIntPipe) productId: number) {
    return this.ratingsService.getProductRatingStats(productId);
  }

  @Get('user/:userId/product/:productId')
  @ApiOperation({ summary: "Get a user's rating for a product" })
  @ApiResponse({ status: 200, description: "The user's rating" })
  getUserRating(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.ratingsService.getUserRating(userId, productId);
  }

  @Delete('user/:userId/product/:productId')
  @ApiOperation({ summary: "Delete a user's rating for a product" })
  @ApiResponse({
    status: 200,
    description: 'The rating has been successfully deleted',
  })
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.ratingsService.remove(userId, productId);
  }
}
