import { motion } from 'framer-motion';

const topics = [
  {
    icon: '🌐',
    title: 'Remote Repositories',
    body: 'A remote is a version of your repo hosted elsewhere (GitHub, GitLab). You push to share and pull to sync.',
    code: 'git remote add origin <url>\ngit push -u origin main\ngit pull origin main',
  },
  {
    icon: '🔍',
    title: 'git status & git log',
    body: "See what's changed and your full commit history. Essential for understanding where you are.",
    code: 'git status\ngit log --oneline --graph --all',
  },
  {
    icon: '↩️',
    title: 'Undoing Changes',
    body: 'Git gives you multiple ways to undo — from unstaging a file to reverting entire commits.',
    code: 'git restore <file>        # discard changes\ngit reset HEAD~1          # undo last commit\ngit revert <commit-id>    # safe undo (new commit)',
  },
  {
    icon: '📦',
    title: 'git stash',
    body: 'Temporarily shelf your work so you can switch context without losing changes.',
    code: 'git stash\ngit stash pop\ngit stash list',
  },
  {
    icon: '🏷️',
    title: 'Tags',
    body: "Mark specific commits as important (usually releases). Unlike branches, tags don't move.",
    code: 'git tag v1.0.0\ngit push origin v1.0.0',
  },
];

export default function Advanced({ darkMode = true }) {
  const card = darkMode ? 'bg-[#161b22] border-[#21262d]' : 'bg-white border-gray-200 shadow-sm';
  const codeBg = darkMode ? 'bg-[#0d1117] border-[#21262d]' : 'bg-gray-900 border-gray-700';
  const bodyText = darkMode ? 'text-[#8b949e]' : 'text-gray-600';
  const heading = darkMode ? 'text-white' : 'text-gray-900';
  const subheading = darkMode ? 'text-[#8b949e]' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${heading}`}>Remote & Advanced Git</h2>
        <p className={subheading}>Remote workflows, undoing mistakes, and power-user commands.</p>
      </div>

      {/* remote flow diagram */}
      <div className={`border rounded-xl p-5 ${card}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${subheading}`}>Remote workflow</p>
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {['Local repo', '→ push →', 'Remote (GitHub)', '→ pull →', 'Local repo'].map((s, i) => (
            <span key={i} className={
              s.includes('→') ? `${subheading}` :
              i === 2 ? 'bg-blue-500/15 text-blue-400 px-3 py-1.5 rounded-full font-medium' :
              'bg-orange-500/15 text-orange-400 px-3 py-1.5 rounded-full font-medium'
            }>
              {s}
            </span>
          ))}
        </div>
      </div>

      {topics.map((topic, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`border rounded-xl p-5 sm:p-6 transition-colors ${card}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{topic.icon}</span>
            <h3 className={`text-lg font-semibold ${heading}`}>{topic.title}</h3>
          </div>
          <p className={`mb-4 leading-relaxed ${bodyText}`}>{topic.body}</p>
          <pre className={`border rounded-lg p-4 text-sm text-orange-400 font-mono overflow-x-auto ${codeBg}`}>
            {topic.code}
          </pre>
        </motion.div>
      ))}
    </div>
  );
}
