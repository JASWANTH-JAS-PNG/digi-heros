import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GolfGive — Play. Win. Give.",
  description: "The golf platform that combines performance tracking, prize draws, and charitable giving.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
