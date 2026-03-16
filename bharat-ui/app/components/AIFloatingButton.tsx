"use client";
import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";

interface AIFloatingButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export default function AIFloatingButton({ isOpen, onClick }: AIFloatingButtonProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                position: "absolute",
                bottom: 56, // above the bottom legend strip
                right: 300, // horizontally to the left of the india intel tab
                zIndex: 2000,
                display: "flex",
                alignItems: "center",
                gap: 10,
                pointerEvents: "auto",
            }}
        >
            {/* Tooltip label */}
            {hovered && !isOpen && (
                <div
                    style={{
                        background: "rgba(10,11,16,0.95)",
                        border: "1px solid rgba(77,210,210,0.2)",
                        borderRadius: 8,
                        padding: "5px 10px",
                        fontSize: 11,
                        color: "#4DD2D2",
                        fontFamily: "JetBrains Mono, monospace",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        animation: "fadeInLeft 0.15s ease",
                    }}
                >
                    Intel Verifier AI
                </div>
            )}

            {/* Circular Button */}
            <button
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    border: isOpen
                        ? "1.5px solid rgba(77,210,210,0.6)"
                        : "1.5px solid rgba(77,210,210,0.25)",
                    background: isOpen
                        ? "linear-gradient(135deg, rgba(77,210,210,0.25), rgba(77,210,210,0.1))"
                        : hovered
                            ? "linear-gradient(135deg, rgba(77,210,210,0.2), rgba(10,11,16,0.9))"
                            : "rgba(10,11,16,0.85)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isOpen
                        ? "0 0 20px rgba(77,210,210,0.35), 0 4px 20px rgba(0,0,0,0.5)"
                        : hovered
                            ? "0 0 14px rgba(77,210,210,0.2), 0 4px 16px rgba(0,0,0,0.4)"
                            : "0 0 8px rgba(77,210,210,0.1), 0 4px 12px rgba(0,0,0,0.4)",
                    transform: hovered && !isOpen ? "scale(1.08)" : "scale(1)",
                }}
                aria-label="Toggle AI Assistant"
            >
                {/* Pulse rings (only when closed) */}
                {!isOpen && (
                    <>
                        <span style={{
                            position: "absolute", inset: -6,
                            borderRadius: "50%",
                            border: "1px solid rgba(77,210,210,0.2)",
                            animation: "ai-pulse-outer 2.5s ease-out infinite",
                            pointerEvents: "none",
                        }} />
                        <span style={{
                            position: "absolute", inset: -2,
                            borderRadius: "50%",
                            border: "1px solid rgba(77,210,210,0.15)",
                            animation: "ai-pulse-inner 2.5s ease-out 0.6s infinite",
                            pointerEvents: "none",
                        }} />
                    </>
                )}

                {/* Icon */}
                <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isOpen ? "rotate(15deg) scale(0.9)" : "rotate(0deg) scale(1)",
                }}>
                    <Bot size={20} color="#4DD2D2" strokeWidth={1.8} />
                    {!isOpen && (
                        <Sparkles
                            size={9}
                            color="#F2D14D"
                            style={{
                                position: "absolute",
                                top: -4, right: -5,
                                animation: "sparkle-blink 2s ease-in-out infinite",
                            }}
                        />
                    )}
                </div>
            </button>

            <style>{`
        @keyframes ai-pulse-outer {
          0%   { transform: scale(1); opacity: 0.5; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes ai-pulse-inner {
          0%   { transform: scale(1); opacity: 0.3; }
          70%  { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes sparkle-blink {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50%       { opacity: 0.4; transform: scale(0.8) rotate(20deg); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
