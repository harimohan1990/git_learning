import { commands } from './commands.js';
import { linuxCommands } from './linuxCommands.js';

// ── Greeting patterns ──────────────────────────────────────────────────────
export const greetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'hiya', 'howdy', 'greetings'];

// ── Topic keyword map ──────────────────────────────────────────────────────
export const topicMap = [
  { keywords: ['stash', 'shelf', 'save temporarily'], topic: 'stash' },
  { keywords: ['rebase', 'replay', 'reapply'], topic: 'rebase' },
  { keywords: ['merge', 'combine', 'join'], topic: 'merge' },
  { keywords: ['branch', 'fork', 'diverge'], topic: 'branch' },
  { keywords: ['commit', 'save', 'snapshot', 'record'], topic: 'commit' },
  { keywords: ['push', 'upload', 'publish', 'remote send'], topic: 'push' },
  { keywords: ['pull', 'download', 'fetch', 'sync'], topic: 'pull' },
  { keywords: ['clone', 'copy repo', 'download repo'], topic: 'clone' },
  { keywords: ['diff', 'difference', 'compare', 'changes'], topic: 'diff' },
  { keywords: ['reset', 'undo', 'revert', 'rollback'], topic: 'reset' },
  { keywords: ['tag', 'release', 'version mark'], topic: 'tag' },
  { keywords: ['cherry-pick', 'cherry pick', 'pick commit'], topic: 'cherry-pick' },
  { keywords: ['log', 'history', 'past commits'], topic: 'log' },
  { keywords: ['status', 'what changed', 'current state'], topic: 'status' },
  { keywords: ['remote', 'origin', 'upstream'], topic: 'remote' },
  { keywords: ['chmod', 'permission', 'access rights'], topic: 'chmod' },
  { keywords: ['grep', 'search text', 'find pattern'], topic: 'grep' },
  { keywords: ['find', 'locate file', 'search file'], topic: 'find' },
  { keywords: ['ssh', 'secure shell', 'remote login'], topic: 'ssh' },
  { keywords: ['curl', 'http request', 'download url', 'api call'], topic: 'curl' },
  { keywords: ['process', 'ps', 'running', 'pid'], topic: 'ps' },
  { keywords: ['disk', 'df', 'storage', 'space'], topic: 'df' },
  { keywords: ['kill', 'stop process', 'terminate'], topic: 'kill' },
  { keywords: ['tar', 'archive', 'compress', 'zip'], topic: 'tar' },
  { keywords: ['sed', 'replace text', 'stream edit'], topic: 'sed' },
  { keywords: ['awk', 'column', 'field process'], topic: 'awk' },
  { keywords: ['systemctl', 'service', 'daemon', 'systemd'], topic: 'systemctl' },
  { keywords: ['cron', 'schedule', 'recurring', 'crontab'], topic: 'cron / crontab' },
  { keywords: ['tmux', 'multiplexer', 'terminal split'], topic: 'tmux' },
  { keywords: ['rsync', 'sync files', 'incremental copy'], topic: 'rsync' },
];

