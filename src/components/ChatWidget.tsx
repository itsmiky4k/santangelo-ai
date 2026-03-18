"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Benvenuto alla Grotta di Sant'Angelo in Criptis! Sono Angelo, il tuo assistente virtuale. Posso aiutarti con informazioni sulla grotta, gli orari, i biglietti e come raggiungerci. Come posso aiutarti? / Welcome! I can also assist you in English, Français, Deutsch or Español.",
};

const SUGGESTIONS = [
  "Quali sono gli orari di apertura?",
  "Quanto costa il biglietto?",
  "Come si arriva alla grotta?",
  "Si può entrare nella grotta?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setShowSuggestions(false);
    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Mi dispiace, si è verificato un errore. Riprova o contattaci via WhatsApp al +39 375 8344382.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

        .sa-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Jost', sans-serif; }

        .sa-toggle {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: #2C1810;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(44,24,16,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 9999;
        }
        .sa-toggle:hover { transform: scale(1.06); box-shadow: 0 6px 30px rgba(44,24,16,0.45); }
        .sa-toggle svg { transition: opacity 0.2s; }

        .sa-panel {
          position: fixed;
          bottom: 104px;
          right: 28px;
          width: 380px;
          max-height: 580px;
          background: #FDFAF5;
          border-radius: 16px;
          box-shadow: 0 8px 48px rgba(44,24,16,0.18), 0 0 0 1px rgba(44,24,16,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9998;
          transform-origin: bottom right;
          animation: sa-open 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes sa-open {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }

        .sa-header {
          background: #2C1810;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .sa-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sa-header-text { flex: 1; }
        .sa-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 600;
          color: #F5ECD7;
          letter-spacing: 0.3px;
        }
        .sa-status {
          font-size: 11px;
          color: rgba(245,236,215,0.6);
          font-weight: 300;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sa-close {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(245,236,215,0.7);
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .sa-close:hover { color: #F5ECD7; }

        .sa-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(44,24,16,0.15) transparent;
        }

        .sa-bubble {
          max-width: 86%;
          padding: 11px 15px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.55;
          font-weight: 400;
          white-space: pre-wrap;
        }
        .sa-bubble-assistant {
          background: #fff;
          color: #2C1810;
          align-self: flex-start;
          border: 1px solid rgba(44,24,16,0.08);
          border-bottom-left-radius: 4px;
        }
        .sa-bubble-user {
          background: #2C1810;
          color: #F5ECD7;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .sa-typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 13px 16px;
          background: #fff;
          border: 1px solid rgba(44,24,16,0.08);
          border-radius: 14px;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
        }
        .sa-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8B6A50;
          animation: sa-bounce 1.2s ease-in-out infinite;
        }
        .sa-dot:nth-child(2) { animation-delay: 0.2s; }
        .sa-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes sa-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        .sa-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 16px 12px;
        }
        .sa-suggestion {
          background: none;
          border: 1px solid rgba(44,24,16,0.2);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 12px;
          color: #6B4A35;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .sa-suggestion:hover { background: #2C1810; color: #F5ECD7; border-color: #2C1810; }

        .sa-input-area {
          border-top: 1px solid rgba(44,24,16,0.08);
          padding: 12px 14px;
          display: flex;
          gap: 8px;
          align-items: center;
          background: #FDFAF5;
          flex-shrink: 0;
        }
        .sa-input {
          flex: 1;
          border: 1px solid rgba(44,24,16,0.15);
          border-radius: 22px;
          padding: 9px 16px;
          font-size: 13.5px;
          font-family: 'Jost', sans-serif;
          background: #fff;
          color: #2C1810;
          outline: none;
          transition: border-color 0.15s;
        }
        .sa-input:focus { border-color: rgba(44,24,16,0.4); }
        .sa-input::placeholder { color: rgba(44,24,16,0.35); }
        .sa-send {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #2C1810;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.15s, transform 0.15s;
        }
        .sa-send:hover:not(:disabled) { transform: scale(1.08); }
        .sa-send:disabled { opacity: 0.4; cursor: not-allowed; }

        .sa-footer {
          text-align: center;
          font-size: 10.5px;
          color: rgba(44,24,16,0.3);
          padding: 0 14px 10px;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        @media (max-width: 440px) {
          .sa-panel { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
          .sa-toggle { bottom: 16px; right: 16px; }
        }
      `}</style>

      <div className="sa-widget">
        {/* Toggle button */}
        <button className="sa-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Apri assistente virtuale">
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5ECD7" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5ECD7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>

        {/* Chat panel */}
        {isOpen && (
          <div className="sa-panel">
            {/* Header */}
            <div className="sa-header">
              <div className="sa-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5ECD7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div className="sa-header-text">
                <div className="sa-name">Angelo</div>
                <div className="sa-status">Assistente Virtuale · Online</div>
              </div>
              <button className="sa-close" onClick={() => setIsOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="sa-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`sa-bubble ${msg.role === "assistant" ? "sa-bubble-assistant" : "sa-bubble-user"}`}>
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="sa-typing">
                  <div className="sa-dot" />
                  <div className="sa-dot" />
                  <div className="sa-dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="sa-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="sa-suggestion" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="sa-input-area">
              <input
                ref={inputRef}
                className="sa-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Scrivi un messaggio…"
                disabled={isLoading}
              />
              <button className="sa-send" onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5ECD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            <div className="sa-footer">Grotta di Sant'Angelo in Criptis · Santeramo in Colle</div>
          </div>
        )}
      </div>
    </>
  );
}
