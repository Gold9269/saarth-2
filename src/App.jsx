import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import "./index.css";

// Sample products
const initialState = {
  products: [
    { id: 1, name: "Laptop", category: "Electronics", price: 800, rating: 4.5, image: "laptop.jpg" },
    { id: 2, name: "Phone", category: "Electronics", price: 500, rating: 4.7, image: "phone.jpg" },
    { id: 3, name: "Shoes", category: "Fashion", price: 100, rating: 4.2, image: "shoes.jpg" },
    { id: 4, name: "Watch", category: "Fashion", price: 150, rating: 4.3, image: "watch.jpg" }
  ],
  searchQuery: "",
  filterCategory: "",
  sortBy: "price",
  currentPage: 1,
  productsPerPage: 2,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER_CATEGORY":
      return { ...state, filterCategory: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};

const store = createStore(reducer);

const ProductList = () => {
  const { products, searchQuery, filterCategory, sortBy, currentPage, productsPerPage } = useSelector(state => state);
  const dispatch = useDispatch();

  let filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterCategory ? p.category === filterCategory : true)
  );

  filteredProducts.sort((a, b) => (sortBy === "price" ? a.price - b.price : b.rating - a.rating));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="container">
      <h2>Product Catalog</h2>
      <div className="controls">
        <input type="text" placeholder="Search products..." onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })} />
        <select onChange={(e) => dispatch({ type: "SET_FILTER_CATEGORY", payload: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
        </select>
        <select onChange={(e) => dispatch({ type: "SET_SORT_BY", payload: e.target.value })}>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>
      <div className="product-grid">
        {displayedProducts.map(p => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.name} className="product-image" />
            <h3>{p.name}</h3>
            <p className="category">{p.category}</p>
            <p className="price">${p.price}</p>
            <p className="rating">⭐ {p.rating}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} className="page-btn" onClick={() => dispatch({ type: "SET_PAGE", payload: i + 1 })}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <ProductList />
  </Provider>
);

export default App;