import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Market from './models/Market.js';
import Crop from './models/Crop.js';
import Price from './models/Price.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Market.deleteMany({});
    await Crop.deleteMany({});
    await Price.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);

    // Create markets for Telangana
    console.log('Creating markets...');
    const markets = await Market.create([
      {
        name: 'Secunderabad Market',
        state: 'Telangana',
        district: 'Hyderabad',
        mandal: 'Secunderabad',
      },
      {
        name: 'Warangal Market',
        state: 'Telangana',
        district: 'Warangal',
        mandal: 'Warangal City',
      },
      {
        name: 'Karimnagar Market',
        state: 'Telangana',
        district: 'Karimnagar',
        mandal: 'Karimnagar',
      },
      {
        name: 'Khammam Market',
        state: 'Telangana',
        district: 'Khammam',
        mandal: 'Khammam',
      },
      {
        name: 'Nizamabad Market',
        state: 'Telangana',
        district: 'Nizamabad',
        mandal: 'Nizamabad',
      },
    ]);
    console.log(`Created ${markets.length} markets`);

    // Create crops
    console.log('Creating crops...');
    const crops = await Crop.create([
      { name: 'Rice', category: 'Cereals', unit: 'kg' },
      { name: 'Wheat', category: 'Cereals', unit: 'kg' },
      { name: 'Maize', category: 'Cereals', unit: 'kg' },
      { name: 'Cotton', category: 'Oilseeds', unit: 'kg' },
      { name: 'Groundnut', category: 'Oilseeds', unit: 'kg' },
      { name: 'Sunflower', category: 'Oilseeds', unit: 'kg' },
      { name: 'Turmeric', category: 'Spices', unit: 'kg' },
      { name: 'Red Chilli', category: 'Spices', unit: 'kg' },
      { name: 'Black Pepper', category: 'Spices', unit: 'kg' },
      { name: 'Coriander', category: 'Spices', unit: 'kg' },
      { name: 'Onion', category: 'Vegetables', unit: 'kg' },
      { name: 'Tomato', category: 'Vegetables', unit: 'kg' },
      { name: 'Potato', category: 'Vegetables', unit: 'kg' },
      { name: 'Cabbage', category: 'Vegetables', unit: 'kg' },
      { name: 'Mango', category: 'Fruits', unit: 'kg' },
      { name: 'Banana', category: 'Fruits', unit: 'kg' },
      { name: 'Citrus', category: 'Fruits', unit: 'kg' },
      { name: 'Guava', category: 'Fruits', unit: 'kg' },
      { name: 'Chickpea', category: 'Pulses', unit: 'kg' },
      { name: 'Pigeon Pea', category: 'Pulses', unit: 'kg' },
    ]);
    console.log(`Created ${crops.length} crops`);

    // Create sample prices for last 30 days
    console.log('Creating price entries...');
    const prices = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      for (const market of markets) {
        for (const crop of crops) {
          // Generate realistic prices based on crop type
          let basePrice = 100;
          if (crop.category === 'Cereals') basePrice = 2000 + Math.random() * 500;
          else if (crop.category === 'Spices') basePrice = 5000 + Math.random() * 2000;
          else if (crop.category === 'Vegetables') basePrice = 30 + Math.random() * 20;
          else if (crop.category === 'Fruits') basePrice = 50 + Math.random() * 30;
          else if (crop.category === 'Pulses') basePrice = 4000 + Math.random() * 1000;
          else if (crop.category === 'Oilseeds') basePrice = 5000 + Math.random() * 1500;

          let price = basePrice + (Math.random() - 0.5) * 200;

         // Ensure price never goes below 1
         price = Math.max(price, 1);



          prices.push({
            marketId: market._id,
            cropId: crop._id,
            date,
            price: Math.round(price * 100) / 100,
          });
        }
      }
    }

    await Price.create(prices);
    console.log(`Created ${prices.length} price entries`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\n🚀 You can now start the application!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
