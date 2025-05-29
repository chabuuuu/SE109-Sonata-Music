import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import PersistentPlayerLayout from "@/components/PersistentPlayerLayout";
import { Toaster } from "react-hot-toast";

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

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#F8F0E3',
              color: '#3A2A24',
              border: '1px solid #C8A97E',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: "'Playfair Display', serif",
            },
            success: {
              iconTheme: {
                primary: '#C8A97E',
                secondary: '#F8F0E3',
              },
            },
            error: {
              iconTheme: {
                primary: '#d32f2f',
                secondary: '#F8F0E3',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
