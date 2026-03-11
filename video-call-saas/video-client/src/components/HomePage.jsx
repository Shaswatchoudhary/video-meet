import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Clock, ArrowUpRight, Hash, Video, Shield, Zap, Globe, Sun, Moon, CalendarClock, Zap as ZapIcon } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';

/* ════════════════════════════════════════════
   HONEYCOMB PATTERN
════════════════════════════════════════════ */
const HoneycombBg = ({ dark }) => {
  const R = 22;
  const gap = 4;
  const W = R * 2 + gap;
  const H = Math.sqrt(3) * R + gap;
  const cols = 10;
  const rows = 22;
  const hexes = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * W * 1.5 + (row % 2 === 0 ? 0 : W * 0.75);
      const cy = row * H * 0.87;
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = (Math.PI / 3) * k - Math.PI / 6;
        return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
      }).join(' ');
      const xFade = Math.max(0.06, 0.55 - (cx / 420) * 0.5);
      hexes.push(
        <polygon key={`${row}-${col}`} points={pts} fill="none"
          stroke={dark ? '#3a3020' : '#B8924A'} strokeWidth="1" opacity={xFade} />
      );
    }
  }
  return (
    <svg style={{ position: 'fixed', left: 0, top: 0, width: 480, height: '100vh', pointerEvents: 'none', zIndex: 0 }}
      viewBox="0 0 480 900" preserveAspectRatio="xMinYMid slice">
      {hexes}
    </svg>
  );
};

/* ════════════════════════════════════════════
   ANIMATED BORDER LINE BADGE
   A glowing line sweeps around the pill border
════════════════════════════════════════════ */
const AnimatedBorderBadge = ({ dark }) => (
  <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 28 }}>
    <style>{`
      @keyframes sweep {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .anim-badge-wrap {
        padding: 1.5px;
        border-radius: 100px;
        background: linear-gradient(90deg,
          transparent 0%,
          transparent 25%,
          #B8741A 45%,
          #E8A030 50%,
          #B8741A 55%,
          transparent 75%,
          transparent 100%
        );
        background-size: 250% 100%;
        animation: sweep 2s linear infinite;
        display: inline-flex;
      }
      .anim-badge-wrap-dark {
        background: linear-gradient(90deg,
          transparent 0%,
          transparent 25%,
          #C8901A 45%,
          #FFB830 50%,
          #C8901A 55%,
          transparent 75%,
          transparent 100%
        );
        background-size: 250% 100%;
        animation: sweep 2s linear infinite;
      }
    `}</style>
    <div className={`anim-badge-wrap ${dark ? 'anim-badge-wrap-dark' : ''}`}>
      <div style={{
        borderRadius: 100, padding: '7px 18px',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: dark ? 'rgba(18,13,8,0.95)' : 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(10px)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '0.8rem', fontWeight: 500,
        color: dark ? '#b8a080' : '#6B4E1A',
        whiteSpace: 'nowrap',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e', flexShrink: 0 }} />
        Trusted for HD video calls worldwide
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════
   NEW MEETING DROPDOWN
════════════════════════════════════════════ */
const NewMeetingDropdown = ({ dark, isCreating, onInstant, onScheduled, btnBlack, btnBlackText }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => !isCreating && setOpen(o => !o)}
        disabled={isCreating}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: btnBlack, color: btnBlackText,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700, fontSize: '0.92rem',
          padding: '13px 22px', borderRadius: 100,
          border: 'none', cursor: isCreating ? 'not-allowed' : 'pointer',
          transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: dark ? '0 4px 20px rgba(240,232,216,0.1)' : '0 4px 20px rgba(15,10,4,0.22)',
          whiteSpace: 'nowrap', opacity: isCreating ? 0.55 : 1,
        }}
        onMouseEnter={e => { if (!isCreating) e.currentTarget.style.opacity = '0.88'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        {isCreating
          ? <span style={{ width: 14, height: 14, border: `2px solid rgba(128,128,128,0.3)`, borderTopColor: btnBlackText, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          : <Plus size={16} strokeWidth={2.5} />}
        {isCreating ? 'Starting…' : 'New Meeting'}
        <span style={{
          fontSize: '0.65rem', opacity: 0.55,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s', display: 'inline-block',
        }}>▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', left: 0, zIndex: 200,
              minWidth: 268,
              background: dark ? 'rgba(18,13,8,0.97)' : 'rgba(253,249,241,0.97)',
              border: `1px solid ${dark ? 'rgba(255,200,100,0.14)' : 'rgba(180,130,70,0.25)'}`,
              borderRadius: 18, backdropFilter: 'blur(24px)',
              boxShadow: dark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 20px 50px rgba(100,60,10,0.14)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: 6 }}>
              {[
                {
                  emoji: '',
                  label: 'Instant Meeting',
                  desc: 'Start right now — share link to invite',
                  action: () => { setOpen(false); onInstant(); },
                  accent: dark ? '#D4901A' : '#B8741A',
                },
                {
                  emoji: '',
                  label: 'Scheduled Meeting',
                  desc: 'Choose date & time, plan ahead',
                  action: () => { setOpen(false); onScheduled(); },
                  accent: dark ? '#5a9aD4' : '#2a72B8',
                },
              ].map((opt) => (
                <DropItem key={opt.label} opt={opt} dark={dark} />
              ))}
            </div>

            {/* Footer hint */}
            <div style={{
              padding: '8px 16px 10px',
              borderTop: `1px solid ${dark ? 'rgba(255,200,100,0.08)' : 'rgba(180,130,70,0.12)'}`,
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.56rem', letterSpacing: '0.1em',
              color: dark ? '#3a2a18' : '#C0A060',
              textAlign: 'center',
            }}>
              ALL MEETINGS ARE END-TO-END ENCRYPTED
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DropItem = ({ opt, dark }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={opt.action}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 13,
        padding: '11px 12px', borderRadius: 12,
        background: hov ? (dark ? 'rgba(255,200,100,0.07)' : 'rgba(180,130,70,0.08)') : 'transparent',
        border: 'none', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.15rem',
      }}>
        {opt.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.88rem', fontWeight: 700,
          color: dark ? '#f0e8d8' : '#0F0A04',
        }}>{opt.label}</div>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.7rem', color: dark ? '#6a5a40' : '#9a7a40', marginTop: 1,
        }}>{opt.desc}</div>
      </div>
      <ArrowUpRight size={14} color={opt.accent} style={{ opacity: hov ? 1 : 0.3, transition: 'opacity 0.15s', flexShrink: 0 }} />
    </button>
  );
};

