import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphView from '../components/3d/GraphView';
import useGitStore from '../store/gitStore';

// ── autocomplete candidates ────────────────────────────────────────────────
const AUTOCOMPLETE = [
  'git init',
  'git status',
  'git log',
  'git add .',
  'git add ',
  'git commit -m ""',
  'git branch ',
  'git checkout ',
  'git checkout -b ',
  'git switch ',
  'git switch -c ',
  'git merge ',
  'git rebase ',
  'git cherry-pick ',
  'git stash',
  'git stash pop',
  'git stash list',
  'git tag ',
  'git branch -d ',
  'git reset',
];

// ── scenario presets ───────────────────────────────────────────────────────
const SCENARIOS = [
  {
    label: 'Feature Branch',
    icon: '🌿',
    steps: [
      'git init',
      'git add .',
      'git commit -m "Initial commit"',
      'git checkout -b feature/login',
      'git add .',
      'git commit -m "Add login form"',
      'git add .',
      'git commit -m "Add auth logic"',
      'git checkout main',
      'git merge feature/login',
    ],
  },
  {
    label: 'Hotfix',
    icon: '🔥',
    steps: [
      'git init',
      'git add .',
      'git commit -m "Initial commit"',
      'git add .',
      'git commit -m "Release v1.0"',
      'git checkout -b hotfix/crash',
      'git add .',
      'git commit -m "Fix null pointer crash"',
      'git checkout main',
      'git merge hotfix/crash',
    ],
  },
  {
    label: 'Rebase Flow',
    icon: '⚡',
    steps: [
      'git init',
      'git add .',
      'git commit -m "Initial commit"',
      'git checkout -b feature/ui',
      'git add .',
      'git commit -m "Add navbar"',
      'git add .',
      'git commit -m "Add sidebar"',
      'git checkout main',
      'git add .',
      'git commit -m "Update deps"',
      'git checkout feature/ui',
      'git rebase main',
    ],
  },
];

