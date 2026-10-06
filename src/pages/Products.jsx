import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowDownRight, ChevronUp } from "lucide-react";
import defaultImg from "../assets/images/home.png";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const normalize = (p) => ({
  id: p.id,
  name: p.name,
  price: parseFloat(p.price),
  pricing_unit: p.pricing_unit,
  quantity_stock: p.quantity_stock || 0,
  category: p.category || p.category_name || 'Uncategorized',
  description: p.description,
  origin: p.origin,
  season: p.season,
  nutrients: p.nutrients,
  shelfLife: p.shelfLife || p.shelf_life,
  image: p.image || ''
});

const Products = () => {
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getProducts(),
          productService.getCategories()
        ]);
        if (productsRes.success) {
          const formatted = productsRes.data.map(normalize);
          setAllProducts(formatted);
          setDisplayedProducts(formatted.slice(0, 9));
        }
        if (categoriesRes.success) setCategories(categoriesRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    const fetchFiltered = async () => {
      try {
        setIsLoading(true);
        const filters = {};
        if (category !== "All") filters.category = category;
        if (search) filters.search = search;
        if (sortBy !== 'default') filters.sort = sortBy;

        const response = await productService.getProducts(filters);
        if (response.success) {
          const formatted = response.data.map(normalize);
          setDisplayedProducts(
            (category === "All" && !search && !showAll)
              ? formatted.slice(0, 9)
              : formatted
          );
        }
      } catch (err) {
        console.error('Filter error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiltered();
  }, [category, search, sortBy, showAll]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      setAddingId(product.id);
      await addItem(product.id, 1);
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  const productCount = (c) => allProducts.filter(p => p.category === c).length;

  const categoryGroups = {
    fruits: ["Berries", "Tree Fruits", "Tropical Fruits", "Citrus", "Exotic Fruits"],
    vegetables: ["Leafy Greens", "Root Vegetables", "Cruciferous", "Nightshades", "Alliums", "Cucurbits", "Stem Vegetables"],
    specialty: ["Herbs", "Fungi", "Specialty Greens"]
  };

  return (
    <section className="product" id="products">
      <h2 className="produc-title">Check Out Our <br /> Products</h2>
      <p className="product-description">
        Here are some selected plants from our showroom, all are in excellent shape. Buy and enjoy best quality.
      </p>

      <div className="filtering">
        <div className="filter-search">
          <input type="text" className="search-input" placeholder="Search ..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-category">
          <select className="category-select" value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All</option>
            <optgroup label="Fruits">
              {categoryGroups.fruits.map(c => (
                <option key={c} value={c}>{c} ({productCount(c)})</option>
              ))}
            </optgroup>
            <optgroup label="Vegetables">
              {categoryGroups.vegetables.map(c => (
                <option key={c} value={c}>{c} ({productCount(c)})</option>
              ))}
            </optgroup>
            <optgroup label="Specialty">
              {categoryGroups.specialty.map(c => (
                <option key={c} value={c}>{c} ({productCount(c)})</option>
              ))}
            </optgroup>
          </select>
        </div>
        <div className="sort-by">
          <select className="sort-select" value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {isLoading && <div style={{ textAlign: 'center', padding: '2rem' }}><p>Loading products...</p></div>}
      {error && <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}><p>Error: {error}</p></div>}

      {!isLoading && !error && (
        <div className="product-container">
          {displayedProducts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No products found</p>
          ) : (
            displayedProducts.map(product => (
              <article className="product-card" key={product.id}>
                <div className="information">
                  <ul>
                    <li><p><b>Stock : </b><span>{product.quantity_stock} {product.pricing_unit}</span></p></li>
                    <li><p><b>Category : </b><span>{product.category}</span></p></li>
                    <li><p><b>Origin : </b><span>{product.origin || 'N/A'}</span></p></li>
                    <li><p><b>Season : </b><span>{product.season || 'N/A'}</span></p></li>
                    <li><p><b>Nutrients : </b><span>{product.nutrients || 'N/A'}</span></p></li>
                    <li><p><b>Shelf Life : </b><span>{product.shelfLife || 'N/A'}</span></p></li>
                    <li><p><b>Description : </b><span>{product.description || 'N/A'}</span></p></li>
                  </ul>
                </div>
                <div className="product-circle"></div>
                <div className="product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
                  {product.image
                    ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <img src={defaultImg} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> }
                </div>
                <h3 className="product-title">{product.name}</h3>
                <span className="product-price">${product.price.toFixed(2)}/{product.pricing_unit}</span>
                <button className="product-btn" onClick={() => handleAddToCart(product)}
                  disabled={addingId === product.id}>
                  <ShoppingBag className="icon" />
                </button>
              </article>
            ))
          )}
        </div>
      )}

      {!isLoading && !error && displayedProducts.length > 0 && category === "All" && !search && (
        <div className="show-more">
          <button className="show-more" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : `More Products (${allProducts.length})`}
            {showAll ? <ChevronUp className="icon" /> : <ArrowDownRight className="icon" />}
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;