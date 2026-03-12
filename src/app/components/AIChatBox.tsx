'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function AIChatBox() {
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;

    // Typically this would append to a message list.
    // In this redesign, we're just building the input UI itself.
    setMessage('');
    setShowAttachMenu(false);
  };

  return (
    <div style={s.container}>
      <div style={s.chatBarWrapper}>
        
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

        <form onSubmit={handleSend} style={s.searchBar}>
          <button 
            type="button" 
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            style={s.attachButton}
            aria-label="Attach File"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAttachMenu ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message EduFlow AI..." 
            style={s.input}
            onFocus={() => setShowAttachMenu(false)}
          />
          
          <button type="submit" style={{...s.sendButton, background: message.trim() ? '#2563EB' : '#E5E7EB', color: message.trim() ? 'white' : '#9CA3AF'}} disabled={!message.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div style={s.footerText}>
          EduFlow AI can make mistakes. Verify important academic information.
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '0',
    left: 'calc(50% + 140px)', /* Account for 280px sidebar */
    transform: 'translateX(-50%)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 24px 16px 24px',
    background: 'transparent',
    zIndex: 9999,
    fontFamily: "'Inter', sans-serif",
    pointerEvents: 'none', 
  },
  chatBarWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '768px', // Equivalent to max-w-3xl
    pointerEvents: 'auto', // Re-enable clicks for the actual input area
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '100px', // pill shaped
    padding: '8px 8px 8px 16px',
    gap: '12px',
    transition: 'border-color 0.2s',
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
    outline: 'none',
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    padding: '8px 0',
  },
  sendButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
    outline: 'none',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#9CA3AF',
    marginTop: '12px',
  },
  attachMenu: {
    position: 'absolute',
    bottom: 'calc(100% + 12px)',
    left: '0',
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
  }
};
