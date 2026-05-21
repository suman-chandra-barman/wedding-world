"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent } from "react";
import type { SendStatus, TryOnItem } from "./types";
import TryOnSidebarSkeleton from "../skeleton/TryOnSidebarSkeleton";
import Link from "next/link";
import Image from "next/image";

type TryOnSidebarProps = {
  tryOnHistory: TryOnItem[];
  selectedTryOnIds: Set<number>;
  activeTryOnId: number | null;
  isLoading: boolean;
  onToggleTryOn: (id: number) => void;
  onPreviewTryOn: (item: TryOnItem) => void;
  email: string;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sendStatus: SendStatus;
  onSendEmail: () => void;
  isPrivacyAccepted: boolean;
  onPrivacyChange: (accepted: boolean) => void;
};

export default function TryOnSidebar({
  tryOnHistory,
  selectedTryOnIds,
  activeTryOnId,
  isLoading,
  onToggleTryOn,
  onPreviewTryOn,
  email,
  onEmailChange,
  sendStatus,
  onSendEmail,
  isPrivacyAccepted,
  onPrivacyChange,
}: TryOnSidebarProps) {
  // Validation: Email format check
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isEmailNotEmpty = email.trim().length > 0;
  const canSendEmail = isEmailNotEmpty && isValidEmail && isPrivacyAccepted;
  return (
    <aside className="flex flex-col justify-between gap-4 p-4 xl:p-5 bg-white">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your try on</h2>
        <div className="overflow-y-auto lg:h-67 space-y-1 rounded-lg bg-[#EDEAE6] p-3">
          {isLoading ? (
            <TryOnSidebarSkeleton />
          ) : tryOnHistory.length === 0 ? (
            <div className="rounded-md bg-white/60 px-3 py-4 text-sm text-[#8d8179]">
              Your generated try-on images will appear here.
            </div>
          ) : (
            tryOnHistory.map((item) => {
              const isSelected = selectedTryOnIds.has(item.id);
              const isActive = activeTryOnId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`grid grid-cols-[58px_minmax(0,1fr)] items-center gap-1 rounded-md border bg-transparent p-1.5 text-left transition hover:bg-white/45 ${
                    isActive
                      ? "bg-white/80 border-[#e3d8cf]"
                      : "border-transparent"
                  }`}
                  onClick={() => onPreviewTryOn(item)}
                >
                  <Image
                    src={item.generatedImage}
                    alt={`Try on ${item.id}`}
                    className="h-16 w-14 rounded-[0.28rem] object-cover"
                    width={58}
                    height={76}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.88rem] text-[#3f3734]">
                      Wedding dress {item.id}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleTryOn(item.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="h-3.5 w-3.5 cursor-pointer rounded-sm border border-[#b48c6c] text-[#b48c6c] accent-[#b48c6c]"
                      aria-label={`Select try on ${item.id}`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg lg:text-xl font-semibold leading-[1.18] text-[#161215">
          Send me my photos via email.
        </h3>

        {/* Email Input Field */}
        <input
          type="email"
          placeholder="EMAIL"
          className="mb-4 w-full rounded-none border border-[#ded6d0] bg-[#f7f5f4] px-3 py-2.5 text-[#4d4642] outline-none transition placeholder:text-[#8f837b] focus:border-[#b48c6c]"
          value={email}
          onChange={onEmailChange}
          aria-label="Email address"
        />

        {/* Privacy Statement Checkbox */}
        <div className="mb-4 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="privacy-checkbox"
            checked={isPrivacyAccepted}
            onChange={(e) => onPrivacyChange(e.target.checked)}
            className="mt-1 h-4 w-4 cursor-pointer rounded border border-[#b48c6c] text-[#b48c6c] accent-[#b48c6c] flex-shrink-0"
            aria-label="Accept privacy statement"
          />
          <label
            htmlFor="privacy-checkbox"
            className="text-xs leading-relaxed text-[#6b6360] cursor-pointer"
          >
            Ja, ich möchte News und Aktionen von Wedding World erhalten. Ich
            stimme der Nutzung meiner Daten zu Informations- und Werbezwecken zu
            und kann meine Einwilligung jederzeit widerrufen. Die{" "}
            <Link
              href="/privacy"
              className="underline hover:text-[#b48c6c] transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzhinweise
            </Link>{" "}
            habe ich gelesen und akzeptiert.
          </label>
        </div>

        {/* Send Button */}
        <button
          type="button"
          className="mt-1 w-full cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b] disabled:cursor-not-allowed disabled:opacity-70"
          onClick={onSendEmail}
          disabled={!canSendEmail || sendStatus === "sending"}
          aria-label="Send photos via email"
        >
          {sendStatus === "sending" ? "SENDING..." : "SEND"}
        </button>

        <Link
          href="https://www.weddingworld.de/termin-buchen/terminbuchung-braut"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="mt-2 uppercase w-full cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.74rem] tracking-[0.06em] text-white transition hover:bg-[#30292b] disabled:cursor-not-allowed disabled:opacity-70">
            TERMIN BUCHEN
          </button>
        </Link>
      </div>
    </aside>
  );
}
