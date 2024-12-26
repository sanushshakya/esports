"use client";

import React, { useState } from "react";
import { useCategory } from "../context/CategoryContext";
import { formattedTitle } from "../utils/formatTitle";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const { categories, loading } = useCategory();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term && categories.length > 0) {
      const results = categories
        .flatMap((category) => category.products)
        .filter((product) => product.title.toLowerCase().includes(term));
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductClick = (title: string) => {
    window.location.href = `/product/${encodeURIComponent(
      formattedTitle(title)
    )}`;
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search products..."
        className="md:w-80 p-2 m-2 rounded border focus:outline-1"
      />

      {searchTerm && filteredProducts.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto z-10">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              onClick={() => handleProductClick(product.title)}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {product.title}
            </li>
          ))}
        </ul>
      )}

      {searchTerm && filteredProducts.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded shadow-md px-4 py-2 text-gray-500 z-10">
          No products found.
        </div>
      )}
    </div>
  );
};

export default SearchBar;
