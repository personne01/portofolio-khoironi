"use client";

import {
  contactInfo as contactInfoDefault,
  socialLinks as socialLinksDefault,
} from "@/constant/portfolio";
import type { ContactInfoDto, SocialLinkDto } from "@/lib/dto";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaMedium,
  FaGlobeAfrica,
} from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const socialIconMap: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  medium: FaMedium,
};

type ContactProps = {
  contactInfo?: ContactInfoDto;
  socialLinks?: SocialLinkDto[];
};

const Contact = ({
  contactInfo = contactInfoDefault,
  socialLinks = socialLinksDefault,
}: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you for your message! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
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
            Get In <span className="text-blue-400">Touch</span>
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Have a project in mind or want to collaborate? Let&apos;s talk!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div
              className={`rounded-2xl p-6 border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-[var(--foreground)]"
                }`}
              >
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                          : "bg-gray-50 border-gray-300 text-[var(--foreground)] placeholder-gray-400"
                      }`}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                          : "bg-gray-50 border-gray-300 text-[var(--foreground)] placeholder-gray-400"
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                        : "bg-gray-50 border-gray-300 text-[var(--foreground)] placeholder-gray-400"
                    }`}
                    placeholder="Project inquiry"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors resize-none ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                        : "bg-gray-50 border-gray-300 text-[var(--foreground)] placeholder-gray-400"
                    }`}
                    placeholder="Tell me about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2 w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div
              className={`rounded-2xl p-6 border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-[var(--foreground)]"
                }`}
              >
                Contact Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <FaEnvelope className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-600 text-sm"
                      }
                    >
                      Email
                    </p>
                    <p
                      className={
                        isDark ? "text-white" : "text-[var(--foreground)]"
                      }
                    >
                      {contactInfo.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <FaPhone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-600 text-sm"
                      }
                    >
                      Phone
                    </p>
                    <p
                      className={
                        isDark ? "text-white" : "text-[var(--foreground)]"
                      }
                    >
                      {contactInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-600 text-sm"
                      }
                    >
                      Location
                    </p>
                    <p
                      className={
                        isDark ? "text-white" : "text-[var(--foreground)]"
                      }
                    >
                      {contactInfo.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-[var(--foreground)]"
                }`}
              >
                Follow Me
              </h3>

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

            <div
              className={`rounded-2xl p-6 border text-center ${
                isDark
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-white/10"
                  : "bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200"
              }`}
            >
              <p
                className={`mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {" "}
                {contactInfo.availability}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span
                  className={
                    isDark
                      ? "text-white font-medium"
                      : "text-[var(--foreground)] font-medium"
                  }
                >
                  Available for new projects
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
