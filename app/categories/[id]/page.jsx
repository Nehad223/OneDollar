"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Grid_Items from "../../components/Grid_Items";
import { useLoaderStore } from "@/store/useLoaderStore"; 
import "./category.css";

const Page = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  const { showLoader, hideLoader } = useLoaderStore(); 

  useEffect(() => {
   const timeout = setTimeout(() => {
    showLoader();
  }, 300); 

    fetch(`/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) => setCategory(data))
      .finally(() => {
        clearTimeout(timeout);
        hideLoader();
        
      });
  }, [id]);

  if (!category) return null;

  return (
    <div className="container categories">
      <h1>{category.name}</h1>
      <Grid_Items items={category.products} />
    </div>
  );
};

export default Page;
