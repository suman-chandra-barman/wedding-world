"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import logo from "@/assets/logo.svg";
import secondaryImage from "@/assets/2nd-logo.png";
import Image from "next/image";
import { ArrowUpFromLine, ChevronDown, ChevronRight } from "lucide-react";

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
];

const PRINCESS_DRESS_ID = 5;

export default function HomePage() {
  const [selectedDressId, setSelectedDressId] = useState<number>(
    DRESS_CARDS[0].id,
  );
  const [selectedSilhouette, setSelectedSilhouette] = useState<string>(
    SILHOUETTE_OPTIONS[0].label,
  );
  const [isSilhouetteOpen, setIsSilhouetteOpen] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [photoActionsOpen, setPhotoActionsOpen] = useState<boolean>(false);
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
    setPhotoActionsOpen(false);
  };

  const removePhoto = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setPhotoActionsOpen(false);
  };

  const onSelectSilhouette = (option: SilhouetteOption) => {
    setSelectedSilhouette(option.label);
    setSelectedDressId(option.dressId);
  };

  const onSelectPrincess = () => {
    setSelectedSilhouette("Princess");
    setSelectedDressId(PRINCESS_DRESS_ID);
  };

  return (
    <main className="min-h-screen text-[#2b2624]">
      <section className="bg-[#EDEAE6] px-4 py-2 text-center text-[#8d8179] sm:px-6 ">
        Guest at the largest and{" "}
        <span className="text-[#161215]">
          most beautiful outfitter in Germany.
        </span>
      </section>

      <header className="container mx-auto bg-white flex flex-col items-stretch justify-center gap-16 rounded-[0.35rem] px-4 py-4 sm:flex-row sm:items-center sm:gap-12 sm:px-5">
        <div className="grid justify-items-center gap-1">
          <Image src={logo} alt="Wedding World Logo" className="h-14 w-auto" />
        </div>
        <nav className="flex flex-wrap justify-center gap-2 sm:justify-end">
          <button
            type="button"
            className="cursor-pointer border-0 bg-[#1f1a1b] px-3 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b] sm:px-4"
          >
            BACK TO WEDDING WORLD
          </button>
          <button
            type="button"
            className="cursor-pointer border-0 bg-[#1f1a1b] px-3 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b] sm:px-4"
          >
            VIEW 2026 COLLECTION
          </button>
          <button
            type="button"
            className="cursor-pointer border-0 bg-[#1f1a1b] px-3 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b] sm:px-4"
          >
            BOOK APPOINTMENT
          </button>
        </nav>
      </header>

      <section className="bg-[#EDEAE6] pb-8 pt-5 ">
        <div className="container mx-auto overflow-hidden rounded-[0.6rem] bg-[#f8f5f3]">
          <div className="bg-[#ab8466] px-3 py-2 text-center text-[0.86rem] text-[#f7ede4]">
            The Wedding World Virtual Bridal Experience
          </div>

          <div className="grid min-h-160 grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_minmax(0,1.95fr)_minmax(0,1.15fr)]">
            <aside className="bg-[#F6F5F3] xl:p-5">
              <Image
                src={secondaryImage}
                alt="Virtual Fitting Room"
                className="w-full h-auto"
              />
              <p className="mt-6 leading-6 text-[#161215]">
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

              <div className="relative mt-2 overflow-hidden rounded-[0.85rem] border border-dashed border-[#ceb9a7] bg-[#f8f3ee] text-[#b48b6a] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
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
                    <button
                      type="button"
                      className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-lg bg-[#312425]/60 text-lg text-white shadow-lg backdrop-blur-sm transition hover:bg-[#312425]/75"
                      onClick={(event) => {
                        event.preventDefault();
                        setPhotoActionsOpen((current) => !current);
                      }}
                      aria-label="Open photo actions"
                      aria-expanded={photoActionsOpen}
                    >
                      ☝
                    </button>
                    {photoActionsOpen ? (
                      <div className="absolute bottom-3 right-3 grid w-32 gap-2">
                        <button
                          type="button"
                          className="w-full rounded-md border-0 bg-[rgba(46,36,31,0.68)] px-2.5 py-2 text-left text-[0.8rem] text-white transition hover:bg-[rgba(46,36,31,0.78)]"
                          onClick={(event) => {
                            event.preventDefault();
                            openFilePicker();
                            setPhotoActionsOpen(false);
                          }}
                        >
                          Change photo
                        </button>
                        <button
                          type="button"
                          className="w-full rounded-md border-0 bg-[rgba(234,83,83,0.2)] px-2.5 py-2 text-left text-[0.8rem] text-[#9e1e1e] transition hover:bg-[rgba(234,83,83,0.28)]"
                          onClick={(event) => {
                            event.preventDefault();
                            removePhoto();
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              <button
                type="button"
                className="mt-3 w-full cursor-pointer rounded-[0.35rem] border-0 bg-[linear-gradient(90deg,#f515cb_0%,#4438cb_100%)] px-4 py-3 text-[0.88rem] tracking-[0.05em] text-[#f7f4ff] shadow-[0_12px_22px_rgba(77,62,151,0.25)] transition hover:brightness-105"
              >
                ✨ TRY ON
              </button>
            </aside>

            <section className="bg-white xl:p-5">
              <h2 className="m-0 text-[1.7rem] font-semibold tracking-[0.01em]">
                Wedding Dresses
              </h2>
              <div className="mt-7 max-w-55">
                <button
                  type="button"
                  onClick={() => setIsSilhouetteOpen((value) => !value)}
                  className="flex w-full items-center justify-between border-0 bg-transparent p-0 text-left font-semibold text-[#ac8464]"
                >
                  <span className="leading-none font-bold">Silhouette</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isSilhouetteOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {isSilhouetteOpen ? (
                  <ul className="m-0 mt-3 list-none p-0">
                    {SILHOUETTE_OPTIONS.map((option) => (
                      <li
                        key={option.label}
                        className="border-b border-[#ccb7a6] pb-2 pt-1 mt-4"
                      >
                        <button
                          type="button"
                          className={`flex w-full items-center justify-between border-0 bg-transparent p-0 text-left  transition ${
                            selectedSilhouette === option.label
                              ? "font-medium text-[#241d1b]"
                              : "text-[#2f2724] hover:text-[#221b19]"
                          }`}
                          onClick={() => onSelectSilhouette(option)}
                        >
                          <span className="leading-[1.05]">{option.label}</span>
                          <ChevronRight className="h-4 w-4 text-[#ac8464]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <button
                  type="button"
                  onClick={onSelectPrincess}
                  className={`mt-7 flex w-full items-center justify-between border-0 bg-transparent p-0 text-left transition font-bold ${
                    selectedSilhouette === "Princess"
                      ? "font-semibold text-[#ac8464]"
                      : "text-[#ac8464] hover:text-[#987357]"
                  }`}
                >
                  <span className="leading-[1.05]">Princess</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
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

            <section className="relative xl:py-5 bg-white">
              <div className="min-h-105 overflow-hidden rounded-[0.7rem] sm:min-h-130 xl:min-h-147">
                <img
                  src={selectedDress.image}
                  alt={selectedDress.name}
                  className="h-160 w-full origin-[50%_38%] object-cover transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>

              <div className="absolute right-7 top-6 grid gap-2">
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-[0.3rem] border-0 bg-[rgba(34,34,34,0.45)] text-[1.15rem] leading-none text-[#f6f5f5] transition hover:bg-[rgba(34,34,34,0.55)]"
                  onClick={() =>
                    setZoom((value) =>
                      Math.min(2.4, Number((value + 0.15).toFixed(2))),
                    )
                  }
                >
                  +
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-[0.3rem] border-0 bg-[rgba(34,34,34,0.45)] text-[1.15rem] leading-none text-[#f6f5f5] transition hover:bg-[rgba(34,34,34,0.55)]"
                  onClick={() =>
                    setZoom((value) =>
                      Math.max(1, Number((value - 0.15).toFixed(2))),
                    )
                  }
                >
                  -
                </button>
              </div>
            </section>

            <aside className="flex flex-col justify-between gap-4 xl:p-5 bg-white">
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
                  className="mb-2 w-full rounded-[0.3rem] border border-[#ded6d0] bg-[#f7f5f4] px-3 py-2.5 text-[#4d4642] outline-none transition placeholder:text-[#8f837b] focus:border-[#b48c6c]"
                />
                <button
                  type="button"
                  className="mt-1 w-full cursor-pointer border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b]"
                >
                  SEND
                </button>
                <button
                  type="button"
                  className="mt-2 w-full cursor-pointer border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b]"
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
