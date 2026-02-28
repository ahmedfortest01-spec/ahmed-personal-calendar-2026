import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "تقويم أحمد الشخصي 2026",
  description: "Personal Calendar 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}
