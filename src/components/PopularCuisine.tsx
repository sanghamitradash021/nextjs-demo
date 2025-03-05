'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { HomeConstants } from '../constants/HomeConstant';

export default function PopularCuisines() {
  const router = useRouter();
  const { theme } = useTheme();
  const { cuisineTypes } = HomeConstants;

  return (
    <section>
      <h2
        className={`text-3xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-gray-100'
        } mb-8`}
      >
        Popular Cuisines
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {cuisineTypes.map((cuisine) => (
          <div
            key={cuisine}
            className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 group ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}
            onClick={() => router.push(`/recipes/cuisine/${cuisine}`)}
          >
            <img
              src={`/assets/${cuisine.toLowerCase()}.jpeg`}
              alt={cuisine}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 flex items-center justify-center group-hover:opacity-90 transition-opacity duration-300">
              <h3 className="text-white text-2xl font-bold">{cuisine}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
