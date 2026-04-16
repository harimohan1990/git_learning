import { create } from 'zustand';

const BRANCH_COLORS = {
  main: '#f97316',
  master: '#f97316',
  develop: '#22d3ee',
  feature: '#a78bfa',
  hotfix: '#f43f5e',
  release: '#4ade80',
  fix: '#fb923c',
  chore: '#94a3b8',
};

const EXTRA_COLORS = ['#facc15', '#fb7185', '#34d399', '#60a5fa', '#c084fc', '#f472b6', '#38bdf8'];

const getBranchColor = (name) => {
  for (const [key, color] of Object.entries(BRANCH_COLORS)) {
    if (name === key || name.startsWith(key + '/')) return color;
  }
  return EXTRA_COLORS[name.length % EXTRA_COLORS.length];
};

const shortId = () => Math.random().toString(36).slice(2, 9);

const useGitStore = create((set, get) => ({
  initialized: false,
  commits: [],
  branches: {},
  tags: {},
  stash: [],
  currentBranch: 'main',
  HEAD: null,
  log: [],
  stagedFiles: [],
  workingFiles: [],
  selectedCommit: null,
  branchLanes: {},   // branch name -> y lane index
  nextLane: 0,

  init: () => {
    const id = shortId();
    const rootCommit = { id, message: 'Initial commit', branch: 'main', parent: null, mergeParent: null, x: 0, y: 0, isMerge: false, timestamp: Date.now() };
    set({
      initialized: true,
      commits: [rootCommit],
      branches: { main: { name: 'main', color: BRANCH_COLORS.main, headCommit: id } },
      tags: {},
      stash: [],
      currentBranch: 'main',
      HEAD: id,
      log: ['Initialized empty Git repository in .git/'],
      stagedFiles: [],
      workingFiles: [],
      selectedCommit: null,
      branchLanes: { main: 0 },
      nextLane: 1,
    });
  },

  _getLane: (branchName) => {
    const { branchLanes, nextLane } = get();
    if (branchLanes[branchName] !== undefined) return branchLanes[branchName];
    const lane = nextLane;
    set((s) => ({ branchLanes: { ...s.branchLanes, [branchName]: lane }, nextLane: lane + 1 }));
    return lane;
  },

  _getNextX: (parentId) => {
    const { commits } = get();
    const parent = commits.find((c) => c.id === parentId);
    if (!parent) return 0;
    // find max x among commits that share the same y lane or are children of parent
    const childrenXes = commits.filter((c) => c.parent === parentId || c.mergeParent === parentId).map((c) => c.x);
    return Math.max(parent.x + 1, ...childrenXes.map((x) => x + 1), parent.x + 1);
  },

  stageFiles: (files) => {
    const { initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    // simulate some working files if none exist
    const simFiles = files[0] === '.' ? ['index.js', 'README.md', 'styles.css'] : files;
    set((s) => ({
      stagedFiles: [...new Set([...s.stagedFiles, ...simFiles])],
      workingFiles: s.workingFiles.filter((f) => !simFiles.includes(f)),
      log: [...s.log, `Changes to be committed:\n  ${simFiles.map((f) => `modified: ${f}`).join('\n  ')}`],
    }));
  },

  touchFiles: (files) => {
    set((s) => ({ workingFiles: [...new Set([...s.workingFiles, ...files])] }));
  },

  addCommit: (message) => {
    const { commits, currentBranch, HEAD, branches, stagedFiles, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (stagedFiles.length === 0) {
      set((s) => ({ log: [...s.log, 'On branch ' + s.currentBranch + '\nnothing to commit, working tree clean\n(Hint: use git add <file> first)'] }));
      return;
    }

    const lane = get()._getLane(currentBranch);
    const id = shortId();

    // x = parent.x + 1, but also avoid x collision with other commits on same lane
    const parent = commits.find((c) => c.id === HEAD);
    const sameYCommits = commits.filter((c) => c.y === lane);
    const usedXes = sameYCommits.map((c) => c.x);
    let x = (parent?.x ?? -1) + 1;
    while (usedXes.includes(x)) x++;

    const newCommit = { id, message, branch: currentBranch, parent: HEAD, mergeParent: null, x, y: lane, isMerge: false, timestamp: Date.now() };

    set((s) => ({
      commits: [...s.commits, newCommit],
      branches: { ...s.branches, [currentBranch]: { ...s.branches[currentBranch], headCommit: id } },
      HEAD: id,
      log: [...s.log, `[${currentBranch} ${id.slice(0, 7)}] ${message}\n  ${stagedFiles.length} file(s) changed`],
      stagedFiles: [],
    }));
  },

  createBranch: (name) => {
    const { branches, HEAD, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (branches[name]) { set((s) => ({ log: [...s.log, `fatal: A branch named '${name}' already exists`] })); return; }
    // assign new lane
    const lane = get()._getLane(name);
    set((s) => ({
      branches: { ...s.branches, [name]: { name, color: getBranchColor(name), headCommit: HEAD } },
      log: [...s.log, `Created branch '${name}' at ${HEAD?.slice(0, 7)}`],
    }));
  },

  createAndCheckout: (name) => {
    const { branches, HEAD, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (branches[name]) { set((s) => ({ log: [...s.log, `fatal: A branch named '${name}' already exists`] })); return; }
    const lane = get()._getLane(name);
    set((s) => ({
      branches: { ...s.branches, [name]: { name, color: getBranchColor(name), headCommit: HEAD } },
      currentBranch: name,
      HEAD: HEAD,
      log: [...s.log, `Switched to a new branch '${name}'`],
    }));
  },

  deleteBranch: (name, force = false) => {
    const { branches, currentBranch, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (name === currentBranch) { set((s) => ({ log: [...s.log, `error: Cannot delete the branch '${name}' which you are currently on.`] })); return; }
    if (!branches[name]) { set((s) => ({ log: [...s.log, `error: branch '${name}' not found.`] })); return; }
    const { [name]: removed, ...rest } = branches;
    set((s) => ({
      branches: rest,
      log: [...s.log, `Deleted branch ${name}.`],
    }));
  },

  checkout: (name) => {
    const { branches, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (!branches[name]) { set((s) => ({ log: [...s.log, `error: pathspec '${name}' did not match any file(s) known to git`] })); return; }
    set((s) => ({
      currentBranch: name,
      HEAD: branches[name].headCommit,
      log: [...s.log, `Switched to branch '${name}'`],
    }));
  },

  merge: (sourceBranch) => {
    const { branches, commits, currentBranch, HEAD, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (!branches[sourceBranch]) { set((s) => ({ log: [...s.log, `merge: ${sourceBranch} - not something we can merge`] })); return; }
    if (sourceBranch === currentBranch) { set((s) => ({ log: [...s.log, `Already on '${currentBranch}'`] })); return; }

    const sourceHead = branches[sourceBranch].headCommit;
    const lane = get()._getLane(currentBranch);
    const sameYCommits = commits.filter((c) => c.y === lane);
    const usedXes = sameYCommits.map((c) => c.x);
    const parentCommit = commits.find((c) => c.id === HEAD);
    let x = (parentCommit?.x ?? 0) + 1;
    while (usedXes.includes(x)) x++;

    const id = shortId();
    const mergeCommit = {
      id,
      message: `Merge branch '${sourceBranch}' into ${currentBranch}`,
      branch: currentBranch,
      parent: HEAD,
      mergeParent: sourceHead,
      x,
      y: lane,
      isMerge: true,
      timestamp: Date.now(),
    };

    set((s) => ({
      commits: [...s.commits, mergeCommit],
      branches: { ...s.branches, [currentBranch]: { ...s.branches[currentBranch], headCommit: id } },
      HEAD: id,
      log: [...s.log, `Merge made by the 'ort' strategy.\nMerged '${sourceBranch}' into ${currentBranch}`],
    }));
  },

  rebase: (targetBranch) => {
    const { branches, commits, currentBranch, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (!branches[targetBranch]) { set((s) => ({ log: [...s.log, `fatal: invalid upstream '${targetBranch}'`] })); return; }

    const targetHead = branches[targetBranch].headCommit;
    const targetCommit = commits.find((c) => c.id === targetHead);
    const lane = get()._getLane(currentBranch);

    // find commits unique to current branch (after divergence)
    const branchCommitsToRebase = commits.filter((c) => c.branch === currentBranch && c.id !== 'root' && !c.isMerge);

    const rebased = branchCommitsToRebase.map((c, i) => ({
      ...c,
      id: shortId(),
      parent: i === 0 ? targetHead : null, // link properly below
      x: (targetCommit?.x ?? 0) + i + 1,
      y: targetCommit?.y ?? 0,
      branch: currentBranch,
    }));

    // fix parent chain
    rebased.forEach((c, i) => { if (i > 0) c.parent = rebased[i - 1].id; });

    const otherCommits = commits.filter((c) => c.branch !== currentBranch || c.id === 'root');
    const lastRebased = rebased[rebased.length - 1];

    set((s) => ({
      commits: [...otherCommits, ...rebased],
      branches: {
        ...s.branches,
        [currentBranch]: { ...s.branches[currentBranch], headCommit: lastRebased?.id ?? targetHead },
      },
      HEAD: lastRebased?.id ?? targetHead,
      log: [...s.log, `Successfully rebased and updated refs/heads/${currentBranch}`],
    }));
  },

  cherryPick: (commitId) => {
    const { commits, currentBranch, HEAD, branches, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    const source = commits.find((c) => c.id.startsWith(commitId) || c.id === commitId);
    if (!source) { set((s) => ({ log: [...s.log, `error: could not apply ${commitId}` ] })); return; }

    const lane = get()._getLane(currentBranch);
    const parent = commits.find((c) => c.id === HEAD);
    const sameYCommits = commits.filter((c) => c.y === lane);
    let x = (parent?.x ?? 0) + 1;
    while (sameYCommits.map((c) => c.x).includes(x)) x++;

    const id = shortId();
    const picked = { ...source, id, branch: currentBranch, parent: HEAD, mergeParent: null, x, y: lane, timestamp: Date.now() };

    set((s) => ({
      commits: [...s.commits, picked],
      branches: { ...s.branches, [currentBranch]: { ...s.branches[currentBranch], headCommit: id } },
      HEAD: id,
      log: [...s.log, `[${currentBranch} ${id.slice(0, 7)}] ${source.message}`],
    }));
  },

  createTag: (name, commitId) => {
    const { commits, HEAD, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    const target = commitId ? commits.find((c) => c.id.startsWith(commitId)) : commits.find((c) => c.id === HEAD);
    if (!target) { set((s) => ({ log: [...s.log, `error: commit not found` ] })); return; }
    set((s) => ({
      tags: { ...s.tags, [name]: target.id },
      log: [...s.log, `Created tag '${name}' at ${target.id.slice(0, 7)}`],
    }));
  },

  pushStash: () => {
    const { stagedFiles, workingFiles, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    const entry = { staged: [...stagedFiles], working: [...workingFiles], timestamp: Date.now() };
    set((s) => ({
      stash: [entry, ...s.stash],
      stagedFiles: [],
      workingFiles: [],
      log: [...s.log, `Saved working directory state WIP on ${s.currentBranch}`],
    }));
  },

  popStash: () => {
    const { stash, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    if (stash.length === 0) { set((s) => ({ log: [...s.log, 'No stash entries found.' ] })); return; }
    const [top, ...rest] = stash;
    set((s) => ({
      stash: rest,
      stagedFiles: top.staged,
      workingFiles: top.working,
      log: [...s.log, `Dropped refs/stash@{0}\nRestored stash: ${top.staged.join(', ')}`],
    }));
  },

  listStash: () => {
    const { stash } = get();
    if (stash.length === 0) { set((s) => ({ log: [...s.log, '(empty stash)'] })); return; }
    const lines = stash.map((e, i) => `stash@{${i}}: WIP on branch (${e.staged.join(', ') || 'no files'})`);
    set((s) => ({ log: [...s.log, lines.join('\n')] }));
  },

  showLog: () => {
    const { commits, branches, HEAD, initialized } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    const sorted = [...commits].reverse();
    const lines = sorted.map((c) => {
      const tagNames = Object.entries(get().tags).filter(([, v]) => v === c.id).map(([k]) => `tag: ${k}`);
      const branchNames = Object.values(branches).filter((b) => b.headCommit === c.id).map((b) => b.name);
      const refs = [...branchNames, ...tagNames];
      const decoration = refs.length ? ` (${refs.join(', ')})` : '';
      const isHead = c.id === HEAD ? ' <- HEAD' : '';
      return `${c.id.slice(0, 7)}${decoration}${isHead}  ${c.message}`;
    });
    set((s) => ({ log: [...s.log, lines.join('\n')] }));
  },

  showStatus: () => {
    const { initialized, currentBranch, stagedFiles, workingFiles, stash } = get();
    if (!initialized) { set((s) => ({ log: [...s.log, 'fatal: not a git repository'] })); return; }
    const lines = [`On branch ${currentBranch}`];
    if (stagedFiles.length) {
      lines.push('Changes to be committed:');
      stagedFiles.forEach((f) => lines.push(`  modified: ${f}`));
    }
    if (workingFiles.length) {
      lines.push('Changes not staged for commit:');
      workingFiles.forEach((f) => lines.push(`  modified: ${f}`));
    }
    if (!stagedFiles.length && !workingFiles.length) lines.push('nothing to commit, working tree clean');
    if (stash.length) lines.push(`\nStash entries: ${stash.length}`);
    set((s) => ({ log: [...s.log, lines.join('\n')] }));
  },

  selectCommit: (id) => set({ selectedCommit: id }),

  reset: () => set({
    initialized: false,
    commits: [],
    branches: {},
    tags: {},
    stash: [],
    currentBranch: 'main',
    HEAD: null,
    log: [],
    stagedFiles: [],
    workingFiles: [],
    selectedCommit: null,
    branchLanes: {},
    nextLane: 0,
  }),

  clearLog: () => set({ log: [] }),
}));

export default useGitStore;
