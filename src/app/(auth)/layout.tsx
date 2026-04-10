export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-parchment-100 relative overflow-hidden">
      {/* Warm ambient corners */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-parchment-300/50 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sienna-200/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Constantia" className="w-16 h-16 rounded-full object-cover mb-2 mx-auto" />
          <h1 className="font-serif font-bold text-parchment-950 text-2xl tracking-wide">
            Constantia
          </h1>
          <p className="font-sans text-sm text-parchment-500 mt-1.5">
            Tu tracker de hábitos, libre para siempre
          </p>
        </div>

        {/* Card */}
        <div className="bg-parchment-200 border border-parchment-300 rounded-sm p-4 sm:p-6 shadow-sm">
          {children}
        </div>

        {/* Stoic quote */}
        <p className="font-serif italic text-xs text-parchment-400 text-center mt-6">
          "Comienza donde estás. Usa lo que tienes."
        </p>
      </div>
    </div>
  );
}
