"use client";

import { projects as projectsDefault } from "@/constant/portfolio";
import type { ProjectDto } from "@/lib/dto";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaGlobe } from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "freelance", label: "Freelance" },
  { id: "product", label: "Products" },
];

type ProjectsProps = {
  projects?: ProjectDto[];
};

const Projects = ({ projects = projectsDefault }: ProjectsProps) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section
      id="projects"
      className={`py-24 ${isDark ? "bg-[#0a0a15]" : "bg-gray-50"}`}
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
            My <span className="text-blue-400">Projects</span>
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            A collection of projects showcasing my expertise in building web
            applications that drive real results.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10 justify-center">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 && (
            <p
              className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No projects available
            </p>
          )}
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group rounded-2xl overflow-hidden border transition-all ${
                isDark
                  ? "bg-white/5 border-white/10 hover:border-blue-500/50"
                  : "bg-white border-gray-200 hover:border-blue-400"
              }`}
            >
              <div
                className={`relative h-48 flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20"
                    : "bg-gradient-to-br from-blue-100 to-purple-100"
                }`}
              >
                <div
                  className={`text-6xl opacity-30 group-hover:opacity-50 transition-opacity ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {project.title.charAt(0)}
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.category === "freelance"
                        ? "bg-purple-600/30 text-purple-300"
                        : "bg-blue-600/30 text-blue-300"
                    }`}
                  >
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3
                  className={`text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors ${
                    isDark ? "text-white" : "text-[var(--foreground)]"
                  }`}
                >
                  {project.title}
                </h3>
                <p
                  className={`text-sm mb-4 line-clamp-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded text-xs ${
                        isDark
                          ? "bg-white/10 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className={`flex items-center justify-between pt-4 ${
                    isDark
                      ? "border-t border-white/10"
                      : "border-t border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
                    >
                      {project.metrics.value}
                    </span>
                    <span
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-600 text-sm"
                      }
                    >
                      {project.metrics.label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={project.GitHubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <FaGithub
                        className={`w-4 h-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <FaExternalLinkAlt
                        className={`w-4 h-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      />
                    </a>
                  </div>
                </div>
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
          <Button variant="outline" size="lg">
            View All Projects
            <FaGlobe className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
