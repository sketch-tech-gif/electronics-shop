import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔥 CALLING:", `${API_BASE}/api/products`);
        
        const response = await fetch(`${API_BASE}/api/products`);
        console.log("📡 STATUS:", response.status);
        console.log("📡 OK:", response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log("❌ ERROR TEXT:", errorText.substring(0, 200));
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ DATA:", data);
        console.log("✅ ARRAY?", Array.isArray(data));
        
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("💥 CATCH ERROR:", err.message);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="app" style={{padding: '2rem', textAlign: 'center'}}>
    <h1>FAITH ELECTRONICS</h1>
    <p>🔄 Loading...</p>
  </div>;

  return (
    <div className="app" style={{padding: '2rem'}}>
      <h1 style={{textAlign: 'center'}}>FAITH ELECTRONICS</h1>
      
      {error && (
        <div style={{
          background: '#fee', color: 'red', padding: '1rem', 
          borderRadius: '8px', margin: '1rem 0', textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {products.length === 0 && !loading ? (
        <p style={{textAlign: 'center', color: '#666'}}>
          No products available
        </p>
      ) : (
        <div>
          <h3 style={{textAlign: 'center'}}>
            Found {products.length} Products
          </h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            {products.map((product, index) => (
              <li key={index} style={{
                padding: '1rem', margin: '0.5rem 0',
                border: '1px solid #ddd', borderRadius: '8px',
                display: 'flex', justifyContent: 'space-between'
              }}>
                <strong>{product.name || 'Product'}</strong>
                <span style={{color: 'green', fontSize: '1.2em'}}>
                  KES {product.price || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
