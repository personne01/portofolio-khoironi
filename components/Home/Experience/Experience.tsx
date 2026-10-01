"use client";

import { experience as experienceDefault } from "@/constant/portfolio";
import type { ExperienceDto } from "@/lib/dto";
import { motion } from "framer-motion";
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

type ExperienceProps = {
  experience?: ExperienceDto[];
};

const Experience = ({ experience = experienceDefault }: ExperienceProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="experience"
      className={`py-24 ${isDark ? "bg-[#0a0a15]" : "bg-gray-100"}`}
    >
      <div className="w-[90%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-[var(--foreground)]"}`}
          >
            Work <span className="text-blue-400">Experience</span>
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            My professional journey through various roles and companies,
            continuously learning and growing in the tech industry.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {experience.length === 0 && (
            <p
              className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No experience available
            </p>
          )}
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex gap-4">
                <div className="hidden md:block w-4 flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full bg-blue-600 border-4 ${
                      isDark ? "border-[#0a0a15]" : "border-gray-100"
                    }`}
                  />
                  {index < experience.length - 1 && (
                    <div
                      className={`w-0.5 h-full mt-2 ${
                        isDark ? "bg-white/10" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>

                <motion.div
                  className={`flex-1 rounded-2xl p-6 mb-8 border transition-all cursor-pointer ${
                    expandedId === exp.id
                      ? "border-blue-500/50"
                      : isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-gray-200"
                  }`}
                  onClick={() =>
                    setExpandedId(expandedId === exp.id ? null : exp.id)
                  }
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h3
                        className={`text-xl font-bold mb-1 ${
                          isDark ? "text-white" : "text-[var(--foreground)]"
                        }`}
                      >
                        {exp.role}
                      </h3>
                      <p className="text-blue-400 font-medium">{exp.company}</p>
                    </div>
                    <div
                      className={`flex items-center gap-4 text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FaCalendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedId === exp.id ? "auto" : 0,
                      opacity: expandedId === exp.id ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <p
                        className={
                          isDark ? "text-gray-300 mb-4" : "text-gray-700 mb-4"
                        }
                      >
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDark
                                ? "bg-white/10 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {expandedId !== exp.id && (
                    <div
                      className={
                        isDark
                          ? "text-gray-500 text-sm mt-4"
                          : "text-gray-400 text-sm mt-4"
                      }
                    >
                      Click to expand...
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDark ? "bg-white/10 text-gray-300" : "bg-gray-200 text-gray-700"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Currently open to new opportunities</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
