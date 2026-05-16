type ImageUploadSkeletonProps = {
  variant: "upload" | "generate";
};

const messageMap = {
  upload: {
    title: "Uploading photo...",
    subtitle: "Checking lighting and clarity.",
  },
  generate: {
    title: "Generating your try-on preview...",
    subtitle: "Blending fabric, fit, and details.",
  },
} as const;

function ImageUploadSkeleton({ variant }: ImageUploadSkeletonProps) {
  const message = messageMap[variant];

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#6f6765]/70 text-center text-[#f7f3ef] backdrop-blur-sm">
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-white/45 border-t-white/95"
        aria-hidden="true"
      />
      <div className="text-sm text-white/90 drop-shadow-[0_2px_8px_rgba(28,20,18,0.45)]">
        {message.title}
      </div>
      <div className="text-xs text-white/90 drop-shadow-[0_2px_8px_rgba(28,20,18,0.45)]">
        {message.subtitle}
      </div>
    </div>
  );
}

export default ImageUploadSkeleton;
