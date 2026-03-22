"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";
import ImageUpload from "@/components/ImageUpload";

export default function EditProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      setUser(data.user);

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      const prof = p as Profile | null;
      setProfile(prof);
      setAvatarUrl(prof?.avatar_url ?? null);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: form.get("username") as string,
        bio: (form.get("bio") as string) || null,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (!error) {
      const newUsername = form.get("username") as string;
      router.push(`/profile/${newUsername}`);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">
        Chargement...
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">
        Connectez-vous pour modifier votre profil.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link
        href={`/profile/${profile.username}`}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
      >
        &larr; Retour au profil
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Modifier le profil
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl border border-gray-200"
      >
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-2xl text-amber-600 font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
          <ImageUpload
            currentUrl={null}
            userId={user.id}
            onUploaded={(url) => {
              if (url) setAvatarUrl(url);
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d&apos;utilisateur *
          </label>
          <input
            name="username"
            required
            defaultValue={profile.username}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={profile.bio ?? ""}
            placeholder="Parlez de votre collection, vos centres d'interet..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <Link
            href={`/profile/${profile.username}`}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
