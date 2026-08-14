import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const products = [
  {
    title: 'Nike Addapt BB 2.0',
    text: 'MEN Running Shoes',
    description: 'The Nike Adapt BB 2.0 brings a revolutionary self-lacing system with FitAdapt technology. Powered by a custom motor, it adjusts to your foot throughout the game for a locked-in, comfortable fit.',
    price: 200,
    rating: '4.9',
    img: '/assets/nike-adapt-bb.png',
    color: 'from-blue-600 to-blue-500',
    shadow: 'shadow-lg shadow-blue-500',
    category: 'basketball',
    isPopular: true,
    isFeatured: true,
    sizes: [7, 8, 9, 10, 11, 12],
    stock: 45,
  },
  {
    title: 'Nike Martine Rose',
    text: 'MEN Running Shoes',
    description: 'A bold collaboration between Nike and Martine Rose, this shoe blends streetwear aesthetics with performance technology. Features a striking red colorway with premium materials.',
    price: 200,
    rating: '4.5',
    img: '/assets/nike-air-red.png',
    color: 'from-red-500 to-rose-500',
    shadow: 'shadow-lg shadow-rose-500',
    category: 'lifestyle',
    isPopular: true,
    isFeatured: false,
    sizes: [7, 8, 9, 10, 11],
    stock: 38,
  },
  {
    title: 'Nike Smart Shoe 2.0',
    text: 'MEN Running Shoes',
    description: 'Next-generation smart footwear with integrated sensors that track your performance metrics. Auto-lacing system with app connectivity for personalized fit adjustments.',
    price: 200,
    rating: '5+',
    img: '/assets/nike-adapt-bb-smart.png',
    color: 'from-violet-500 to-indigo-500',
    shadow: 'shadow-lg shadow-violet-500',
    category: 'running',
    isPopular: true,
    isFeatured: true,
    sizes: [8, 9, 10, 11, 12],
    stock: 30,
  },
  {
    title: 'Nike Air Low Premium',
    text: 'MEN Running Shoes',
    description: 'Premium leather construction meets Air cushioning technology. This low-top silhouette offers everyday comfort with a sleek, minimalist design perfect for any occasion.',
    price: 150,
    rating: '5+',
    img: '/assets/product7.png',
    color: 'from-sky-600 to-indigo-600',
    shadow: 'shadow-lg shadow-blue-500',
    category: 'lifestyle',
    isFeatured: true,
    sizes: [7, 8, 9, 10, 11, 12],
    stock: 60,
  },
  {
    title: 'Nike Air Force Green',
    text: 'MEN Running Shoes',
    description: 'A fresh take on the iconic Air Force silhouette in a vibrant green colorway. Features durable leather upper and classic Air sole unit for all-day comfort.',
    price: 150,
    rating: '5+',
    img: '/assets/product2.png',
    color: 'from-green-500 to-emerald-500',
    shadow: 'shadow-lg shadow-green-500',
    category: 'lifestyle',
    isFeatured: true,
    sizes: [7, 8, 9, 10, 11, 12],
    stock: 55,
  },
  {
    title: 'Nike Addapt BB Rose',
    text: 'MEN Running Shoes',
    description: 'The rose edition of the Adapt BB brings elegance to the court. Self-lacing technology with premium materials in a stunning rose colorway.',
    price: 150,
    rating: '5+',
    img: '/assets/product3.png',
    color: 'from-red-500 to-rose-500',
    shadow: 'shadow-lg shadow-rose-500',
    category: 'basketball',
    isFeatured: true,
    sizes: [8, 9, 10, 11, 12],
    stock: 42,
  },
  {
    title: 'Nike Air Premium',
    text: 'MEN Running Shoes',
    description: 'Crafted with premium materials and featuring responsive Air cushioning, this shoe delivers superior comfort and style for the discerning sneaker enthusiast.',
    price: 150,
    rating: '5+',
    img: '/assets/product4.png',
    color: 'from-orange-500 to-amber-500',
    shadow: 'shadow-lg shadow-orange-500',
    category: 'running',
    isFeatured: true,
    sizes: [7, 8, 9, 10, 11],
    stock: 48,
  },
  {
    title: 'Nike Adapt BB Pro',
    text: 'MEN Running Shoes',
    description: 'Professional-grade basketball shoe with advanced FitAdapt technology. Designed for elite performance with enhanced traction and responsive cushioning.',
    price: 150,
    rating: '5+',
    img: '/assets/product5.png',
    color: 'from-gray-900 to-yellow-500',
    shadow: 'shadow-lg shadow-yellow-500',
    category: 'basketball',
    isFeatured: true,
    sizes: [8, 9, 10, 11, 12, 13],
    stock: 35,
  },
  {
    title: 'Air Jordan PR3',
    text: 'MEN Running Shoes',
    description: 'The Air Jordan PR3 continues the legendary Jordan lineage with modern performance features. Encapsulated Air-Sole unit and herringbone traction pattern.',
    price: 150,
    rating: '5+',
    img: '/assets/product6.png',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-lg shadow-cyan-500',
    category: 'basketball',
    isFeatured: true,
    sizes: [7, 8, 9, 10, 11, 12],
    stock: 50,
  },
  {
    title: 'Nike Multi Smart Shoe',
    text: 'MEN Running Shoes',
    description: 'Versatile smart shoe that adapts to multiple activities. Features dynamic support system and integrated performance tracking for running, training, and everyday wear.',
    price: 150,
    rating: '5+',
    img: '/assets/product1.png',
    color: 'from-yellow-500 to-yellow-500',
    shadow: 'shadow-lg shadow-yellow-500',
    category: 'training',
    isFeatured: true,
    sizes: [7, 8, 9, 10, 11],
    stock: 40,
  },
  {
    title: 'Nike Jordan Air Max',
    text: 'MEN Running Shoes',
    description: 'A fusion of Jordan heritage and Air Max innovation. This hybrid delivers maximum cushioning with iconic Jordan styling in a premium brown leather construction.',
    price: 150,
    rating: '5+',
    img: '/assets/product9.png',
    color: 'from-[#936550] to-orange-900',
    shadow: 'shadow-lg shadow-orange-800',
    category: 'lifestyle',
    isFeatured: true,
    sizes: [8, 9, 10, 11, 12],
    stock: 33,
  },
  {
    title: 'Nike Old Max-x',
    text: 'MEN Running Shoes',
    description: 'A retro-inspired design that pays homage to classic Nike Air Max heritage. Features visible Air cushioning and vintage styling updated with modern comfort technology.',
    price: 150,
    rating: '5+',
    img: '/assets/product10.png',
    color: 'from-indigo-700 to-indigo-700',
    shadow: 'shadow-lg shadow-indigo-500',
    category: 'lifestyle',
    isFeatured: true,
    sizes: [7, 8, 9, 10, 11, 12],
    stock: 52,
  },
  {
    title: 'Nike Lime Jordan 11',
    text: 'MEN Running Shoes',
    description: 'The Jordan 11 reimagined in an electrifying lime colorway. Patent leather mudguard and full-length Air-Sole unit deliver both style and performance.',
    price: 150,
    rating: '5+',
    img: '/assets/product12.png',
    color: 'from-green-600 to-lime-500',
    shadow: 'shadow-lg shadow-lime-500',
    category: 'basketball',
    isFeatured: false,
    sizes: [8, 9, 10, 11, 12],
    stock: 28,
  },
  {
    title: 'Nike Air Black Max',
    text: 'MEN Running Shoes',
    description: 'Stealth meets style in this all-black Air Max edition. Premium materials and blacked-out design make this the perfect shoe for those who prefer understated luxury.',
    price: 150,
    rating: '5+',
    img: '/assets/product11.png',
    color: 'from-slate-900 to-black',
    shadow: 'shadow-lg shadow-black',
    category: 'lifestyle',
    isFeatured: false,
    sizes: [7, 8, 9, 10, 11, 12, 13],
    stock: 65,
  },
  {
    title: 'Nike Zoom Max',
    text: 'MEN Running Shoes',
    description: 'Engineered for speed with Nike Zoom Air technology. Lightweight construction with responsive cushioning designed for runners seeking their personal best.',
    price: 150,
    rating: '5+',
    img: '/assets/product8.png',
    color: 'from-blue-900 to-blue-500',
    shadow: 'shadow-lg shadow-blue-500',
    category: 'running',
    isFeatured: false,
    sizes: [7, 8, 9, 10, 11, 12],
    stock: 58,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@nike.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@nike.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('👤 Admin user created (admin@nike.com / admin123)');
    }

    // Create demo user if doesn't exist
    const demoExists = await User.findOne({ email: 'demo@nike.com' });
    if (!demoExists) {
      await User.create({
        name: 'Demo User',
        email: 'demo@nike.com',
        password: 'demo123',
        role: 'user',
      });
      console.log('👤 Demo user created (demo@nike.com / demo123)');
    }

    // Insert products
    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded successfully!`);

    console.log('\n🎉 Database seeding complete!');
    console.log('---');
    console.log('Admin Login: admin@nike.com / admin123');
    console.log('Demo Login:  demo@nike.com / demo123');
    console.log('---');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDB();
