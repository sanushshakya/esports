"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCategories } from "../services/categories";
import { CategoryTypes } from "../types/CategoryTypes";

interface CategoryContextProps {
  categories: CategoryTypes[];
  loading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextProps>({
  categories: [],
  loading: true,
  error: null,
});

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const cachedCategories = localStorage.getItem("categories");
      const cachedTimestamp = localStorage.getItem("categoriesTimestamp");

      const currentTime = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (
        cachedCategories &&
        cachedTimestamp &&
        currentTime - parseInt(cachedTimestamp) < twentyFourHours
      ) {
        setCategories(JSON.parse(cachedCategories));
        setLoading(false);
      } else {
        const data = await getCategories();
        setCategories(data);

        localStorage.setItem("categories", JSON.stringify(data));
        localStorage.setItem("categoriesTimestamp", currentTime.toString());
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
