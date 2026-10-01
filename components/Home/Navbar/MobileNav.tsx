"use client";

import {
  navLinks as navLinksDefault,
  personalInfo as personalInfoDefault,
} from "@/constant/portfolio";
import type { NavLinkDto, PersonalInfoDto } from "@/lib/dto";
import Link from "next/link";
import React from "react";
import { CgClose } from "react-icons/cg";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

type NavProps = {
  showNav: boolean;
  closeNav: () => void;
  navLinks?: NavLinkDto[];
  personalInfo?: PersonalInfoDto;
};

const MobileNav = ({
  closeNav,
  showNav,
  navLinks = navLinksDefault,
  personalInfo = personalInfoDefault,
}: NavProps) => {
  const navOpen = showNav ? "translate-x-0" : "translate-x-[100%]";
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <div
        className={`fixed inset-0 ${navOpen} transform transition-all right-0 duration-500 z-[10002] bg-black 
        opacity-70 w-full h-screen`}
      ></div>
      <div
        className={`${navOpen} fixed justify-center flex flex-col h-full transform transition-all duration-500
        delay-300 w-[80%] sm:w-[60%] space-y-6 z-[10050] right-0 border-l ${
          isDark
            ? "bg-[#0d0d1f] text-white border-white/10"
            : "bg-white text-gray-800 border-gray-200"
        }`}
      >
        {navLinks.map((link) => {
          return (
            <a
              key={link.id}
              href={link.url}
              onClick={closeNav}
              className={`w-fit text-xl ml-12 border-b-[1.5px] pb-1 sm:text-[30px] hover:text-blue-400 transition-colors ${
                isDark ? "border-white/20" : "border-gray-300"
              }`}
            >
              {link.label}
            </a>
          );
        })}

        <div className="flex items-center space-x-2 ml-12 mt-8">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? "bg-white" : "bg-gray-800"
            }`}
          >
            <span
              className={
                isDark ? "text-black font-bold" : "text-white font-bold"
              }
            >
              {personalInfo.name.charAt(0)}
            </span>
          </div>
          <span
            className={
              isDark ? "text-white font-bold" : "text-gray-800 font-bold"
            }
          >
            {personalInfo.name}
          </span>
        </div>

        <div className="ml-12 mt-4">
          <ThemeToggle />
        </div>

        <CgClose
          onClick={closeNav}
          className={`absolute top-4 right-4 w-8 h-8 cursor-pointer ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        />
      </div>
    </div>
  );
};

export default MobileNav;
