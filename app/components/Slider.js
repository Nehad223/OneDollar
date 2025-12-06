"use client"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import Link from "next/link";
import Card_Slider from './Card_Slider'

const Slider = ({ items, id }) => {
  return (
    <div className="slider-wrapper">
      <Swiper
        dir="rtl"
        spaceBetween={10}
        modules={[Navigation]}
        navigation
        breakpoints={{
          0: { slidesPerView: 1.2 },
          480: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <Card_Slider Img={item.imageUrl} Text={item.name} Price={item.price} />
          </SwiperSlide>
        ))}

        {items.length > 7 && (
          <SwiperSlide>
            <Link href={`/categories/${id}`} style={{ textDecoration: "none" }}>
              <div className="See_More">
                عرض المزيد <span className="arrow">←</span>
              </div>
            </Link>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  )
}

export default Slider
