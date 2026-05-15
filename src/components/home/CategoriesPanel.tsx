"use client";
/* eslint-disable @next/next/no-img-element */

import { ChevronDown, ChevronRight } from "lucide-react";
import type { Category, CategoryImage } from "./types";
import CategoriesPanelSkeleton from "../skeleton/CategoriesPanelSkeleton";

type CategoriesPanelProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  selectedCategory: Category | undefined;
  selectedDressImageId: number | null;
  isLoading: boolean;
  onSelectCategory: (category: Category) => void;
  onSelectDressImage: (image: CategoryImage) => void;
};

export default function CategoriesPanel({
  categories,
  selectedCategoryId,
  selectedCategory,
  selectedDressImageId,
  isLoading,
  onSelectCategory,
  onSelectDressImage,
}: CategoriesPanelProps) {
  return (
    <section className="bg-white p-5 xl:p-6">
      <h2 className="m-0 text-[1.7rem] font-semibold tracking-[0.01em]">
        Wedding Dresses
      </h2>
      {isLoading ? (
        <CategoriesPanelSkeleton />
      ) : (
        <>
          <div className="mt-8 max-w-55">
            <p className="leading-none font-bold text-[#ac8464]">Categories</p>

            <ul className="m-0 mt-4 list-none p-0 space-y-4">
              {categories?.map((category) => (
                <li key={category.category_id}>
                  {selectedCategoryId === category.category_id ? (
                    <button
                      type="button"
                      className="flex w-full items-center justify-start gap-2 border-0 bg-transparent p-0 text-left font-semibold text-[#ac8464] transition"
                      onClick={() => onSelectCategory(category)}
                    >
                      <span className="leading-[1.05]">
                        {category.category_type}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex w-full items-center justify-between border-0 bg-transparent p-0 text-left font-medium text-[#1f1a1b] transition hover:text-[#6f5540]"
                      onClick={() => onSelectCategory(category)}
                    >
                      <span className="leading-[1.05]">
                        {category.category_type}
                      </span>
                      <ChevronRight className="h-4 w-4 text-[#ac8464]" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {(selectedCategory?.images ?? []).map((image) => (
              <button
                key={image.id}
                type="button"
                className={`overflow-hidden rounded-[0.42rem] border-2 bg-transparent p-0 transition ${
                  image.id === selectedDressImageId
                    ? "border-[#b48c6c]"
                    : "border-transparent hover:border-[#d7c1af]"
                }`}
                onClick={() => onSelectDressImage(image)}
              >
                <img
                  src={image.image_url}
                  alt={`Dress ${image.id}`}
                  className="aspect-3/4 w-full object-cover"
                />
              </button>
            ))}
            {!selectedCategory?.images.length && (
              <div className="col-span-3 rounded-md border border-dashed border-[#e3d8cf] bg-[#f7f5f4] px-4 py-6 text-center text-sm text-[#8d8179]">
                No dress in this category yet.
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
