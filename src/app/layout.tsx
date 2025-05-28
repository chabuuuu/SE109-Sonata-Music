import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import PersistentPlayerLayout from "@/components/PersistentPlayerLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonata Music - Classical Music Platform",
  description:
    "A platform for classical music lovers to discover and enjoy timeless pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Bọc toàn bộ ứng dụng trong Provider */}
          <MusicPlayerProvider>
            {/* Children là nơi các trang như ClassicalMusicArtistsPage sẽ được render */}
            {children}

            {/* Player toàn cục nằm ở đây, bên ngoài children */}
            <PersistentPlayerLayout />
          </MusicPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
