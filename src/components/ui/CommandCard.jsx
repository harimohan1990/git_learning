import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandCard({ command, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 hover:border-[#388bfd] transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <code className="text-sm bg-[#0d1117] text-orange-400 px-3 py-1 rounded-md font-mono border border-[#21262d] break-all">
          {command.syntax}
        </code>
        <span className="ml-2 shrink-0 text-xs text-[#6e7681] uppercase bg-[#21262d] px-2 py-1 rounded">
          {command.category}
        </span>
      </div>

      <h3 className="font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
        {command.name}
      </h3>
      <p className="text-sm text-[#8b949e] mb-3">{command.description}</p>

      {command.details && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-[#388bfd] hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {expanded ? '▲ Hide details' : '▼ Show details'}
        </button>
      )}

      <AnimatePresence>
        {expanded && command.details && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#8b949e] mt-3 leading-relaxed border-t border-[#21262d] pt-3">
              {command.details}
            </p>
            {command.example && (
              <div className="mt-2">
                <p className="text-xs text-[#6e7681] mb-1">Example</p>
                <code className="block text-xs bg-[#0d1117] text-green-400 px-3 py-2 rounded-md font-mono border border-[#21262d] whitespace-pre-wrap">
                  {command.example}
                </code>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
