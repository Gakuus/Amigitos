import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const consumables = [
  // 🍎 Frutas
  { name: 'Manzana', description: 'Una manzana fresca. Restaura hambre 15.', price: 5, imageUrl: '/assets/shop/apple.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 15 } },
  { name: 'Plátano', description: 'Un plátano dulce. Restaura hambre 20.', price: 7, imageUrl: '/assets/shop/banana.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 20 } },
  { name: 'Fresas', description: 'Fresas jugosas. Restauran hambre 18 y felicidad 5.', price: 8, imageUrl: '/assets/shop/strawberry.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 18 } },

  // 🥩 Comida básica
  { name: 'Croquetas Básicas', description: 'Comida estándar. Restaura hambre 30.', price: 10, imageUrl: '/assets/shop/food-basic.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 30 } },
  { name: 'Croquetas Premium', description: 'Comida premium deliciosa. Restaura hambre 50.', price: 25, imageUrl: '/assets/shop/food-premium.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 50 } },
  { name: 'Croquetas Gourmet', description: 'Comida gourmet. Restaura hambre 80 y felicidad 10.', price: 50, imageUrl: '/assets/shop/food-gourmet.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 80 } },

  // 🥕 Snacks
  { name: 'Galleta Crujiente', description: 'Galleta con forma de hueso. Restaura hambre 12 y felicidad 8.', price: 6, imageUrl: '/assets/shop/cookie.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 12 } },
  { name: 'Palito de Queso', description: 'Snack de queso derretido. Restaura hambre 10 y felicidad 15.', price: 9, imageUrl: '/assets/shop/cheese-stick.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 10 } },
  { name: 'Hueso de Carnaza', description: 'Hueso para roer. Restaura hambre 25 y felicidad 20.', price: 15, imageUrl: '/assets/shop/bone.svg', category: 'FOOD', effect: { stat: 'hunger', amount: 25 } },

  // 🍰 Postres
  { name: 'Pastelito', description: 'Pastelito de vainilla. Restaura felicidad 30.', price: 12, imageUrl: '/assets/shop/cupcake.svg', category: 'FOOD', effect: { stat: 'happiness', amount: 30 } },
  { name: 'Helado', description: 'Helado cremoso de fresa. Restaura felicidad 40.', price: 18, imageUrl: '/assets/shop/ice-cream.svg', category: 'FOOD', effect: { stat: 'happiness', amount: 40 } },
  { name: 'Donut', description: 'Donut glaseado. Restaura felicidad 25 y hambre 10.', price: 10, imageUrl: '/assets/shop/donut.svg', category: 'FOOD', effect: { stat: 'happiness', amount: 25 } },

  // 🧽 Esponjas
  { name: 'Esponja Básica', description: 'Esponja simple. Limpia 30.', price: 10, imageUrl: '/assets/shop/sponge-basic.svg', category: 'SPONGE', effect: { stat: 'hygiene', amount: 30 } },
  { name: 'Esponja Premium', description: 'Esponja suave y aromática. Limpia 50.', price: 25, imageUrl: '/assets/shop/sponge-premium.svg', category: 'SPONGE', effect: { stat: 'hygiene', amount: 50 } },
  { name: 'Esponja de Lujo', description: 'Esponja de spa. Limpia 80 y sube felicidad 5.', price: 50, imageUrl: '/assets/shop/sponge-luxury.svg', category: 'SPONGE', effect: { stat: 'hygiene', amount: 80 } },
  { name: 'Champú Suave', description: 'Champú con aroma a coco. Limpia 40 y sube felicidad 15.', price: 20, imageUrl: '/assets/shop/shampoo.svg', category: 'SPONGE', effect: { stat: 'hygiene', amount: 40 } },

  // 🧸 Juguetes
  { name: 'Pelota Saltarina', description: 'Pelota que rebota. Sube felicidad 30.', price: 15, imageUrl: '/assets/shop/toy-ball.svg', category: 'TOY', effect: { stat: 'happiness', amount: 30 } },
  { name: 'Juguete Rompecabezas', description: 'Juguete interactivo. Sube felicidad 50.', price: 30, imageUrl: '/assets/shop/toy-puzzle.svg', category: 'TOY', effect: { stat: 'happiness', amount: 50 } },
  { name: 'Peluche Suave', description: 'Peluche abrazable. Sube felicidad 35 y energía 10.', price: 22, imageUrl: '/assets/shop/toy-plush.svg', category: 'TOY', effect: { stat: 'happiness', amount: 35 } },
  { name: 'Láser Puntero', description: 'Juguete de caza. Sube felicidad 60 y gasta energía 10.', price: 35, imageUrl: '/assets/shop/toy-laser.svg', category: 'TOY', effect: { stat: 'happiness', amount: 60 } },

  // 💊 Medicina
  { name: 'Poción de Energía', description: 'Restaura energía 50.', price: 20, imageUrl: '/assets/shop/potion-health.svg', category: 'MEDICINE', effect: { stat: 'energy', amount: 50 } },
  { name: 'Poción de Ánimo', description: 'Sube la felicidad al máximo.', price: 30, imageUrl: '/assets/shop/potion-happy.svg', category: 'MEDICINE', effect: { stat: 'happiness', amount: 100 } },
  { name: 'Multivitamínico', description: 'Sube todos los stats 25.', price: 40, imageUrl: '/assets/shop/potion-multi.svg', category: 'MEDICINE', effect: { stat: 'all', amount: 25 } },
  { name: 'Restaurador Total', description: 'Restaura todos los stats al 100%.', price: 100, imageUrl: '/assets/shop/potion-full.svg', category: 'MEDICINE', effect: { stat: 'all', amount: 100 } },
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
