function ImageUploadSkeleton() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#6f6765]/70 text-center text-[#f7f3ef] backdrop-blur-sm">
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-white/45 border-t-white/95"
        aria-hidden="true"
      />
      <div className="text-[0.98rem] text-white/90 drop-shadow-[0_2px_8px_rgba(28,20,18,0.45)]">
        Please wait a moment.
      </div>
      <div className="text-[0.98rem] text-white/90 drop-shadow-[0_2px_8px_rgba(28,20,18,0.45)]">
        It&#39;s worth of it.
      </div>
    </div>
  );
}

export default ImageUploadSkeleton;
