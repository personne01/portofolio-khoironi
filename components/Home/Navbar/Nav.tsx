"use client";

import { navLinks, personalInfo } from "@/constant/portfolio";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiDownload } from "react-icons/bi";
import { FaCode } from "react-icons/fa";
import { HiBars3BottomRight } from "react-icons/hi2";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

type NavProps = {
  openNav: () => void;
};

const Nav = ({ openNav }: NavProps) => {
  const [navBg, setNavBg] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handler = () => {
      if (window.scrollY >= 90) setNavBg(true);
      if (window.scrollY < 90) setNavBg(false);
    };

    window.addEventListener("scroll", handler);

    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    const element = document.querySelector(url);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (window.innerWidth < 1024) {
      openNav();
    }
  };

  return (
    <div
      className={`transition-all ${
        navBg ? "bg-[var(--muted)] shadow-md" : "fixed"
      } h-[12vh] z-[10000] fixed w-full`}
    >
      <div className="flex items-center h-full justify-between w-[90%] mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-col ${
            theme === "dark" ? "bg-white" : "bg-[var(--foreground)]"
          }`}>
            <FaCode className={`w-5 h-5 ${theme === "dark" ? "text-black" : "text-white]"}`} />
          </div>
          <div className={`text-x1 hidden sm:block md:text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-[var(--foreground)]"
          }`}>
            {personalInfo.name}
          </div>
        </Link>
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              onClick={(e) => handleNavClick(e, link.url)}
              className={`text-base hover:text-blue-400 font-medium transition-all duration-200 ${
                theme === "dark" ? "text-white" : "text-[var(--foreground)]"
              }`}
            >
              <p>{link.label}</p>
            </a>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Link
            href={personalInfo.resume}
            download
            className="hidden md:flex px-6 py-3 text-sm cursor-pointer rounded-lg bg-blue-800 hover:bg-blue-700 transition-all duration-300 text-white items-center space-x-2"
          >
            <BiDownload className="w-5 h-5" />
            <span>CV</span>
          </Link>
          <button
            onClick={openNav}
            className={`ml-2 w-10 h-10 lg:hidden flex items-center justify-center rounded-lg ${
              theme === "dark" ? "bg-white/10" : "bg-[var(--foreground)]/10"
            }`}
          >
            <HiBars3BottomRight className={`w-6 h-6 cursor-pointer ${
              theme === "dark" ? "text-white" : "text-[var(--foreground)]"
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nav;