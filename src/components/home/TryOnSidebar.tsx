"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent } from "react";
import type { SendStatus, TryOnItem } from "./types";

type TryOnSidebarProps = {
  tryOnHistory: TryOnItem[];
  selectedTryOnIds: Set<number>;
  onToggleTryOn: (id: number) => void;
  email: string;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sendStatus: SendStatus;
  onSendEmail: () => void;
};

export default function TryOnSidebar({
  tryOnHistory,
  selectedTryOnIds,
  onToggleTryOn,
  email,
  onEmailChange,
  sendStatus,
  onSendEmail,
}: TryOnSidebarProps) {
  return (
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
                onClick={() => onToggleTryOn(item.id)}
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
          onChange={onEmailChange}
        />
        <button
          type="button"
          className="mt-1 w-full cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b] disabled:cursor-not-allowed disabled:opacity-70"
          onClick={onSendEmail}
          disabled={sendStatus === "sending"}
        >
          {sendStatus === "sending" ? "SENDING..." : "SEND"}
        </button>
      </div>
    </aside>
  );
}
