"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LogoFull from "@/components/LogoFull";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-gold-100 text-brown-800"
        : "text-brown-500 hover:text-brown-800 hover:bg-brown-50"
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-brown-200/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/">
          <LogoFull size={34} />
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/collection" className={linkClass("/collection")}>
            Collection
          </Link>
          <Link href="/offers" className={linkClass("/offers")}>
            Offres
          </Link>

          {user ? (
            <>
              <Link
                href={`/profile/${user.user_metadata?.username || user.id}`}
                className={linkClass("/profile")}
              >
                Profil
              </Link>
              <Link
                href="/profile/edit"
                className={linkClass("/profile/edit")}
              >
                Parametres
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="ml-2 px-3 py-2 text-sm text-brown-400 hover:text-brown-700 transition-colors"
              >
                Deconnexion
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="ml-3 px-5 py-2 btn-gold rounded-lg text-sm font-semibold"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
