import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createRatingDto: CreateRatingDto) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: createRatingDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createRatingDto.productId} not found`,
      );
    }

    // Check if user has purchased the product
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: createRatingDto.productId,
        order: {
          userId: userId,
        },
      },
    });

    if (!hasPurchased) {
      throw new ForbiddenException(
        `You can only rate products you've purchased`,
      );
    }

    try {
      // Create or update rating
      return await this.prisma.rating.upsert({
        where: {
          userId_productId: {
            userId: userId,
            productId: createRatingDto.productId,
          },
        },
        update: {
          stars: createRatingDto.stars,
          comment: createRatingDto.comment,
        },
        create: {
          stars: createRatingDto.stars,
          comment: createRatingDto.comment,
          userId: userId,
          productId: createRatingDto.productId,
        },
      });
    } catch (error) {
      throw new ConflictException('Unable to create or update rating');
    }
  }

  async findAllForProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return this.prisma.rating.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllProduct() {
    const product = await this.prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getUserRating(userId: number, productId: number) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!rating) {
      throw new NotFoundException(`Rating not found`);
    }

    return rating;
  }

  async remove(userId: number, productId: number) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!rating) {
      throw new NotFoundException(`Rating not found`);
    }

    if (rating.userId !== userId) {
      throw new ForbiddenException(`You can only delete your own ratings`);
    }

    return this.prisma.rating.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async getProductRatingStats(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const ratings = await this.prisma.rating.findMany({
      where: { productId },
      select: { stars: true },
    });

    if (ratings.length === 0) {
      return {
        productId,
        averageRating: 0,
        totalRatings: 0,
        ratingsDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      };
    }

    // Calculate average rating
    const sum = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    const averageRating = sum / ratings.length;

    // Calculate ratings distribution
    const ratingsDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratings.forEach((rating) => {
      ratingsDistribution[rating.stars]++;
    });

    return {
      productId,
      averageRating,
      totalRatings: ratings.length,
      ratingsDistribution,
    };
  }
}
