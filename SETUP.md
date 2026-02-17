# CropPrice Tracker - Complete Setup Guide

A full-stack MERN application for tracking agricultural crop prices with real-time data, admin dashboard, and role-based access control.

## Project Structure

```
crop-price-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Market.js
│   │   ├── Crop.js
│   │   └── Price.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── marketController.js
│   │   ├── cropController.js
│   │   └── priceController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── cropRoutes.js
│   │   └── priceRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PriceChart.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageMarkets.jsx
│   │   │   ├── ManageCrops.jsx
│   │   │   └── ManagePrices.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
└── SETUP.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Installation Steps

### 1. Clone or Extract the Project

```bash
cd crop-price-tracker
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
```

**Backend .env Configuration:**

```env
MONGODB_URI=mongodb://localhost:27017/crop-price-tracker
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crop-price-tracker?retryWrites=true&w=majority
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Frontend .env Configuration:**

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Running the Application

### Development Mode

#### Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Terminal 2 - Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Default Admin Credentials

Email: `admin@example.com`
Password: `admin123`

**⚠️ Important:** Change these credentials immediately in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Markets (Admin only for POST/PUT/DELETE)
- `GET /api/markets` - Get all markets
- `GET /api/markets/:id` - Get market by ID
- `POST /api/markets` - Create market
- `PUT /api/markets/:id` - Update market
- `DELETE /api/markets/:id` - Delete market

### Crops (Admin only for POST/PUT/DELETE)
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get crop by ID
- `POST /api/crops` - Create crop
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### Prices (Admin only for POST/PUT/DELETE)
- `GET /api/price/today/:marketId/:cropId` - Get today's price
- `GET /api/price/history/:marketId/:cropId/:days` - Get price history
- `GET /api/price/stats` - Get price statistics
- `POST /api/price` - Create price entry
- `PUT /api/price/:id` - Update price
- `DELETE /api/price/:id` - Delete price

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/user),
  createdAt: Date,
  updatedAt: Date
}
```

### Market
```javascript
{
  name: String,
  state: String,
  district: String,
  mandal: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Crop
```javascript
{
  name: String (unique),
  category: String (Cereals/Pulses/Oilseeds/Spices/Vegetables/Fruits/Other),
  unit: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Price
```javascript
{
  marketId: ObjectId (ref: Market),
  cropId: ObjectId (ref: Crop),
  date: Date,
  price: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Features

### User Features
- ✅ Select market and crop dynamically
- ✅ View today's price
- ✅ View price history (7, 30, 90 days)
- ✅ Interactive price charts
- ✅ Price trend indicators
- ✅ Mobile-responsive design
- ✅ Price statistics (min, max, average)

### Admin Features
- ✅ Secure JWT authentication
- ✅ Admin dashboard with statistics
- ✅ Add/Edit/Delete markets
- ✅ Add/Edit/Delete crops
- ✅ Add/Edit/Delete price entries
- ✅ Role-based access control
- ✅ Responsive admin interface

## Seeding Sample Data

Create a `seed.js` file in the backend:

```javascript
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
    // Clear existing data
    await User.deleteMany({});
    await Market.deleteMany({});
    await Crop.deleteMany({});
    await Price.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create markets
    const markets = await Market.create([
      { name: 'Secunderabad Market', state: 'Telangana', district: 'Hyderabad', mandal: 'Secunderabad' },
      { name: 'Warangal Market', state: 'Telangana', district: 'Warangal', mandal: 'Warangal' },
      { name: 'Karimnagar Market', state: 'Telangana', district: 'Karimnagar', mandal: 'Karimnagar' },
    ]);

    // Create crops
    const crops = await Crop.create([
      { name: 'Rice', category: 'Cereals', unit: 'kg' },
      { name: 'Cotton', category: 'Oilseeds', unit: 'kg' },
      { name: 'Turmeric', category: 'Spices', unit: 'kg' },
      { name: 'Red Chilli', category: 'Spices', unit: 'kg' },
      { name: 'Onion', category: 'Vegetables', unit: 'kg' },
      { name: 'Tomato', category: 'Vegetables', unit: 'kg' },
    ]);

    // Create sample prices
    const prices = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      for (let j = 0; j < markets.length; j++) {
        for (let k = 0; k < crops.length; k++) {
          prices.push({
            marketId: markets[j]._id,
            cropId: crops[k]._id,
            date,
            price: 100 + Math.random() * 50,
          });
        }
      }
    }
    await Price.create(prices);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
```

Run with: `node seed.js`

## Security Best Practices

- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens for authentication
- ✅ Role-based authorization (admin only)
- ✅ Protected routes
- ✅ CORS enabled
- ✅ Helmet middleware for security headers
- ✅ Input validation with express-validator
- ✅ MongoDB indexes for performance
- ✅ Environment variables for sensitive data
- ✅ HTTPS recommended for production

## Performance Optimizations

- ✅ MongoDB indexes on frequently queried fields
- ✅ Pagination support for large datasets
- ✅ Efficient API queries
- ✅ Client-side caching with JWT tokens
- ✅ Responsive UI with lazy loading

## Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
```

Deploy the `dist` folder to Vercel or Netlify

## Troubleshooting

### MongoDB Connection Issues
- Check MongoDB URI in .env
- Ensure MongoDB is running (for local)
- Verify network access (for Atlas)

### CORS Errors
- Check backend CORS configuration
- Ensure frontend URL is allowed
- Verify API_URL in frontend .env

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Token Expiration
- Tokens expire after 30 days
- Login again to get new token
- Adjust JWT_EXPIRE in backend .env if needed

## Contact & Support

For issues or questions, please refer to the documentation or contact the development team.

---

**Happy Tracking! 🌾📊**
