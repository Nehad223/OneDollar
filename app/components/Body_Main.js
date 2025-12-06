"use client";
import { useEffect, useState } from "react";
import React from "react";
import Slider from "./Slider";
import { useLoaderStore } from "@/store/useLoaderStore"; 

const Body_Main = () => {
  const [categories, setCategories] = useState([]);

  const { showLoader, hideLoader } = useLoaderStore(); 

useEffect(() => {
  const timeout = setTimeout(() => {
    showLoader();
  }, 300); 

  fetch("/api/categories")
    .then((res) => res.json())
    .then((data) => setCategories(data))
    .finally(() => {
      clearTimeout(timeout); 
      hideLoader();
    });
}, []);


  return (
    <div className="Body_Main">
      {categories.map((category) => (
        <div key={category.id}>
          <h1>{category.name}</h1>
          <Slider items={category.products} id={category.id} />
        </div>
      ))}
    </div>
  );
};

export default Body_Main;
