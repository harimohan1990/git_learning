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
    body: 'See what\'s changed and your full commit history. Essential for understanding where you are.',
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
    code: 'git stash\ngit stash pop',
  },
  {
    icon: '🏷️',
    title: 'Tags',
    body: 'Mark specific commits as important (usually releases). Unlike branches, tags don\'t move.',
    code: 'git tag v1.0.0\ngit push origin v1.0.0',
  },
];

export default function Advanced() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Advanced Git</h2>
        <p className="text-[#8b949e]">Remote workflows, undoing mistakes, and power-user commands.</p>
      </div>
      {topics.map((topic, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#161b22] border border-[#21262d] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{topic.icon}</span>
            <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
          </div>
          <p className="text-[#8b949e] mb-4">{topic.body}</p>
          <pre className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 text-sm text-orange-400 font-mono overflow-x-auto">
            {topic.code}
          </pre>
        </motion.div>
      ))}
    </div>
  );
}
