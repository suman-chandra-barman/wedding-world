import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

// Mulish Font Configuration
const mulish = localFont({
  src: [
    {
      path: "../../public/fonts/mulish/Mulish-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/mulish/Mulish-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/mulish/Mulish-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/mulish/Mulish-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-mulish",
});

// Minion Pro Font Configuration
const minionPro = localFont({
  src: [
    {
      path: "../../public/fonts/minion/MinionPro-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/minion/MinionPro-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/minion/MinionPro-It.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-minion",
});

export const metadata: Metadata = {
  title: "Wedding World",
  description: "A wedding clothing boutique app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${minionPro.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-(family-name:--font-mulish) text-[#161215]"
      >
        {children}
      </body>
    </html>
  );
}
