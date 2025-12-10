# Electronics Shop - Visual Architecture & Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│                    http://localhost:5173                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐      ┌──────────────┐      ┌──────────┐         │
│  │   App    │─────▶│ ProductList  │─────▶│ Product  │         │
│  │ (State)  │      │ (Filter/Sort)│      │  Card    │         │
│  │          │      │              │      │          │         │
│  │ - Cart   │      └──────────────┘      └──────────┘         │
│  │ - Search │           ▲                      │               │
│  │ - Filter │           │                      ▼               │
│  │ - Sort   │           │                   Add to Cart        │
│  └──────────┘      ┌────────────┐                              │
│       │ │          │   Cart     │                              │
│       │ └─────────▶│ Component  │                              │
│       │            │            │                              │
│       │            │ - Items    │                              │
│       │            │ - Quantity │                              │
│       │            │ - Total    │                              │
│       │            └────────────┘                              │
│       │                                                         │
│       └─────────────────────────────────────────────────────▐  │
│                    FETCH API                                 │  │
└──────────────────────────────────────────────────────────────┬──┘
                                                               │
                            HTTP Requests                       │
                            http://localhost:5000              │
                                                               │
┌──────────────────────────────────────────────────────────────┴──┐
│                       SERVER (Express)                          │
│                   http://localhost:5000/api                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │         Express Routes                       │               │
│  │  ┌────────────────────────────────────────┐  │               │
│  │  │ GET    /products     → List All        │  │               │
│  │  │ POST   /products     → Create          │  │               │
│  │  │ GET    /products/:id → Single Product  │  │               │
│  │  │ PUT    /products/:id → Update          │  │               │
│  │  │ DELETE /products/:id → Delete          │  │               │
│  │  └────────────────────────────────────────┘  │               │
│  └──────────────────────┬───────────────────────┘               │
│                         │                                       │
│                    MongoDB                                      │
│                         │                                       │
│  ┌──────────────────────▼───────────────────────┐               │
│  │      Mongoose Schema & Operations            │               │
│  │  ┌────────────────────────────────────────┐  │               │
│  │  │ Product Collection                     │  │               │
│  │  │ - name (String)                        │  │               │
│  │  │ - sku (String, unique)                 │  │               │
│  │  │ - category (String)                    │  │               │
│  │  │ - brand (String)                       │  │               │
│  │  │ - price (Number)                       │  │               │
│  │  │ - description (String)                 │  │               │
│  │  │ - specs (String)                       │  │               │
│  │  │ - imageUrl (String)                    │  │               │
│  │  │ - inStock (Boolean)                    │  │               │
│  │  │ - createdAt (Timestamp)                │  │               │
│  │  │ - updatedAt (Timestamp)                │  │               │
│  │  └────────────────────────────────────────┘  │               │
│  └──────────────────────────────────────────────┘               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 📱 User Workflow

```
User Opens App
     │
     ▼
Load Products from API
     │
     ▼
Display Product Grid
     │
     ├─── Search ───────────┐
     │                      │
     ├─── Filter Category ──┤──▶ Filter Products
     │                      │
     └─── Sort Price ───────┘
     
     ▼
   Click Product Card
     │
     ├─── View Details ──┐
     │                   │
     └─── Add to Cart ───┘
     
     ▼
 View Cart
     │
     ├─── Add More ────────┐
     │                     │
     ├─── Change Qty ──────┤──▶ Update Cart
     │                     │
     └─── Remove Item ─────┘
     
     ▼
 Checkout (Future Feature)
```

## 🔄 Data Flow

```
┌──────────────────┐
│   User Input     │
│  - Search        │
│  - Filter        │
│  - Sort          │
│  - Add to Cart   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Component State Update  │
│  (React State)           │
│  - searchTerm            │
│  - filterCategory        │
│  - sortBy                │
│  - cart                  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Product Filtering       │
│  & Sorting Logic         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Render UI               │
│  - ProductList           │
│  - ProductCard(s)        │
│  - Cart                  │
└──────────────────────────┘
```

## 🌳 Component Tree

```
App
├── Header
│   ├── Title
│   └── Cart Button
│
├── Main (Conditional)
│   │
│   ├─ IF showCart = false:
│   │  │
│   │  ├── Controls
│   │  │   ├── Search Input
│   │  │   ├── Category Filter
│   │  │   └── Sort Select
│   │  │
│   │  └── ProductList
│   │      └── ProductCard (multiple)
│   │          ├── Image
│   │          ├── Info
│   │          ├── Price
│   │          └── Add Button
│   │
│   └─ IF showCart = true:
│      │
│      └── Cart
│          ├── Back Button
│          ├── Cart Items (multiple)
│          │   ├── Item Details
│          │   ├── Quantity Controls
│          │   ├── Subtotal
│          │   └── Remove Button
│          │
│          └── Cart Summary
│              ├── Total Price
│              └── Checkout Button
│
└── Footer
    └── Copyright
```

