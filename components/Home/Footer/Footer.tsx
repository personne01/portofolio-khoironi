"use client";

import { navLinks, personalInfo, socialLinks } from "@/constant/portfolio";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className={`py-12 border-t ${
      isDark ? "bg-[#0d0d1f] border-white/10" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="w-[90%] mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-[var(--foreground)]"
            }`}>
              {personalInfo.name}
            </h3>
            <p className={`max-w-md mb-4 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              {personalInfo.title} building digital products that drive results.
              Let&apos;s work together to bring your ideas to life.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/khoironi"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isDark ? "bg-white/10 hover:bg-blue-600/30" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FaGithub className={`w-4 h-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`} />
              </a>
              <a
                href="https://linkedin.com/in/khoironi"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isDark ? "bg-white/10 hover:bg-blue-600/30" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FaLinkedin className={`w-4 h-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`} />
              </a>
              <a
                href="https://twitter.com/khoironi"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isDark ? "bg-white/10 hover:bg-blue-600/30" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FaTwitter className={`w-4 h-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`} />
              </a>
              <a
                href="https://instagram.com/khoironi"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isDark ? "bg-white/10 hover:bg-blue-600/30" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FaInstagram className={`w-4 h-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`} />
              </a>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${
              isDark ? "text-white" : "text-[var(--foreground)]"
            }`}>Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${
              isDark ? "text-white" : "text-[var(--foreground)]"
            }`}>Contact</h4>
            <ul className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              <li>{personalInfo.email}</li>
              <li>{personalInfo.location}</li>
            </ul>
          </div>
        </div>

        <div className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${
          isDark ? "border-t border-white/10" : "border-t border-gray-200"
        }`}>
          <p className={isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <div className={`flex gap-6 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <a href="#" className={isDark ? "hover:text-white" : "hover:text-black"}>
              Privacy Policy
            </a>
            <a href="#" className={isDark ? "hover:text-white" : "hover:text-black"}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;