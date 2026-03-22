import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brown-800 via-brown-900 to-black" />
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gold-400/5 blur-2xl" />
        <div className="absolute bottom-0 left-20 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32 text-center">
          <div className="flex justify-center mb-8">
            <Logo size={80} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Votre collection,{" "}
            <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              numerisee.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-brown-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Cataloguez vos pieces de monnaie, partagez votre collection et
            echangez avec d&apos;autres passionnes de numismatique.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 btn-gold rounded-xl font-semibold text-base shadow-lg"
            >
              Creer mon compte
            </Link>
            <Link
              href="/collection"
              className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl font-semibold text-base hover:bg-white/20 transition-colors"
            >
              Voir les collections
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-center text-sm uppercase tracking-[0.2em] text-gold-600 font-semibold mb-2">
          Fonctionnalites
        </h2>
        <p className="text-center text-2xl md:text-3xl font-bold text-brown-800 mb-12">
          Tout pour gerer votre collection
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-numis p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A67B28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-brown-800 mb-2">Cataloguez</h3>
            <p className="text-brown-400 text-sm leading-relaxed">
              Ajoutez vos pieces avec photos avers/revers, annee, pays et etat
              de conservation.
            </p>
          </div>

          <div className="card-numis p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A67B28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-brown-800 mb-2">Partagez</h3>
            <p className="text-brown-400 text-sm leading-relaxed">
              Votre profil public permet aux autres collectionneurs de decouvrir
              vos pieces.
            </p>
          </div>

          <div className="card-numis p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A67B28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-brown-800 mb-2">Echangez</h3>
            <p className="text-brown-400 text-sm leading-relaxed">
              Proposez et recevez des offres d&apos;echange sur les pieces
              disponibles.
            </p>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-brown-800">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              100%
            </p>
            <p className="text-brown-400 text-sm mt-1">Gratuit</p>
          </div>
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              Securise
            </p>
            <p className="text-brown-400 text-sm mt-1">Donnees protegees</p>
          </div>
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              Simple
            </p>
            <p className="text-brown-400 text-sm mt-1">Prise en main rapide</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-brown-800 mb-4">
          Pret a demarrer votre collection ?
        </h2>
        <p className="text-brown-400 mb-8">
          Rejoignez la communaute Numis et commencez a cataloguer vos pieces des
          aujourd&apos;hui.
        </p>
        <Link
          href="/auth/register"
          className="inline-block px-8 py-3.5 btn-gold rounded-xl font-semibold text-base shadow-lg"
        >
          Creer mon compte gratuitement
        </Link>
      </section>
    </>
  );
}
