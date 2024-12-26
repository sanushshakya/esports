// components/ProductCard.tsx
import React from "react";
import Link from "next/link";
import { ProductTypes } from "../types/ProductTypes";
import { formattedTitle } from "../utils/formatTitle";

const ProductCard = ({ title, price, image_url }: ProductTypes) => {
  return (
    <Link
      href={`/product/${encodeURIComponent(formattedTitle(title))}`}
      className="no-underline"
    >
      <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer">
        {image_url ? (
          <img
            src={`http://localhost:8000${image_url}`}
            alt={title}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-blue-500 font-bold">${price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