/* ════════════════════════════════════════════
   SCHEDULE MODAL (shown when Scheduled chosen)
════════════════════════════════════════════ */
const ScheduleModal = ({ dark, onClose, onCreate, textPrimary, textMuted, cardBg, cardBorder, btnBlack, btnBlackText }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const inputStyle = {
    width: '100%', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
    border: `1.5px solid ${dark ? 'rgba(255,200,100,0.15)' : 'rgba(180,130,70,0.28)'}`,
    borderRadius: 10, padding: '10px 13px',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem',
    color: textPrimary, outline: 'none',
  };
  const labelStyle = {
    display: 'block', fontFamily: "'Space Mono', monospace",
    fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase',
    color: textMuted, marginBottom: 6,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 22, padding: '28px 28px 22px',
          width: '100%', maxWidth: 400,
          backdropFilter: 'blur(24px)',
          boxShadow: dark ? '0 30px 60px rgba(0,0,0,0.6)' : '0 30px 60px rgba(100,60,10,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: textPrimary, marginBottom: 4 }}>
            📅 Schedule a Meeting
          </div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem', color: textMuted }}>
            Fill in details and share the meeting link later.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Meeting Title</label>
            <input placeholder="e.g. Team Standup" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 12,
              background: 'transparent',
              border: `1.5px solid ${dark ? 'rgba(255,200,100,0.18)' : 'rgba(180,130,70,0.3)'}`,
              color: textMuted, cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '0.85rem',
            }}
          >Cancel</button>
          <button
            onClick={() => { if (title || date) { onCreate({ title: title || 'Scheduled Meeting', date, time }); onClose(); } }}
            style={{
              flex: 2, padding: '11px 0', borderRadius: 12,
              background: btnBlack, color: btnBlackText,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem',
            }}
          >Create Meeting</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════
   LIVE CLOCK
════════════════════════════════════════════ */
const LiveClock = () => {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
};

