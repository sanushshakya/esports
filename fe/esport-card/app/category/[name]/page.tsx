"use client";
import React, { useEffect, useState } from "react";
import { useCategory } from "@/app/context/CategoryContext";
import { useParams } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import { formattedTitle } from "@/app/utils/formatTitle";

const CategoryPage = () => {
  const [title, setTitle] = useState<string | null>(null);
  const { categories } = useCategory();
  const { name } = useParams();

  if (!name) return <p>Category not found!</p>;

  const category = categories.find(
    (cat) => encodeURIComponent(formattedTitle(cat.name)) === name
  );

  useEffect(() => {
    if (category) {
      setTitle(category.name);
    }
  }, [category]);

  if (!category) {
    return <p>Category not available</p>;
  }

  const products = category.products || [];

  return (
    <div className="py-20 lg:py-32">
      <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
      <h2 className="text-center text-2xl mt-8 mb-4 font-bold">
        Popular {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-300 rounded-lg p-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            image_url={product.image_url}
            id={product.id}
            category={product.category}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
