import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingsService } from './ratings/ratings.service';
import { RatingsController } from './ratings/ratings.controller';
import { RatingsModule } from './ratings/ratings.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [RatingsModule, PrismaModule, ProductsModule],
  controllers: [AppController, RatingsController],
  providers: [AppService, RatingsService, PrismaService],
})
export class AppModule {}
