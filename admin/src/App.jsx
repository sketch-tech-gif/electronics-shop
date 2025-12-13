import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (productId, updatedProduct) => {
    setProducts(
      products.map((p) => (p._id === productId ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p._id !== productId));
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onClose={() => {}}
        />
      ) : (
        <AdminPanel
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onClose={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
