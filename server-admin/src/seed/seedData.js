import Product from '../Products/product.model.js';

const REAL_PRODUCTS = [
  {
    name: 'Desayuno Chapín',
    category: 'desayunos',
    description: 'Huevos al gusto, frijoles volteados, plátanos fritos, queso fresco y crema.',
    price: 28.0,
    photo: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: true,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Pancakes con Miel & Frutas',
    category: 'desayunos',
    description: '3 esponjosos pancakes servidos con miel de maple, mantequilla y rodajas de fresa.',
    price: 22.5,
    photo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Muffin de Huevo & Tocino',
    category: 'desayunos',
    description: 'Pan muffin tierno con huevo frito, queso americano derretido y tocino crujiente.',
    price: 18.0,
    photo: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Hamburguesa Kinal Supreme',
    category: 'almuerzos',
    description: 'Carne 100% de res, doble queso cheddar, tocino, lechuga, tomate y salsa especial.',
    price: 35.5,
    photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: true,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Torta de Milanesa de Pollo',
    category: 'almuerzos',
    description: 'Pan artesanal crujiente con milanesa empanizada, frijoles, queso y aguacate.',
    price: 26.0,
    photo: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: true,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Burrito de Carne Asada',
    category: 'almuerzos',
    description: 'Tortilla gigante de harina cargada de carne asada, arroz, frijolitos y guacamole.',
    price: 30.0,
    photo: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Licuado de Fresa (16 oz)',
    category: 'bebidas',
    description: 'Licuado natural preparado con leche fresca y fresas naturales de temporada.',
    price: 12.0,
    photo: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Horchata Artesanal Fría',
    category: 'bebidas',
    description: 'Bebida tradicional de arroz con canela y almendras, bien helada en vaso de 16 oz.',
    price: 10.0,
    photo: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Gaseosa Fría 500ml',
    category: 'bebidas',
    description: 'Botella helada de Coca-Cola, Sprite, Fanta o Mirinda.',
    price: 8.0,
    photo: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Nachos con Queso & Jalapeño',
    category: 'snacks',
    description: 'Chips de maíz crujientes cubiertos con queso cheddar derretido y rodajas de jalapeño.',
    price: 16.0,
    photo: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Papas Fritas Sazonadas',
    category: 'snacks',
    description: 'Porción abundante de papas estilo bastón doraditas con sazón especial de la casa.',
    price: 14.0,
    photo: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
  {
    name: 'Empanada Horneada de Carne',
    category: 'snacks',
    description: 'Empanada hojaldrada rellena de carne molida sazonada con especias tradicionales.',
    price: 9.0,
    photo: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    allowAccompaniments: false,
    isActive: true,
    isDeleted: false,
  },
];

export const seedProducts = async () => {
  try {
    const existing = await Product.find({ isDeleted: false });
    // If fewer than 5 products or containing flower image placeholders, refresh seed
    const hasSampleFlower = existing.some((p) => p.photo && p.photo.includes('sample.jpg'));
    if (existing.length < 5 || hasSampleFlower) {
      console.log('🌱 Seeding real cafeteria products into MongoDB...');
      await Product.deleteMany({
        $or: [{ photo: { $regex: 'sample.jpg' } }, { isDeleted: false }],
      });
      await Product.insertMany(REAL_PRODUCTS);
      console.log('✅ Real cafeteria products seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};
