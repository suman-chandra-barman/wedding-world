"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  Trash2,
  WandSparkles,
} from "lucide-react";
import secondaryImage from "@/assets/secondary logo.png";
import type { TryOnStatus, UploadStatus } from "./types";
import ImageUploadSkeleton from "../skeleton/ImageUploadSkeleton";

type UploadPanelProps = {
  uploadedImage: string | null;
  uploadStatus: UploadStatus;
  tryOnStatus: TryOnStatus;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onTryOn: () => void;
  onRemove: () => void;
};

export default function UploadPanel({
  uploadedImage,
  uploadStatus,
  tryOnStatus,
  onUpload,
  onTryOn,
  onRemove,
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <aside className="bg-[#F6F5F3] xl:p-5">
      <Image
        src={secondaryImage}
        alt="Virtual Fitting Room"
        className="w-70 md:w-full h-auto p-4 xl:p-0 mx-auto"
      />
      <div className="mt-0 md:my-4 px-4 xl:p-0">
        <h3 className="text-sm font-semibold text-[#161215] mb-1">
          Probiere jetzt dein Lieblingskleid in unserer Virtual Bridal Fitting
          Room an.
        </h3>
        <ol className="text-sm text-[#161215] list-decimal list-inside">
          <li>Lade ein Foto von dir hoch</li>
          <li>Wähle dein Lieblingskleid aus</li>
          <li>Sieh dich selbst als Braut</li>
          <li>Sende dir deine Kleider per E-Mail</li>
        </ol>
        <p className="text-xs text-[#8d8179] mt-2">(maximal 3 Anproben)</p>
      </div>

      <input
        ref={fileInputRef}
        id="upload-photo"
        accept="image/*"
        type="file"
        className="sr-only"
        onChange={onUpload}
      />

      <div className="group relative overflow-hidden w-50 sm:w-full mx-auto rounded-[0.85rem] border border-dashed border-[#ceb9a7] bg-[#f8f3ee] text-[#b48b6a] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        {!uploadedImage ? (
          <button
            type="button"
            onClick={openFilePicker}
            className="flex min-h-40 md:min-h-57 w-full cursor-pointer flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,#fbf7f3_0%,#f5eee8_100%)] px-6 py-10 text-[#b48b6a] transition hover:bg-[#f7f0ea]"
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
              className="h-40 md:h-57 w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[#6f6664]/46 opacity-0 md:opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100" />
            <div className="pointer-events-none absolute bottom-4 right-2 grid w-40 gap-1 opacity-100 md:opacity-0 md:pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-none border border-white/10 bg-[#1f1a1b] px-3 py-2 text-left text-[0.8rem] text-[#f8f6f5] shadow-[0_10px_22px_rgba(42,35,35,0.25)] transition hover:bg-[#30292b]"
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
                className="flex w-full items-center gap-2 rounded-none border border-white/10 bg-[#1f1a1b] px-3 py-2 text-left text-[0.8rem] text-[#f8f6f5] shadow-[0_10px_22px_rgba(42,35,35,0.25)] transition hover:bg-[#30292b]"
                onClick={(event) => {
                  event.preventDefault();
                  onRemove();
                }}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </>
        )}
        {(uploadStatus === "uploading" || tryOnStatus === "loading") && (
          <ImageUploadSkeleton
            variant={tryOnStatus === "loading" ? "generate" : "upload"}
          />
        )}
      </div>

      <button
        type="button"
        className="hidden md:flex mt-4 w-full cursor-pointer items-center justify-center gap-4 rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.88rem] tracking-[0.05em] text-[#f7f4ff] transition hover:bg-[#30292b] disabled:cursor-not-allowed disabled:opacity-70"
        onClick={onTryOn}
        disabled={tryOnStatus === "loading"}
      >
        <WandSparkles />
        {tryOnStatus === "loading" ? "GENERATING..." : "TRY ON"}
      </button>
    </aside>
  );
}