// ── FAQ answers ────────────────────────────────────────────────────────────
export const faqs = [
  {
    patterns: ['what is git', 'explain git', 'git meaning', 'what does git do'],
    answer: `**Git** is a distributed version control system created by Linus Torvalds in 2005.

It lets you:
• Track changes to files over time
• Collaborate with others without overwriting each other's work
• Create branches to work on features in isolation
• Revert to any previous state of your project

Every developer has a full copy of the repository — there's no single point of failure.`,
  },
  {
    patterns: ['difference between git and github', 'git vs github', 'what is github'],
    answer: `**Git** is the version control tool — it runs on your local machine.

**GitHub** is a cloud hosting platform for Git repositories. It adds:
• A web interface to browse code
• Pull Requests for code review
• Issues for bug tracking
• CI/CD with GitHub Actions

Other similar platforms: GitLab, Bitbucket. Git works without any of them.`,
  },
  {
    patterns: ['what is a branch', 'why use branches', 'branch explained'],
    answer: `A **branch** is an independent line of development.

Think of it as a parallel universe for your code. You can:
• Create a branch to work on a feature
• Make commits without affecting \`main\`
• Merge the branch back when done

\`\`\`
git checkout -b feature/login   # create + switch
git commit -m "Add login form"  # commit on branch
git checkout main               # go back to main
git merge feature/login         # bring changes in
\`\`\``,
  },
  {
    patterns: ['merge vs rebase', 'when to rebase', 'rebase vs merge difference'],
    answer: `Both integrate changes from one branch into another, but differently:

**Merge** creates a merge commit — preserves full history:
\`git merge feature\`

**Rebase** replays your commits on top — linear history:
\`git rebase main\`

**When to use each:**
• Use **merge** for public/shared branches (safe, non-destructive)
• Use **rebase** for local cleanup before a PR (cleaner history)
• Never rebase commits already pushed to a shared remote`,
  },
  {
    patterns: ['what is staging', 'why git add', 'index explained', 'staging area'],
    answer: `Git has a **3-stage workflow**:

1. **Working directory** — where you edit files
2. **Staging area (index)** — where you select what goes into the next commit
3. **Repository** — permanent committed history

\`git add\` moves changes from working directory → staging.
\`git commit\` moves staged changes → repository.

This lets you make many changes but commit them in focused, logical chunks.`,
  },
  {
    patterns: ['how to undo commit', 'undo last commit', 'revert commit'],
    answer: `Depends on whether you've pushed or not:

**Not pushed yet — soft reset (keeps changes staged):**
\`git reset --soft HEAD~1\`

**Not pushed — discard changes completely:**
\`git reset --hard HEAD~1\`

**Already pushed — safe revert (creates new commit):**
\`git revert HEAD\`

Never use \`reset --hard\` on commits already shared with others.`,
  },
  {
    patterns: ['git pull vs git fetch', 'fetch vs pull', 'difference fetch pull'],
    answer: `**fetch** — downloads remote changes but does NOT merge them:
\`git fetch origin\`
Your local branches are untouched. Review with \`git log origin/main\`.

**pull** — fetch + merge in one step:
\`git pull origin main\`

**Best practice:** Use \`git fetch\` then inspect, then merge manually when you want control over what gets integrated.`,
  },
  {
    patterns: ['what is linux', 'why learn linux', 'linux basics'],
    answer: `**Linux** is a free, open-source operating system kernel created by Linus Torvalds in 1991.

Why learn it:
• Powers 96% of web servers, all Android phones, cloud infrastructure
• Essential for DevOps, backend development, security
• Powerful command-line tools for automation
• Understanding Linux makes you a significantly better developer

Popular distros: Ubuntu, Debian, CentOS, Fedora, Arch.`,
  },
  {
    patterns: ['chmod 755', 'chmod 644', 'permission numbers', 'octal permission'],
    answer: `Linux permissions use 3 digits (owner / group / others):

Each digit is a sum of: **4**=read, **2**=write, **1**=execute

| Octal | Binary | Meaning |
|-------|--------|---------|
| 7 | 111 | rwx (read+write+execute) |
| 6 | 110 | rw- (read+write) |
| 5 | 101 | r-x (read+execute) |
| 4 | 100 | r-- (read only) |

**Common values:**
• \`chmod 644 file\` → files (owner rw, others r)
• \`chmod 755 dir\` → directories & executables
• \`chmod +x script.sh\` → add execute for everyone`,
  },
  {
    patterns: ['pipe', 'piping commands', 'what is |', 'combine commands'],
    answer: `The **pipe** \`|\` connects the output of one command to the input of another.

\`\`\`bash
# count lines in a file
cat file.txt | wc -l

# find running nginx processes
ps aux | grep nginx

# top 10 largest files
du -sh * | sort -rh | head -10

# search logs for errors, last 20
grep ERROR app.log | tail -20
\`\`\`

Pipes let you build powerful one-liners by chaining simple tools.`,
  },
  {
    patterns: ['ssh key', 'generate ssh key', 'ssh keygen'],
    answer: `Generate an SSH key pair:

\`\`\`bash
ssh-keygen -t ed25519 -C "your@email.com"
# Press Enter to accept default path (~/.ssh/id_ed25519)
# Enter a passphrase (recommended)

# Copy public key to server
ssh-copy-id user@server

# Or for GitHub — copy this and paste in GitHub Settings → SSH Keys:
cat ~/.ssh/id_ed25519.pub
\`\`\`

The private key (\`id_ed25519\`) stays on your machine. The public key (\`.pub\`) goes on servers/GitHub.`,
  },
  {
    patterns: ['environment variable', 'what is env', 'export variable', '$path'],
    answer: `**Environment variables** are key-value pairs available to all processes.

\`\`\`bash
# View all
env

# View specific
echo $PATH
printenv HOME

# Set temporarily (current session only)
export MY_VAR=hello

# Make permanent (add to ~/.bashrc)
echo 'export MY_VAR=hello' >> ~/.bashrc
source ~/.bashrc
\`\`\`

\`PATH\` is the most important — it tells the shell where to look for executables.`,
  },
  {
    patterns: ['how to use this', 'what can you do', 'help me', 'what can i ask'],
    answer: `I can help you with **Git** and **Linux** questions! Try asking:

**Git:**
• "How do I undo a commit?"
• "What is git stash?"
• "Merge vs rebase?"
• "How do I create a branch?"
• "What does git fetch do?"

**Linux:**
• "How does chmod work?"
• "What is grep?"
• "How do I find a file?"
• "What is a pipe?"
• "How to check disk space?"

Or just type any command name and I'll explain it!`,
  },
];

// ── Search both command lists ──────────────────────────────────────────────
export function searchCommands(query) {
  const q = query.toLowerCase();
  const allCommands = [
    ...commands.map((c) => ({ ...c, type: 'git' })),
    ...linuxCommands.map((c) => ({ ...c, type: 'linux' })),
  ];

  return allCommands.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(q);
    const syntaxMatch = c.syntax?.toLowerCase().includes(q);
    const descMatch = c.description?.toLowerCase().includes(q);
    return nameMatch || syntaxMatch || descMatch;
  }).slice(0, 3);
}

export function formatCommandAnswer(cmd) {
  const badge = cmd.type === 'git' ? '⎇ Git' : '🐧 Linux';
  return `**${badge} — \`${cmd.name}\`**

${cmd.description}

**Syntax:** \`${cmd.syntax}\`

${cmd.details || ''}

${cmd.example ? `**Example:**\n\`\`\`\n${cmd.example}\n\`\`\`` : ''}`;
}
