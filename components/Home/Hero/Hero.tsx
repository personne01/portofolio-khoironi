"use client";

import { personalInfo, heroStats } from "@/constant/portfolio";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { FaArrowRight, FaDownload, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center justify-center pt-20 ${isDark ? "bg-[#0d0d1f]" : "bg-gray-100"}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0d0d1f] to-[#0d0d1f]" />

      <div className="relative z-10 w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-600/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-blue-300">{personalInfo.availabilityText}</span>
            </motion.div>

            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 ${isDark ? "text-white" : "text-[var(--foreground)]"
              }`}>
              Hi, I&apos;m{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {personalInfo.name}
              </span>
            </h1>

            <p className={`text-xl md:text-2xl mb-6 ${isDark ? "text-gray-300" : "text-gray-700"
              }`}>
              {personalInfo.title}
            </p>

            <p className={`text-lg mb-8 max-w-xl ${isDark ? "text-gray-400" : "text-gray-600"
              }`}>
              {personalInfo.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="#contact">
                <Button size="lg" className="group">
                  Hire Me
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href={personalInfo.resume} download>
                <Button size="lg" variant="outline">
                  <FaDownload className="mr-2" />
                  View Resume
                </Button>
              </Link>
            </div>

            <div className={`flex items-center gap-4 justify-center lg:justify-start ${isDark ? "text-gray-400" : "text-gray-500"
              }`}>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-sm" />
                <span>{personalInfo.location}</span>
              </div>
              <Link href={`mailto:${personalInfo.email}`} className={`flex items-center gap-2 hover:${isDark ? "text-white" : "text-[var(--foreground)]"
                } transition-colors`}>
                <FaEnvelope className="text-sm" />
                <span>{personalInfo.email}</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center">
                <div className={`w-64 h-64 md:w-88 md:h-88 rounded-full border flex items-center justify-center ${isDark
                    ? "bg-[var(--background)] border-white/10"
                    : "bg-white border-gray-200"
                  }`}>
                  <span className={`text-6xl md:text-8xl font-bold ${isDark ? "text-white" : "text-[var(--foreground)]"
                    }`}>
                    {personalInfo.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center animate-pulse">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
        >
          {heroStats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold mb-1 ${isDark ? "text-white" : "text-[var(--foreground)]"
                }`}>
                {stat.value}
              </div>
              <div className={isDark ? "text-gray-400" : "text-gray-500"}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;