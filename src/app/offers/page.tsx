"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Offer } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

interface OfferWithDetails extends Offer {
  coin: { name: string } | null;
  from_user: { username: string } | null;
  to_user: { username: string } | null;
}

export default function OffersPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [received, setReceived] = useState<OfferWithDetails[]>([]);
  const [sent, setSent] = useState<OfferWithDetails[]>([]);
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadOffers(data.user.id);
      else setLoading(false);
    });
  }, []);

  async function loadOffers(userId: string) {
    const [r, s] = await Promise.all([
      supabase
        .from("offers")
        .select("*, coin:coins(name), from_user:profiles!offers_from_user_id_fkey(username)")
        .eq("to_user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("offers")
        .select("*, coin:coins(name), to_user:profiles!offers_to_user_id_fkey(username)")
        .eq("from_user_id", userId)
        .order("created_at", { ascending: false }),
    ]);
    setReceived((r.data as OfferWithDetails[]) || []);
    setSent((s.data as OfferWithDetails[]) || []);
    setLoading(false);
  }

  async function updateOffer(id: string, status: "accepted" | "refused") {
    await supabase.from("offers").update({ status }).eq("id", id);
    if (user) loadOffers(user.id);
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      refused: "bg-red-100 text-red-700",
    };
    const labels: Record<string, string> = {
      pending: "En attente",
      accepted: "Acceptee",
      refused: "Refusee",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (!user && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        Connectez-vous pour voir vos offres.
      </div>
    );
  }

  const offers = tab === "received" ? received : sent;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Offres</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("received")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "received"
              ? "bg-amber-100 text-amber-900"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Recues ({received.length})
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "sent"
              ? "bg-amber-100 text-amber-900"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Envoyees ({sent.length})
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-10">Chargement...</p>
      ) : offers.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Aucune offre.</p>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {offer.coin?.name || "Piece supprimee"}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {tab === "received"
                    ? `De ${offer.from_user?.username || "?"}`
                    : `A ${offer.to_user?.username || "?"}`}
                </p>
                {offer.message && (
                  <p className="text-sm text-gray-400 mt-1 italic">
                    &quot;{offer.message}&quot;
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(offer.status)}
                {tab === "received" && offer.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateOffer(offer.id, "accepted")}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => updateOffer(offer.id, "refused")}
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
