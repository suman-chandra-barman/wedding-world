"use client";
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut } from "lucide-react";
import secondaryImage from "@/assets/secondary logo.png";

type ImageViewerProps = {
  generatedImageUrl: string | null;
  selectedDressImageUrl: string | null;
};

export default function ImageViewer({
  generatedImageUrl,
  selectedDressImageUrl,
}: ImageViewerProps) {
  const viewerKey = generatedImageUrl ?? selectedDressImageUrl ?? "empty";

  return (
    <section className=" bg-white xl:pt-6">
      <div className="mb-4 pt-4 flex justify-center sm:hidden">
        <Image
          src={secondaryImage}
          alt="See yourself as a bride"
          className="h-auto w-44"
        />
      </div>
      <div className="relative mx-4 xl:mx-0">
        <div className="w-full md:min-h-105 overflow-hidden rounded-[0.7rem] sm:min-h-130 xl:min-h-147">
          {generatedImageUrl || selectedDressImageUrl ? (
            <TransformWrapper
              key={viewerKey}
              minScale={1}
              maxScale={2.4}
              initialScale={1}
              centerOnInit
              doubleClick={{ disabled: true }}
              wheel={{ disabled: true }}
              panning={{ velocityDisabled: true }}
              pinch={{ disabled: false }}
              limitToBounds
            >
              {({ zoomIn, zoomOut }) => (
                <div className="relative w-full">
                  <TransformComponent
                    wrapperClass="!block !w-full"
                    contentClass="!block !w-full"
                  >
                    <div className="w-full">
                      <Image
                        src={generatedImageUrl ?? selectedDressImageUrl ?? ""}
                        alt="Generated preview"
                        draggable={false}
                        className="block h-auto w-full select-none object-cover"
                        width={600}
                        height={800}
                      />
                    </div>
                  </TransformComponent>
                  <div className="absolute right-6 top-6 overflow-hidden rounded-[0.42rem] border border-white/10 bg-[rgba(59,55,54,0.78)] shadow-[0_12px_20px_rgba(12,10,10,0.24)] backdrop-blur-[1.5px]">
                    <button
                      type="button"
                      aria-label="Zoom in"
                      className="grid h-10 w-11 cursor-pointer place-items-center border-0 bg-transparent text-[#f6f5f5] transition hover:bg-white/7"
                      onClick={() => zoomIn()}
                    >
                      <ZoomIn className="h-5 w-5" strokeWidth={1.7} />
                    </button>
                    <button
                      type="button"
                      aria-label="Zoom out"
                      className="grid h-10 w-11 cursor-pointer place-items-center border-0 bg-transparent text-[#f6f5f5] transition hover:bg-white/7"
                      onClick={() => zoomOut()}
                    >
                      <ZoomOut className="h-5 w-5" strokeWidth={1.7} />
                    </button>
                  </div>
                </div>
              )}
            </TransformWrapper>
          ) : (
            <div className="flex h-160 items-center justify-center bg-[#f6f2ee] text-sm text-[#8d8179]">
              Upload your photo and select a dress to generate.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
