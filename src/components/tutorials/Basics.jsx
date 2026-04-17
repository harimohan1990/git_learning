import { motion } from 'framer-motion';

const steps = [
  {
    icon: '🧠',
    title: 'What is Git?',
    body: 'Git is a version control system — it tracks changes to your files over time. Think of it like a save system for your project. Every time you commit, Git takes a snapshot of your entire project.',
  },
  {
    icon: '🗂️',
    title: 'git init',
    body: 'Creates a hidden .git folder that turns any directory into a Git repository. This is always your first step when starting a new project.',
    code: 'git init',
  },
  {
    icon: '➕',
    title: 'git add',
    body: 'Stages your changes — moves them to a "waiting room" before saving. You choose exactly what goes into each commit. Use "git add ." to stage everything.',
    code: 'git add .\ngit add filename.txt\ngit add -p   # interactive staging',
  },
  {
    icon: '💾',
    title: 'git commit',
    body: 'Saves a snapshot of your staged changes with a descriptive message. This becomes a permanent node in your project history that you can always return to.',
    code: 'git commit -m "first commit"',
  },
  {
    icon: '🔍',
    title: 'git status & log',
    body: 'Check what files are staged, modified, or untracked. View the full history of commits on your current branch.',
    code: 'git status\ngit log --oneline',
  },
];

export default function Basics({ darkMode = true }) {
  const card = darkMode ? 'bg-[#161b22] border-[#21262d]' : 'bg-white border-gray-200 shadow-sm';
  const codeBg = darkMode ? 'bg-[#0d1117] border-[#21262d]' : 'bg-gray-900 border-gray-700';
  const bodyText = darkMode ? 'text-[#8b949e]' : 'text-gray-600';
  const heading = darkMode ? 'text-white' : 'text-gray-900';
  const subheading = darkMode ? 'text-[#8b949e]' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${heading}`}>Git Basics</h2>
        <p className={subheading}>Master the foundation of every Git workflow.</p>
      </div>

      {/* Visual flow */}
      <div className={`border rounded-xl p-5 ${card}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${subheading}`}>The Git workflow</p>
        <div className="flex items-center gap-1 flex-wrap">
          {['Working Dir', '→', 'Staging (add)', '→', 'Repository (commit)'].map((s, i) => (
            <span key={i} className={s === '→' ? `${subheading} text-lg` : `text-xs font-medium px-3 py-1.5 rounded-full ${i === 0 ? 'bg-blue-500/15 text-blue-400' : i === 2 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-green-500/15 text-green-400'}`}>
              {s}
            </span>
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
