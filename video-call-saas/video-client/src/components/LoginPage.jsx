import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Video, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

/* ════════════════════════════════════════════
   HONEYCOMB BACKGROUND
════════════════════════════════════════════ */
const HoneycombBg = () => {
  const R = 22, gap = 4;
  const W = R * 2 + gap;
  const H = Math.sqrt(3) * R + gap;
  const hexes = [];
  for (let row = 0; row < 22; row++) {
    for (let col = 0; col < 10; col++) {
      const cx = col * W * 1.5 + (row % 2 === 0 ? 0 : W * 0.75);
      const cy = row * H * 0.87;
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = (Math.PI / 3) * k - Math.PI / 6;
        return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
      }).join(' ');
      const xFade = Math.max(0.06, 0.5 - (cx / 420) * 0.45);
      hexes.push(
        <polygon key={`${row}-${col}`} points={pts} fill="none"
          stroke="#B8924A" strokeWidth="1" opacity={xFade} />
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
   INPUT FIELD
════════════════════════════════════════════ */
const Field = ({ label, name, type = 'text', placeholder, value, onChange, icon: Icon, required }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label style={{
        display: 'block', fontFamily: "'Space Mono', monospace",
        fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase',
        color: '#A08050', marginBottom: 6,
      }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: focused ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.55)',
        border: `1.5px solid ${focused ? 'rgba(184,116,26,0.6)' : 'rgba(180,130,70,0.28)'}`,
        borderRadius: 12, padding: '11px 14px',
        transition: 'all 0.2s', backdropFilter: 'blur(8px)',
      }}>
        <Icon size={14} color={focused ? '#B8741A' : 'rgba(160,114,42,0.45)'} style={{ flexShrink: 0, transition: 'color 0.2s' }} />
        <input
          type={isPassword && !show ? 'password' : 'text'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.88rem', color: '#0F0A04',
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(160,114,42,0.5)', padding: 0, flexShrink: 0 }}>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════ */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); setApiSuccess(''); setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        login({ name: data.name, email: data.email, _id: data._id }, data.token);
        setApiSuccess('Login successful! Redirecting…');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setApiError(data.message || 'Invalid email or password.');
      }
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; background: #F0E6D0; overscroll-behavior: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(0.6); }
        }
      `}</style>

      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        minHeight: '100vh', width: '100%',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        background: `
          radial-gradient(ellipse 70% 65% at 0% 100%, #D8C090 0%, transparent 55%),
          radial-gradient(ellipse 55% 50% at 100% 0%, #FAF2E0 0%, transparent 55%),
          radial-gradient(ellipse 80% 80% at 50% 50%, #EDE0C0 0%, #E4D0A8 100%)
        `,
      }}>
        <HoneycombBg />
        {/* Right glow */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 45% 55% at 98% 40%, rgba(252,240,210,0.8) 0%, transparent 65%)' }} />

        {/* ── NAVBAR ── */}
        <nav style={{
          position: 'relative', zIndex: 20, height: 62, padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(180,130,70,0.18)',
          background: 'rgba(240,230,208,0.82)', backdropFilter: 'blur(18px)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: '#0F0A04',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 14px rgba(15,10,4,0.22)', position: 'relative',
            }}>
              <Video size={17} color="#F5E6C8" strokeWidth={2} />
              <div style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: '#E8501A', boxShadow: '0 0 6px #E8501A', animation: 'blink 1.2s ease-in-out infinite' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.05rem', fontWeight: 800, color: '#0F0A04', letterSpacing: '-0.02em', lineHeight: 1 }}>VideoMeet</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', color: '#A08050', letterSpacing: '0.18em', marginTop: 2 }}>HD · ENCRYPTED · INSTANT</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.8rem', color: '#A08050' }}>No account?</span>
            <Link to="/register" style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.82rem',
              color: '#0F0A04', textDecoration: 'none',
              background: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(180,130,70,0.28)',
              borderRadius: 100, padding: '6px 16px', backdropFilter: 'blur(6px)',
              transition: 'all 0.2s',
            }}>
              Register →
            </Link>
          </div>
        </nav>

        {/* ── BODY ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '32px 24px', position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center', maxWidth: 960, width: '100%' }}>

            {/* Left: brand text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(180,130,70,0.25)',
                borderRadius: 100, padding: '6px 16px', marginBottom: 28,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem',
                color: '#6B4E1A', fontWeight: 500, backdropFilter: 'blur(8px)',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
                Secure · Encrypted · Always on
              </div>

              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
                fontWeight: 800, lineHeight: 1.06,
                letterSpacing: '-0.03em', color: '#0F0A04', marginBottom: 18,
              }}>
                Welcome back<br />
                <span style={{ color: '#B8741A' }}>to your meetings.</span>
              </h1>

              <p style={{ fontSize: '1rem', color: '#7A5A28', lineHeight: 1.75, fontWeight: 400, maxWidth: 380 }}>
                Log in to access your meetings, collaborate with your team, and stay connected — anywhere in the world.
              </p>

              {/* Trust items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 36 }}>
                {[
                  { icon: '🔐', text: 'AES-256 end-to-end encryption' },
                  { icon: '⚡', text: 'Sub-80ms average latency' },
                  { icon: '🌐', text: 'Works in any modern browser' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                      background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(180,130,70,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem',
                    }}>{icon}</div>
                    <span style={{ fontSize: '0.82rem', color: '#7A5A28', fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: form card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(200,168,130,0.3)',
                borderRadius: 24, backdropFilter: 'blur(24px)',
                padding: '32px 28px',
                boxShadow: '0 20px 50px rgba(100,60,10,0.1)',
              }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A08050', marginBottom: 8 }}>// sign in</div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.65rem', fontWeight: 800, color: '#0F0A04', letterSpacing: '-0.025em' }}>Sign in to VideoMeet</h2>
                  <p style={{ fontSize: '0.82rem', color: '#A08050', marginTop: 5 }}>Enter your credentials to continue</p>
                </div>

                {/* Alerts */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 10, fontSize: '0.8rem', color: '#991b1b', fontWeight: 500 }}>
                      {apiError}
                    </motion.div>
                  )}
                  {apiSuccess && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, fontSize: '0.8rem', color: '#15803d', fontWeight: 500 }}>
                      {apiSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Field label="Email Address" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} icon={Mail} required />
                  <div>
                    <Field label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} icon={Lock} required />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                      <a href="#" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.72rem', color: '#B8741A', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: '#0F0A04', color: '#F5E6C8',
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.92rem',
                      padding: '14px 0', borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 20px rgba(15,10,4,0.22)', transition: 'all 0.2s',
                      opacity: isLoading ? 0.65 : 1,
                    }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.opacity = '0.88'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {isLoading
                      ? <span style={{ width: 15, height: 15, border: '2px solid rgba(245,230,200,0.3)', borderTopColor: '#F5E6C8', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                      : <><span>Sign In</span><ArrowUpRight size={15} style={{ opacity: 0.65 }} /></>
                    }
                  </button>
                </form>

                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(180,130,70,0.18)', textAlign: 'center' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.82rem', color: '#A08050' }}>Don't have an account? </span>
                  <Link to="/register" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.82rem', fontWeight: 800, color: '#B8741A', textDecoration: 'none', letterSpacing: '-0.01em' }}>
                    Create one →
                  </Link>
                </div>
              </div>

              {/* Footer badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 18 }}>
                {[
                  { icon: ShieldCheck, text: 'AES-256' },
                  { icon: ShieldCheck, text: 'SOC-2' },
                  { icon: ShieldCheck, text: 'GDPR' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#A08050', letterSpacing: '0.1em' }}>
                    <Icon size={11} color="#B8741A" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;