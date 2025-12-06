"use client"
import { useEffect, useState } from 'react'
import React from 'react'
import Slider from './Slider'
const Body_Main = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);
console.log(categories)
  return (
    <div className='Body_Main'>
{categories.map(category => (
  <div key={category.id}>
    <h1>{category.name}</h1>
    <Slider items={category.products } id={category.id} />
  </div>
))}

      
    </div>
  )
}

export default Body_Main


