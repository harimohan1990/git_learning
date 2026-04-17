import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/playground', label: 'Playground' },
  { to: '/linux', label: 'Linux' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-white shrink-0" onClick={() => setMenuOpen(false)}>
          <span className="text-xl sm:text-2xl">⎇</span>
          <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
            GitVerse
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className="relative px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-white text-[#8b949e]">
              {pathname === to && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-[#21262d] rounded-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://git-scm.com/doc"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs border border-[#30363d] rounded-md text-[#8b949e] hover:text-white hover:border-[#6e7681] transition-colors"
          >
            Git Docs ↗
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1 p-2 rounded-md hover:bg-[#21262d] transition-colors"
            aria-label="Toggle menu"
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-[#8b949e] origin-center transition-all" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-0.5 bg-[#8b949e]" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-[#8b949e] origin-center transition-all" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[#21262d] bg-[#0d1117]"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === to ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://git-scm.com/doc"
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2.5 rounded-lg text-sm text-[#8b949e] hover:text-white hover:bg-[#161b22] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Git Docs ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
