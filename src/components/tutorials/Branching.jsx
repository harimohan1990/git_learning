import { motion } from 'framer-motion';

const steps = [
  {
    icon: '🌿',
    title: 'What is a Branch?',
    body: 'A branch is an independent line of development. Think of it as a parallel road — you can work on a new feature without touching the main code.',
  },
  {
    icon: '➕',
    title: 'Create a Branch',
    body: 'Creates a new pointer to the current commit. Your work from this point is isolated from other branches.',
    code: 'git branch feature/login\n# or create and switch at once:\ngit checkout -b feature/login',
  },
  {
    icon: '🔄',
    title: 'Switch Branches',
    body: 'Move your HEAD (current position) to a different branch. Files in your working directory update automatically to match.',
    code: 'git checkout feature/login\n# modern syntax:\ngit switch feature/login',
  },
  {
    icon: '🔀',
    title: 'Merge',
    body: 'Bring changes from one branch into another. Creates a merge commit that joins two histories together. Safe — preserves full history.',
    code: 'git checkout main\ngit merge feature/login',
  },
  {
    icon: '⚡',
    title: 'Rebase',
    body: 'Replays your commits on top of another branch. Creates a linear history — cleaner logs but rewrites commit IDs. Never rebase shared branches.',
    code: 'git checkout feature/login\ngit rebase main',
  },
];

export default function Branching({ darkMode = true }) {
  const card = darkMode ? 'bg-[#161b22] border-[#21262d]' : 'bg-white border-gray-200 shadow-sm';
  const innerCard = darkMode ? 'bg-[#0d1117]' : 'bg-gray-50';
  const codeBg = darkMode ? 'bg-[#0d1117] border-[#21262d]' : 'bg-gray-900 border-gray-700';
  const bodyText = darkMode ? 'text-[#8b949e]' : 'text-gray-600';
  const heading = darkMode ? 'text-white' : 'text-gray-900';
  const subheading = darkMode ? 'text-[#8b949e]' : 'text-gray-500';
  const metaText = darkMode ? 'text-[#8b949e]' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${heading}`}>Branching & Merging</h2>
        <p className={subheading}>Work on features in parallel without breaking your main codebase.</p>
      </div>

      {/* Concept cards */}
      <div className={`border rounded-xl p-5 ${card}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${subheading}`}>Key concepts</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Branch', sub: 'Independent road', icon: '🛣️', color: 'text-purple-400 bg-purple-400/10' },
            { label: 'Commit', sub: 'Checkpoint on road', icon: '📍', color: 'text-orange-400 bg-orange-400/10' },
            { label: 'HEAD', sub: 'Where you are now', icon: '📌', color: 'text-green-400 bg-green-400/10' },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-4 text-center ${innerCard}`}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className={`font-semibold text-sm ${heading}`}>{item.label}</p>
              <p className={`text-xs mt-1 ${metaText}`}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Merge vs Rebase */}
      <div className={`border rounded-xl p-5 ${card}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${subheading}`}>Merge vs Rebase</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'git merge', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', desc: 'Preserves full history. Creates a merge commit. Safe for shared branches.' },
            { label: 'git rebase', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', desc: 'Linear history. Replays commits. Best for local/feature branches before PR.' },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-4 border ${item.color}`}>
              <code className="font-mono text-sm font-bold">{item.label}</code>
              <p className={`text-xs mt-2 leading-relaxed ${metaText}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`border rounded-xl p-5 sm:p-6 transition-colors ${card}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{step.icon}</span>
            <h3 className={`text-lg font-semibold ${heading}`}>{step.title}</h3>
          </div>
          <p className={`mb-4 leading-relaxed ${bodyText}`}>{step.body}</p>
          {step.code && (
            <pre className={`border rounded-lg p-4 text-sm text-orange-400 font-mono overflow-x-auto ${codeBg}`}>
              {step.code}
            </pre>
          )}
        </motion.div>
      ))}
    </div>
  );
}
