"use client";
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import {
    X, Send, Bot, User, AlertTriangle, CheckCircle, ExternalLink,
    Loader2, Zap, Shield, Globe, ChevronRight
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Source {
    name: string;
    url: string;
    reliability: string;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    misinformation_risk?: "LOW" | "MEDIUM" | "HIGH";
    categories?: string[];
    timestamp: string;
    isTyping?: boolean;
}

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const RISK_CONFIG = {
    LOW: { color: "#4DE6A1", bg: "rgba(77,230,161,0.1)", border: "rgba(77,230,161,0.25)", icon: CheckCircle, label: "Low Risk" },
    MEDIUM: { color: "#F2D14D", bg: "rgba(242,209,77,0.1)", border: "rgba(242,209,77,0.25)", icon: AlertTriangle, label: "Medium Risk" },
    HIGH: { color: "#F25C75", bg: "rgba(242,92,117,0.1)", border: "rgba(242,92,117,0.25)", icon: AlertTriangle, label: "High Risk" },
};

const RELIABILITY_COLOR: Record<string, string> = {
    "High": "#4DE6A1",
    "Medium-High": "#F2D14D",
    "Official": "#4DD2D2",
};

const QUICK_PROMPTS = [
    "Verify a news headline",
    "Check military activity report",
    "Analyze conflict zone news",
    "Detect misinformation",
    "Get trusted sources",
];

function formatMarkdown(text: string): ReactNode[] {
    const lines = text.split("\n");
    const elements: ReactNode[] = [];
    let key = 0;

    for (const line of lines) {
        if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
            // Bold only line
            elements.push(
                <p key={key++} style={{ fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>
                    {line.replace(/\*\*/g, "")}
                </p>
            );
        } else if (line.includes("**")) {
            // Mixed bold
            const parts = line.split(/(\*\*.*?\*\*)/g);
            elements.push(
                <p key={key++} style={{ marginBottom: 4, lineHeight: 1.6 }}>
                    {parts.map((part, i) =>
                        part.startsWith("**") && part.endsWith("**")
                            ? <strong key={i} style={{ color: "#E2E8F0", fontWeight: 600 }}>{part.replace(/\*\*/g, "")}</strong>
                            : <span key={i}>{part}</span>
                    )}
                </p>
            );
        } else if (line.includes("`") && !line.startsWith("-")) {
            const parts = line.split(/(`[^`]+`)/g);
            elements.push(
                <p key={key++} style={{ marginBottom: 4, lineHeight: 1.6 }}>
                    {parts.map((part, i) =>
                        part.startsWith("`") && part.endsWith("`")
                            ? <code key={i} style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4, fontSize: "11px", color: "#F2D14D" }}>{part.replace(/`/g, "")}</code>
                            : <span key={i}>{part}</span>
                    )}
                </p>
            );
        } else if (line.startsWith("- ") || line.startsWith("• ")) {
            elements.push(
                <div key={key++} style={{ display: "flex", gap: 8, marginBottom: 3, paddingLeft: 4 }}>
                    <span style={{ color: "#4DD2D2", flexShrink: 0, marginTop: 2 }}>›</span>
                    <span style={{ lineHeight: 1.5 }}>{line.replace(/^[-•]\s/, "")}</span>
                </div>
            );
        } else if (line === "---") {
            elements.push(<hr key={key++} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "12px 0" }} />);
        } else if (line.trim() === "") {
            elements.push(<div key={key++} style={{ height: 6 }} />);
        } else {
            elements.push(
                <p key={key++} style={{ marginBottom: 4, lineHeight: 1.6 }}>{line}</p>
            );
        }
    }
    return elements;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "🔍 **Intelligence Assessment**\n\nI can help you verify news from your map trackers — including military bases, conflict zones, protest hotspots, and geopolitical events. Share a headline, paste an article link, or describe a specific event and I will:\n\n• Cross-check against trusted sources\n• Assess misinformation risk\n• Provide geopolitical context\n• Surface relevant verified reporting",
            sources: [],
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 350);
        }
    }, [isOpen]);

    const handleSend = useCallback(async (text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg || isLoading) return;
        setInput("");

        const userMsg: Message = {
            id: `u_${Date.now()}`,
            role: "user",
            content: msg,
            timestamp: new Date().toISOString(),
        };

        const typingMsg: Message = {
            id: `typing_${Date.now()}`,
            role: "assistant",
            content: "",
            timestamp: new Date().toISOString(),
            isTyping: true,
        };

        setMessages(prev => [...prev, userMsg, typingMsg]);
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg }),
            });

            const data = await res.json();

            const aiMsg: Message = {
                id: `a_${Date.now()}`,
                role: "assistant",
                content: data.response ?? "Unable to analyze this request. Please try rephrasing.",
                sources: data.sources ?? [],
                misinformation_risk: data.misinformation_risk,
                categories: data.categories,
                timestamp: data.timestamp ?? new Date().toISOString(),
            };

            setMessages(prev => [...prev.filter(m => !m.isTyping), aiMsg]);
        } catch {
            setMessages(prev => [
                ...prev.filter(m => !m.isTyping),
                {
                    id: `err_${Date.now()}`,
                    role: "assistant",
                    content: "⚠️ **Connection Error**\n\nUnable to reach the AI backend. Ensure the `bharat-ai` server is running on port 8000.",
                    timestamp: new Date().toISOString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Backdrop (subtle) */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 9000,
                    pointerEvents: isOpen ? "auto" : "none",
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 420,
                    zIndex: 9100,
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(10, 11, 16, 0.98)",
                    borderLeft: "1px solid rgba(77,210,210,0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isOpen ? "-8px 0 40px rgba(0,0,0,0.6), -1px 0 0 rgba(77,210,210,0.08)" : "none",
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                {/* ── Header ──────────────────────────────────────────────────── */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(77,210,210,0.04)",
                    flexShrink: 0,
                }}>
                    {/* Icon */}
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "linear-gradient(135deg, rgba(77,210,210,0.25), rgba(77,210,210,0.05))",
                        border: "1px solid rgba(77,210,210,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Shield size={16} color="#4DD2D2" />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", letterSpacing: "0.01em" }}>
                            Intel Verifier AI
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4DE6A1", boxShadow: "0 0 6px #4DE6A1" }} />
                            <span style={{ fontSize: 10, color: "#4DE6A1", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>
                                ACTIVE · NEWS ANALYSIS MODE
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            color: "rgba(255,255,255,0.4)", padding: 6, borderRadius: 6,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Capabilities strip ───────────────────────────────────────── */}
                <div style={{
                    padding: "8px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    display: "flex", gap: 6, flexWrap: "wrap",
                    flexShrink: 0,
                }}>
                    {[
                        { icon: Zap, label: "Headlines", color: "#F2D14D" },
                        { icon: Globe, label: "Context", color: "#4DD2D2" },
                        { icon: Shield, label: "Verify", color: "#4DE6A1" },
                    ].map(({ icon: Icon, label, color }) => (
                        <div key={label} style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "3px 8px", borderRadius: 20,
                            background: `${color}12`, border: `1px solid ${color}22`,
                            fontSize: 10, color, fontFamily: "JetBrains Mono, monospace",
                            letterSpacing: "0.05em",
                        }}>
                            <Icon size={9} />
                            {label}
                        </div>
                    ))}
                </div>

                {/* ── Messages ─────────────────────────────────────────────────── */}
                <div style={{
                    flex: 1, overflowY: "auto", padding: "12px 0",
                    display: "flex", flexDirection: "column", gap: 2,
                }}>
                    {messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* ── Quick Prompts ────────────────────────────────────────────── */}
                {messages.length <= 1 && (
                    <div style={{
                        padding: "8px 16px 0",
                        display: "flex", flexDirection: "column", gap: 4,
                        flexShrink: 0,
                    }}>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", marginBottom: 2 }}>
                            QUICK ACTIONS
                        </span>
                        {QUICK_PROMPTS.map(p => (
                            <button
                                key={p}
                                onClick={() => handleSend(p)}
                                style={{
                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: 8, padding: "7px 12px",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    cursor: "pointer", color: "rgba(255,255,255,0.6)",
                                    fontSize: 12, textAlign: "left", transition: "all 0.2s",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(77,210,210,0.07)";
                                    e.currentTarget.style.borderColor = "rgba(77,210,210,0.2)";
                                    e.currentTarget.style.color = "#E2E8F0";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                                }}
                            >
                                <span>{p}</span>
                                <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Input ────────────────────────────────────────────────────── */}
                <div style={{
                    padding: "12px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    flexShrink: 0,
                    background: "rgba(0,0,0,0.3)",
                }}>
                    <div style={{
                        display: "flex", gap: 8, alignItems: "flex-end",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        padding: "8px 8px 8px 12px",
                        transition: "border-color 0.2s",
                    }}
                        onFocus={() => { }}
                    >
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Paste headline, article link, or describe news..."
                            rows={1}
                            disabled={isLoading}
                            style={{
                                flex: 1, background: "transparent", border: "none", outline: "none",
                                color: "#E2E8F0", fontSize: 13, resize: "none",
                                fontFamily: "Inter, system-ui, sans-serif",
                                lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
                            }}
                            onInput={e => {
                                const t = e.currentTarget;
                                t.style.height = "auto";
                                t.style.height = Math.min(t.scrollHeight, 120) + "px";
                            }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            style={{
                                width: 32, height: 32, borderRadius: 7, border: "none",
                                background: input.trim() && !isLoading
                                    ? "linear-gradient(135deg, #4DD2D2, #2ab8b8)"
                                    : "rgba(255,255,255,0.06)",
                                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, transition: "all 0.2s",
                                boxShadow: input.trim() && !isLoading ? "0 0 12px rgba(77,210,210,0.4)" : "none",
                            }}
                        >
                            {isLoading
                                ? <Loader2 size={14} color="#4DD2D2" style={{ animation: "spin 1s linear infinite" }} />
                                : <Send size={14} color={input.trim() ? "#0A0A0A" : "rgba(255,255,255,0.25)"} />
                            }
                        </button>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", fontFamily: "JetBrains Mono, monospace" }}>
                        Enter to send · Shift+Enter for new line
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
      `}</style>
        </>
    );
}

// ── Message Bubble Component ─────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "user";

    if (message.isTyping) {
        return (
            <div style={{ padding: "8px 16px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                    background: "linear-gradient(135deg, rgba(77,210,210,0.3), rgba(77,210,210,0.1))",
                    border: "1px solid rgba(77,210,210,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Bot size={12} color="#4DD2D2" />
                </div>
                <div style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "4px 10px 10px 10px", padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 5,
                }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: "#4DD2D2",
                            animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{
            padding: "6px 16px",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            flexDirection: isUser ? "row-reverse" : "row",
        }}>
            {/* Avatar */}
            <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                background: isUser
                    ? "rgba(242,166,90,0.2)"
                    : "linear-gradient(135deg, rgba(77,210,210,0.3), rgba(77,210,210,0.1))",
                border: `1px solid ${isUser ? "rgba(242,166,90,0.3)" : "rgba(77,210,210,0.25)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {isUser ? <User size={12} color="#F2A65A" /> : <Bot size={12} color="#4DD2D2" />}
            </div>

            <div style={{ flex: 1, minWidth: 0, maxWidth: "90%" }}>
                {/* Bubble */}
                <div style={{
                    background: isUser ? "rgba(242,166,90,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isUser ? "rgba(242,166,90,0.15)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: isUser ? "10px 4px 10px 10px" : "4px 10px 10px 10px",
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "rgba(226,232,240,0.9)",
                    lineHeight: 1.55,
                }}>
                    {isUser ? (
                        <p style={{ margin: 0 }}>{message.content}</p>
                    ) : (
                        <div>{formatMarkdown(message.content)}</div>
                    )}
                </div>

                {/* Misinformation Risk Badge */}
                {!isUser && message.misinformation_risk && message.misinformation_risk !== "LOW" && (
                    <MisinformationBadge risk={message.misinformation_risk} />
                )}

                {/* Sources */}
                {!isUser && message.sources && message.sources.length > 0 && (
                    <SourcesList sources={message.sources} />
                )}

                {/* Timestamp */}
                <div style={{
                    marginTop: 4, fontSize: 10,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "JetBrains Mono, monospace",
                    textAlign: isUser ? "right" : "left",
                }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
            </div>
        </div>
    );
}

function MisinformationBadge({ risk }: { risk: "LOW" | "MEDIUM" | "HIGH" }) {
    const cfg = RISK_CONFIG[risk];
    const Icon = cfg.icon;
    return (
        <div style={{
            marginTop: 6, display: "flex", alignItems: "center", gap: 6,
            padding: "5px 10px", borderRadius: 20,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            width: "fit-content",
        }}>
            <Icon size={11} color={cfg.color} />
            <span style={{ fontSize: 10, color: cfg.color, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>
                MISINFO RISK: {cfg.label.toUpperCase()}
            </span>
        </div>
    );
}

function SourcesList({ sources }: { sources: Source[] }) {
    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", marginBottom: 5 }}>
                VERIFICATION SOURCES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {sources.map(src => (
                    <a
                        key={src.name}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "5px 10px", borderRadius: 6,
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            textDecoration: "none",
                            transition: "all 0.15s",
                            gap: 8,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(77,210,210,0.07)";
                            e.currentTarget.style.borderColor = "rgba(77,210,210,0.2)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                            <div style={{
                                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                                background: RELIABILITY_COLOR[src.reliability] ?? "#999",
                                boxShadow: `0 0 5px ${RELIABILITY_COLOR[src.reliability] ?? "#999"}88`,
                            }} />
                            <span style={{ fontSize: 12, color: "#E2E8F0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {src.name}
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                            <span style={{ fontSize: 9, color: RELIABILITY_COLOR[src.reliability] ?? "#999", fontFamily: "JetBrains Mono, monospace" }}>
                                {src.reliability}
                            </span>
                            <ExternalLink size={10} color="rgba(255,255,255,0.25)" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