// ── command parser ─────────────────────────────────────────────────────────
function parseCommand(raw, store) {
  const input = raw.trim();
  const parts = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  if (!parts.length) return null;
  if (parts[0] !== 'git') return `command not found: ${parts[0]}`;

  const sub = parts[1];
  const arg = parts[2]?.replace(/^["']|["']$/g, '');
  const arg2 = parts[3]?.replace(/^["']|["']$/g, '');

  switch (sub) {
    case 'init':
      store.init();
      return null;

    case 'add':
      if (!store.initialized) return 'fatal: not a git repository';
      store.stageFiles(arg ? [arg] : ['.']);
      return null;

    case 'commit': {
      if (!store.initialized) return 'fatal: not a git repository';
      if (arg === '-am' || (arg === '-a' && parts[3] === '-m')) {
        const msg = (arg === '-am' ? arg2 : parts[4])?.replace(/^["']|["']$/g, '');
        if (!msg) return "error: switch 'm' requires a value";
        store.stageFiles(['.']);
        store.addCommit(msg);
        return null;
      }
      if (arg !== '-m') return "error: use git commit -m \"message\"";
      const msg = arg2;
      if (!msg) return "error: switch 'm' requires a value";
      store.addCommit(msg);
      return null;
    }

    case 'branch':
      if (arg === '-d' || arg === '-D') {
        if (!parts[3]) return 'error: branch name required';
        store.deleteBranch(parts[3].replace(/^["']|["']$/g, ''), arg === '-D');
        return null;
      }
      if (!arg) {
        if (!store.initialized) return 'fatal: not a git repository';
        const branches = Object.keys(store.branches);
        if (!branches.length) return '(no branches yet)';
        return branches.map((b) => (b === store.currentBranch ? `* ${b}` : `  ${b}`)).join('\n');
      }
      store.createBranch(arg);
      return null;

    case 'checkout':
      if (!store.initialized) return 'fatal: not a git repository';
      if (arg === '-b') {
        if (!arg2) return 'error: branch name required';
        store.createAndCheckout(arg2);
        return null;
      }
      if (!arg) return 'error: branch name required';
      store.checkout(arg);
      return null;

    case 'switch':
      if (!store.initialized) return 'fatal: not a git repository';
      if (arg === '-c' || arg === '--create') {
        if (!arg2) return 'error: branch name required';
        store.createAndCheckout(arg2);
        return null;
      }
      if (!arg) return 'error: branch name required';
      store.checkout(arg);
      return null;

    case 'merge':
      if (!arg) return 'error: branch name required';
      store.merge(arg);
      return null;

    case 'rebase':
      if (arg === '--abort') { store.set?.((s) => ({ log: [...s.log, 'rebase: no rebase in progress'] })); return null; }
      if (!arg) return 'error: branch name required';
      store.rebase(arg);
      return null;

    case 'cherry-pick':
      if (!arg) return 'error: commit hash required';
      store.cherryPick(arg);
      return null;

    case 'tag':
      if (!arg) {
        const tags = Object.keys(store.tags);
        return tags.length ? tags.join('\n') : '(no tags)';
      }
      store.createTag(arg, arg2);
      return null;

    case 'stash':
      if (!arg || arg === 'push') { store.pushStash(); return null; }
      if (arg === 'pop') { store.popStash(); return null; }
      if (arg === 'list') { store.listStash(); return null; }
      return `git stash: unknown subcommand '${arg}'`;

    case 'log':
      store.showLog();
      return null;

    case 'status':
      store.showStatus();
      return null;

    case 'reset':
      if (!store.initialized) return 'fatal: not a git repository';
      set((s) => ({ log: [...s.log, 'Unstaged changes after reset.' ] }));
      return null;

    case 'diff':
      if (!store.initialized) return 'fatal: not a git repository';
      if (!store.stagedFiles.length && !store.workingFiles.length) return 'no changes';
      return `diff summary:\n  staged: ${store.stagedFiles.join(', ') || 'none'}\n  modified: ${store.workingFiles.join(', ') || 'none'}`;

    case 'help':
    case '--help':
      return [
        'Available commands:',
        '  git init              Start a repository',
        '  git add <file|.>      Stage files',
        '  git commit -m "msg"   Commit staged files',
        '  git branch <name>     Create branch',
        '  git checkout <branch> Switch branch',
        '  git checkout -b <n>   Create & switch',
        '  git switch <branch>   Switch branch',
        '  git switch -c <name>  Create & switch',
        '  git merge <branch>    Merge branch',
        '  git rebase <branch>   Rebase onto branch',
        '  git cherry-pick <sha> Cherry-pick commit',
        '  git stash             Stash changes',
        '  git stash pop         Restore stash',
        '  git stash list        List stashes',
        '  git tag <name>        Create tag',
        '  git log               Show commit log',
        '  git status            Show working tree',
        '  git diff              Show changes',
      ].join('\n');

    default:
      return `git: '${sub}' is not recognized. Try 'git help'`;
  }
}

// ── WorkingTree sidebar panel ──────────────────────────────────────────────
function WorkingTreePanel({ store }) {
  return (
    <div className="p-3 border-b border-[#21262d] text-xs space-y-1.5">
      <p className="text-[#6e7681] uppercase tracking-wider font-semibold mb-2">Working Tree</p>

      {store.stagedFiles.length > 0 && (
        <div>
          <p className="text-green-400 mb-1">Staged</p>
          {store.stagedFiles.map((f) => (
            <p key={f} className="text-[#8b949e] pl-2">+ {f}</p>
          ))}
        </div>
      )}

      {store.workingFiles.length > 0 && (
        <div>
          <p className="text-yellow-400 mb-1">Modified</p>
          {store.workingFiles.map((f) => (
            <p key={f} className="text-[#8b949e] pl-2">~ {f}</p>
          ))}
        </div>
      )}

      {store.stash.length > 0 && (
        <p className="text-purple-400">Stash: {store.stash.length} entr{store.stash.length === 1 ? 'y' : 'ies'}</p>
      )}

      {!store.stagedFiles.length && !store.workingFiles.length && !store.stash.length && (
        <p className="text-[#6e7681] italic">Clean working tree</p>
      )}
    </div>
  );
}

// ── CommitInspector panel ──────────────────────────────────────────────────
function CommitInspector({ commit, branches, tags, onClose }) {
  if (!commit) return null;
  const branchNames = Object.values(branches).filter((b) => b.headCommit === commit.id).map((b) => b.name);
  const tagNames = Object.entries(tags).filter(([, v]) => v === commit.id).map(([k]) => k);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="border-b border-[#21262d] p-3 bg-[#0d1117] text-xs space-y-1"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[#6e7681] uppercase tracking-wider font-semibold">Commit</p>
        <button onClick={onClose} className="text-[#6e7681] hover:text-white">✕</button>
      </div>
      <p className="font-mono text-orange-400">{commit.id}</p>
      <p className="text-white font-medium">{commit.message}</p>
      {branchNames.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-1">
          {branchNames.map((n) => <span key={n} className="bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">{n}</span>)}
        </div>
      )}
      {tagNames.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {tagNames.map((t) => <span key={t} className="bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">🏷 {t}</span>)}
        </div>
      )}
      {commit.isMerge && <p className="text-pink-400 mt-1">Merge commit</p>}
      <p className="text-[#6e7681]">{commit.parent ? `Parent: ${commit.parent.slice(0, 7)}` : 'Root commit'}</p>
    </motion.div>
  );
}

// ── Main Playground ────────────────────────────────────────────────────────
export default function Playground() {
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'scenarios'
  const inputRef = useRef();
  const logRef = useRef();
  const store = useGitStore();

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [store.log]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setCmdHistory((h) => [cmd, ...h]);
    setHistoryIdx(-1);
    setSuggestions([]);

    // echo command to log
    useGitStore.setState((s) => ({ log: [...s.log, `$ ${cmd}`] }));

    const result = parseCommand(cmd, store);
    if (result) {
      useGitStore.setState((s) => ({ log: [...s.log, result] }));
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] || '');
      setSuggestions([]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next]);
      setSuggestions([]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        setInput(suggestions[0]);
        setSuggestions([]);
      } else if (suggestions.length > 1) {
        // cycle
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 2) {
      const matches = AUTOCOMPLETE.filter((c) => c.startsWith(val) && c !== val);
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const runScenario = async (steps) => {
    store.reset();
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 300));
      useGitStore.setState((s) => ({ log: [...s.log, `$ ${steps[i]}`] }));
      const result = parseCommand(steps[i], useGitStore.getState());
      if (result) useGitStore.setState((s) => ({ log: [...s.log, result] }));
    }
  };

  const selectedCommit = store.commits.find((c) => c.id === store.selectedCommit);
  const branches = store.branches || {};
  const tags = store.tags || {};

  return (
    <div className="flex flex-col h-screen pt-[65px] bg-[#0d1117]">
      {/* ── top bar ── */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-[#21262d] bg-[#161b22] gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-white shrink-0">Playground</span>
          {store.initialized && (
            <span className="text-xs bg-[#0d1117] border border-[#21262d] text-orange-400 px-2 py-0.5 rounded font-mono truncate">
              ⎇ {store.currentBranch}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {Object.values(branches).slice(0, 3).map((b) => (
            <div key={b.name} className="hidden sm:flex items-center gap-1 text-xs text-[#8b949e]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
              <span className="truncate max-w-[60px]">{b.name}</span>
            </div>
          ))}
          <button
            onClick={() => store.reset()}
            className="text-xs text-[#6e7681] hover:text-red-400 border border-[#21262d] hover:border-red-400/50 px-2.5 py-1 rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* ── 3D Graph ── */}
        <div className="flex-1 relative min-h-[250px]">
          <GraphView
            commits={store.commits}
            branches={store.branches}
            tags={store.tags}
            HEAD={store.HEAD}
            height="100%"
            onSelectCommit={(id) => store.selectCommit(id)}
            selectedCommit={store.selectedCommit}
          />
          {!store.initialized && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-5xl mb-3">⎇</div>
                <p className="text-[#6e7681] text-sm">Run <code className="text-orange-400 bg-[#161b22] px-2 py-0.5 rounded">git init</code> to start</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="w-full md:w-[360px] flex flex-col border-t md:border-t-0 md:border-l border-[#21262d] bg-[#0d1117]">
          {/* tabs */}
          <div className="flex border-b border-[#21262d]">
            {['terminal', 'scenarios'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold capitalize transition-colors ${
                  activeTab === tab ? 'text-orange-400 border-b-2 border-orange-400' : 'text-[#6e7681] hover:text-white'
                }`}
              >
                {tab === 'terminal' ? '⌨ Terminal' : '🎬 Scenarios'}
              </button>
            ))}
          </div>

          {activeTab === 'scenarios' ? (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <p className="text-xs text-[#6e7681] mb-3">Click a scenario to auto-play it step by step.</p>
              {SCENARIOS.map((s) => (
                <motion.button
                  key={s.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setActiveTab('terminal'); runScenario(s.steps); }}
                  className="w-full text-left bg-[#161b22] border border-[#21262d] hover:border-orange-500/50 rounded-xl p-4 transition-colors"
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className="font-semibold text-white text-sm mb-1">{s.label}</p>
                  <p className="text-xs text-[#6e7681]">{s.steps.length} commands</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.steps.slice(0, 4).map((step, i) => (
                      <code key={i} className="text-[10px] bg-[#0d1117] text-orange-400 px-1.5 py-0.5 rounded">{step}</code>
                    ))}
                    {s.steps.length > 4 && <span className="text-[10px] text-[#6e7681]">+{s.steps.length - 4} more</span>}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <>
              {/* working tree */}
              {store.initialized && <WorkingTreePanel store={store} />}

              {/* commit inspector */}
              <AnimatePresence>
                {selectedCommit && (
                  <CommitInspector
                    commit={selectedCommit}
                    branches={branches}
                    tags={tags}
                    onClose={() => store.selectCommit(null)}
                  />
                )}
              </AnimatePresence>

              {/* terminal log */}
              <div ref={logRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5">
                <AnimatePresence initial={false}>
                  {store.log.map((line, i) => {
                    const isCmd = line.startsWith('$ ');
                    const isError = line.startsWith('fatal') || line.startsWith('error');
                    const isSuccess = line.startsWith('Switched') || line.startsWith('Merge') || line.startsWith('Successfully') || line.startsWith('Created') || line.startsWith('Initialized') || line.startsWith('[');
                    return (
                      <motion.pre
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`whitespace-pre-wrap break-all leading-relaxed ${
                          isCmd ? 'text-blue-400 font-bold mt-2' :
                          isError ? 'text-red-400' :
                          isSuccess ? 'text-green-400' :
                          'text-[#8b949e]'
                        }`}
                      >
                        {line}
                      </motion.pre>
                    );
                  })}
                </AnimatePresence>
                {store.log.length === 0 && (
                  <p className="text-[#6e7681]">Type <span className="text-orange-400">git init</span> to get started…</p>
                )}
              </div>

              {/* autocomplete suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="border-t border-[#21262d] bg-[#161b22]"
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setInput(s); setSuggestions([]); inputRef.current?.focus(); }}
                        className="w-full text-left px-4 py-1.5 text-xs font-mono text-[#8b949e] hover:bg-[#21262d] hover:text-orange-400 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* input */}
              <form onSubmit={handleSubmit} className="border-t border-[#21262d] p-3">
                <div className="flex items-center gap-2 bg-[#161b22] border border-[#21262d] rounded-lg px-3 py-2 focus-within:border-orange-500/60 transition-colors">
                  <span className="text-orange-400 font-mono text-sm select-none shrink-0">$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="git init"
                    className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-[#6e7681] min-w-0"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {input && (
                    <button type="button" onClick={() => { setInput(''); setSuggestions([]); }} className="text-[#6e7681] hover:text-white text-xs shrink-0">✕</button>
                  )}
                </div>
                <p className="text-[10px] text-[#6e7681] mt-1.5 px-1">Tab autocomplete · ↑↓ history · Enter to run</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
