import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "ProManage - Dashboard",
};

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <div
      className={`${inter.variable} ${inter.className} flex h-screen overflow-hidden bg-background font-body-lg text-on-surface antialiased`}
    >
      {children}
    </div>
  );
}
