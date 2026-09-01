import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ProManage - Iniciar sesión",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return (
    <div
      className={`${inter.variable} ${inter.className} flex min-h-screen flex-1 flex-col bg-surface text-on-background antialiased`}
    >
      {children}
    </div>
  );
}
