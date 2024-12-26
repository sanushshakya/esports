"use client";

import React, { useEffect, useState } from "react";
import CategoryList from "./components/CategoryList";
import { useCategory } from "./context/CategoryContext";
import BannerSlider from "./components/Banner";

const Home = () => {
  const { categories, loading, error } = useCategory();

  if (loading) return <p>Loading categories...</p>;
  if (error)
    return (
      <p className="text-center md:text-2xl md:py-14 py-5">
        No Products Available at the moment.
      </p>
    );

  return (
    <>
      <section className="pt-16 lg:pt-16">
        <BannerSlider />
        <div className="px-16 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {categories.map((category) => (
            <CategoryList
              key={category.id}
              name={category.name}
              products={category.products}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
