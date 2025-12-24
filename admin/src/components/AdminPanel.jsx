import { useState } from "react";
import "./AdminPanel.css";

const API_URL = 'https://electronics-shop-api-id3m.onrender.com';

function AdminPanel({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    description: "",
    specs: "",
    imageUrl: "",
    inStock: true,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      category: "",
      brand: "",
      price: "",
      salePrice: "",
      description: "",
      specs: "",
      imageUrl: "",
      inStock: true,
    });
    setEditingId(null);
    setShowForm(false);
    setSelectedFiles([]);
    setUploadedUrls([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    selectedFiles.forEach((file) => {
      formDataUpload.append("images", file);
    });

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await res.json();

      if (data.urls && data.urls.length > 0) {
        setUploadedUrls(data.urls);
        setFormData((prev) => ({ ...prev, imageUrl: data.urls[0] }));
        alert(`Successfully uploaded ${data.urls.length} image(s)`);
      }
    } catch (error) {
      alert("Upload failed: " + error.message);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      brand: formData.brand,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      description: formData.description,
      specs: formData.specs,
      imageUrl: formData.imageUrl,
      inStock: formData.inStock,
    };

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updatedProduct = await res.json();
          onUpdateProduct(editingId, updatedProduct);
          alert("Product updated");
        } else {
          const error = await res.json();
          alert(`Failed to update product: ${error.message || "Unknown error"}`);
        }
      } else {
        const res = await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const newProduct = await res.json();
          onAddProduct(newProduct);
          alert("Product added");
        } else {
          const error = await res.json();
          alert(`Failed to add product: ${error.message || "Unknown error"}`);
        }
      }
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : "",
      description: product.description,
      specs: product.specs,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
    });
    setUploadedUrls(product.imageUrl ? [product.imageUrl] : []);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${API_URL}/api/products/${productId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          onDeleteProduct(productId);
          alert("Product deleted");
        } else {
          alert("Failed to delete product.");
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Error deleting product. Check console.");
      }
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
      </div>

      {!showForm ? (
        <>
          <button className="btn-add-product" onClick={() => setShowForm(true)}>
            ➕ Add New Product
          </button>

          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price (KES)</th>
                  <th>Sale Price (KES)</th>
                  <th>In Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{product.price.toLocaleString()}</td>
                    <td>
                      {product.salePrice
                        ? product.salePrice.toLocaleString()
                        : "—"}
                    </td>
                    <td>{product.inStock ? "✓" : "✗"}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                        title="Edit product"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product._id)}
                        title="Delete product"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="form-header">
            <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
            <button className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Samsung Galaxy S24"
                />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., SAM-S24-001"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Smartphones"
                />
              </div>
              <div className="form-group">
                <label>Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Samsung"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (KES) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 50000"
                />
              </div>
              <div className="form-group">
                <label>Sale Price (KES) — optional</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 45000 (leave blank if no sale)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the product..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Specs / Features</label>
                <textarea
                  name="specs"
                  value={formData.specs}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.1 inch AMOLED, 256GB Storage, 12MP Camera..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group image-upload-group">
                <label>Product Images</label>
                <div className="upload-controls">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                    className="btn-upload"
                  >
                    {uploading ? "Uploading..." : "📤 Upload Images"}
                  </button>
                </div>

                {selectedFiles.length > 0 && !uploading && (
                  <p className="file-info">
                    {selectedFiles.length} file(s) selected
                  </p>
                )}

                {uploadedUrls.length > 0 && (
                  <div className="uploaded-previews">
                    <p>
                      <strong>Uploaded Images:</strong>
                    </p>
                    <div className="preview-grid">
                      {uploadedUrls.map((url, i) => (
                        <div key={i} className="preview-item">
                          <img src={url} alt={`Preview ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="hidden"
                  name="imageUrl"
                  value={formData.imageUrl}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                  />
                  In Stock
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? "✓ Update Product" : "✓ Add Product"}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
