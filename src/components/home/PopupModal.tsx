"use client";

type PopupModalProps = {
  message: string;
  onClose: () => void;
};

export default function PopupModal({ message, onClose }: PopupModalProps) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-md bg-white p-5 text-center shadow-xl">
        <p className="text-sm text-[#3f3734]">{message}</p>
        <button
          type="button"
          className="mt-4 w-full rounded-none border-0 bg-[#1f1a1b] px-4 py-2.5 text-[0.75rem] tracking-[0.06em] text-white transition hover:bg-[#30292b]"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
