"use client";

import { mediumArticles as articlesDefault } from "@/constant/portfolio";
import type { ArticleDto } from "@/lib/dto";
import { motion } from "framer-motion";
import { FaMedium, FaBook, FaClock, FaExternalLinkAlt } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

type ArticlesProps = {
  articles?: ArticleDto[];
};

const Articles = ({ articles = articlesDefault }: ArticlesProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="Articles"
      className={`py-24 ${isDark ? "bg-[#0d0d1f]" : "bg-gray-50"}`}
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
            My <span className="text-blue-400">Articles</span>
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Latest articles from my Medium blog.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length === 0 && (
            <p
              className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No articles available
            </p>
          )}
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl p-6 border transition-all hover:border-blue-500/50 ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <FaMedium className="w-5 h-5 text-blue-400" />
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isDark
                      ? "bg-blue-600/20 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {article.category}
                </span>
              </div>

              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-white" : "text-[var(--foreground)]"
                }`}
              >
                {article.title}
              </h3>

              <p
                className={`text-sm mb-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {article.description}
              </p>

              <div
                className={`flex items-center justify-between text-sm ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaClock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
                <span>{article.date}</span>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Read Article
                <FaExternalLinkAlt className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="https://medium.com/@muhkhoironi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaBook className="w-5 h-5" />
            View All Articles
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Articles;
