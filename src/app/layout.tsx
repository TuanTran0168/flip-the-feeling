import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import ClientOverlays from "@/components/ClientOverlays";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flip the Feeling",
  description: "Âm nhạc Bùi Anh Tuấn cho mỗi cung bậc cảm xúc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <ClientOverlays />
        {children}
      </body>
    </html>
  );
}
