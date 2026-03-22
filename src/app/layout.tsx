import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
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
        <footer className="border-t border-brown-200/50 bg-brown-800 py-10">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
            <Logo size={28} />
            <p className="text-brown-300 text-sm">
              Numis &mdash; La plateforme des collectionneurs de monnaie
            </p>
            <p className="text-brown-500 text-xs">
              &copy; {new Date().getFullYear()} Numis. Tous droits reserves.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
