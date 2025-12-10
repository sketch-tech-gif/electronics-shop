# Development Guide

## 🛠️ Development Workflow

### Terminal 1: Start MongoDB
```bash
mongod
# or if installed as Windows Service, it should start automatically
```

### Terminal 2: Start Backend
```bash
cd server
npm run dev
```
Look for: `Server listening on port 5000`

### Terminal 3: Start Frontend
```bash
cd client
npm run dev
```
Look for: `Local: http://localhost:5173`

### Terminal 4: Add Sample Data
Use either curl, Postman, or REST Client extension with `API_TEST.rest`

## 📝 VS Code Setup Recommendations

### Recommended Extensions
1. **REST Client** - For testing API
   - Use `API_TEST.rest` file to test endpoints
   - Right-click request and select "Send Request"

2. **MongoDB for VS Code** - For database management
   - Browse and manage MongoDB data visually

3. **ESLint** - Code quality
   - Already configured in client

4. **Thunder Client** - Alternative API testing
   - Built-in REST client for VS Code

## 🔄 Common Development Tasks

### Add a New Product Category
1. Create product via API with new category
2. Frontend automatically detects category in filter
3. No code changes needed!

### Customize Styling
1. Edit `client/src/App.css`
2. Vite automatically reloads on save
3. Check browser DevTools (F12) for CSS debugging

### Modify Product Model
1. Edit `server/src/models/Product.js`
2. Add new fields in the schema
3. Restart server for changes to take effect
4. Update API tests in `API_TEST.rest`

### Add API Validation
1. Enhance Mongoose schema in `Product.js`
2. Add custom validators:
```javascript
price: {
  type: Number,
  required: true,
  min: [0, 'Price cannot be negative'],
  max: [10000000, 'Price too high']
}
```

## 🐛 Debugging Tips

### Frontend Debugging
- Open browser DevTools: `F12` or `Ctrl+Shift+I`
- Check Console tab for errors
- Use React DevTools extension
- Network tab to see API calls
- Performance tab for optimization

### Backend Debugging
- Check terminal output for logs
- Add console.log for debugging
- Use `node --inspect` for step-by-step debugging
- Check error responses in API responses

### Common Issues

**"Cannot GET /api/products"**
- Ensure server is running on port 5000
- Check if route is registered in `index.js`
- Verify frontend is calling correct URL

**"MongoDB connection error"**
- Check MongoDB is running
- Verify MONGO_URI in `.env`
- Connection string format: `mongodb://localhost:27017/electronics-shop`

**CORS errors**
- CORS is already enabled in `index.js`
- Check frontend is requesting from localhost:5000
- Not localhost:3000 or other ports

**Vite not reloading**
- Sometimes CSS changes need manual refresh
- Check Vite terminal for errors
- Try stopping and restarting Vite

## 📚 Code Structure Explanation

### App.jsx (Main Component)
```
useState for:
  - products: All products from API
  - loading: Loading state
  - cart: Shopping cart items
  - showCart: Toggle cart view
  - searchTerm, filterCategory, sortBy: UI filters

Functions:
  - fetchProducts(): Call API on mount
  - addToCart(): Add/increment item in cart
  - removeFromCart(): Remove from cart
  - updateQuantity(): Change item quantity
```

### ProductList.jsx
```
Receives:
  - products: Array of products
  - onAddToCart: Callback function

Renders:
  - Grid of ProductCard components
  - Empty state if no products
```

### ProductCard.jsx
```
Receives:
  - product: Single product object
  - onAddToCart: Callback function

Shows:
  - Product image
  - Product details
  - Price
  - Add to cart button
```

### Cart.jsx
```
Receives:
  - cart: Array of cart items
  - onRemove, onUpdateQuantity, onClose: Callbacks

Shows:
  - List of cart items with quantity controls
  - Total price calculation
  - Checkout button (placeholder)
```

## 🚀 Building for Production

### Frontend Build
```bash
cd client
npm run build
# Creates dist/ folder with optimized files
npm run preview  # Preview production build
```

### Backend Deployment
```bash
# Install production dependencies
npm install --production

# Start with Node (not nodemon)
npm start
```

## 🔐 Security Considerations

### Current Setup
- ✅ CORS enabled (restrict in production)
- ✅ Environment variables for sensitive data
- ✅ No hardcoded passwords

### Future Improvements
- [ ] Add input validation on backend
- [ ] Sanitize user inputs
- [ ] Add authentication
- [ ] Use HTTPS
- [ ] Rate limiting
- [ ] Helmet.js for security headers

## 📊 Testing

### Manual Testing Checklist
- [ ] Search for products
- [ ] Filter by category
- [ ] Sort by price
- [ ] Add items to cart
- [ ] Remove items from cart
- [ ] Change quantities
- [ ] Check total price calculation
- [ ] Test on mobile view (F12 → Toggle Device Toolbar)

### API Testing
Use `API_TEST.rest` file with REST Client extension:
1. Open `API_TEST.rest`
2. Click "Send Request" above each request
3. Check response in right panel

## 🎯 Performance Optimization

### Current Optimizations
- ✅ Vite for fast builds
- ✅ React Fast Refresh
- ✅ CSS Grid for layout
- ✅ Minimal dependencies

### Potential Improvements
- Image lazy loading
- Code splitting
- Caching strategies
- Database indexing
- API response compression

## 📖 Learning Resources

### For React
- Official: https://react.dev
- Hooks: https://react.dev/reference/react

### For Node.js/Express
- Official: https://nodejs.org
- Express: https://expressjs.com

### For MongoDB
- Official: https://www.mongodb.com
- Mongoose: https://mongoosejs.com

### For CSS
- MDN Web Docs: https://developer.mozilla.org
- CSS Grid: https://css-tricks.com/snippets/css/complete-guide-grid/

## 💡 Tips & Tricks

1. **Hot Reload**
   - Frontend: Automatic with Vite
   - Backend: Use `npm run dev` with nodemon

2. **Quick Testing**
   - Keep `API_TEST.rest` open in VS Code
   - Test endpoints before building features

3. **Git Workflow**
   ```bash
   git add .
   git commit -m "Add feature description"
   git push
   ```

4. **Keep Dependencies Updated**
   ```bash
   npm outdated          # Check for updates
   npm update            # Update packages
   npm audit            # Check for vulnerabilities
   ```

## 🆘 Getting Help

1. **Check existing files**
   - README.md - Full documentation
   - QUICKSTART.md - Quick setup
   - PROJECT_SUMMARY.md - Overview

2. **Check browser console**
   - F12 → Console tab
   - Look for red error messages

3. **Check server logs**
   - Terminal where you ran `npm run dev`
   - Look for error messages

4. **Use VS Code Debugger**
   - Set breakpoints (click line number)
   - Run with debugger
   - Step through code

Happy Coding! 🎉
