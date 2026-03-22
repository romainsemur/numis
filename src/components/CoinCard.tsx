import type { Coin } from "@/lib/supabase/types";
import Link from "next/link";

interface CoinCardProps {
  coin: Coin;
  showTradeButton?: boolean;
}

export default function CoinCard({ coin, showTradeButton }: CoinCardProps) {
  return (
    <Link
      href={`/collection/${coin.id}`}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {coin.image_url ? (
          <img
            src={coin.image_url}
            alt={coin.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl text-gray-300">&#x1FA99;</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{coin.name}</h3>
        <div className="flex gap-2 mt-1 text-sm text-gray-500">
          {coin.year && <span>{coin.year}</span>}
          {coin.country && <span>{coin.country}</span>}
          {coin.grade && (
            <span className="bg-gray-100 px-1.5 rounded">{coin.grade}</span>
          )}
        </div>
        {coin.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {coin.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {coin.is_for_trade && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Disponible
            </span>
          )}
          {showTradeButton && coin.is_for_trade && (
            <span className="text-xs text-amber-600 font-medium">
              Proposer un echange
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