/* ════════════════════════════════════════════
   RECENT MEETING ROW — NO REJOIN, just info
════════════════════════════════════════════ */
const MtgRow = ({ mtg, idx, dark }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '9px 12px', borderRadius: 12,
        transition: 'all 0.18s',
        background: hov
          ? (dark ? 'rgba(255,180,80,0.07)' : 'rgba(180,130,70,0.08)')
          : (dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)'),
        border: `1px solid ${hov
          ? (dark ? 'rgba(255,180,80,0.18)' : 'rgba(180,130,70,0.28)')
          : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(200,168,130,0.22)')}`,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: dark ? 'rgba(255,180,80,0.09)' : 'rgba(180,130,70,0.11)',
        border: `1px solid ${dark ? 'rgba(255,180,80,0.16)' : 'rgba(180,130,70,0.18)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Video size={13} color={dark ? '#C8902A' : '#A0722A'} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.8rem', fontWeight: 600,
          color: dark ? '#e8ddd0' : '#1a1008',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {mtg.title || 'Quick Meeting'}
        </div>
        <div style={{
          fontSize: '0.62rem', color: dark ? '#6a5a40' : '#A08060', marginTop: 2,
          fontFamily: "'Space Mono', monospace",
        }}>
          {new Date(mtg.createdAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          {' · '}
          {new Date(mtg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Ended badge — no rejoin since call is over */}
      <div style={{
        padding: '3px 9px', borderRadius: 100, flexShrink: 0,
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(180,130,70,0.08)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(180,130,70,0.18)'}`,
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.55rem', letterSpacing: '0.08em',
        color: dark ? '#4a3820' : '#B09060',
      }}>
        ENDED
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout, dashboardData, axiosInstance } = useAppContext();
  const [meetingIdInput, setMeetingIdInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [dark, setDark] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const handleStartInstant = async () => {
    setIsCreating(true);
    try {
      const meetId = Math.random().toString(36).substring(2, 10);
      const res = await axiosInstance.post('/meetings/create', { meetId, title: 'Quick Meeting' });
      localStorage.setItem('stream_token', res.data.token);
      navigate(`/meeting/${res.data.meetId}`);
    } catch { alert('Failed to create meeting.'); }
    finally { setIsCreating(false); }
  };

  const handleScheduledCreate = async ({ title, date, time }) => {
    setIsCreating(true);
    try {
      const meetId = Math.random().toString(36).substring(2, 10);
      const res = await axiosInstance.post('/meetings/create', { meetId, title: title || 'Scheduled Meeting' });
      localStorage.setItem('stream_token', res.data.token);
      navigate(`/meeting/${res.data.meetId}`);
    } catch { alert('Failed to create scheduled meeting.'); }
    finally { setIsCreating(false); }
  };

  const handleJoin = async (e) => {
    if (e) e.preventDefault();
    if (!meetingIdInput.trim()) { inputRef.current?.focus(); return; }
    setIsJoining(true);
    try {
      const res = await axiosInstance.post('/meetings/join', { meetId: meetingIdInput.trim() });
      localStorage.setItem('stream_token', res.data.token);
      navigate(`/meeting/${res.data.meetId}`);
    } catch (err) { alert(err.response?.data?.message || 'Failed to join meeting'); }
    finally { setIsJoining(false); }
  };

  // ── Theme tokens ──
  const bg = dark ? '#0D0B08' : '#F0E6D0';
  const cardBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)';
  const cardBorder = dark ? 'rgba(255,200,100,0.1)' : 'rgba(200,168,130,0.3)';
  const textPrimary = dark ? '#F0E8D8' : '#0F0A04';
  const textSecondary = dark ? '#7a6a50' : '#7A5A28';
  const textMuted = dark ? '#4a3a20' : '#A08050';
  const accentColor = dark ? '#D4901A' : '#B8741A';
  const navBg = dark ? 'rgba(13,11,8,0.88)' : 'rgba(240,230,208,0.82)';
  const navBorder = dark ? 'rgba(255,200,100,0.08)' : 'rgba(180,130,70,0.18)';
  const inputBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)';
  const inputBorder = dark ? 'rgba(255,200,100,0.15)' : 'rgba(180,130,70,0.28)';
  const inputBorderFocus = dark ? 'rgba(212,144,26,0.6)' : 'rgba(184,116,26,0.6)';
  const btnBlack = dark ? '#F0E8D8' : '#0F0A04';
  const btnBlackText = dark ? '#0F0A04' : '#F0E8D8';
  const statDiv = dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.2)';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { height: 100%; overflow: hidden; overscroll-behavior: none; background: ${bg}; }
        body { height: 100%; overflow: hidden; overscroll-behavior: none; background: ${bg}; }
        #root { height: 100%; overflow: hidden; background: ${bg}; }
        ::-webkit-scrollbar { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: ${dark ? 'invert(0.7)' : 'none'};
          cursor: pointer;
        }
      `}</style>

      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        height: '100vh', width: '100vw',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative',
        background: dark
          ? `radial-gradient(ellipse 65% 70% at 100% 30%, rgba(180,100,20,0.22) 0%, transparent 60%), #0D0B08`
          : `radial-gradient(ellipse 70% 65% at 0% 100%, #D8C090 0%, transparent 55%),
             radial-gradient(ellipse 55% 50% at 100% 0%, #FAF2E0 0%, transparent 55%),
             radial-gradient(ellipse 80% 80% at 50% 50%, #EDE0C0 0%, #E4D0A8 100%)`,
        transition: 'background 0.4s',
      }}>

        <HoneycombBg dark={dark} />
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: dark
            ? 'radial-gradient(ellipse 45% 55% at 95% 50%, rgba(180,100,20,0.18) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 45% 55% at 98% 40%, rgba(252,240,210,0.8) 0%, transparent 65%)',
          transition: 'background 0.4s',
        }} />

        {/* ════ NAVBAR ════ */}
        <nav style={{
          position: 'relative', zIndex: 20,
          height: 62, padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${navBorder}`,
          background: navBg, backdropFilter: 'blur(18px)',
          flexShrink: 0, transition: 'all 0.4s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: dark ? '#F0E8D8' : '#0F0A04',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 14px ${dark ? 'rgba(240,232,216,0.15)' : 'rgba(15,10,4,0.22)'}`,
              position: 'relative', transition: 'background 0.4s',
            }}>
              <Video size={17} color={dark ? '#0F0A04' : '#F5E6C8'} strokeWidth={2} />
              <div style={{
                position: 'absolute', top: 5, right: 5,
                width: 7, height: 7, borderRadius: '50%',
                background: '#E8501A', boxShadow: '0 0 6px #E8501A',
                animation: 'blink 1.2s ease-in-out infinite',
              }} />
            </div>
            <div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.05rem', fontWeight: 800,
                color: textPrimary, letterSpacing: '-0.02em', lineHeight: 1, transition: 'color 0.4s',
              }}>VideoMeet</div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.48rem', color: textMuted,
                letterSpacing: '0.18em', marginTop: 2, transition: 'color 0.4s',
              }}>HD · ENCRYPTED · INSTANT</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.82rem', color: textPrimary, fontWeight: 700, transition: 'color 0.4s' }}>
                <LiveClock />
              </div>
              <div style={{ fontSize: '0.62rem', color: textMuted, marginTop: 1, transition: 'color 0.4s' }}>
                {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div style={{ width: 1, height: 24, background: navBorder }} />
            <button
              onClick={() => setDark(d => !d)}
              title={dark ? 'Light mode' : 'Dark mode'}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,10,4,0.07)',
                border: `1.5px solid ${dark ? 'rgba(255,200,100,0.18)' : 'rgba(180,130,70,0.25)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: dark ? '#D4901A' : '#8a6030', transition: 'all 0.2s',
              }}
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={logout}
              title="Sign out"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)',
                border: `1.5px solid ${dark ? 'rgba(255,200,100,0.12)' : 'rgba(180,130,70,0.25)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: dark ? '#7a6040' : '#8a6030', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = btnBlack; e.currentTarget.style.color = btnBlackText; }}
              onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = dark ? '#7a6040' : '#8a6030'; }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </nav>

        {/* ════ MAIN ════ */}
        <main style={{
          position: 'relative', zIndex: 1,
          flex: 1, overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 32,
          padding: '0 44px 24px',
          alignItems: 'center',
          maxWidth: 1300, margin: '0 auto', width: '100%',
        }}>

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <AnimatedBorderBadge dark={dark} />

            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2.6rem, 4.8vw, 4.4rem)',
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.03em', color: textPrimary,
              marginBottom: 20, transition: 'color 0.4s',
            }}>
              Video meetings,<br />
              <span style={{ color: accentColor, transition: 'color 0.4s' }}>done right.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(0.88rem, 1.35vw, 1.02rem)',
              color: textSecondary, lineHeight: 1.78, fontWeight: 400,
              maxWidth: 480, transition: 'color 0.4s',
            }}>
              Start or join crystal-clear video calls instantly — no downloads, no friction. Built for{' '}
              <span style={{ color: accentColor, fontWeight: 600 }}>speed, security, and simplicity.</span>
            </p>

            {/* CTA Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 34, flexWrap: 'wrap' }}>
              <NewMeetingDropdown
                dark={dark}
                isCreating={isCreating}
                onInstant={handleStartInstant}
                onScheduled={() => setShowSchedule(true)}
                btnBlack={btnBlack}
                btnBlackText={btnBlackText}
              />

              <form onSubmit={handleJoin}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: inputFocused ? (dark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.8)') : inputBg,
                  border: `1.5px solid ${inputFocused ? inputBorderFocus : inputBorder}`,
                  borderRadius: 14, padding: '11px 14px 11px 16px',
                  transition: 'all 0.2s', backdropFilter: 'blur(8px)',
                  minWidth: 255,
                }}>
                  <Hash size={13} color={inputFocused ? accentColor : (dark ? 'rgba(255,200,100,0.25)' : 'rgba(100,60,10,0.3)')} style={{ flexShrink: 0, transition: 'color 0.2s' }} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter code or link"
                    value={meetingIdInput}
                    onChange={e => setMeetingIdInput(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    style={{
                      flex: 1, background: 'none', border: 'none', outline: 'none',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.8rem', color: textPrimary, letterSpacing: '0.06em',
                    }}
                  />
                  <AnimatePresence>
                    {meetingIdInput.trim() && (
                      <motion.button
                        type="submit"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        disabled={isJoining}
                        style={{
                          padding: '6px 14px', borderRadius: 10,
                          background: btnBlack, color: btnBlackText,
                          border: 'none', cursor: 'pointer',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap',
                        }}
                      >
                        {isJoining ? '…' : 'Join'}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', alignItems: 'stretch',
              marginTop: 40, paddingTop: 24,
              borderTop: `1px solid ${statDiv}`, transition: 'border-color 0.4s',
            }}>
              {[
                { val: '99.9%', lbl: 'Uptime' },
                { val: '<80ms', lbl: 'Avg Latency' },
                { val: '256-bit', lbl: 'Encryption' },
                { val: '1–100', lbl: 'Participants' },
              ].map(({ val, lbl }, i) => (
                <div key={lbl} style={{
                  display: 'flex', flexDirection: 'column',
                  paddingLeft: i === 0 ? 0 : 20, paddingRight: 20,
                  borderRight: i < 3 ? `1px solid ${statDiv}` : 'none',
                  transition: 'border-color 0.4s',
                }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.02em', transition: 'color 0.4s' }}>{val}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2, transition: 'color 0.4s' }}>{lbl}</span>
                </div>
              ))}
            </div>

            {/* Pills */}
            <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
              {[{ icon: Zap, text: 'Instant HD' }, { icon: Shield, text: 'E2E Encrypted' }, { icon: Globe, text: 'Browser-based' }].map(({ icon: Icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
                  border: `1px solid ${dark ? 'rgba(255,200,100,0.12)' : 'rgba(180,130,70,0.22)'}`,
                  borderRadius: 100, padding: '5px 12px',
                  fontSize: '0.71rem', color: textSecondary, fontWeight: 500,
                  backdropFilter: 'blur(6px)', transition: 'all 0.4s',
                }}>
                  <Icon size={11} color={accentColor} />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT CARD ── */}
          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', maxHeight: 'calc(100vh - 120px)', paddingTop: 16 }}
          >
            {/* Quick actions */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, backdropFilter: 'blur(20px)', padding: '20px 20px 16px', transition: 'all 0.4s' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: textMuted, marginBottom: 14, transition: 'color 0.4s' }}>// quick actions</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: btnBlack, color: btnBlackText,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: '0.88rem', transition: 'all 0.4s',
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: textMuted, fontWeight: 500, transition: 'color 0.4s' }}>Welcome back</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: textPrimary, transition: 'color 0.4s' }}>{user?.name}</div>
                </div>
              </div>

              {/* Instant meeting */}
              <button
                onClick={handleStartInstant}
                disabled={isCreating}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 15px', borderRadius: 13,
                  background: btnBlack, border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s', color: btnBlackText,
                  opacity: isCreating ? 0.55 : 1, marginBottom: 8,
                }}
                onMouseEnter={e => { if (!isCreating) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(128,128,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCreating
                      ? <span style={{ width: 11, height: 11, border: `2px solid rgba(128,128,128,0.3)`, borderTopColor: btnBlackText, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                      : <span style={{ fontSize: '0.85rem' }}>⚡</span>}
                  </div>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem' }}>
                    {isCreating ? 'Starting…' : 'Instant Meeting'}
                  </span>
                </div>
                <ArrowUpRight size={13} style={{ opacity: 0.45 }} />
              </button>

              {/* Scheduled meeting */}
              <button
                onClick={() => setShowSchedule(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 15px', borderRadius: 13,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
                  border: `1.5px solid ${inputBorder}`,
                  cursor: 'pointer', transition: 'all 0.2s', color: textPrimary,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,200,100,0.08)' : 'rgba(180,130,70,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.85rem' }}></span>
                  </div>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem' }}>
                    Schedule Meeting
                  </span>
                </div>
                <ArrowUpRight size={13} style={{ opacity: 0.35 }} />
              </button>

              {/* Join input */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginTop: 8,
                padding: '10px 13px', borderRadius: 13,
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
                border: `1.5px solid ${inputBorder}`, transition: 'all 0.4s',
              }}>
                <Hash size={12} color={dark ? 'rgba(255,200,100,0.25)' : 'rgba(100,60,10,0.3)'} />
                <input
                  type="text"
                  placeholder="Paste meeting code…"
                  value={meetingIdInput}
                  onChange={e => setMeetingIdInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontFamily: "'Space Mono', monospace", fontSize: '0.76rem',
                    color: textPrimary, letterSpacing: '0.05em',
                  }}
                />
                <AnimatePresence>
                  {meetingIdInput.trim() && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      onClick={handleJoin}
                      disabled={isJoining}
                      style={{
                        padding: '5px 13px', borderRadius: 9,
                        background: btnBlack, color: btnBlackText,
                        border: 'none', cursor: 'pointer',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700, fontSize: '0.72rem', whiteSpace: 'nowrap',
                      }}
                    >
                      {isJoining ? '…' : 'Join'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Recent Meetings */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: 20, backdropFilter: 'blur(20px)',
              padding: '16px 16px 12px', flex: 1,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              transition: 'all 0.4s',
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: textMuted, marginBottom: 10, transition: 'color 0.4s' }}>
                // past meetings
              </div>

              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {dashboardData?.recentMeetings?.length > 0 ? (
                  dashboardData.recentMeetings.slice(0, 4).map((mtg, idx) => (
                    <MtgRow key={mtg._id || idx} mtg={mtg} idx={idx} dark={dark} />
                  ))
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: dark ? 'rgba(255,200,100,0.07)' : 'rgba(180,130,70,0.1)',
                      border: `1px solid ${dark ? 'rgba(255,200,100,0.14)' : 'rgba(180,130,70,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Clock size={17} color={dark ? 'rgba(200,150,50,0.4)' : 'rgba(160,114,42,0.45)'} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.8rem', color: dark ? '#4a3820' : '#4a3010' }}>No past meetings</p>
                      <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 3 }}>History will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: 10, padding: '7px 11px', borderRadius: 9,
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.45)',
                border: `1px solid ${dark ? 'rgba(255,200,100,0.08)' : 'rgba(180,130,70,0.18)'}`,
                display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.4s',
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.56rem', color: textMuted, letterSpacing: '0.1em', transition: 'color 0.4s' }}>ALL SYSTEMS GO</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.62rem', color: textMuted, transition: 'color 0.4s' }}>{dashboardData?.recentMeetings?.length || 0} meetings</span>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Schedule Modal */}
        <AnimatePresence>
          {showSchedule && (
            <ScheduleModal
              dark={dark}
              onClose={() => setShowSchedule(false)}
              onCreate={handleScheduledCreate}
              textPrimary={textPrimary}
              textMuted={textMuted}
              cardBg={dark ? 'rgba(22,17,10,0.97)' : 'rgba(253,249,241,0.97)'}
              cardBorder={cardBorder}
              btnBlack={btnBlack}
              btnBlackText={btnBlackText}
            />
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(0.6); }
        }
      `}</style>
    </>
  );
};

export default HomePage;