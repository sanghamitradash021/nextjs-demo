'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { HomeConstants } from '../constants/HomeConstant';
import { useTheme } from '@/context/ThemeContext';
import { useMealTypeRecipes } from '../hooks/Mealtype';

export default function FeaturedCategories() {
  const { featuredCategories } = HomeConstants;
  const { theme } = useTheme();
  const { fetchMealTypeRecipesHandler } = useMealTypeRecipes();

  return (
    <section>
      <h2
        className={`text-3xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-gray-100'
        } mb-8`}
      >
        Featured Categories
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="rounded-xl"
      >
        {featuredCategories.map((category, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-72 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => fetchMealTypeRecipesHandler(category.name)}
            >
              <img
                src={category.image || '/placeholder.svg'}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore {category.name.toLowerCase()} recipes
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
