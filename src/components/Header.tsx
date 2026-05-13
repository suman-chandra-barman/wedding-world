import Image from "next/image";
import logo from "@/assets/logo.svg";

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

      <header className="container mx-auto flex flex-col items-stretch justify-center gap-16 rounded-[0.35rem] bg-white p-4 sm:flex-row sm:items-center sm:gap-12 sm:px-8">
        <div className="grid justify-items-center gap-1">
          <Image src={logo} alt="Wedding World Logo" className="h-14 w-auto" />
        </div>
        <nav className="flex flex-wrap justify-center gap-2 sm:justify-end">
          <button
            type="button"
            className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
          >
            BACK TO WEDDING WORLD
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
          >
            VIEW 2026 COLLECTION
          </button>
          {/* <button
            type="button"
            className="cursor-pointer rounded-none border-0 bg-[#1f1a1b] px-4 py-3 text-[0.66rem] tracking-[0.03em] text-[#f7f3f1] transition hover:bg-[#30292b]"
          >
            BOOK APPOINTMENT
          </button> */}
        </nav>
      </header>
    </header>
  );
};

export default Header;
