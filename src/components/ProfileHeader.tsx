import Link from "next/link";
import type { Profile } from "@/lib/supabase/types";

interface ProfileHeaderProps {
  profile: Profile;
  totalCoins: number;
  forTrade: number;
  isOwner: boolean;
}

export default function ProfileHeader({
  profile,
  totalCoins,
  forTrade,
  isOwner,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8 flex items-start gap-6">
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.username}
          className="w-20 h-20 rounded-full object-cover border-2 border-gold-300"
        />
      ) : (
        <div className="w-20 h-20 bg-gradient-to-br from-gold-200 to-gold-400 rounded-full flex items-center justify-center text-3xl text-brown-800 font-bold">
          {profile.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-brown-800">
            {profile.username}
          </h1>
          {isOwner && (
            <Link
              href="/profile/edit"
              className="text-xs px-3 py-1 border border-brown-200 rounded-lg text-brown-500 hover:bg-brown-50 transition-colors"
            >
              Modifier le profil
            </Link>
          )}
        </div>
        {profile.bio && (
          <p className="text-brown-400 mt-1">{profile.bio}</p>
        )}
        <div className="flex gap-4 mt-2 text-sm text-brown-300">
          <span>
            <strong className="text-brown-700">{totalCoins}</strong> piece
            {totalCoins !== 1 ? "s" : ""}
          </span>
          <span>
            <strong className="text-brown-700">{forTrade}</strong> a echanger
          </span>
        </div>
      </div>
    </div>
  );
}
