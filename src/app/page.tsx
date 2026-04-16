import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-parchment-100 texture-paper relative overflow-hidden">

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Constantia" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-serif font-bold text-parchment-950 tracking-wide text-lg">Constantia</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-parchment-600 hover:text-parchment-950 transition-colors font-sans"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-5 py-2 rounded-sm bg-parchment-950 text-parchment-100 hover:bg-sienna-800 transition-colors font-sans"
          >
            Empezar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center relative z-10 animate-fade-in">

        {/* Eyebrow */}
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-sienna-600 mb-8 font-medium">
          Open source · Gratuito · Sin límites
        </p>

        {/* Headline — large serif */}
        <h1 className="font-serif font-bold text-parchment-950 max-w-2xl leading-[1.1] mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
          La disciplina es
          <br />
          <span className="text-sienna-700 italic">libertad.</span>
        </h1>

        <p className="font-sans text-base text-parchment-600 max-w-sm leading-relaxed mb-3">
          Un tracker de hábitos para quienes eligen vivir con intención.
          Sin paywalls. Sin distracciones.
        </p>

        {/* Stoic quote */}
        <p className="font-serif italic text-xs text-parchment-500 mb-12">
          "El alma que no tiene un objetivo fijo se pierde." — Montaigne
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-sm bg-parchment-950 text-parchment-100 font-sans font-medium text-sm hover:bg-sienna-800 transition-all duration-200 active:scale-95"
          >
            Crear mi cuenta gratis
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-sm border border-parchment-400 text-parchment-700 font-sans font-medium text-sm hover:bg-parchment-200 transition-all duration-200"
          >
            Ya tengo cuenta
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mt-24 mb-12 max-w-xl w-full">
          <div className="flex-1 h-px bg-parchment-300" />
          <span className="font-serif text-xs text-parchment-400 tracking-widest uppercase">Principios</span>
          <div className="flex-1 h-px bg-parchment-300" />
        </div>

        {/* Features — stoic style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-parchment-300 border border-parchment-300 max-w-2xl w-full rounded-sm overflow-hidden">
          {[
            {
              numeral: "I",
              title: "Rachas visuales",
              desc: "Anillos animados que reflejan tu constancia de un vistazo.",
            },
            {
              numeral: "II",
              title: "Historial completo",
              desc: "Calendario heatmap con cada día de tu recorrido, para siempre.",
            },
            {
              numeral: "III",
              title: "Respuesta inmediata",
              desc: "La UI se actualiza al instante. Sin spinners. Sin espera.",
            },
          ].map(({ numeral, title, desc }) => (
            <div
              key={title}
              className="p-6 bg-parchment-100 text-left"
            >
              <p className="font-serif text-sienna-600 text-sm mb-3 font-bold">{numeral}</p>
              <h3 className="font-serif font-bold text-parchment-950 text-sm mb-2">{title}</h3>
              <p className="font-sans text-xs text-parchment-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-parchment-300 py-8 px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif italic text-xs text-parchment-400">
            "La excelencia no es un acto sino un hábito." — Aristóteles
          </p>
          <p className="font-sans text-xs text-parchment-400">
            Constantia es open source.{" "}
            <a
              href="https://github.com/ValentinoKvolek"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sienna-600 hover:text-sienna-800 transition-colors underline underline-offset-2"
            >
              Ver en GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
