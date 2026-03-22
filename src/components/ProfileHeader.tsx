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
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-3xl text-amber-600 font-bold">
          {profile.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.username}
          </h1>
          {isOwner && (
            <Link
              href="/profile/edit"
              className="text-xs px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Modifier le profil
            </Link>
          )}
        </div>
        {profile.bio && (
          <p className="text-gray-500 mt-1">{profile.bio}</p>
        )}
        <div className="flex gap-4 mt-2 text-sm text-gray-400">
          <span>
            <strong className="text-gray-700">{totalCoins}</strong> piece
            {totalCoins !== 1 ? "s" : ""}
          </span>
          <span>
            <strong className="text-gray-700">{forTrade}</strong> a echanger
          </span>
        </div>
      </div>
    </div>
  );
}
