'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm EduFlow AI. How can I help you today?", isBot: true },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: message, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Mock AI response delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          text: "I'm a demo AI assistant! I've recorded your message, but I don't have back-end processing connected yet.", 
          isBot: true 
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...s.fabButton,
          transform: isOpen ? 'scale(0) opacity(0)' : 'scale(1) opacity(1)',
          pointerEvents: isOpen ? 'none' : 'auto'
        }}
        aria-label="Open AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <path d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={s.chatWindow}>
          {/* Header */}
          <div style={s.header}>
            <div style={s.headerLeft}>
              <div style={s.aiIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2zm0 4v16M8 10h8M6 14h12M4 18h16" />
                </svg>
              </div>
              <div>
                <div style={s.headerTitle}>EduFlow AI</div>
                <div style={s.headerStatus}>Online</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={s.closeButton} aria-label="Close Chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div style={s.messagesArea}>
            {messages.map(msg => (
              <div key={msg.id} style={{ ...s.messageWrapper, justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                <div style={{ ...s.messageBubble, ...(msg.isBot ? s.messageBot : s.messageUser) }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ position: 'relative' }}>
            {/* Attachment Popover */}
            {showAttachMenu && (
              <div style={s.attachMenu}>
                <button type="button" style={s.attachItem} onClick={() => setShowAttachMenu(false)}>
                  <div style={{...s.attachIconBg, background: '#E0E7FF', color: '#4F46E5'}}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  </div>
                  <span>Image</span>
                </button>
                <button type="button" style={s.attachItem} onClick={() => setShowAttachMenu(false)}>
                  <div style={{...s.attachIconBg, background: '#FCE7F3', color: '#DB2777'}}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                  </div>
                  <span>Video</span>
                </button>
                <button type="button" style={s.attachItem} onClick={() => setShowAttachMenu(false)}>
                  <div style={{...s.attachIconBg, background: '#FEE2E2', color: '#DC2626'}}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><text x="9" y="16" fontSize="5" fontWeight="bold" strokeWidth="1">PDF</text></svg>
                  </div>
                  <span>PDF</span>
                </button>
                <button type="button" style={s.attachItem} onClick={() => setShowAttachMenu(false)}>
                  <div style={{...s.attachIconBg, background: '#DCFCE7', color: '#16A34A'}}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <span>Document</span>
                </button>
              </div>
            )}
            <form onSubmit={handleSend} style={s.inputArea}>
              <button 
                type="button" 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                style={s.attachButton}
                aria-label="Attach File"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAttachMenu ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..." 
                style={s.input}
                onFocus={() => setShowAttachMenu(false)}
              />
            <button type="submit" style={s.sendButton} disabled={!message.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  fabButton: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
    border: 'none',
    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 9999,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '360px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9999,
    fontFamily: "'Inter', sans-serif",
    border: '1px solid #E5E7EB',
    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  header: {
    background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  aiIcon: {
    width: '36px',
    height: '36px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '15px',
    lineHeight: '1.2',
  },
  headerStatus: {
    fontSize: '12px',
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    opacity: 0.8,
    transition: 'opacity 0.2s',
  },
  messagesArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: '#F9FAFB',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '1.5',
    position: 'relative',
  },
  messageBot: {
    background: 'white',
    color: '#111827',
    borderRadius: '16px 16px 16px 4px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  messageUser: {
    background: '#2563EB',
    color: 'white',
    borderRadius: '16px 16px 4px 16px',
    boxShadow: '0 2px 8px rgba(37,99,235,0.2)',
  },
  inputArea: {
    padding: '16px',
    background: 'white',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  attachButton: {
    background: 'transparent',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  attachMenu: {
    position: 'absolute',
    bottom: '100%',
    left: '16px',
    marginBottom: '8px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    padding: '12px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    border: '1px solid #E5E7EB',
    zIndex: 10,
    animation: 'slideUp 0.2s ease-out',
  },
  attachItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    color: '#374151',
    fontFamily: 'inherit',
  },
  attachIconBg: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  input: {
    flex: 1,
    background: '#F3F4F6',
    border: '1px solid transparent',
    borderRadius: '100px',
    padding: '0 16px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  sendButton: {
    width: '42px',
    height: '42px',
    borderRadius: '21px',
    background: '#7C3AED',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
  }
};
