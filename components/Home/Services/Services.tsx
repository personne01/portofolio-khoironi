"use client";

import { services as servicesDefault } from "@/constant/portfolio";
import type { ServiceDto } from "@/lib/dto";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  FaCode,
  FaShoppingCart,
  FaServer,
  FaQuestionCircle,
} from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "code":
      return FaCode;
    case "shopping-cart":
      return FaShoppingCart;
    case "server":
      return FaServer;
    case "consulting":
      return FaQuestionCircle;
    default:
      return FaCode;
  }
};

type ServicesProps = {
  services?: ServiceDto[];
};

const Services = ({ services = servicesDefault }: ServicesProps) => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="services"
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
            My <span className="text-blue-400">Services</span>
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Professional web development services tailored to help your business
            grow. From custom websites to full-fledged applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.length === 0 && (
            <p
              className={`col-span-full text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No services available
            </p>
          )}
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className={`relative rounded-2xl p-6 border transition-all ${
                  hoveredService === service.id
                    ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                    : isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-gray-200"
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center mb-4">
                  <IconComponent className="w-7 h-7 text-blue-400" />
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-[var(--foreground)]"}`}
                >
                  {service.title}
                </h3>
                <p
                  className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {service.description}
                </p>

                <div
                  className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-[var(--foreground)]"}`}
                >
                  {service.price}
                </div>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className="text-green-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-16 rounded-2xl p-8 md:p-12 border ${
            isDark
              ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-white/10"
              : "bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3
                className={`text-2xl md:text-3xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-[var(--foreground)]"
                }`}
              >
                Need something custom?
              </h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Let&apos;s discuss your project and find the perfect solution.
              </p>
            </div>
            <Button size="lg">Schedule a Call</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
