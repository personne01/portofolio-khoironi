import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import { ThemeProvider } from "@/context/ThemeContext";

const font = Inter({
  weight:['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets:['latin']
})

export const metadata: Metadata = {
  title: "Khoironi Portfolio | Next.js",
  description: "Created by Khoironi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        <ThemeProvider>
          <ResponsiveNav/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}