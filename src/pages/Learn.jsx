import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tutorials } from '../data/commands';
import Basics from '../components/tutorials/Basics';
import Branching from '../components/tutorials/Branching';
import Advanced from '../components/tutorials/Advanced';

const contentMap = {
  'what-is-git': <Basics />,
  'init-repo': <Basics />,
  'add-commit': <Basics />,
  branching: <Branching />,
  merge: <Branching />,
  rebase: <Branching />,
  remote: <Advanced />,
};

function SidebarContent({ selected, onSelect, onClose }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#21262d]">
        <p className="text-xs font-semibold text-[#6e7681] uppercase tracking-widest">Tutorials</p>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-[#6e7681] hover:text-white transition-colors text-lg leading-none">✕</button>
        )}
      </div>
      <ul className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {tutorials.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => { onSelect(t.slug); onClose?.(); }}
              className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                selected === t.slug
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'text-[#8b949e] hover:text-white hover:bg-[#161b22] border border-transparent'
              }`}
            >
              <span className="text-lg shrink-0">{t.icon}</span>
              <div className="text-left min-w-0">
                <p className="font-medium truncate">{t.title}</p>
                <p className="text-xs text-[#6e7681] truncate">{t.description}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Learn() {
  const [selected, setSelected] = useState('what-is-git');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const current = tutorials.find((t) => t.slug === selected);

  const bg = darkMode ? 'bg-[#0d1117]' : 'bg-gray-50';
  const sidebarBg = darkMode ? 'bg-[#0d1117]' : 'bg-white';
  const borderColor = darkMode ? 'border-[#21262d]' : 'border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-[#8b949e]' : 'text-gray-500';

  return (
    <div className={`flex h-screen pt-[65px] ${bg} transition-colors duration-200`}>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      {/* Mobile: drawer from left */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={`fixed left-0 top-[65px] bottom-0 z-40 w-72 md:hidden ${sidebarBg} border-r ${borderColor} shadow-2xl`}
          >
            <SidebarContent selected={selected} onSelect={setSelected} onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop: static sidebar */}
      <aside className={`hidden md:flex flex-col w-64 shrink-0 border-r ${borderColor} ${sidebarBg} transition-colors duration-200`}>
        <SidebarContent selected={selected} onSelect={setSelected} />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Mobile top bar ── */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${borderColor} ${sidebarBg} md:hidden transition-colors duration-200`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${borderColor} ${textSecondary} hover:${textPrimary} transition-colors text-sm`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className={`font-medium ${textPrimary}`}>{current?.icon} {current?.title}</span>
          </button>

          <button
            onClick={() => setDarkMode((d) => !d)}
            className={`p-2 rounded-lg border ${borderColor} transition-colors ${textSecondary} hover:${textPrimary}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* ── Desktop dark mode toggle row ── */}
        <div className={`hidden md:flex items-center justify-between px-6 py-2 border-b ${borderColor} ${sidebarBg} transition-colors duration-200`}>
          <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
            <span>{current?.icon}</span>
            <span className={`font-semibold ${textPrimary}`}>{current?.title}</span>
            <span className="hidden sm:inline">— {current?.description}</span>
          </div>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${borderColor} text-xs font-medium transition-all hover:scale-105 ${
              darkMode
                ? 'text-yellow-400 hover:bg-yellow-400/10'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <><span>☀️</span><span>Light Mode</span></>
            ) : (
              <><span>🌙</span><span>Dark Mode</span></>
            )}
          </button>
        </div>

        {/* ── Content area ── */}
        <main className="flex-1 overflow-y-auto">
          <div className={`max-w-3xl mx-auto px-4 sm:px-6 py-8 ${textPrimary} transition-colors duration-200`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <LearnContent slug={selected} darkMode={darkMode} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* ── Mobile bottom nav ── */}
        <div className={`md:hidden flex border-t ${borderColor} ${sidebarBg} transition-colors duration-200`}>
          {(() => {
            const idx = tutorials.findIndex((t) => t.slug === selected);
            const prev = tutorials[idx - 1];
            const next = tutorials[idx + 1];
            return (
              <>
                <button
                  onClick={() => prev && setSelected(prev.slug)}
                  disabled={!prev}
                  className={`flex-1 flex items-center gap-2 px-4 py-3 text-sm transition-colors ${prev ? `${textSecondary} hover:${textPrimary}` : 'opacity-30 cursor-not-allowed text-[#6e7681]'}`}
                >
                  <span>←</span>
                  <span className="truncate">{prev?.title || 'Start'}</span>
                </button>
                <div className={`w-px ${borderColor}`} />
                <button
                  onClick={() => next && setSelected(next.slug)}
                  disabled={!next}
                  className={`flex-1 flex items-center justify-end gap-2 px-4 py-3 text-sm transition-colors ${next ? 'text-orange-400 hover:text-orange-300' : 'opacity-30 cursor-not-allowed text-[#6e7681]'}`}
                >
                  <span className="truncate">{next?.title || 'Done'}</span>
                  <span>→</span>
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ── Content router that passes darkMode to tutorials ──────────────────────
function LearnContent({ slug, darkMode }) {
  const props = { darkMode };
  switch (slug) {
    case 'what-is-git':
    case 'init-repo':
    case 'add-commit':
      return <Basics {...props} />;
    case 'branching':
    case 'merge':
    case 'rebase':
      return <Branching {...props} />;
    case 'remote':
      return <Advanced {...props} />;
    default:
      return <Basics {...props} />;
  }
}
