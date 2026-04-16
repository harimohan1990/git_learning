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
    body: 'Creates a new pointer to the current commit. Your work from this point is isolated.',
    code: 'git branch feature/login',
  },
  {
    icon: '🔄',
    title: 'Switch Branches',
    body: 'Move your HEAD (current position) to a different branch. Files in your working directory update to match.',
    code: 'git checkout feature/login\n# or modern syntax:\ngit switch feature/login',
  },
  {
    icon: '🔀',
    title: 'Merge',
    body: 'Bring changes from one branch into another. Creates a merge commit that joins two histories together.',
    code: 'git checkout main\ngit merge feature/login',
  },
  {
    icon: '⚡',
    title: 'Rebase',
    body: 'Replays your commits on top of another branch. Creates a linear history — cleaner but rewrites commit IDs.',
    code: 'git checkout feature/login\ngit rebase main',
  },
];

export default function Branching() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Branching & Merging</h2>
        <p className="text-[#8b949e]">Work on features in parallel without breaking your main codebase.</p>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          {[
            { label: 'Branch = Road', icon: '🛣️' },
            { label: 'Commit = Checkpoint', icon: '📍' },
            { label: 'HEAD = You are here', icon: '📌' },
          ].map((item) => (
            <div key={item.label} className="bg-[#0d1117] rounded-lg p-4">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-[#8b949e]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#161b22] border border-[#21262d] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{step.icon}</span>
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
          </div>
          <p className="text-[#8b949e] mb-4">{step.body}</p>
          {step.code && (
            <pre className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 text-sm text-orange-400 font-mono overflow-x-auto">
              {step.code}
            </pre>
          )}
        </motion.div>
      ))}
    </div>
  );
}
