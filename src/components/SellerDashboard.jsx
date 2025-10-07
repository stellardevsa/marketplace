// src/components/SellerDashboard.jsx
import { useState, useEffect } from 'react';

function SellerDashboard({ publicKey, server }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: null
  });
  const [loading, setLoading] = useState(true);
  
  // Mock seller address check - in real app, this would be more secure
  const isSeller = publicKey === 'GB66WWJBXVTB4WLTSMTRBADE2IYUHGEPOHJCBDJ4W3YQTZYTXLOXNTHL';
  
  useEffect(() => {
    // In a real app, this would fetch from a database
    // For this example, we'll use the same products as ProductList
    const mockProducts = [
      { 
        id: 1, 
        name: 'Stellar T-Shirt', 
        price: '5', 
        seller: 'GB66WWJBXVTB4WLTSMTRBADE2IYUHGEPOHJCBDJ4W3YQTZYTXLOXNTHL',
        image: '/products/tshirt.jpg'
      },
      { 
        id: 2, 
        name: 'Stellar Mug', 
        price: '10', 
        seller: 'GB66WWJBXVTB4WLTSMTRBADE2IYUHGEPOHJCBDJ4W3YQTZYTXLOXNTHLNF3ZD',
        image: '/products/mug.jpg'
      },
    ];
    
    setProducts(mockProducts.filter(p => p.seller === publicKey));
    setLoading(false);
  }, [publicKey]);
  
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    // In real app, this would save to a database
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: newProduct.price,
      seller: publicKey,
      image: newProduct.image ? URL.createObjectURL(newProduct.image) : null
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', image: null });
  };
  
  if (!publicKey) return null;
  if (!isSeller) return null;
  
  return (
    <div className="seller-dashboard">
      <h2>Seller Dashboard</h2>
      
      <div className="add-product-form">
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product name"
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Price (XLM)"
            value={newProduct.price}
            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
            required
            min="0"
            step="0.0000001"
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewProduct({...newProduct, image: e.target.files[0]})}
          />
          <button type="submit">Add Product</button>
        </form>
      </div>
      
      <div className="my-products">
        <h3>My Products</h3>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>You don't have any products listed</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                  />
                )}
                <h4>{product.name}</h4>
                <p>Price: {product.price} XLM</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;