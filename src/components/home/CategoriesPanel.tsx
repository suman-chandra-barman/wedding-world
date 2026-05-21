"use client";
/* eslint-disable @next/next/no-img-element */

import { ChevronDown, ChevronRight, WandSparkles } from "lucide-react";
import type { Category, CategoryImage, TryOnStatus } from "./types";
import CategoriesPanelSkeleton from "../skeleton/CategoriesPanelSkeleton";
import Image from "next/image";

type CategoriesPanelProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  selectedCategory: Category | undefined;
  selectedDressImageId: number | null;
  isLoading: boolean;
  tryOnStatus?: TryOnStatus;
  onSelectCategory: (category: Category) => void;
  onSelectDressImage: (image: CategoryImage) => void;
  onTryOn?: () => void;
};

export default function CategoriesPanel({
  categories,
  selectedCategoryId,
  selectedCategory,
  selectedDressImageId,
  isLoading,
  tryOnStatus = "idle",
  onSelectCategory,
  onSelectDressImage,
  onTryOn,
}: CategoriesPanelProps) {
  return (
    <section className="bg-white p-5 xl:p-6">
      <h2 className="m-0 text-xl font-semibold tracking-[0.01em]">
        Wedding Dresses
      </h2>
      {isLoading ? (
        <CategoriesPanelSkeleton />
      ) : (
        <>
          <div className="mt-8 md:max-w-none">
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

          <div className="mt-4 grid grid-cols-3 md:grid-cols-4!  gap-2">
            {(selectedCategory?.images ?? []).map((image) => (
              <button
                key={image.id}
                type="button"
                className={`overflow-hidden rounded-[0.42rem] border-3 bg-transparent p-0 transition ${
                  image.id === selectedDressImageId
                    ? "border-[#b48c6c]"
                    : "border-transparent hover:border-[#d7c1af]"
                }`}
                onClick={() => onSelectDressImage(image)}
              >
                <Image
                  src={image.image_url}
                  alt={`Dress ${image.id}`}
                  className="aspect-3/4 w-full object-cover"
                  width={300}
                  height={400}
                />
              </button>
            ))}
            {!selectedCategory?.images.length && (
              <div className="col-span-3 rounded-md border border-dashed border-[#e3d8cf] bg-[#f7f5f4] px-4 py-6 text-center text-sm text-[#8d8179]">
                No dress in this category yet.
              </div>
            )}
          </div>

          {onTryOn && (
            <button
              type="button"
              className="md:hidden mt-4 flex w-full cursor-pointer items-center justify-center gap-4 rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.88rem] tracking-[0.05em] text-[#f7f4ff] transition hover:bg-[#30292b] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onTryOn}
              disabled={tryOnStatus === "loading"}
            >
              <WandSparkles />
              {tryOnStatus === "loading" ? "GENERATING..." : "TRY ON"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