## 💾 State Management in App

```
const [products, setProducts]           // All products from API
const [loading, setLoading]             // Loading state
const [cart, setCart]                   // Cart items
const [showCart, setShowCart]           // Toggle cart view
const [searchTerm, setSearchTerm]       // Search filter
const [filterCategory, setFilterCategory] // Category filter
const [sortBy, setSortBy]               // Sort method

Functions:
- fetchProducts()      // Call API on mount
- addToCart()          // Add/increment item
- removeFromCart()     // Remove item
- updateQuantity()     // Change quantity
- filteredProducts     // Computed/filtered list
```

## 🎨 Styling Architecture

```
index.css
├── Root variables
├── Global styles
├── Scrollbar styling
└── Base element styles

App.css
├── Layout (flex, grid)
├── Header & Navigation
├── Main content area
├── Product grid
├── Product cards
├── Cart styles
├── Forms & inputs
├── Buttons
├── Footer
└── Media queries
```

## 📡 API Request/Response Flow

```
Frontend                          Backend                    MongoDB
    │                                │                          │
    │─── GET /api/products ────────▶ │                          │
    │                                │─ Mongoose Query ────────▶ │
    │                                │ Product.find()           │
    │                                │                          │
    │                                │◀─ Results ───────────────│
    │◀── JSON Response ──────────────│                          │
    │                                │                          │
    │─── POST /api/products ───────▶ │                          │
    │   (with product data)          │─ Mongoose Create ──────▶ │
    │                                │ Product.create()         │
    │                                │                          │
    │                                │◀─ Created Doc ──────────│
    │◀── Created Product JSON ───────│                          │
    │                                │                          │
    │─── PUT /api/products/:id ────▶ │                          │
    │   (with updates)               │─ Mongoose Update ──────▶ │
    │                                │ findByIdAndUpdate()      │
    │                                │                          │
    │                                │◀─ Updated Doc ─────────│
    │◀── Updated Product JSON ───────│                          │
    │                                │                          │
    │─── DELETE /api/products/:id ──▶ │                          │
    │                                │─ Mongoose Delete ──────▶ │
    │                                │ findByIdAndRemove()      │
    │                                │                          │
    │                                │◀─ Deleted ──────────────│
    │◀── Success Message ────────────│                          │
```

## 🎯 Feature Implementation Map

```
Search Products
├── Input onChange listener
├── Update searchTerm state
├── Filter products with includes()
└── Re-render ProductList

Filter by Category
├── Extract unique categories from products
├── Dropdown with categories
├── Filter based on selection
└── Update filtered results

Sort Products
├── Select with sort options
├── Apply sort comparator
├── Update product order
└── Re-render

Add to Cart
├── Check if product in cart
├── If yes: increment quantity
├── If no: add new item
└── Update cart state

View Cart
├── Toggle showCart state
├── Render Cart component
├── Calculate total price
└── Display cart items

Update Quantity
├── Find item in cart
├── Update quantity value
├── Recalculate total
└── Re-render cart

Remove from Cart
├── Filter out product
├── Update cart state
├── Recalculate total
└── Re-render
```

## 🔌 Integration Points

```
Frontend ◀─────────────▶ Backend
  │                       │
  ├─ HTTP Requests        │
  │  - Fetch API          │
  │  - JSON payload       │
  │                       │
  └─ Responses            │
     - JSON               │
     - Status codes       │
     - Error messages     │

Backend ◀─────────────▶ Database
  │                       │
  ├─ Mongoose Queries     │
  │  - find()             │
  │  - findById()         │
  │  - create()           │
  │  - findByIdAndUpdate()│
  │  - findByIdAndRemove()│
  │                       │
  └─ Results             │
     - Documents         │
     - Aggregations      │
     - Validation        │
```

## 🚀 Deployment Flow (Future)

```
Development
    │
    ├─ Frontend: npm run build
    │             Creates dist/ folder
    │
    ├─ Backend: npm install --production
    │           Removes dev dependencies
    │
    └─ Database: MongoDB Atlas
               Cloud-hosted MongoDB

                    │
                    ▼

Production Server (e.g., Heroku, Railway, AWS)
    │
    ├─ Serve Frontend from dist/
    ├─ Run Express backend
    └─ Connect to MongoDB Atlas

                    │
                    ▼

Live Website
    │
    └─ Users can shop! 🛒
```

---

**This architecture is:**
- ✅ Scalable
- ✅ Maintainable
- ✅ Extendable
- ✅ Production-ready

