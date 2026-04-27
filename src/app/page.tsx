"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import logo from "@/assets/logo.svg";
import secondaryImage from "@/assets/secondary logo.png";
import Image from "next/image";
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  ChevronDown,
  ChevronRight,
  Trash2,
  WandSparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type DressCard = {
  id: number;
  name: string;
  image: string;
};

type SilhouetteOption = {
  label: string;
  dressId: number;
};

const DRESS_CARDS: DressCard[] = [
  {
    id: 1,
    name: "Wedding Dress 1",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 2,
    name: "Wedding Dress 2",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 3,
    name: "Wedding Dress 3",
    image:
      "https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg?auto=compress&cs=tinysrgb&w=720",
  },
  {
    id: 4,
    name: "Wedding Dress 4",
    image:
      "https://images.unsplash.com/photo-1585241936939-be4099591252?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 5,
    name: "Wedding Dress 5",
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 6,
    name: "Wedding Dress 6",
    image:
      "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?auto=format&fit=crop&w=720&q=80",
  },
];

const SILHOUETTE_OPTIONS: SilhouetteOption[] = [
  { label: "A-Line", dressId: 1 },
  { label: "Mermaid", dressId: 2 },
  { label: "Fit & Flare", dressId: 3 },
  { label: "Straight / Column", dressId: 4 },
  { label: "Princess", dressId: 5 },
];

