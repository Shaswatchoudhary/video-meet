import React, { useState, useRef, useEffect } from 'react';
import {
  X, MessageSquare, Users, Search,
  Mic, MicOff, VideoOff, ShieldCheck,
  Send, MoreVertical, UserMinus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk';

/* ───────────────────────────
   Participant Row
─────────────────────────── */
const ParticipantRow = ({ p, call, isCurrentUserHost }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const tracks = p.publishedTracks ?? [];
  const hasAudio = tracks.some(t => t === 1 || String(t).toLowerCase().includes('audio'));
  const hasVideo = tracks.some(t => t === 2 || String(t).toLowerCase().includes('video'));

  const initials = (p.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarHue = (p.name?.charCodeAt(0) || 72) * 5 % 360;
  const isCreator = p.userId === call?.state?.createdBy?.id;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px', cursor: 'default',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `hsl(${avatarHue},50%,40%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.82rem', fontWeight: 700, color: '#fff',
          border: p.isSpeaking ? '2.5px solid #34a853' : '2px solid rgba(255,255,255,0.08)',
          boxShadow: p.isSpeaking ? '0 0 10px rgba(52,168,83,0.4)' : 'none',
          transition: 'all 0.2s',
        }}>
          {initials}
        </div>
        {/* Muted mic badge on avatar */}
        {!hasAudio && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 17, height: 17, borderRadius: '50%',
            background: '#ea4335', border: '2px solid #2d2f31',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MicOff size={9} color="#fff" />
          </div>
        )}
      </div>

      {/* Name + tags */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.88rem', fontWeight: 500, color: '#e8eaed',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 120,
          }}>
            {p.name || 'Unknown'}
          </span>
          {p.isLocalParticipant && (
            <span style={{ fontSize: '0.62rem', color: '#8ab4f8', background: 'rgba(138,180,248,0.12)', padding: '1px 6px', borderRadius: 4 }}>
              You
            </span>
          )}
          {isCreator && (
            <span style={{ fontSize: '0.62rem', color: '#f9ab00', background: 'rgba(249,171,0,0.1)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
              HOST
            </span>
          )}
        </div>
        {p.isSpeaking && (
          <span style={{ fontSize: '0.68rem', color: '#34a853' }}>Speaking</span>
        )}
      </div>

      {/* Status icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!hasVideo && <VideoOff size={14} color="#5f6368" />}
        {hasAudio
          ? <Mic    size={14} color="#34a853" />
          : <MicOff size={14} color="#ea4335" />
        }

        {/* Host actions — only for non-self */}
        {isCurrentUserHost && !p.isLocalParticipant && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: menuOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9aa0a6', transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
            >
              <MoreVertical size={14} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'rgba(28, 22, 18, 0.96)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(212, 144, 26, 0.25)',
                    borderRadius: 14, padding: 6, minWidth: 190,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.65)', zIndex: 300,
                  }}
                >
                  {[
                    {
                      icon: <ShieldCheck size={14} color="#D4901A" />,
                      label: p.isPinned ? 'Unpin participant' : 'Pin for me',
                      color: '#F0E8D8',
                      hoverBg: 'rgba(212, 144, 26, 0.12)',
                      action: () => { 
                        if (p.isPinned) call?.unpin?.(p.userId);
                        else call?.pin?.(p.userId);
                        setMenuOpen(false); 
                      },
                    },
                    {
                      icon: <Users size={14} color="#D4901A" />,
                      label: 'Pin for everyone',
                      color: '#F0E8D8',
                      hoverBg: 'rgba(212, 144, 26, 0.12)',
                      action: () => { 
                        call?.sendCustomEvent?.({ type: 'global-pin', custom: { userId: p.userId } });
                        setMenuOpen(false); 
                      },
                    },
                    {
                      icon: <MicOff size={14} color="#9aa0a6" />,
                      label: 'Mute audio',
                      color: '#e8eaed',
                      hoverBg: 'rgba(255,255,255,0.08)',
                      action: () => { call?.muteUser?.(p.userId, 'audio'); setMenuOpen(false); },
                    },
                    {
                      icon: <VideoOff size={14} color="#9aa0a6" />,
                      label: 'Mute video',
                      color: '#e8eaed',
                      hoverBg: 'rgba(255,255,255,0.08)',
                      action: () => { call?.muteUser?.(p.userId, 'video'); setMenuOpen(false); },
                    },
                    {
                      icon: <Search size={14} color="#9aa0a6" />,
                      label: 'Allow screen share',
                      color: '#e8eaed',
                      hoverBg: 'rgba(255,255,255,0.08)',
                      action: () => { /* Permissions toggling if supported */ setMenuOpen(false); },
                    },
                    {
                      icon: <UserMinus size={14} color="#ea4335" />,
                      label: 'Remove from call',
                      color: '#ea4335',
                      hoverBg: 'rgba(234,67,53,0.15)',
                      action: async () => {
                        try { await call?.removeMembers?.([p.userId]); }
                        catch { call?.blockUser?.(p.userId); }
                        setMenuOpen(false);
                      },
                    },
                    {
                      icon: <X size={14} color="#ea4335" />,
                      label: 'Block from meeting',
                      color: '#ea4335',
                      hoverBg: 'rgba(234,67,53,0.15)',
                      action: () => { call?.blockUser?.(p.userId); setMenuOpen(false); },
                    },
                  ].map(item => (
                    <button key={item.label}
                      onClick={item.action}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: item.color, fontSize: '0.85rem', fontWeight: 500,
                        textAlign: 'left', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = item.hoverBg;
                        e.currentTarget.style.paddingLeft = '14px';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.paddingLeft = '12px';
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24 }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────────────────────────
   Chat Bubble
─────────────────────────── */
const ChatBubble = ({ msg }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: msg.isOwn ? 'flex-end' : 'flex-start', gap: 3,
  }}>
    {!msg.isOwn && (
      <span style={{ fontSize: '0.73rem', fontWeight: 600, color: '#8ab4f8', paddingLeft: 4 }}>
        {msg.sender}
      </span>
    )}
    <div style={{
      maxWidth: '82%', padding: '9px 13px',
      background: msg.isOwn ? '#1a73e8' : '#3c4043',
      borderRadius: msg.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      fontSize: '0.87rem', color: '#e8eaed', lineHeight: 1.5,
      wordBreak: 'break-word',
    }}>
      {msg.text}
    </div>
    <span style={{ fontSize: '0.63rem', color: '#5f6368', paddingInline: 4 }}>
      {msg.time}
    </span>
  </div>
);

