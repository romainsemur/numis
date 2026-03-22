import { createClient } from "@/lib/supabase/server";
import CoinCard from "@/components/CoinCard";
import { notFound } from "next/navigation";
import type { Profile, Coin } from "@/lib/supabase/types";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  const profile = profileData as Profile | null;
  if (!profile) return notFound();

  const { data: coinsData } = await supabase
    .from("coins")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const coins = (coinsData as Coin[]) || [];
  const totalCoins = coins.length;
  const forTrade = coins.filter((c) => c.is_for_trade).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-start gap-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-3xl text-amber-600 font-bold">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.username}
          </h1>
          {profile.bio && (
            <p className="text-gray-500 mt-1">{profile.bio}</p>
          )}
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>
              <strong className="text-gray-700">{totalCoins}</strong> pieces
            </span>
            <span>
              <strong className="text-gray-700">{forTrade}</strong> a echanger
            </span>
          </div>
        </div>
      </div>

      {totalCoins === 0 ? (
        <p className="text-gray-400 text-center py-20">
          Cette collection est vide.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {coins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} showTradeButton />
          ))}
        </div>
      )}
    </div>
  );
}
