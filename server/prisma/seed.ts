import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const USER_COUNT = 12;
const PRODUCT_COUNT = 7;
const ORDER_COUNT = 25;
const RATING_PROBABILITY = 0.8;

async function main() {
  console.log(' Starting to seed database...');

  await prisma.rating.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleaned existing data');

  const users: Array<{ id: number; name: string; email: string }> = [];
  console.log(`Creating ${USER_COUNT} users...`);

  for (let i = 0; i < USER_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    });
    users.push(user);
  }

  console.log(`Created ${users.length} users`);

  const products: Array<{ id: number; name: string; price: number }> = [];
  console.log(`Creating ${PRODUCT_COUNT} products...`);

  const productCategories = [
    'Mattress',
    'Pillow',
    'Bedding',
    'Bed Frame',
    'Nightstand',
    'Lamp',
  ];
  const productModifiers = [
    'Luxury',
    'Comfort',
    'Deluxe',
    'Premium',
    'Classic',
    'Modern',
    'Ergonomic',
  ];

  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const category = faker.helpers.arrayElement(productCategories);
    const modifier = faker.helpers.arrayElement(productModifiers);

    const product = await prisma.product.create({
      data: {
        name: `${modifier} ${category} ${faker.string.uuid().substring(0, 4)}`,
        price: parseFloat(faker.commerce.price({ min: 99, max: 999 })),
      },
    });
    products.push(product);
  }

  console.log(`Created ${products.length} products`);

  console.log(`Creating ${ORDER_COUNT} orders with items...`);

  const orders: Array<{ id: number; userId: number; createdAt: Date }> = [];
  const orderItems: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
  }> = [];
  const productsPurchasedByUser = new Map<number, Set<number>>();

  for (let i = 0; i < ORDER_COUNT; i++) {
    const user = faker.helpers.arrayElement(users);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        createdAt: faker.date.past({ years: 1 }),
      },
    });
    orders.push(order);

    const numItems = faker.number.int({ min: 1, max: 3 });

    const productsInThisOrder = new Set<number>();

    for (let j = 0; j < numItems; j++) {
      let product = faker.helpers.arrayElement(products);

      while (productsInThisOrder.has(product.id)) {
        product = faker.helpers.arrayElement(products);
      }
      productsInThisOrder.add(product.id);

      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 2 }),
        },
      });
      orderItems.push(orderItem);

      if (!productsPurchasedByUser.has(user.id)) {
        productsPurchasedByUser.set(user.id, new Set<number>());
      }
      const userPurchases = productsPurchasedByUser.get(user.id);
      if (userPurchases) {
        userPurchases.add(product.id);
      }
    }
  }

  console.log(
    ` Created ${orders.length} orders with ${orderItems.length} items`,
  );

  console.log('Creating ratings for purchased products...');

  const ratings: Array<{
    id: number;
    userId: number;
    productId: number;
    stars: number;
    comment: string | null;
    createdAt: Date;
  }> = [];
  const ratingComments = [
    'Very comfortable and well-made, exceeded my expectations!',
    'Great value for money. Would recommend to friends and family.',
    'The quality is excellent, and it arrived quickly.',
    'Perfect fit for my needs. So happy with this purchase!',
    'Not as thick as I expected, but still comfortable.',
    'Comfortable but could be better. The material seems durable though.',
    'Good quality but took longer than expected to arrive.',
    "Very pleased with this purchase! It's exactly what I wanted.",
    'Decent quality for the price, but not exceptional.',
    "Excellent product. I've already ordered another one!",
    'The design is beautiful, and the quality is top-notch.',
    'Disappointed with the quality. Not worth the price.',
    'Good enough for everyday use, but nothing special.',
    'Perfect! Just what I was looking for.',
    'Quality is better than expected for the price point.',
    "Fantastic product! I'm very satisfied with my purchase.",
    "It's good, but I've seen better for the same price.",
    'Love it! The comfort level is amazing.',
    'Sturdy construction and attractive design. Very pleased!',
    "Adequate but doesn't stand out compared to similar products.",
  ];

  for (const [userId, productIds] of productsPurchasedByUser.entries()) {
    for (const productId of productIds) {
      if (Math.random() < RATING_PROBABILITY) {
        const starDistribution = [1, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5];
        const stars = faker.helpers.arrayElement(starDistribution);

        let commentPool: string[];
        if (stars >= 4) {
          commentPool = ratingComments.filter((_, index) => index % 2 === 0);
        } else if (stars === 3) {
          commentPool = ratingComments.filter((_, index) => index % 3 === 1);
        } else {
          commentPool = ratingComments.filter((_, index) => index % 5 === 4);
        }

        const comment = faker.helpers.arrayElement(commentPool);

        const rating = await prisma.rating.create({
          data: {
            userId: userId,
            productId: productId,
            stars,
            comment,
            createdAt: faker.date.recent({ days: 60 }),
          },
        });
        ratings.push(rating);
      }
    }
  }

  console.log(` Created ${ratings.length} ratings`);
  console.log(' Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
