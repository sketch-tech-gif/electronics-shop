# 🛒 Sketch Tech Electronics Store

🌐 Live site: https://sketch-tech-electronics.vercel.app

A modern full-stack e-commerce platform for electronics built with React, Node.js, Express, and MongoDB.

This project demonstrates a scalable MERN-style architecture with clean UI design and full REST API integration.

---

## 🚀 Features

### 🖥️ Frontend (React)
- Responsive product catalog with grid layout
- Search and filter products by category
- Sort products by name and price
- Shopping cart with add/remove/quantity management
- Modern UI with smooth animations and gradients
- Mobile-friendly responsive design

### ⚙️ Backend (Node.js + Express)
- RESTful API for product management
- Full CRUD operations (Create, Read, Update, Delete)
- MongoDB database integration with Mongoose
- Environment configuration using dotenv
- CORS enabled for frontend communication

---

## 🧱 Project Structure

```
electronics-shop/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   └── Cart.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles
│
└── server/                  # Node.js Backend
    ├── src/
    │   ├── config/db.js
    │   ├── models/Product.js
    │   ├── routes/productRoutes.js
    │   ├── controllers/
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run backend:

```bash
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🔌 API Endpoints

- GET `/api/products` → Get all products  
- GET `/api/products/:id` → Get single product  
- POST `/api/products` → Create product  
- PUT `/api/products/:id` → Update product  
- DELETE `/api/products/:id` → Delete product  

---

## 📦 Data Model

```javascript
{
  name: String,
  sku: String,
  category: String,
  brand: String,
  price: Number,
  description: String,
  specs: String,
  imageUrl: String,
  inStock: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧰 Tech Stack

Frontend:
- React
- Vite
- CSS3
- Fetch API

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- Dotenv
- Nodemon

---

## 🎨 UI Features

- Modern gradient design
- Card-based product layout
- Smooth hover animations
- Fully responsive design
- Clean spacing and typography

---

## 🚀 Future Improvements

- User authentication (JWT)
- Persistent shopping cart
- Payment integration (Stripe/PayPal)
- Order management system
- Admin dashboard
- Product image upload
- Wishlist system

---

## 👨‍💻 Author

Evans Kangogo

---

## 📄 License

ISC
