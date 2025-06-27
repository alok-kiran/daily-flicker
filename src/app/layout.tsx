import type { Metadata } from "next";
import { Roboto_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const robotoSerif = Roboto_Serif({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Your Blog",
  description: "A WordPress-like blog built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={robotoSerif.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
