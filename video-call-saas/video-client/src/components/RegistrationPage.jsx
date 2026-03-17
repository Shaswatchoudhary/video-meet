import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ShieldCheck, Video, Eye, EyeOff, Mail, Lock, User,
  Zap, Globe, AlertCircle,
} from 'lucide-react';
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
      hexes.push(
        <polygon key={`${row}-${col}`} points={pts} fill="none"
          stroke="#B8924A" strokeWidth="1"
          opacity={Math.max(0.06, 0.5 - (cx / 420) * 0.45)} />
      );
    }
  }
  return (
    <svg style={{ position:'fixed', left:0, top:0, width:480, height:'100vh', pointerEvents:'none', zIndex:0 }}
      className="hidden md:block"
      viewBox="0 0 480 900" preserveAspectRatio="xMinYMid slice">
      {hexes}
    </svg>
  );
};

/* ════════════════════════════════════════════
   INLINE FIELD ERROR
   — replaces browser "please fill this field" popup
════════════════════════════════════════════ */
const FieldError = ({ msg }) => (
  <AnimatePresence>
    {msg && (
      <motion.div
        initial={{ opacity:0, y:-4, height:0 }}
        animate={{ opacity:1, y:0, height:'auto' }}
        exit={{ opacity:0, y:-4, height:0 }}
        transition={{ duration:0.18, ease:[0.22,1,0.36,1] }}
        style={{ overflow:'hidden' }}
      >
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          marginTop:6, padding:'7px 11px',
          background:'rgba(234,67,53,0.07)',
          border:'1px solid rgba(234,67,53,0.2)',
          borderRadius:8,
        }}>
          <AlertCircle size={12} color="#ea4335" style={{ flexShrink:0 }} />
          <span style={{
            fontFamily:"'Plus Jakarta Sans', sans-serif",
            fontSize:'0.72rem', color:'#c0392b', fontWeight:500,
          }}>{msg}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ════════════════════════════════════════════
   INPUT FIELD
════════════════════════════════════════════ */
const Field = ({ label, name, type = 'text', placeholder, value, onChange, icon: Icon, error, onFocusClear }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow]       = useState(false);
  const isPassword = type === 'password';
  const hasError   = Boolean(error);

  return (
    <div>
      <label style={{
        display:'block', fontFamily:"'Space Mono', monospace",
        fontSize:'0.58rem', letterSpacing:'0.16em', textTransform:'uppercase',
        color: hasError ? '#c0392b' : '#A08050', marginBottom:6, transition:'color 0.2s',
      }}>{label}</label>

      <div style={{
        display:'flex', alignItems:'center', gap:10,
        background: focused ? 'rgba(255,255,255,0.82)' : (hasError ? 'rgba(234,67,53,0.04)' : 'rgba(255,255,255,0.55)'),
        border:`1.5px solid ${hasError ? 'rgba(234,67,53,0.45)' : (focused ? 'rgba(184,116,26,0.6)' : 'rgba(180,130,70,0.28)')}`,
        borderRadius:12, padding:'11px 14px',
        transition:'all 0.2s', backdropFilter:'blur(8px)',
      }}>
        <Icon
          size={14}
          color={hasError ? '#ea4335' : (focused ? '#B8741A' : 'rgba(160,114,42,0.45)')}
          style={{ flexShrink:0, transition:'color 0.2s' }}
        />
        <input
          type={isPassword && !show ? 'password' : 'text'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => { setFocused(true); onFocusClear?.(name); }}
          onBlur={() => setFocused(false)}
          style={{
            flex:1, background:'none', border:'none', outline:'none',
            fontFamily:"'Plus Jakarta Sans', sans-serif",
            fontSize:'0.88rem', color:'#0F0A04',
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(160,114,42,0.5)', padding:0, flexShrink:0 }}>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>

      <FieldError msg={error} />
    </div>
  );
};

/* ════════════════════════════════════════════
   PASSWORD STRENGTH BAR
════════════════════════════════════════════ */
const StrengthBar = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)        s += 25;
    if (/[A-Z]/.test(password))      s += 25;
    if (/[0-9]/.test(password))      s += 25;
    if (/[^A-Za-z0-9]/.test(password)) s += 25;
    return s;
  }, [password]);

  if (!password) return null;

  const color = strength <= 25 ? '#ef4444' : strength <= 50 ? '#f59e0b' : strength <= 75 ? '#84cc16' : '#22c55e';
  const label = strength <= 25 ? 'Weak'    : strength <= 50 ? 'Fair'    : strength <= 75 ? 'Good'    : 'Strong';

  return (
    <div style={{ marginTop:6 }}>
      <div style={{ height:3, background:'rgba(180,130,70,0.15)', borderRadius:3, overflow:'hidden' }}>
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${strength}%` }}
          style={{ height:'100%', background:color, borderRadius:3, transition:'background 0.3s' }}
        />
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:3 }}>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.55rem', color, letterSpacing:'0.08em' }}>{label}</span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   REGISTRATION PAGE
════════════════════════════════════════════ */
const RegistrationPage = () => {
  const navigate = useNavigate();
  const { login, axiosInstance } = useAppContext();
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'', terms:false });
  const [isLoading, setIsLoading]   = useState(false);
  const [errors, setErrors]         = useState({});
  const [apiError, setApiError]     = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const clearError = (name) => {
    if (errors[name]) setErrors(p => ({ ...p, [name]:'' }));
    if (apiError) setApiError('');
  };

  // Our own validation — noValidate disables browser bubble entirely
  const validate = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = 'Full name is required.';
    if (!formData.email.trim())
      errs.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Enter a valid email address.';
    if (!formData.password)
      errs.password = 'Please create a password.';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (!formData.confirmPassword)
      errs.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    if (!formData.terms)
      errs.terms = 'You must agree to the Terms of Service to continue.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); setApiSuccess('');

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const data = res.data;
      if (res.status === 201 || res.status === 200) {
        login({ name: data.name, email: data.email, _id: data._id }, data.token);
        setApiSuccess('Account created! Redirecting…');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setApiError(data.message || 'Registration failed. Please try again.');
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
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body, #root { background:#F0E6D0; overscroll-behavior:none; }
        @keyframes spin  { to { transform:rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.6)} }
      `}</style>

      <div style={{
        fontFamily:"'Plus Jakarta Sans', sans-serif",
        minHeight:'100vh', width:'100%',
        display:'flex', flexDirection:'column',
        position:'relative',
        background:`
          radial-gradient(ellipse 70% 65% at 0% 100%, #D8C090 0%, transparent 55%),
          radial-gradient(ellipse 55% 50% at 100% 0%, #FAF2E0 0%, transparent 55%),
          radial-gradient(ellipse 80% 80% at 50% 50%, #EDE0C0 0%, #E4D0A8 100%)
        `,
      }}>
        <HoneycombBg />
        <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', background:'radial-gradient(ellipse 45% 55% at 98% 40%, rgba(252,240,210,0.8) 0%, transparent 65%)' }} />

        {/* ── NAVBAR ── */}
        <nav className="relative z-[20] h-16 px-6 md:px-10 flex items-center justify-between border-b backdrop-blur-xl shrink-0"
          style={{
            borderColor: 'rgba(180,130,70,0.18)',
            background: 'rgba(240,230,208,0.82)',
          }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#0F0A04', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 14px rgba(15,10,4,0.22)', position:'relative' }}>
              <Video size={17} color="#F5E6C8" strokeWidth={2} />
              <div style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'#E8501A', boxShadow:'0 0 6px #E8501A', animation:'blink 1.2s linear infinite' }} />
            </div>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'1.05rem', fontWeight:800, color:'#0F0A04', letterSpacing:'-0.02em', lineHeight:1 }}>VideoMeet</div>
              <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.48rem', color:'#A08050', letterSpacing:'0.18em', marginTop:2 }}>HD · ENCRYPTED · INSTANT</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'0.8rem', color:'#A08050' }}>Have an account?</span>
            <Link to="/login" style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:700, fontSize:'0.82rem', color:'#0F0A04', textDecoration:'none', background:'rgba(255,255,255,0.55)', border:'1.5px solid rgba(180,130,70,0.28)', borderRadius:100, padding:'6px 16px', backdropFilter:'blur(6px)' }}>
              Sign In →
            </Link>
          </div>
        </nav>

        {/* ── BODY ── */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-8 relative z-[1]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center max-w-5xl w-full">

            {/* LEFT: brand */}
            <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.65, ease:[0.22,1,0.36,1] }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(255,255,255,0.55)', border:'1px solid rgba(180,130,70,0.25)',
                borderRadius:100, padding:'6px 16px', marginBottom:28,
                fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'0.78rem',
                color:'#6B4E1A', fontWeight:500, backdropFilter:'blur(8px)',
              }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#E8A020', boxShadow:'0 0 5px #E8A020', animation:'blink 1.5s linear infinite' }} />
                Join thousands of teams worldwide
              </div>

              <h1 style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'clamp(2.4rem, 4vw, 3.6rem)', fontWeight:800, lineHeight:1.06, letterSpacing:'-0.03em', color:'#0F0A04', marginBottom:18 }}>
                The future of<br />
                <span style={{ color:'#B8741A' }}>video collaboration.</span>
              </h1>

              <p style={{ fontSize:'1rem', color:'#7A5A28', lineHeight:1.75, fontWeight:400, maxWidth:380 }}>
                Experience ultra-low latency, crystal-clear HD, and seamless meeting management — all in your browser.
              </p>

              {/* Stats */}
              <div style={{ display:'flex', gap:0, marginTop:36, paddingTop:24, borderTop:'1px solid rgba(180,130,70,0.2)' }}>
                {[
                  { val:'99.9%', lbl:'Uptime' },
                  { val:'<80ms', lbl:'Latency' },
                  { val:'256-bit', lbl:'Encryption' },
                ].map(({ val, lbl }, i) => (
                  <div key={lbl} style={{ display:'flex', flexDirection:'column', paddingLeft:i===0?0:24, paddingRight:24, borderRight:i<2?'1px solid rgba(180,130,70,0.2)':'none' }}>
                    <span style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'1.4rem', fontWeight:800, color:'#0F0A04', letterSpacing:'-0.02em' }}>{val}</span>
                    <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.55rem', color:'#A08050', letterSpacing:'0.12em', textTransform:'uppercase', marginTop:2 }}>{lbl}</span>
                  </div>
                ))}
              </div>

              {/* Trust items — Lucide icons, NO emojis */}
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:28 }}>
                {[
                  { Icon: Lock,  text: 'AES-256 end-to-end encryption' },
                  { Icon: Zap,   text: 'Sub-80ms average latency' },
                  { Icon: Globe, text: 'Works in any modern browser' },
                ].map(({ Icon, text }) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{
                      width:32, height:32, borderRadius:9, flexShrink:0,
                      background:'rgba(255,255,255,0.55)', border:'1px solid rgba(180,130,70,0.2)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon size={14} color="#B8741A" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize:'0.82rem', color:'#7A5A28', fontWeight:500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: form */}
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.1, ease:[0.22,1,0.36,1] }}>
              <div style={{
                background:'rgba(255,255,255,0.5)', border:'1px solid rgba(200,168,130,0.3)',
                borderRadius:24, backdropFilter:'blur(24px)', padding:'28px 26px',
                boxShadow:'0 20px 50px rgba(100,60,10,0.1)',
              }}>
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'#A08050', marginBottom:8 }}>// create account</div>
                  <h2 style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'1.55rem', fontWeight:800, color:'#0F0A04', letterSpacing:'-0.025em' }}>Create your account</h2>
                  <p style={{ fontSize:'0.8rem', color:'#A08050', marginTop:4 }}>Join thousands of teams on VideoMeet</p>
                </div>

                {/* API-level alerts */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      style={{ marginBottom:14, padding:'10px 14px', background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:10, fontSize:'0.8rem', color:'#991b1b', fontWeight:500, display:'flex', alignItems:'center', gap:8 }}>
                      <AlertCircle size={14} color="#ea4335" style={{ flexShrink:0 }} />
                      {apiError}
                    </motion.div>
                  )}
                  {apiSuccess && (
                    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      style={{ marginBottom:14, padding:'10px 14px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, fontSize:'0.8rem', color:'#15803d', fontWeight:500 }}>
                      {apiSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* noValidate → kills browser popup; we validate ourselves */}
                <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:13 }}>
                  <Field label="Full Name" name="name" placeholder="John Doe"
                    value={formData.name} onChange={handleChange}
                    icon={User} error={errors.name} onFocusClear={clearError} />

                  <Field label="Email Address" name="email" type="email" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange}
                    icon={Mail} error={errors.email} onFocusClear={clearError} />

                  <div>
                    <Field label="Password" name="password" type="password" placeholder="••••••••"
                      value={formData.password} onChange={handleChange}
                      icon={Lock} error={errors.password} onFocusClear={clearError} />
                    <StrengthBar password={formData.password} />
                  </div>

                  <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••"
                    value={formData.confirmPassword} onChange={handleChange}
                    icon={Lock} error={errors.confirmPassword} onFocusClear={clearError} />

                  {/* Terms checkbox */}
                  <div>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'2px 0' }}>
                      <input
                        type="checkbox" id="terms" name="terms"
                        checked={formData.terms}
                        onChange={(e) => { handleChange(e); if (errors.terms) setErrors(p => ({ ...p, terms:'' })); }}
                        style={{ marginTop:3, width:14, height:14, accentColor:'#B8741A', cursor:'pointer', flexShrink:0 }}
                      />
                      <label htmlFor="terms" style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'0.75rem', color:'#7A5A28', lineHeight:1.55, cursor:'pointer' }}>
                        I agree to the{' '}
                        <a href="#" style={{ color:'#B8741A', fontWeight:600, textDecoration:'none' }}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" style={{ color:'#B8741A', fontWeight:600, textDecoration:'none' }}>Privacy Policy</a>
                      </label>
                    </div>
                    <FieldError msg={errors.terms} />
                  </div>

                  <button
                    type="submit" disabled={isLoading}
                    style={{
                      width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      background:'#0F0A04', color:'#F5E6C8',
                      fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:700, fontSize:'0.92rem',
                      padding:'14px 0', borderRadius:12, border:'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      boxShadow:'0 4px 20px rgba(15,10,4,0.22)', transition:'all 0.2s',
                      opacity: isLoading ? 0.65 : 1, marginTop:4,
                    }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.opacity='0.88'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity='1'; }}
                  >
                    {isLoading
                      ? <span style={{ width:15, height:15, border:'2px solid rgba(245,230,200,0.3)', borderTopColor:'#F5E6C8', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
                      : <><span>Create Account</span><ArrowUpRight size={15} style={{ opacity:0.65 }} /></>
                    }
                  </button>
                </form>

                <div style={{ marginTop:20, paddingTop:18, borderTop:'1px solid rgba(180,130,70,0.18)', textAlign:'center' }}>
                  <span style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'0.82rem', color:'#A08050' }}>Already have an account? </span>
                  <Link to="/login" style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'0.82rem', fontWeight:800, color:'#B8741A', textDecoration:'none' }}>
                    Sign in →
                  </Link>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, marginTop:16 }}>
                {['AES-256','SOC-2','GDPR'].map(t => (
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:5, fontFamily:"'Space Mono', monospace", fontSize:'0.58rem', color:'#A08050', letterSpacing:'0.1em' }}>
                    <ShieldCheck size={11} color="#B8741A" />
                    {t}
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

export default RegistrationPage;