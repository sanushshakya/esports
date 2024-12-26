"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { ProductTypes } from "../types/ProductTypes";
import Link from "next/link";
import { formattedTitle } from "../utils/formatTitle";

interface CategoryListTypes {
  name: string;
  products: ProductTypes[];
}

const CategoryList = ({ name, products }: CategoryListTypes) => {
  return (
    <div className="py-8 md:py-14 lg:py-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{name}</h2>

        <Link
          href={`/category/${encodeURIComponent(formattedTitle(name))}`}
          className="text-blue-500 hover:underline mt-4 block text-center"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-2">
        {products.slice(0, 4).map(
          (
            product // Limit to 4 items
          ) => (
            <ProductCard key={product.id} {...product} />
          )
        )}
      </div>
    </div>
  );
};

export default CategoryList;
