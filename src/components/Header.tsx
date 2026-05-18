import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      {/* top header */}
      <section className="bg-[#EDEAE6] px-6 py-3 text-center text-[#8d8179] sm:px-8 flex flex-col items-center sm:flex-row sm:justify-center sm:gap-2">
        <span>Guest at the largest and </span>
        {"  "}
        <span className="text-[#161215] ">
          most beautiful out&shy;fitter in Germany.
        </span>
      </section>

      <header className="container mx-auto flex flex-col items-stretch justify-center gap-4 rounded-[0.35rem] bg-white p-4 sm:flex-row sm:items-center sm:gap-12 sm:px-8">
        <div className="grid justify-items-center gap-1">
          <Image src={logo} alt="Wedding World Logo" className="h-14 w-auto" />
        </div>
        <nav className="flex flex-wrap justify-center gap-2 sm:justify-end">
          <Link
            href="https://www.weddingworld.de/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
            >
              BACK TO WEDDING WORLD
            </button>
          </Link>
          <Link
            href="https://www.weddingworld.de/brautkleider"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
            >
              VIEW 2026 COLLECTION
            </button>
          </Link>
          <Link
            href="https://www.weddingworld.de/termin-buchen/terminbuchung-braut"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
            >
              BOOK APPOINTMENT
            </button>
          </Link>
        </nav>
      </header>
    </header>
  );
};

export default Header;
