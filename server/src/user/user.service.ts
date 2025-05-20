import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async hasPurchasedProduct(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    // First check if both user and product exist
    const [user, product] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.product.findUnique({ where: { id: productId } }),
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Then check if there is an order item for this user and product
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
        },
      },
    });

    return !!orderItem; // Convert to boolean
  }
}
