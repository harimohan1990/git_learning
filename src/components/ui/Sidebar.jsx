import { Link, useLocation } from 'react-router-dom';
import { tutorials } from '../../data/commands';

export default function Sidebar({ onSelect, selectedSlug }) {
  return (
    <aside className="w-64 shrink-0 border-r border-[#21262d] h-full overflow-y-auto py-6 px-4">
      <p className="text-xs font-semibold text-[#6e7681] uppercase tracking-widest mb-4 px-2">
        Tutorials
      </p>
      <ul className="space-y-1">
        {tutorials.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => onSelect?.(t.slug)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedSlug === t.slug
                  ? 'bg-[#1f2937] text-white'
                  : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
