"use client";

import { personalInfo, skills } from "@/constant/portfolio";
import { motion } from "framer-motion";
import { FaCode, FaServer, FaDatabase } from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const stats = [
  { id: 1, value: "5+", label: "Years Experience" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "devops", label: "DevOps" },
];

const About = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const filteredSkills = activeCategory === "all"
    ? skills
    : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section id="about" className={`py-24 ${isDark ? "bg-[#0d0d1f]" : "bg-gray-100"}`}>
      <div className="w-[90%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-[var(--foreground)]"}`}>
            About <span className="text-blue-400">Me</span>
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            I&apos;m a passionate {personalInfo.title} with {stats[0].value} years of experience 
            building digital products that help businesses grow.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className={`rounded-2xl p-8 border ${
              isDark 
                ? "bg-white/5 border-white/10" 
                : "bg-white border-gray-200"
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-[var(--foreground)]"}`}>My Story</h3>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                I began my journey in software development back in 2018, starting with HTML, CSS, 
                and JavaScript. Over the years, I&apos;ve worked with various clients from startups to 
                established companies, helping them transform their ideas into reality.
              </p>
              <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mt-4`}>
                My expertise spans across frontend and backend development, with a strong focus on 
                building scalable web applications using modern technologies like Next.js, React, 
                and Node.js. I believe in writing clean, maintainable code and delivering projects 
                on time.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className={`rounded-xl p-4 border text-center ${
                isDark 
                  ? "bg-white/5 border-white/10" 
                  : "bg-white border-gray-200"
              }`}>
                <FaCode className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className={isDark ? "text-white" : "text-[var(--foreground)]"}>95%</div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>Frontend</div>
              </div>
              <div className={`rounded-xl p-4 border text-center ${
                isDark 
                  ? "bg-white/5 border-white/10" 
                  : "bg-white border-gray-200"
              }`}>
                <FaServer className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className={isDark ? "text-white" : "text-[var(--foreground)]"}>85%</div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>Backend</div>
              </div>
              <div className={`rounded-xl p-4 border text-center ${
                isDark 
                  ? "bg-white/5 border-white/10" 
                  : "bg-white border-gray-200"
              }`}>
                <FaDatabase className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className={isDark ? "text-white" : "text-[var(--foreground)]"}>80%</div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>Database</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="skills"
          >
            <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : isDark 
                        ? "bg-white/10 text-gray-300 hover:bg-white/20"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={isDark ? "text-white font-medium" : "text-[var(--foreground)] font-medium"}>{skill.name}</span>
                    <span className={isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{skill.level}%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                  }`}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;