"use client";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
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
  TryOnHistoryResponse,
  TryOnItem,
  TryOnResponse,
  TryOnStatus,
  UploadPayload,
  UploadResponse,
  UploadStatus,
} from "@/components/home/types";

export default function HomePage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  const apiUrl = useCallback(
    (path: string) =>
      `${backendUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`,
    [backendUrl],
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] =
    useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedDressImageId, setSelectedDressImageId] = useState<
    number | null
  >(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [tryOnHistory, setTryOnHistory] = useState<TryOnItem[]>([]);
  const [isTryOnHistoryLoading, setIsTryOnHistoryLoading] =
    useState<boolean>(false);
  const [selectedTryOnIds, setSelectedTryOnIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [activeTryOnId, setActiveTryOnId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [tryOnStatus, setTryOnStatus] = useState<TryOnStatus>("idle");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [userImageId, setUserImageId] = useState<number | null>(null);
  const sessionStorageKey = "ww_session_key";

  const getStoredSessionKey = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(sessionStorageKey);
  }, [sessionStorageKey]);

  const storeSessionKey = useCallback(
    (key: string) => {
      if (typeof window === "undefined") {
        return;
      }
      window.localStorage.setItem(sessionStorageKey, key);
    },
    [sessionStorageKey],
  );

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

  // Load try-on history on mount if session key exists
  useEffect(() => {
    const storedSessionKey = getStoredSessionKey();
    if (!storedSessionKey || tryOnHistory.length > 0) {
      return;
    }

    let isActive = true;
    const loadTryOnHistory = async () => {
      setIsTryOnHistoryLoading(true);
      try {
        const response = await fetch(
          apiUrl(
            `/api/try-on/?session_key=${encodeURIComponent(storedSessionKey)}`,
          ),
        );
        if (!response.ok) {
          throw new Error("Failed to load try-on history.");
        }
        const data = (await response.json()) as TryOnHistoryResponse[];
        if (!isActive) {
          return;
        }
        const list = Array.isArray(data) ? data : [];
        const mapped: TryOnItem[] = list.map((item) => ({
          id: item.id,
          generatedImage: item.generated_image,
          createdAt: item.created_at,
          sessionKey: item.session_key,
        }));
        setTryOnHistory(mapped);
        setSelectedTryOnIds(new Set());
        if (mapped[0]) {
          setActiveImageUrl(mapped[0].generatedImage);
          setActiveTryOnId(mapped[0].id);
        }
      } catch (error) {
        if (isActive) {
          setPopupMessage("Unable to load your images. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsTryOnHistoryLoading(false);
        }
      }
    };

    loadTryOnHistory();
    return () => {
      isActive = false;
    };
  }, [apiUrl, getStoredSessionKey, tryOnHistory.length]);

  // Clear try-on history when session key is removed (e.g., on logout or session expiration)
  useEffect(() => {
    const effectiveSessionKey = sessionKey ?? getStoredSessionKey();
    if (!effectiveSessionKey) {
      setTryOnHistory([]);
      setSelectedTryOnIds(new Set());
      setActiveTryOnId(null);
      setActiveImageUrl(null);
      setIsTryOnHistoryLoading(false);
    }
  }, [getStoredSessionKey, sessionKey]);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsCategoriesLoading(true);
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
            setActiveImageUrl(firstImage.image_url);
          }
        }
      } catch (error) {
        setPopupMessage("Unable to load categories. Please try again.");
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Upload photo handler
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
      formData.append("session_key", getStoredSessionKey() ?? "");
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
      storeSessionKey(payload.session_key);
      setUserImageId(payload.id);
      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");
      setPopupMessage("Upload failed. Please try again.");
    }
  };

  // Remove photo handler
  const removePhoto = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setSessionKey(null);
    setUserImageId(null);
    setUploadStatus("idle");
    setActiveImageUrl(null);
  };

  // Category selection handler
  const onSelectCategory = (category: Category) => {
    setSelectedCategoryId(category.category_id);
    const firstImage = category.images[0] ?? null;
    if (firstImage) {
      setSelectedDressImageId(firstImage.id);
      setActiveImageUrl(firstImage.image_url);
    } else {
      setSelectedDressImageId(null);
      setActiveImageUrl(null);
    }
  };

  const onSelectDressImage = (image: CategoryImage) => {
    setSelectedDressImageId(image.id);
    setActiveImageUrl(image.image_url);
  };

  // Try-On selection toggle handler
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

      const data = (await response.json()) as
        | TryOnResponse
        | {
            data: TryOnResponse;
          };
      const payload = "data" in data ? data.data : data;
      const nextItem: TryOnItem = {
        id: payload.id,
        generatedImage: payload.generated_image,
        createdAt: payload.created_at,
        sessionKey: payload.session_key,
      };

      setActiveImageUrl(payload.generated_image);
      setActiveTryOnId(payload.id);
      setTryOnHistory((prev) => [nextItem, ...prev]);
      setTryOnStatus("success");
    } catch (error) {
      setTryOnStatus("error");
      setPopupMessage("Try on failed. Please try again.");
    }
  };

  // Send Email handler
  const onSendEmail = async () => {
    // Email validation
    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedEmail) {
      setPopupMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail) {
      setPopupMessage("Please enter a valid email address.");
      return;
    }

    // Privacy validation
    if (!isPrivacyAccepted) {
      setPopupMessage(
        "Please accept the privacy statement before sending your images.",
      );
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
          email: trimmedEmail,
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
            Wedding World Virtual Bridal Fitting Room
          </div>

          <div className="grid min-h-160 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_minmax(0,1.95fr)_minmax(0,1.15fr)] xl:gap-0">
            <div className="md:order-1 xl:order-0">
              <UploadPanel
                uploadedImage={uploadedImage}
                uploadStatus={uploadStatus}
                tryOnStatus={tryOnStatus}
                onUpload={onUpload}
                onTryOn={onTryOn}
                onRemove={removePhoto}
              />
            </div>

            <div className="md:order-2 xl:order-0 bg-white">
              <CategoriesPanel
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                selectedCategory={selectedCategory}
                selectedDressImageId={selectedDressImageId}
                isLoading={isCategoriesLoading}
                tryOnStatus={tryOnStatus}
                onSelectCategory={onSelectCategory}
                onSelectDressImage={onSelectDressImage}
                onTryOn={onTryOn}
              />
            </div>

            <div className="md:order-3 xl:order-0 bg-white">
              <ImageViewer
                generatedImageUrl={activeImageUrl}
                selectedDressImageUrl={activeImageUrl}
              />
            </div>

            <div className="md:order-4 xl:order-0 bg-white">
              <TryOnSidebar
                tryOnHistory={tryOnHistory}
                selectedTryOnIds={selectedTryOnIds}
                activeTryOnId={activeTryOnId}
                isLoading={isTryOnHistoryLoading}
                onToggleTryOn={toggleTryOnSelection}
                onPreviewTryOn={(item) => {
                  setActiveImageUrl(item.generatedImage);
                  setActiveTryOnId(item.id);
                }}
                email={email}
                onEmailChange={(event) => setEmail(event.target.value)}
                sendStatus={sendStatus}
                onSendEmail={onSendEmail}
                isPrivacyAccepted={isPrivacyAccepted}
                onPrivacyChange={setIsPrivacyAccepted}
              />
            </div>
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
