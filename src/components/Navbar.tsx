"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
        ? "bg-amber-100 text-amber-900"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="text-xl font-bold text-amber-700">
          Numis
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
                Mon profil
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="ml-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Deconnexion
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="ml-2 px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
