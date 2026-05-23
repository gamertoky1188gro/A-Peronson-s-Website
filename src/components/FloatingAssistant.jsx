import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE, getToken, getCurrentUser } from "../lib/auth";
import BotLogo from "./ui/BotLogo";

function getUserId() {
  const user = getCurrentUser();
  return user?.id || null;
}

async function fetchSessionMessages() {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE}/assistant/session-messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.messages || [];
  } catch {
    return [];
  }
}

async function deleteSessionAPI() {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/assistant/session`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.ok || false;
  } catch {
    return false;
  }
}

function TypewriterText({ text, speed = 20, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span>{displayedText}</span>;
}

export default function FloatingAssistant() {
  const userId = getUserId();
  const location = useLocation();
  const orbMode = location.pathname === "/help";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const requestSeqRef = useRef(1);

  useEffect(() => {
    if (open && userId && !sessionLoaded) {
      fetchSessionMessages().then((msgs) => {
        if (msgs && msgs.length > 0) {
          const formatted = msgs.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            text: m.text,
            isNew: false,
          }));
          setMessages(formatted);
        } else {
          setMessages([{
            role: "assistant",
            text: "Hello! I am your GarTex Assistant. How can I help you with your textile business today?",
            isNew: false,
          }]);
        }
        setSessionLoaded(true);
      });
    }
  }, [open, userId, sessionLoaded]);

  async function deleteSession() {
    if (userId) {
      await deleteSessionAPI();
    }
    setMessages([{
      role: "assistant",
      text: "Chat cleared. How can I help you with your textile business today?",
      isNew: false,
    }]);
    setSessionLoaded(false);
  }

  useEffect(() => {
    const wsUrl = (() => {
      if (API_BASE.startsWith("http://") || API_BASE.startsWith("https://")) {
        return API_BASE.replace(/^http/, "ws").replace(/\/api\/*$/, "/ws");
      }
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${window.location.host}/ws`;
    })();
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Assistant WS Connected");
      try {
        const token = typeof getToken === "function" ? getToken() : null;
        if (token) {
          socket.send(JSON.stringify({ type: "identify", token }));
        }
      } catch (err) {
        console.warn("Assistant identify failed", err);
      }
    };
    const streamingIds = new Set();

    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.error("Failed to parse WS message", err);
        return;
      }
      if (data.type === "chunk") {
        const rid = data.request_id;
        streamingIds.add(rid);
        setMessages((prev) => {
          const idx = prev.findLastIndex(
            (m) => m.role === "assistant" && m.request_id === rid,
          );
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], text: data.text || "" };
            return updated;
          }
          return [
            ...prev,
            {
              role: "assistant",
              text: data.text || "",
              isNew: false,
              request_id: rid,
            },
          ];
        });
      } else if (data.type === "reply") {
        streamingIds.delete(data.request_id);
        const botMsg = {
          role: "assistant",
          text:
            data.answer || "I am sorry, I could not find an answer to that.",
          isNew: !streamingIds.has(data.request_id),
          request_id: data.request_id || null,
        };
        setMessages((prev) => [...prev, botMsg]);
        setLoading(false);
      } else if (data.type === "error") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Error: " + (data.message || "Something went wrong"),
            isNew: true,
          },
        ]);
        setLoading(false);
      }
    };
    socket.onclose = () => console.log("Assistant WS Disconnected");
    socket.onerror = (err) => console.error("Assistant WS Error", err);

    socketRef.current = socket;

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend(textOverride) {
    const text = textOverride || input;
    if (!text.trim() || loading) return;

    const requestId = `req_${requestSeqRef.current++}`;
    const userMsg = { role: "user", text, request_id: requestId, isNew: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "ask", question: text, request_id: requestId }),
      );
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Connection lost. Please refresh the page.",
          isNew: true,
        },
      ]);
      setLoading(false);
    }
  }

  function markAsOld(msgIndex) {
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, isNew: false } : m)),
    );
  }

  const suggestions = [
    "How do I verify my account?",
    "Tell me about Premium benefits",
    "How do contracts work?",
    "Need help with onboarding",
  ];

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={[
            "w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 active:scale-90",
            orbMode
              ? "assistant-orb-btn hover:scale-110"
              : "bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-110 ring-2 ring-white/30 dark:ring-white/10",
          ].join(" ")}
          aria-label={open ? "Close assistant" : "Open assistant"}
          title={open ? "Close assistant" : "Open assistant"}
        >
          {!open ? (
            <BotLogo width={22} height={22} />
          ) : (
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6 L18 18 M6 18 L18 6"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] z-50 transform transition-all duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-full bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border-l border-slate-200/70 dark:border-slate-800/60 shadow-borderless dark:shadow-borderlessDark flex flex-col">
          <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-400 text-white flex items-center justify-between px-5 py-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold backdrop-blur-sm shrink-0">
                <BotLogo
                  width={22}
                  height={22}
                  variant="glyph"
                  className="text-white"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold tracking-tight text-[15px]">GarTex Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      loading ? "bg-amber-300" : "bg-green-300"
                    }`}
                  ></span>
                  <p className="text-[10px] uppercase tracking-wider text-white/80 font-semibold">
                    {loading ? "Thinking..." : "Online"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={deleteSession}
                aria-label="Delete session"
                title="Delete session & start new chat"
                type="button"
                className="hover:bg-white/15 p-2 rounded-xl transition-colors"
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/80"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                  />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                title="Close assistant"
                type="button"
                className="hover:bg-white/15 p-2 rounded-xl transition-colors"
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/80"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6 L18 18 M6 18 L18 6"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[88%] text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-sky-500 to-cyan-400 text-white rounded-2xl rounded-br-none px-4 py-3 shadow-md shadow-sky-500/20"
                      : "bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200/60 dark:border-slate-700/50 shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" && msg.isNew ? (
                    <TypewriterText
                      text={msg.text}
                      onComplete={() => markAsOld(i)}
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3.5 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 pt-3 pb-5 border-t border-slate-200/60 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shrink-0">
            {messages.length < 3 && !loading && (
              <div className="flex flex-wrap gap-2 mb-3 animate-in fade-in slide-in-from-bottom-1 duration-500">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[11px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/50 px-3 py-1.5 rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your question..."
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/50"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:shadow-lg hover:shadow-sky-500/30 active:scale-90 shrink-0"
              >
                <svg
                  className="w-5 h-5 rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-3 font-medium">
              GarTex AI Assistant
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
