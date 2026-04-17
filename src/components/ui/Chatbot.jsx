import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { greetings, topicMap, faqs, searchCommands, formatCommandAnswer } from '../../data/chatbotKnowledge';
import { commands } from '../../data/commands';
import { linuxCommands } from '../../data/linuxCommands';

// ── Markdown-lite renderer ─────────────────────────────────────────────────
function MsgText({ text }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-white">{line.slice(2, -2)}</p>;
        }
        // inline bold + inline code
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**'))
                return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
              if (part.startsWith('`') && part.endsWith('`'))
                return <code key={j} className="bg-[#0d1117] text-green-400 px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

// ── Code block renderer ────────────────────────────────────────────────────
function MsgContent({ text }) {
  const blocks = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-2 text-sm text-[#c9d1d9]">
      {blocks.map((block, i) => {
        if (block.startsWith('```')) {
          const code = block.replace(/^```[^\n]*\n?/, '').replace(/```$/, '');
          return (
            <pre key={i} className="bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
              {code.trim()}
            </pre>
          );
        }
        return <MsgText key={i} text={block} />;
      })}
    </div>
  );
}

// ── Quick suggestion chips ─────────────────────────────────────────────────
const SUGGESTIONS = [
  'What is git stash?',
  'Merge vs rebase?',
  'How does chmod work?',
  'How to undo a commit?',
  'What is grep?',
  'git pull vs git fetch',
  'What is a branch?',
  'How to use pipes?',
];

// ── Bot logic ──────────────────────────────────────────────────────────────
function getBotResponse(input) {
  const q = input.toLowerCase().trim();

  // greeting
  if (greetings.some((g) => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'))) {
    return `Hey there! 👋 I'm **GitBot** — your Git & Linux assistant.

Ask me about any Git or Linux command, concept, or workflow. Try:
• "What is git rebase?"
• "How do I check disk space?"
• "Difference between merge and rebase?"`;
  }

  // thanks
  if (['thanks', 'thank you', 'thx', 'ty', 'cheers'].some((t) => q.includes(t))) {
    return "You're welcome! 😊 Ask me anything else about Git or Linux.";
  }

  // FAQ exact match
  for (const faq of faqs) {
    if (faq.patterns.some((p) => q.includes(p))) {
      return faq.answer;
    }
  }

  // direct command lookup — "git stash", "what is chmod", "explain grep", etc.
  const cleanQ = q
    .replace(/^(what is|explain|how does|how do i use|tell me about|what does|how to use)\s+/i, '')
    .trim();

  // check git commands first
  const gitMatch = commands.find(
    (c) => c.name.toLowerCase() === cleanQ || c.syntax?.toLowerCase().startsWith(cleanQ)
  );
  if (gitMatch) return formatCommandAnswer({ ...gitMatch, type: 'git' });

  // check linux commands
  const linuxMatch = linuxCommands.find(
    (c) => c.name.toLowerCase() === cleanQ || c.syntax?.toLowerCase().startsWith(cleanQ)
  );
  if (linuxMatch) return formatCommandAnswer({ ...linuxMatch, type: 'linux' });

  // topic keyword match
  for (const { keywords, topic } of topicMap) {
    if (keywords.some((kw) => q.includes(kw))) {
      const gitCmd = commands.find((c) => c.name.toLowerCase().includes(topic));
      const linuxCmd = linuxCommands.find((c) => c.name.toLowerCase() === topic);
      if (gitCmd) return formatCommandAnswer({ ...gitCmd, type: 'git' });
      if (linuxCmd) return formatCommandAnswer({ ...linuxCmd, type: 'linux' });
    }
  }

  // fuzzy search across all commands
  const results = searchCommands(cleanQ);
  if (results.length === 1) return formatCommandAnswer(results[0]);
  if (results.length > 1) {
    const list = results.map((r) => `• \`${r.name}\` — ${r.description}`).join('\n');
    return `I found a few matches for **"${cleanQ}"**:\n\n${list}\n\nAsk me about any specific one for full details!`;
  }

  // fallback
  return `Hmm, I'm not sure about **"${input}"** specifically. Try rephrasing or ask about:

• A specific command (e.g., "git rebase", "chmod", "grep")
• A concept (e.g., "what is a branch?", "how do pipes work?")
• A workflow (e.g., "how to undo a commit?")

Type **"help"** to see what I can do!`;
}

// ── Main Chatbot Component ─────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: `Hi! I'm **GitBot** 🤖 — your Git & Linux assistant.

Ask me anything about commands, workflows, or concepts!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText) return;

    setMessages((m) => [...m, { id: Date.now(), role: 'user', text: userText }]);
    setInput('');
    setTyping(true);

    const delay = 400 + Math.min(userText.length * 8, 800);
    setTimeout(() => {
      const response = getBotResponse(userText);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: response }]);
      setTyping(false);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const unreadCount = 0;

  return (
    <>
      {/* ── FAB button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center text-2xl"
        aria-label="Open chatbot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              ✕
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              💬
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[360px] bg-[#161b22] border border-[#21262d] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: 'min(520px, calc(100vh - 120px))' }}
          >
            {/* header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-b border-[#21262d]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-lg shrink-0">
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">GitBot</p>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Git & Linux Assistant
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#6e7681] hover:text-white transition-colors text-lg leading-none">✕</button>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-orange-500 text-white rounded-tr-sm ml-auto'
                        : 'bg-[#21262d] rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm">{msg.text}</p>
                    ) : (
                      <MsgContent text={msg.text} />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 items-end"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-sm shrink-0">
                      🤖
                    </div>
                    <div className="bg-[#21262d] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 bg-[#6e7681] rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-[#6e7681] mb-1.5 uppercase tracking-wider">Try asking</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs bg-[#0d1117] border border-[#30363d] hover:border-orange-500/50 hover:text-orange-400 text-[#8b949e] px-2.5 py-1 rounded-full transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* input */}
            <form onSubmit={handleSubmit} className="border-t border-[#21262d] px-3 py-3">
              <div className="flex items-center gap-2 bg-[#0d1117] border border-[#21262d] rounded-xl px-3 py-2 focus-within:border-orange-500/50 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Git or Linux..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#6e7681] min-w-0"
                  disabled={typing}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || typing}
                  whileTap={{ scale: 0.9 }}
                  className="shrink-0 w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-white rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
