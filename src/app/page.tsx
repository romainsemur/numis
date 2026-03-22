import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Votre collection,{" "}
        <span className="text-amber-600">numerisee.</span>
      </h1>
      <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
        Cataloguez vos pieces de monnaie, partagez votre collection et echangez
        avec d&apos;autres passionnes de numismatique.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/auth/register"
          className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Creer mon compte
        </Link>
        <Link
          href="/collection"
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Voir les collections
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="text-3xl mb-3">&#x1FA99;</div>
          <h3 className="font-semibold text-lg mb-2">Cataloguez</h3>
          <p className="text-gray-500 text-sm">
            Ajoutez vos pieces avec photos, annee, pays et etat de
            conservation.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="text-3xl mb-3">&#x1F310;</div>
          <h3 className="font-semibold text-lg mb-2">Partagez</h3>
          <p className="text-gray-500 text-sm">
            Votre profil public permet aux autres collectionneurs de decouvrir
            vos pieces.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="text-3xl mb-3">&#x1F91D;</div>
          <h3 className="font-semibold text-lg mb-2">Echangez</h3>
          <p className="text-gray-500 text-sm">
            Proposez et recevez des offres d&apos;echange sur les pieces
            disponibles.
          </p>
        </div>
      </div>
    </div>
  );
}
