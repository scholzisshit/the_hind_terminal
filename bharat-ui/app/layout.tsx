import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bharat Monitor — Geospatial Intelligence Platform",
  description: "Real-time geospatial intelligence, border conflict tracking, infrastructure monitoring, and AI predictions for India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-abyss overflow-hidden">{children}</body>
    </html>
  );
}
