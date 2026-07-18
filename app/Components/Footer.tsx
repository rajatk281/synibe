import Link from "next/link";

const footerLinks = {
  product: [
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Watch Together", href: "/create-room" },
    { name: "Listen Together", href: "/create-room" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Help Center", href: "/help" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-white/[0.06] overflow-hidden select-none">
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/[0.03] rounded-full blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-8 py-16">
          
          <div className="flex flex-col gap-5">
            <Link href="/" className="group">
              <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors duration-300">
                Synibe
              </h2>
            </Link>
            <p className="text-sm text-slate-500 font-light leading-relaxed max-w-xs">
              Experience entertainment together. Synchronized watching,
              listening, and reacting — no matter the distance.
            </p>

            
            <div className="flex items-center gap-2 mt-2">
              {["X", "GH", "DC", "IG"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/30 uppercase tracking-wider hover:text-purple-400 hover:border-purple-500/20 hover:bg-purple-500/[0.06] transition-all duration-300"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-purple-400 transition-colors duration-300 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-purple-400 transition-colors duration-300 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-purple-400 transition-colors duration-300 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-700">
            © {new Date().getFullYear()} Synibe. Directed by Design. All Rights
            Reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
