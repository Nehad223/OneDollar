"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Grid_Items from "../../components/Grid_Items";
import "./category.css";

const Page = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) => setCategory(data));
  }, [id]);

  if (!category) return <div>Loading...</div>;

  return (
    <div className="container categories">
      <h1>{category.name}</h1>
      <Grid_Items items={category.products} />
    </div>
  );
};

export default Page;
