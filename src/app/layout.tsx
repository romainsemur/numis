import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Numis - Collection de pieces de monnaie",
  description:
    "Gerez votre collection de pieces, partagez-la et echangez avec d'autres collectionneurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
          Numis &mdash; Collection de pieces de monnaie
        </footer>
      </body>
    </html>
  );
}
