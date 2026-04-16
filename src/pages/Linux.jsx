import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { linuxCommands, linuxCategories, levelColors } from '../data/linuxCommands';

function CommandCard({ cmd, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 hover:border-[#388bfd] transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <code className="text-sm bg-[#0d1117] text-green-400 px-3 py-1 rounded-md font-mono border border-[#21262d] break-all">
          {cmd.syntax}
        </code>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs text-[#6e7681] uppercase bg-[#21262d] px-2 py-0.5 rounded">
            {cmd.category}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${levelColors[cmd.level]}`}>
            {cmd.level}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
        {cmd.name}
      </h3>
      <p className="text-sm text-[#8b949e] mb-3">{cmd.description}</p>

      {cmd.details && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-[#388bfd] hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {expanded ? '▲ Hide details' : '▼ Show details'}
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#8b949e] mt-3 leading-relaxed border-t border-[#21262d] pt-3 whitespace-pre-wrap">
              {cmd.details}
            </p>
            {cmd.example && (
              <div className="mt-3">
                <p className="text-xs text-[#6e7681] mb-1">Example</p>
                <pre className="text-xs bg-[#0d1117] text-green-400 px-3 py-2 rounded-md font-mono border border-[#21262d] whitespace-pre-wrap overflow-x-auto">
                  {cmd.example}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const LEVELS = ['all', 'basic', 'intermediate', 'advanced'];

export default function Linux() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return linuxCommands.filter((cmd) => {
      const matchCat = activeCategory === 'all' || cmd.category === activeCategory;
      const matchLevel = activeLevel === 'all' || cmd.level === activeLevel;
      const q = search.toLowerCase();
      const matchSearch = !q || cmd.name.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q) || cmd.syntax.toLowerCase().includes(q);
      return matchCat && matchLevel && matchSearch;
    });
  }, [activeCategory, activeLevel, search]);

  const stats = useMemo(() => ({
    basic: linuxCommands.filter((c) => c.level === 'basic').length,
    intermediate: linuxCommands.filter((c) => c.level === 'intermediate').length,
    advanced: linuxCommands.filter((c) => c.level === 'advanced').length,
  }), []);

  return (
    <div className="min-h-screen pt-[65px]">
      {/* Hero */}
      <section className="px-6 lg:px-16 py-16 border-b border-[#21262d] bg-gradient-to-b from-[#0d1117] to-[#0d1117]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-[#161b22] border border-[#21262d] rounded-full px-4 py-2 text-sm text-[#8b949e] mb-6">
            <span className="text-green-400">$</span>
            <span className="font-mono">man linux</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Linux Commands{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Reference
            </span>
          </h1>
          <p className="text-[#8b949e] text-lg mb-8 leading-relaxed">
            Every essential Linux command from beginner to advanced — with detailed explanations and real examples.
          </p>

          {/* level stats */}
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Basic', count: stats.basic, color: 'text-green-400 border-green-400/30 bg-green-400/5' },
              { label: 'Intermediate', count: stats.intermediate, color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5' },
              { label: 'Advanced', count: stats.advanced, color: 'text-red-400 border-red-400/30 bg-red-400/5' },
            ].map((s) => (
              <div key={s.label} className={`border rounded-xl px-4 py-3 ${s.color}`}>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs opacity-70">{s.label}</p>
              </div>
            ))}
            <div className="border border-[#21262d] rounded-xl px-4 py-3 bg-[#161b22]">
              <p className="text-2xl font-bold text-white">{linuxCommands.length}</p>
              <p className="text-xs text-[#6e7681]">Total</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="sticky top-[65px] z-10 bg-[#0d1117]/95 backdrop-blur border-b border-[#21262d] px-6 lg:px-16 py-4">
        {/* Search */}
        <div className="flex items-center gap-3 bg-[#161b22] border border-[#21262d] rounded-lg px-3 py-2 mb-4 focus-within:border-green-500/50 transition-colors max-w-md">
          <span className="text-[#6e7681] text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#6e7681]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#6e7681] hover:text-white text-xs">✕</button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-2">
          {linuxCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-green-500 text-white'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level filter */}
        <div className="flex gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                activeLevel === lvl
                  ? lvl === 'basic' ? 'bg-green-500 text-white'
                  : lvl === 'intermediate' ? 'bg-yellow-500 text-black'
                  : lvl === 'advanced' ? 'bg-red-500 text-white'
                  : 'bg-white text-black'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#6e7681] self-center">{filtered.length} commands</span>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 lg:px-16 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#6e7681]">
            <p className="text-4xl mb-3">🔍</p>
            <p>No commands found for "{search}"</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); setActiveLevel('all'); }} className="mt-3 text-sm text-green-400 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cmd, i) => (
              <CommandCard key={cmd.name + cmd.syntax} cmd={cmd} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
