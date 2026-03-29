import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "よんよん探検隊 📚",
  description: "楽しく読んで、たくさん学ぼう！",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={geist.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
