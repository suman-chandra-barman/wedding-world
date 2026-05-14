"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
import Header from "@/components/Header";

type CategoryImage = {
  id: number;
  image_url: string;
  uploaded_at: string;
};

type Category = {
  category_id: number;
  category_type: string;
  images: CategoryImage[];
  created_at: string;
  updated_at: string;
};

type CategoriesPayload = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
};

type CategoriesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: CategoriesPayload;
};

type UploadPayload = {
  id: number;
  image: string;
  session_key: string;
  uploaded_at: string;
};

type UploadResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: UploadPayload;
};

type TryOnResponse = {
  id: number;
  generated_image: string;
  created_at: string;
  session_key: string;
};

type TryOnItem = {
  id: number;
  generatedImage: string;
  createdAt: string;
  sessionKey: string;
};

export default function HomePage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  const apiUrl = (path: string) =>
    `${backendUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
  const [zoom, setZoom] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedDressImageId, setSelectedDressImageId] = useState<
    number | null
  >(null);
  const [selectedDressImageUrl, setSelectedDressImageUrl] = useState<
    string | null
  >(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [tryOnHistory, setTryOnHistory] = useState<TryOnItem[]>([]);
  const [selectedTryOnIds, setSelectedTryOnIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [email, setEmail] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [tryOnStatus, setTryOnStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [sendStatus, setSendStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [userImageId, setUserImageId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedCategory = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list.find((item) => item.category_id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(apiUrl("/api/categories/"));
        if (!response.ok) {
          throw new Error("Failed to load categories.");
        }
        const data = (await response.json()) as CategoriesResponse;
        const list = data.data?.results ?? [];
        setCategories(list);
        const firstCategory = list[0] ?? null;
        if (firstCategory) {
          setSelectedCategoryId(firstCategory.category_id);
          const firstImage = firstCategory.images[0] ?? null;
          if (firstImage) {
            setSelectedDressImageId(firstImage.id);
            setSelectedDressImageUrl(firstImage.image_url);
          }
        }
      } catch (error) {
        setPopupMessage("Unable to load categories. Please try again.");
      }
    };

    loadCategories();
  }, []);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    const nextImage = URL.createObjectURL(file);
    setUploadedImage(nextImage);
    setUploadStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(apiUrl("/api/user/upload/"), {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed.");
      }
      const data = (await response.json()) as UploadResponse | UploadPayload;
      const payload = "data" in data ? data.data : data;
      setSessionKey(payload.session_key);
      setUserImageId(payload.id);
      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");
      setPopupMessage("Upload failed. Please try again.");
    }
  };

  const removePhoto = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setSessionKey(null);
    setUserImageId(null);
    setUploadStatus("idle");
  };

  const onSelectCategory = (category: Category) => {
    setSelectedCategoryId(category.category_id);
    const firstImage = category.images[0] ?? null;
    if (firstImage) {
      setSelectedDressImageId(firstImage.id);
      setSelectedDressImageUrl(firstImage.image_url);
    } else {
      setSelectedDressImageId(null);
      setSelectedDressImageUrl(null);
    }
  };

  const onSelectDressImage = (image: CategoryImage) => {
    setSelectedDressImageId(image.id);
    setSelectedDressImageUrl(image.image_url);
  };

  const toggleTryOnSelection = (id: number) => {
    setSelectedTryOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const onTryOn = async () => {
    if (!userImageId || !sessionKey) {
      setPopupMessage("Please upload your photo first.");
      return;
    }

    if (!selectedDressImageId) {
      setPopupMessage("Please select a dress image first.");
      return;
    }

    setTryOnStatus("loading");

    try {
      const response = await fetch(apiUrl("/api/try-on/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_key: sessionKey,
          user_image_id: userImageId,
          dress_image_id: selectedDressImageId,
        }),
      });

      if (!response.ok) {
        throw new Error("Try on failed.");
      }

      const data = (await response.json()) as TryOnResponse;
      const nextItem: TryOnItem = {
        id: data.id,
        generatedImage: data.generated_image,
        createdAt: data.created_at,
        sessionKey: data.session_key,
      };

      setGeneratedImageUrl(data.generated_image);
      setTryOnHistory((prev) => [nextItem, ...prev]);
      setTryOnStatus("success");
    } catch (error) {
      setTryOnStatus("error");
      setPopupMessage("Try on failed. Please try again.");
    }
  };

  const onSendEmail = async () => {
    if (!email.trim()) {
      setPopupMessage("Please enter your email first.");
      return;
    }

    if (selectedTryOnIds.size === 0) {
      setPopupMessage(
        "Please select at least one image from your try on list.",
      );
      return;
    }

    setSendStatus("sending");

    try {
      const response = await fetch(apiUrl("/api/user/send-email/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generated_image_ids: Array.from(selectedTryOnIds),
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Send failed.");
      }

      setSendStatus("success");
      setPopupMessage("Images sent successfully.");
      setSelectedTryOnIds(new Set());
    } catch (error) {
      setSendStatus("error");
      setPopupMessage("Unable to send images. Please try again.");
    }
  };

  return (
    <main className="min-h-screen text-[#2b2624]">
      <Header />

      <section className="bg-[#EDEAE6] pb-8 px-2 py-4 sm:p-4">
        <div className="container mx-auto overflow-hidden rounded-[0.6rem] bg-[#f8f5f3]">
          <div className="bg-[#ab8466] px-3 py-2 text-center text-[0.86rem] text-[#f7ede4]">
            The Wedding World Virtual Bridal Experience
          </div>

          <div className="grid min-h-160 grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_minmax(0,1.95fr)_minmax(0,1.15fr)]">
            {/* Left Sidebar - upload image */}
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
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-4 rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.88rem] tracking-[0.05em] text-[#f7f4ff] transition hover:bg-[#30292b] disabled:cursor-not-allowed disabled:opacity-70"
                onClick={onTryOn}
                disabled={tryOnStatus === "loading"}
              >
                <WandSparkles />
                {tryOnStatus === "loading" ? "GENERATING..." : "TRY ON"}
              </button>
              {uploadStatus === "uploading" && (
                <p className="mt-3 text-xs tracking-[0.08em] text-[#8d8179]">
                  Uploading...
                </p>
              )}
            </aside>

            {/* Wedding Dresses Section */}
            <section className="bg-white p-5 xl:p-6">
              <h2 className="m-0 text-[1.7rem] font-semibold tracking-[0.01em]">
                Wedding Dresses
              </h2>
              <div className="mt-8 max-w-55">
                <p className="leading-none font-bold text-[#ac8464]">
                  Categories
                </p>

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
                    No dress images in this category yet.
                  </div>
                )}
              </div>
            </section>

            {/* Image viewer section */}
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
                  {generatedImageUrl || selectedDressImageUrl ? (
                    <img
                      src={generatedImageUrl ?? selectedDressImageUrl ?? ""}
                      alt="Generated preview"
                      className="h-160 w-full origin-[50%_38%] object-cover transition-transform duration-200"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  ) : (
                    <div className="flex h-160 items-center justify-center bg-[#f6f2ee] text-sm text-[#8d8179]">
                      Upload your photo and select a dress to generate.
                    </div>
                  )}
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

            {/* Right sidebar section */}
            <aside className="flex flex-col justify-between gap-4 p-4 xl:p-5 bg-white">
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Try On</h2>
                <div className="grid gap-3 rounded-lg bg-[#EDEAE6] p-3">
                  {tryOnHistory.length === 0 ? (
                    <div className="rounded-md bg-white/60 px-3 py-4 text-sm text-[#8d8179]">
                      Your generated try-on images will appear here.
                    </div>
                  ) : (
                    tryOnHistory.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`grid grid-cols-[58px_minmax(0,1fr)] items-center gap-2 rounded-md border-0 bg-transparent p-1.5 text-left transition hover:bg-white/45 ${
                          selectedTryOnIds.has(item.id) ? "bg-white/80" : ""
                        }`}
                        onClick={() => toggleTryOnSelection(item.id)}
                      >
                        <img
                          src={item.generatedImage}
                          alt={`Try on ${item.id}`}
                          className="h-19 w-14 rounded-[0.28rem] object-cover"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[0.9rem] text-[#3f3734]">
                            Generated {item.id}
                          </span>
                          <span
                            className={`h-3.5 w-3.5 rounded-sm border border-[#b48c6c] ${
                              selectedTryOnIds.has(item.id)
                                ? "bg-[#b48c6c]"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg lg:text-xl font-semibold leading-[1.18] text-[#161215">
                  Send me my photos via email.
                </h3>
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="mb-3 w-full rounded-none border border-[#ded6d0] bg-[#f7f5f4] px-3 py-2.5 text-[#4d4642] outline-none transition placeholder:text-[#8f837b] focus:border-[#b48c6c]"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button
                  type="button"
                  className="mt-1 w-full cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b] disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={onSendEmail}
                  disabled={sendStatus === "sending"}
                >
                  {sendStatus === "sending" ? "SENDING..." : "SEND"}
                </button>
                {/* <button
                  type="button"
                  className="mt-3 w-full cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b]"
                >
                  BOOK APPOINTMENT
                </button> */}
              </div>
            </aside>
          </div>
        </div>
      </section>
      {popupMessage && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-md bg-white p-5 text-center shadow-xl">
            <p className="text-sm text-[#3f3734]">{popupMessage}</p>
            <button
              type="button"
              className="mt-4 w-full rounded-none border-0 bg-[#1f1a1b] px-4 py-2.5 text-[0.75rem] tracking-[0.06em] text-white transition hover:bg-[#30292b]"
              onClick={() => setPopupMessage(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
