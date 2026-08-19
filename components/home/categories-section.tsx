"use client";

import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

const MAIN_CATEGORY_DATA = [
  { 
    id: "men", 
    name: "Men", 
    slug: "men", 
    subtitle: "Modern Elite",
    desc: "Style Redefined",
    image: "https://www.exportleftovers.com/cdn/shop/files/anime_5.jpg?v=1784118174&width=720" 
  },
  { 
    id: "women", 
    name: "Women", 
    slug: "women", 
    subtitle: "Daily Ease",
    desc: "Made For Comfort",
    image: "https://www.exportleftovers.com/cdn/shop/files/white_2_03a9b9bb-d15a-4809-b5b3-ca5be0dab7c4.jpg?v=1784377234&width=720" 
  },
  { 
    id: "kids", 
    name: "Kids", 
    slug: "kids", 
    subtitle: "Daily Fun",
    desc: "Designed For Activity",
    image: "https://www.exportleftovers.com/cdn/shop/files/5_86f257cf-9ae5-4e00-aa6a-5136cd85cdb4.jpg?v=1785424365&width=720" 
  },
  { 
    id: "bags", 
    name: "Bags", 
    slug: "bags", 
    subtitle: "Premium Carry",
    desc: "Quality You Can Feel",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80" 
  },
];

interface CategoriesSectionProps {
  categories?: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  // Always ensure only the 4 main categories are shown
  const displayCategories = MAIN_CATEGORY_DATA.map((mainCat) => {
    const dbCat = categories?.find((c) => c.slug.toLowerCase() === mainCat.slug);
    return {
      ...mainCat,
      id: dbCat?.id ?? mainCat.id,
      image: dbCat?.image || mainCat.image,
    };
  });

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-3">
            FIND EVERYTHING YOU NEED IN ONE PLACE
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900 uppercase">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* 4 Large Vertical Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {displayCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative h-[450px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-xl bg-neutral-100 flex flex-col justify-end p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Content */}
              <div className="relative z-10 text-white">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 text-neutral-200">
                  {category.subtitle}
                </p>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-300">
                  {category.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
