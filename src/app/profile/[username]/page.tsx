import { createClient } from "@/lib/supabase/server";
import CoinCard from "@/components/CoinCard";
import ProfileHeader from "@/components/ProfileHeader";
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: coinsData } = await supabase
    .from("coins")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const coins = (coinsData as Coin[]) || [];
  const totalCoins = coins.length;
  const forTrade = coins.filter((c) => c.is_for_trade).length;
  const isOwner = user?.id === profile.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProfileHeader
        profile={profile}
        totalCoins={totalCoins}
        forTrade={forTrade}
        isOwner={isOwner}
      />

      {totalCoins === 0 ? (
        <p className="text-gray-400 text-center py-20">
          Cette collection est vide.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              showTradeButton={!isOwner}
            />
          ))}
        </div>
      )}
    </div>
  );
}