export default function HomePage() {
  const [selectedDressId, setSelectedDressId] = useState<number>(
    DRESS_CARDS[0].id,
  );
  const [selectedSilhouette, setSelectedSilhouette] = useState<string>(
    SILHOUETTE_OPTIONS[0].label,
  );
  const [zoom, setZoom] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedDress = useMemo(
    () =>
      DRESS_CARDS.find((item) => item.id === selectedDressId) ?? DRESS_CARDS[0],
    [selectedDressId],
  );

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    const nextImage = URL.createObjectURL(file);
    setUploadedImage(nextImage);
  };

  const removePhoto = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
  };

  const onSelectSilhouette = (option: SilhouetteOption) => {
    setSelectedSilhouette(option.label);
  };

  return (
    <main className="min-h-screen text-[#2b2624]">
      <section className="bg-[#EDEAE6] px-6 py-3 text-center text-[#8d8179] sm:px-8 flex flex-col items-center sm:flex-row sm:justify-center sm:gap-2">
        <span>Guest at the largest and </span>{"  "}
        <span className="text-[#161215] ">
          most beautiful out&shy;fitter in Germany.
        </span>
      </section>

      <header className="container mx-auto flex flex-col items-stretch justify-center gap-16 rounded-[0.35rem] bg-white p-4 sm:flex-row sm:items-center sm:gap-12 sm:px-8">
        <div className="grid justify-items-center gap-1">
          <Image src={logo} alt="Wedding World Logo" className="h-14 w-auto" />
        </div>
        <nav className="flex flex-wrap justify-center gap-2 sm:justify-end">
          <button
            type="button"
            className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
          >
            BACK TO WEDDING WORLD
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
          >
            VIEW 2026 COLLECTION
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
          >
            BOOK APPOINTMENT
          </button>
        </nav>
      </header>

      <section className="bg-[#EDEAE6] pb-8 px-2 py-4 sm:p-4">
        <div className="container mx-auto overflow-hidden rounded-[0.6rem] bg-[#f8f5f3]">
          <div className="bg-[#ab8466] px-3 py-2 text-center text-[0.86rem] text-[#f7ede4]">
            The Wedding World Virtual Bridal Experience
          </div>

          <div className="grid min-h-160 grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_minmax(0,1.95fr)_minmax(0,1.15fr)]">
            {/* Sidebar with upload and info */}
            <aside className="bg-[#F6F5F3] xl:p-5">
              <Image
                src={secondaryImage}
                alt="Virtual Fitting Room"
                className="w-full h-auto p-8 xl:p-0"
              />
              <p className="mt-0 mb-8 md:my-6  leading-6 text-[#161215] p-4 xl:p-0">
                Curious how your dream dress looks on you? Try on your favorite
                dress now in our virtual fitting room. Upload a photo of
                yourself and get a first impression of your fitting.
              </p>

              <input
                ref={fileInputRef}
                id="upload-photo"
                accept="image/*"
                type="file"
                className="sr-only"
                onChange={onUpload}
              />

              <div className="group relative overflow-hidden rounded-[0.85rem] border border-dashed border-[#ceb9a7] bg-[#f8f3ee] text-[#b48b6a] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                {!uploadedImage ? (
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="flex min-h-57 w-full cursor-pointer flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,#fbf7f3_0%,#f5eee8_100%)] px-6 py-10 text-[#b48b6a] transition hover:bg-[#f7f0ea]"
                  >
                    <ArrowUpFromLine />
                    <span className="text-sm tracking-[0.16em] underline decoration-[#d7c1af] underline-offset-4">
                      Upload your photo
                    </span>
                  </button>
                ) : (
                  <>
                    <img
                      src={uploadedImage}
                      alt="Uploaded user"
                      className="h-57 w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[#6f6664]/46 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100" />
                    <div className="pointer-events-none absolute bottom-4 right-2 grid w-40 gap-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-none border border-white/10 bg-[#1f1a1b] px-3 py-2.5 text-left text-[0.8rem] text-[#f8f6f5] shadow-[0_10px_22px_rgba(42,35,35,0.25)] transition hover:bg-[#30292b]"
                        onClick={(event) => {
                          event.preventDefault();
                          openFilePicker();
                        }}
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        Change photo
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-none border border-white/10 bg-[#1f1a1b] px-3 py-2.5 text-left text-[0.8rem] text-[#f8f6f5] shadow-[0_10px_22px_rgba(42,35,35,0.25)] transition hover:bg-[#30292b]"
                        onClick={(event) => {
                          event.preventDefault();
                          removePhoto();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-4 rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.88rem] tracking-[0.05em] text-[#f7f4ff] transition hover:bg-[#30292b]"
              >
                <WandSparkles /> TRY ON
              </button>
            </aside>

            {/* Wedding Dresses Section */}
            <section className="bg-white p-5 xl:p-6">
              <h2 className="m-0 text-[1.7rem] font-semibold tracking-[0.01em]">
                Wedding Dresses
              </h2>
              <div className="mt-8 max-w-55">
                <p className="leading-none font-bold text-[#ac8464]">
                  Silhouette
                </p>

                <ul className="m-0 mt-4 list-none p-0 space-y-4">
                  {SILHOUETTE_OPTIONS.map((option) => (
                    <li key={option.label}>
                      {selectedSilhouette === option.label ? (
                        <button
                          type="button"
                          className="flex w-full items-center justify-start gap-2 border-0 bg-transparent p-0 text-left font-semibold text-[#ac8464] transition"
                          onClick={() => onSelectSilhouette(option)}
                        >
                          <span className="leading-[1.05]">{option.label}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="flex w-full items-center justify-between border-0 bg-transparent p-0 text-left font-medium text-[#1f1a1b] transition hover:text-[#6f5540]"
                          onClick={() => onSelectSilhouette(option)}
                        >
                          <span className="leading-[1.05]">{option.label}</span>
                          <ChevronRight className="h-4 w-4 text-[#ac8464]" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {DRESS_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className={`overflow-hidden rounded-[0.42rem] border bg-transparent p-0 transition ${
                      card.id === selectedDressId
                        ? "border-[#b48c6c]"
                        : "border-transparent hover:border-[#d7c1af]"
                    }`}
                    onClick={() => setSelectedDressId(card.id)}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="aspect-3/4 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            <section className=" bg-white xl:pt-6">
              <div className="mb-4 flex justify-center sm:hidden">
                <Image
                  src={secondaryImage}
                  alt="See yourself as a bride"
                  className="h-auto w-44"
                />
              </div>
              <div className="relative mx-4 xl:mx-0">
                <div className="min-h-105 overflow-hidden rounded-[0.7rem] sm:min-h-130 xl:min-h-147">
                  <img
                    src={selectedDress.image}
                    alt={selectedDress.name}
                    className="h-160 w-full origin-[50%_38%] object-cover transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>

                <div className="absolute right-6 top-6 overflow-hidden rounded-[0.42rem] border border-white/10 bg-[rgba(59,55,54,0.78)] shadow-[0_12px_20px_rgba(12,10,10,0.24)] backdrop-blur-[1.5px]">
                  <button
                    type="button"
                    aria-label="Zoom in"
                    className="grid h-10 w-11 cursor-pointer place-items-center border-0 bg-transparent text-[#f6f5f5] transition hover:bg-white/7"
                    onClick={() =>
                      setZoom((value) =>
                        Math.min(2.4, Number((value + 0.15).toFixed(2))),
                      )
                    }
                  >
                    <ZoomIn className="h-5 w-5" strokeWidth={1.7} />
                  </button>
                  <button
                    type="button"
                    aria-label="Zoom out"
                    className="grid h-10 w-11 cursor-pointer place-items-center border-0 bg-transparent text-[#f6f5f5] transition hover:bg-white/7"
                    onClick={() =>
                      setZoom((value) =>
                        Math.max(1, Number((value - 0.15).toFixed(2))),
                      )
                    }
                  >
                    <ZoomOut className="h-5 w-5" strokeWidth={1.7} />
                  </button>
                </div>
              </div>
            </section>

            <aside className="flex flex-col justify-between gap-4 p-4 xl:p-5 bg-white">
              <div className="grid gap-3 rounded-lg bg-[#EDEAE6] p-3">
                {DRESS_CARDS.slice(0, 3).map((card) => (
                  <button
                    key={`side-${card.id}`}
                    type="button"
                    className="grid grid-cols-[58px_minmax(0,1fr)] items-center gap-2 rounded-md border-0 bg-transparent p-1.5 text-left transition hover:bg-white/45"
                    onClick={() => setSelectedDressId(card.id)}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="h-19 w-14 rounded-[0.28rem] object-cover"
                    />
                    <span className="text-[0.9rem] text-[#3f3734]">
                      {card.name}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <h3 className="mb-3 text-lg lg:text-xl font-semibold leading-[1.18] text-[#161215">
                  Send me my photos via email.
                </h3>
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="mb-3 w-full rounded-none border border-[#ded6d0] bg-[#f7f5f4] px-3 py-2.5 text-[#4d4642] outline-none transition placeholder:text-[#8f837b] focus:border-[#b48c6c]"
                />
                <button
                  type="button"
                  className="mt-1 w-full cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b]"
                >
                  SEND
                </button>
                <button
                  type="button"
                  className="mt-3 w-full cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b]"
                >
                  BOOK APPOINTMENT
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