/* ───────────────────────────
   Main Panel
─────────────────────────── */
const MeetingSidePanel = ({ isOpen, onClose, defaultTab = 'participants' }) => {
  const [activeTab, setActiveTab]     = useState(defaultTab);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages]       = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef(null);

  const call = useCall();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const allParticipants  = useParticipants();
  const localParticipant = useLocalParticipant();

  // Deduplicate by userId — prevents showing self twice
  const seen = new Set();
  const participants = allParticipants.filter(p => {
    if (seen.has(p.userId)) return false;
    seen.add(p.userId);
    return true;
  });

  const isCurrentUserHost = localParticipant?.userId === call?.state?.createdBy?.id;

  useEffect(() => { setActiveTab(defaultTab); }, [defaultTab]);

  const filtered = participants.filter(p =>
    !searchQuery.trim() || p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Real-time chat
  useEffect(() => {
    if (!call) return;
    const unsub = call.on('custom', event => {
      if (event.type === 'chat-message') {
        setMessages(prev => [...prev, {
          id: `${Date.now()}-${Math.random()}`,
          text: event.custom.text,
          sender: event.custom.sender,
          isOwn: event.user?.id === call.currentUserId,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    });
    return () => unsub?.();
  }, [call]);

  const sendMessage = () => {
    const text = chatMessage.trim();
    if (!text) return;
    call?.sendCustomEvent?.({
      type: 'chat-message',
      custom: { text, sender: localParticipant?.name || 'Me' },
    }).catch(() => {});
    setChatMessage('');
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* ── Tab button ── */
  const TabBtn = ({ id, label, Icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '13px 0', border: 'none', cursor: 'pointer',
        background: 'transparent',
        color: activeTab === id ? '#8ab4f8' : '#9aa0a6',
        borderBottom: `2px solid ${activeTab === id ? '#8ab4f8' : 'transparent'}`,
        fontSize: '0.88rem', fontWeight: 500,
        transition: 'all 0.15s',
        fontFamily: 'Google Sans, Roboto, sans-serif',
      }}
    >
      <Icon size={15} />
      {label}
      {count !== undefined && (
        <span style={{
          background: activeTab === id ? 'rgba(138,180,248,0.14)' : 'rgba(255,255,255,0.07)',
          color: activeTab === id ? '#8ab4f8' : '#9aa0a6',
          fontSize: '0.68rem', padding: '1px 7px', borderRadius: 100, fontWeight: 600,
        }}>{count}</span>
      )}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 33, stiffness: 310 }}
          style={{
            position: 'fixed', right: 0, top: 0, bottom: 0,
            width: 360, background: '#2d2f31',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column',
            zIndex: 40,
            fontFamily: 'Google Sans, Roboto, sans-serif',
          }}
        >
          {/* ── Header: tabs + CLOSE ── */}
          <div style={{
            display: 'flex', alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            flexShrink: 0, minHeight: 56,
            paddingRight: 12,
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ flex: 1, display: 'flex' }}>
              <TabBtn id="participants" label="People" Icon={Users} count={participants.length} />
              <TabBtn id="chat" label="Chat" Icon={MessageSquare} />
            </div>

            {/* ── CLOSE BUTTON — Prominent ── */}
            <button
              onClick={onClose}
              title="Close panel"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#e8eaed', transition: 'all 0.2s',
                marginLeft: 12,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(234,67,53,0.15)';
                e.currentTarget.style.color = '#ea4335';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#e8eaed';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* ── Participants Tab ── */}
          {activeTab === 'participants' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Search */}
              <div style={{ padding: '12px 16px 6px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 24, padding: '8px 14px',
                }}>
                  <Search size={14} color="#5f6368" />
                  <input
                    type="text"
                    placeholder="Search people"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1, background: 'none', border: 'none', outline: 'none',
                      fontSize: '0.84rem', color: '#e8eaed',
                      fontFamily: 'Google Sans, Roboto, sans-serif',
                    }}
                  />
                </div>
              </div>

              <div style={{ padding: '2px 16px 8px' }}>
                <span style={{ fontSize: '0.76rem', color: '#5f6368' }}>
                  In this call · {participants.length}
                </span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filtered.map(p => (
                  <ParticipantRow
                    key={p.sessionId || p.userId}
                    p={p}
                    call={call}
                    isCurrentUserHost={isCurrentUserHost}
                  />
                ))}
              </div>

              <div style={{
                padding: '10px 16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
              }}>
                <ShieldCheck size={12} color="#34a853" />
                <span style={{ fontSize: '0.7rem', color: '#5f6368' }}>End-to-end encrypted</span>
              </div>
            </div>
          )}

          {/* ── Chat Tab ── */}
          {activeTab === 'chat' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }}>
                {messages.length === 0 ? (
                  <div style={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 14,
                    padding: '60px 24px',
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <MessageSquare size={24} color="#5f6368" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.92rem', fontWeight: 500, color: '#e8eaed' }}>No messages yet</p>
                      <p style={{ fontSize: '0.78rem', color: '#9aa0a6', marginTop: 6, lineHeight: 1.55 }}>
                        Messages are visible to everyone in the call
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {messages.map(m => <ChatBubble key={m.id} msg={m} />)}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{
                padding: '10px 16px 16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                flexShrink: 0,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 24, padding: '8px 8px 8px 16px',
                }}>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Send a message to everyone"
                    style={{
                      flex: 1, background: 'none', border: 'none', outline: 'none',
                      fontSize: '0.84rem', color: '#e8eaed',
                      fontFamily: 'Google Sans, Roboto, sans-serif',
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!chatMessage.trim()}
                    style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: chatMessage.trim() ? '#1a73e8' : 'rgba(255,255,255,0.06)',
                      border: 'none', cursor: chatMessage.trim() ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s', flexShrink: 0,
                    }}
                  >
                    <Send size={14} color={chatMessage.trim() ? '#fff' : '#5f6368'} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeetingSidePanel;