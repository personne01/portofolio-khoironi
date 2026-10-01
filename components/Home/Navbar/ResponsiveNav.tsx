"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import Nav from "./Nav";
import type { NavLinkDto, PersonalInfoDto } from "@/lib/dto";

type ResponsiveNavProps = {
  navLinks?: NavLinkDto[];
  personalInfo?: PersonalInfoDto;
};

const ResponsiveNav = ({ navLinks, personalInfo }: ResponsiveNavProps) => {
  const [showNav, setShowNav] = useState(false);
  const pathname = usePathname();

  // The root layout renders this on every route; /admin supplies its own chrome.
  if (pathname.startsWith("/admin")) return null;

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);
  return (
    <div>
      <Nav
        openNav={openNavHandler}
        navLinks={navLinks}
        personalInfo={personalInfo}
      />
      <MobileNav
        showNav={showNav}
        closeNav={closeNavHandler}
        navLinks={navLinks}
        personalInfo={personalInfo}
      />
    </div>
  );
};

export default ResponsiveNav;
