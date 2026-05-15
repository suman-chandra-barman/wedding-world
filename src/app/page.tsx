"use client";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import UploadPanel from "@/components/home/UploadPanel";
import CategoriesPanel from "@/components/home/CategoriesPanel";
import ImageViewer from "@/components/home/ImageViewer";
import TryOnSidebar from "@/components/home/TryOnSidebar";
import PopupModal from "@/components/home/PopupModal";
import type {
  CategoriesResponse,
  Category,
  CategoryImage,
  SendStatus,
  TryOnItem,
  TryOnResponse,
  TryOnStatus,
  UploadPayload,
  UploadResponse,
  UploadStatus,
} from "@/components/home/types";

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
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [tryOnStatus, setTryOnStatus] = useState<TryOnStatus>("idle");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [userImageId, setUserImageId] = useState<number | null>(null);

  const selectedCategory = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list.find((item) => item.category_id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

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

  // Try On handler
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
            <UploadPanel
              uploadedImage={uploadedImage}
              uploadStatus={uploadStatus}
              tryOnStatus={tryOnStatus}
              onUpload={onUpload}
              onTryOn={onTryOn}
              onRemove={removePhoto}
            />

            <CategoriesPanel
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              selectedCategory={selectedCategory}
              selectedDressImageId={selectedDressImageId}
              onSelectCategory={onSelectCategory}
              onSelectDressImage={onSelectDressImage}
            />

            <ImageViewer
              generatedImageUrl={generatedImageUrl}
              selectedDressImageUrl={selectedDressImageUrl}
              zoom={zoom}
              onZoomIn={() =>
                setZoom((value) =>
                  Math.min(2.4, Number((value + 0.15).toFixed(2))),
                )
              }
              onZoomOut={() =>
                setZoom((value) =>
                  Math.max(1, Number((value - 0.15).toFixed(2))),
                )
              }
            />

            <TryOnSidebar
              tryOnHistory={tryOnHistory}
              selectedTryOnIds={selectedTryOnIds}
              onToggleTryOn={toggleTryOnSelection}
              email={email}
              onEmailChange={(event) => setEmail(event.target.value)}
              sendStatus={sendStatus}
              onSendEmail={onSendEmail}
            />
          </div>
        </div>
      </section>
      {popupMessage && (
        <PopupModal
          message={popupMessage}
          onClose={() => setPopupMessage(null)}
        />
      )}
    </main>
  );
}
