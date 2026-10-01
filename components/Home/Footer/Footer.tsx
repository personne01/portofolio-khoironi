"use client";

import {
  navLinks as navLinksDefault,
  personalInfo as personalInfoDefault,
  socialLinks as socialLinksDefault,
} from "@/constant/portfolio";
import type { NavLinkDto, PersonalInfoDto, SocialLinkDto } from "@/lib/dto";
import { motion } from "framer-motion";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaMedium,
  FaGlobeAfrica,
} from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const socialIconMap: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  medium: FaMedium,
};

type FooterProps = {
  navLinks?: NavLinkDto[];
  personalInfo?: PersonalInfoDto;
  socialLinks?: SocialLinkDto[];
};

const Footer = ({
  navLinks = navLinksDefault,
  personalInfo = personalInfoDefault,
  socialLinks = socialLinksDefault,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`py-12 border-t ${
        isDark ? "bg-[#0d0d1f] border-white/10" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="w-[90%] mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-[var(--foreground)]"
              }`}
            >
              {personalInfo.name}
            </h3>
            <p
              className={`max-w-md mb-4 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {personalInfo.title} building digital products that drive results.
              Let&apos;s work together to bring your ideas to life.
            </p>
            <div className="flex gap-4">
              {socialLinks.length === 0 ? (
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No social links available
                </p>
              ) : (
                socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon] ?? FaGlobeAfrica;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isDark
                          ? "bg-white/10 hover:bg-blue-600/30"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isDark
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-700 hover:text-black"
                        }`}
                      />
                    </a>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <h4
              className={`font-semibold mb-4 ${
                isDark ? "text-white" : "text-[var(--foreground)]"
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.length === 0 ? (
                <li
                  className={
                    isDark ? "text-gray-500" : "text-gray-400"
                  }
                >
                  No quick links available
                </li>
              ) : (
                navLinks.slice(0, 5).map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className={
                        isDark
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-black"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <h4
              className={`font-semibold mb-4 ${
                isDark ? "text-white" : "text-[var(--foreground)]"
              }`}
            >
              Contact
            </h4>
            <ul
              className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              <li>{personalInfo.email}</li>
              <li>{personalInfo.location}</li>
            </ul>
          </div>
        </div>

        <div
          className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${
            isDark ? "border-t border-white/10" : "border-t border-gray-200"
          }`}
        >
          <p
            className={
              isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
            }
          >
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <div
            className={`flex gap-6 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            <a
              href="#"
              className={isDark ? "hover:text-white" : "hover:text-black"}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className={isDark ? "hover:text-white" : "hover:text-black"}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
