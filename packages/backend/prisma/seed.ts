import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const consumables = [
  { name: 'Basic Kibble', description: 'Standard pet food. Fills hunger by 30.', price: 10, imageUrl: '/assets/shop/food-basic.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 30 } },
  { name: 'Premium Kibble', description: 'Delicious premium food. Fills hunger by 50.', price: 25, imageUrl: '/assets/shop/food-premium.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 50 } },
  { name: 'Gourmet Feast', description: 'A luxurious feast. Fills hunger by 80 and boosts happiness by 10.', price: 50, imageUrl: '/assets/shop/food-gourmet.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 80 } },
  { name: 'Basic Sponge', description: 'A simple bathing sponge. Cleans by 30.', price: 10, imageUrl: '/assets/shop/sponge-basic.svg', category: 'SPONGE', effect: { stat: 'hygiene', amount: 30 } },
  { name: 'Premium Sponge', description: 'A soft, scented sponge. Cleans by 50.', price: 25, imageUrl: '/assets/shop/sponge-premium.svg', category: 'SPONGE', effect: { stat: 'hygiene', amount: 50 } },
  { name: 'Luxury Sponge', description: 'A fluffy spa-grade sponge. Cleans by 80 and boosts happiness by 5.', price: 50, imageUrl: '/assets/shop/sponge-luxury.svg', category: 'SPONGE', effect: { stat: 'hygiene', amount: 80 } },
  { name: 'Toy Ball', description: 'A fun bouncy ball. Boosts happiness by 30.', price: 15, imageUrl: '/assets/shop/toy-ball.svg', category: 'TOY', effect: { stat: 'happiness', amount: 30 } },
  { name: 'Puzzle Toy', description: 'A stimulating puzzle toy. Boosts happiness by 50.', price: 30, imageUrl: '/assets/shop/toy-puzzle.svg', category: 'TOY', effect: { stat: 'happiness', amount: 50 } },
  { name: 'Health Potion', description: 'Restores pet energy by 50.', price: 20, imageUrl: '/assets/shop/potion-health.svg', category: 'MEDICINE', effect: { stat: 'energy', amount: 50 } },
  { name: 'Full Restore', description: 'Completely restores all stats to full.', price: 100, imageUrl: '/assets/shop/potion-full.svg', category: 'MEDICINE', effect: { stat: 'all', amount: 100 } },
];

async function main() {
  for (const item of consumables) {
    const existing = await prisma.consumable.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.consumable.create({ data: { id: uuidv4(), ...item } });
    }
  }
  console.log(`Seeded ${consumables.length} consumables`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
