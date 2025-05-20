import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'The user' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get(':userId/products/:productId/purchased')
  @ApiOperation({ summary: 'Check if a user has purchased a specific product' })
  @ApiResponse({
    status: 200,
    description: 'Boolean indicating if the user has purchased the product',
  })
  async hasPurchasedProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const hasPurchased = await this.userService.hasPurchasedProduct(
      userId,
      productId,
    );
    return { hasPurchased };
  }
}
