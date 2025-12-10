# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows: MongoDB should be installed and running as a service
# Or start it manually:
mongod
```

### Step 2: Set Up Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
✅ Server running at `http://localhost:5000`

### Step 3: Set Up Frontend (in a new terminal)
```bash
cd client
npm install
npm run dev
```
✅ Client running at `http://localhost:5173`

### Step 4: Add Sample Products
Use this command to add products via API:

```bash
# Add iPhone
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro Max",
    "sku": "IP15PM",
    "category": "Phones",
    "brand": "Apple",
    "price": 150000,
    "description": "Latest Apple smartphone with A17 Bionic chip",
    "specs": "6.7 inch display, 512GB storage, Titanium design",
    "inStock": true
  }'

# Add Samsung Galaxy
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Galaxy S24 Ultra",
    "sku": "SGS24U",
    "category": "Phones",
    "brand": "Samsung",
    "price": 145000,
    "description": "Powerful Android phone with advanced features",
    "specs": "6.8 inch display, 256GB storage",
    "inStock": true
  }'

# Add Laptop
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro 16 M3",
    "sku": "MBP16M3",
    "category": "Laptops",
    "brand": "Apple",
    "price": 350000,
    "description": "Professional laptop for developers and creators",
    "specs": "16-inch display, 32GB RAM, 1TB SSD",
    "inStock": true
  }'

# Add Headphones
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sony WH-1000XM5",
    "sku": "SONYWH5",
    "category": "Audio",
    "brand": "Sony",
    "price": 45000,
    "description": "Premium wireless headphones with noise cancellation",
    "specs": "40-hour battery, ANC, premium sound",
    "inStock": true
  }'

# Add Smartwatch
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple Watch Ultra",
    "sku": "AWULTRA",
    "category": "Wearables",
    "brand": "Apple",
    "price": 80000,
    "description": "Rugged smartwatch for outdoor enthusiasts",
    "specs": "49mm titanium case, always-on display",
    "inStock": true
  }'
```

Or use a REST client like Postman or VS Code REST Client.

### Step 5: Open Browser
Visit `http://localhost:5173` and start shopping! 🛒

## 🎯 Key Features to Try

✅ **Search** - Find products by name
✅ **Filter** - Filter by category (Phones, Laptops, Audio, etc.)
✅ **Sort** - Sort by name, price low-to-high, price high-to-low
✅ **Cart** - Add products to cart, adjust quantities
✅ **Responsive** - Try on mobile/tablet view

## 🐛 Troubleshooting

**Port 5000 already in use?**
```bash
# Change PORT in server/.env to another port like 5001
PORT=5001
```

**MongoDB connection failed?**
- Ensure MongoDB is running
- Check MONGO_URI in `.env` matches your setup
- For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/electronics-shop`

**CORS errors?**
- Make sure backend is running on port 5000
- Frontend requests should go to `http://localhost:5000`

## 📚 Next Steps

1. Read the full [README.md](../README.md) for detailed documentation
2. Explore the product model in `server/src/models/Product.js`
3. Customize styling in `client/src/App.css`
4. Add authentication in future updates
5. Implement payment integration

Happy coding! 🚀
