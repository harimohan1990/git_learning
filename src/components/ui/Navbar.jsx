import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/playground', label: 'Playground' },
  { to: '/linux', label: 'Linux' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
        <span className="text-2xl">⎇</span>
        <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
          GitVerse
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ to, label }) => (
          <Link key={to} to={to} className="relative px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-white text-[#8b949e]">
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

      <a
        href="https://git-scm.com/doc"
        target="_blank"
        rel="noreferrer"
        className="hidden md:flex items-center gap-2 px-4 py-2 text-sm border border-[#30363d] rounded-md text-[#8b949e] hover:text-white hover:border-[#6e7681] transition-colors"
      >
        Git Docs ↗
      </a>
    </nav>
  );
}
