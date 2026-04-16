import { motion } from 'framer-motion';

const steps = [
  {
    icon: '🧠',
    title: 'What is Git?',
    body: 'Git is a version control system — it tracks changes to your files over time. Think of it like a save system for your project. Every time you commit, Git takes a snapshot.',
  },
  {
    icon: '🗂️',
    title: 'git init',
    body: 'Creates a hidden .git folder that turns any directory into a Git repository. This is always your first step.',
    code: 'git init',
  },
  {
    icon: '➕',
    title: 'git add',
    body: 'Stages your changes — moves them to a "waiting room" before saving. You choose exactly what goes into each commit.',
    code: 'git add .\ngit add filename.txt',
  },
  {
    icon: '💾',
    title: 'git commit',
    body: 'Saves a snapshot of your staged changes with a descriptive message. This becomes a permanent node in your project history.',
    code: 'git commit -m "first commit"',
  },
];

export default function Basics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Git Basics</h2>
        <p className="text-[#8b949e]">Master the foundation of every Git workflow.</p>
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
