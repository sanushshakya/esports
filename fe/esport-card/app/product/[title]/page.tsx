"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useCategory } from "@/app/context/CategoryContext";
import { formattedTitle } from "@/app/utils/formatTitle";
import { buyProduct } from "@/app/services/products";

const ProductDetailPage = () => {
  const { categories } = useCategory();
  const params = useParams();
  const title = Array.isArray(params.title) ? params.title[0] : params.title;

  if (!title) return <p>Product not found!</p>;

  // Search for product by title in all categories
  const product = categories
    .flatMap((category) => category.products)
    .find((prod) => encodeURIComponent(formattedTitle(prod.title)) === title);

  if (!product) return <p>Product not available</p>;

  const handleBuy = async () => {
    const res = await buyProduct(product.id);
    if (res) alert(`Successfully bought ${product.title}!`);
  };

  return (
    <section className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex items-center mt-10">
        <div className="w-1/2 p-4">
          <img
            src={`http://localhost:8000${product.image_url}`}
            alt={title}
            className="w-full rounded-md mb-4 object-cover"
          />
        </div>

        <div className="w-1/2 p-6">
          <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-4">
            ${product.price}
          </p>

          {/* Buy Button */}
          <button
            onClick={handleBuy}
            className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Product Overview Section */}
      <div className="max-w-6xl mx-auto text-white rounded-lg shadow-lg overflow-hidden mt-10">
        <div className="py-6 px-5">
          <h3 className="mt-4 md:text-[2rem]">Product Overview</h3>
          <p className="mt-4 md:text-2xl text-justify">{product.overview}</p>
        </div>

        <div className="py-6 px-5">
          <h3 className="mt-4 md:text-[2rem]">About {product.title}</h3>
          <p className="mt-4 md:text-2xl text-justify">
            {product.details_html}
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-4">FAQs</h2>

          {product.faqs.map((faq: any, index: any) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-lg">{faq}</h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductDetailPage;
