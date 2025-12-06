import React from 'react'
import Card_Slider from "@/app/components/Card_Slider";

const Grid_Items = ({items}) => {
  return (
<div className="Grid_items">
  {items.map((item) => (
    <Card_Slider key={item.id} Img={item.imageUrl} Text={item.name} Price={item.price} />
  ))}
</div>

  )
}
export default Grid_Items

