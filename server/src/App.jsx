import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://electronics-shop-api-id3m.onrender.com//api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch products error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app">
        <h1>Electronics Shop</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>FAITH ELECTRONICS</h1>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p._id}>
              {p.name} – KES {p.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
