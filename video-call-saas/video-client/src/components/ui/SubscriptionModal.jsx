import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/useAppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Crown, Rocket, Check, CreditCard, Smartphone,
  Lock, ShieldCheck, ChevronRight, Sparkles, Tag,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   BILLING PERIODS CONFIG
───────────────────────────────────────────── */
const PERIODS = {
  aarambh: [
    { id: 'monthly', label: 'Monthly',    months: 1,  price: 12,  save: null,       per: '12' },
    { id: '6month',  label: '6 Months',   months: 6,  price: 65,  save: 'Save ₹7',  per: '10.8' },
    { id: 'yearly',  label: 'Yearly',     months: 12, price: 100, save: 'Save ₹44', per: '8.3' },
  ],
  samraat: [
    { id: 'monthly', label: 'Monthly',    months: 1,  price: 22,  save: null,        per: '22' },
    { id: '6month',  label: '6 Months',   months: 6,  price: 120, save: 'Save ₹12',  per: '20' },
    { id: 'yearly',  label: 'Yearly',     months: 12, price: 200, save: 'Save ₹64',  per: '16.6' },
  ],
};

/* ─────────────────────────────────────────────
   CARD NUMBER FORMATTER
───────────────────────────────────────────── */
const formatCard = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

/* ─────────────────────────────────────────────
   INPUT ROW
───────────────────────────────────────────── */
const PayInput = ({ label, placeholder, value, onChange, maxLength, type = 'text', half = false, dark }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: half ? '1 1 0' : '1 1 100%', minWidth: 0 }}>
      <label style={{
        display: 'block',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.54rem', letterSpacing: '0.14em', textTransform: 'uppercase',
        color: dark ? '#7a6a50' : '#A08050', marginBottom: 5,
      }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: focused
            ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)')
            : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)'),
          border: `1.5px solid ${focused
            ? (dark ? 'rgba(212,144,26,0.7)' : 'rgba(184,116,26,0.65)')
            : (dark ? 'rgba(255,200,100,0.15)' : 'rgba(180,130,70,0.28)')}`,
          borderRadius: 10,
          padding: '10px 13px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.82rem',
          color: dark ? '#f0e8d8' : '#0F0A04',
          outline: 'none',
          transition: 'all 0.18s',
          letterSpacing: '0.04em',
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN MODAL
───────────────────────────────────────────── */
const SubscriptionModal = ({ plan, dark, onClose, onSuccess }) => {
  const isPro       = plan?.id === 'samraat';
  const periods     = PERIODS[plan?.id] || PERIODS.aarambh;
  const accentClr   = isPro ? (dark ? '#D4901A' : '#B8741A') : (dark ? '#5a9aD4' : '#2a72B8');
  const accentLight = isPro
    ? (dark ? 'rgba(212,144,26,0.12)' : 'rgba(184,116,26,0.09)')
    : (dark ? 'rgba(90,154,212,0.12)' : 'rgba(42,114,184,0.09)');
  const accentBorder = isPro
    ? (dark ? 'rgba(212,144,26,0.35)' : 'rgba(184,116,26,0.35)')
    : (dark ? 'rgba(90,154,212,0.35)' : 'rgba(42,114,184,0.35)');

  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [selPeriod, setSelPeriod]   = useState('yearly');

  const activePeriod = periods.find(p => p.id === selPeriod);

  const { axiosInstance, user } = useAppContext();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadCashfree = () => {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    setLoading(true);

    try {
      // 1. Load Cashfree SDK
      const sdkLoaded = await loadCashfree();
      if (!sdkLoaded) {
        alert('Failed to load Cashfree SDK');
        setLoading(false);
        return;
      }

      const cashfree = window.Cashfree({
        mode: "sandbox" // change to "production" for production
      });

      // 2. Create order on backend
      const orderRes = await axiosInstance.post('/cashfree/create-order', {
        plan: plan.id,
        amount: activePeriod.price
      });

      const { payment_session_id, order_id } = orderRes.data;

      // 3. Initialize Checkout
      let checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal", // OPEN AS MODAL
      };

      cashfree.checkout(checkoutOptions).then(() => {
        console.log("Checkout complete for order:", order_id);
        // After checkout modal is closed, we verify the status
        verifyCashfreePayment(order_id);
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  const verifyCashfreePayment = async (orderId) => {
    try {
      const verifyRes = await axiosInstance.post('/cashfree/verify', {
        order_id: orderId,
        plan: plan.id,
        period: selPeriod
      });

      if (verifyRes.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.(verifyRes.data.subscription);
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        alert('Payment verification failed');
      }
    } catch (e) {
      alert('Error verifying payment: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.92, y: 28, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 28, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 680,
            background: dark ? 'rgba(16,12,7,0.97)' : 'rgba(252,248,240,0.97)',
            border: `1px solid ${dark ? 'rgba(255,200,100,0.12)' : 'rgba(200,168,130,0.35)'}`,
            borderRadius: 28,
            backdropFilter: 'blur(32px)',
            boxShadow: dark
              ? '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,200,100,0.05)'
              : '0 32px 80px rgba(100,60,10,0.18)',
            overflow: 'hidden',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {/* ── TOP HEADER ── */}
          <div style={{
            padding: '22px 26px 18px',
            borderBottom: `1px solid ${dark ? 'rgba(255,200,100,0.08)' : 'rgba(180,130,70,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Plan badge */}
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: accentLight,
                border: `1.5px solid ${accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isPro
                  ? <Crown size={20} color={accentClr} strokeWidth={1.8} />
                  : <Rocket size={20} color={accentClr} strokeWidth={1.8} />}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: dark ? '#6a5a40' : '#A08050', marginBottom: 2,
                }}>
                  Subscribing to
                </div>
                <div style={{
                  fontSize: '1.1rem', fontWeight: 800,
                  color: accentClr, letterSpacing: '-0.02em',
                }}>
                  {plan?.hindiName}
                  <span style={{ fontSize: '0.7rem', fontWeight: 400, color: dark ? '#6a5a40' : '#A08050', marginLeft: 8, fontFamily: "'Space Mono', monospace" }}>
                    {plan?.tagline}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                border: `1px solid ${dark ? 'rgba(255,200,100,0.12)' : 'rgba(180,130,70,0.22)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: dark ? '#6a5a40' : '#A08050',
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
            >
              <X size={15} />
            </button>
          </div>

          {/* ── BODY ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>

            {/* LEFT — billing period + summary */}
            <div style={{
              padding: '22px 22px 24px',
              borderRight: `1px solid ${dark ? 'rgba(255,200,100,0.08)' : 'rgba(180,130,70,0.15)'}`,
            }}>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: dark ? '#6a5a40' : '#A08050', marginBottom: 12,
              }}>
                // Billing Period
              </div>


              {/* Period selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {periods.map(p => {
                  const isSel = selPeriod === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelPeriod(p.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '13px 14px', borderRadius: 14,
                        background: isSel ? accentLight : (dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.45)'),
                        border: `1.5px solid ${isSel ? accentBorder : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(180,130,70,0.2)')}`,
                        cursor: 'pointer', transition: 'all 0.18s', textAlign: 'left',
                        boxShadow: isSel ? `0 4px 16px ${accentClr}22` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Radio dot */}
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                          background: isSel ? accentClr : 'transparent',
                          border: `2px solid ${isSel ? accentClr : (dark ? 'rgba(255,200,100,0.25)' : 'rgba(180,130,70,0.35)')}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.18s',
                        }}>
                          {isSel && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.88rem', fontWeight: 700,
                            color: isSel ? accentClr : (dark ? '#e8ddd0' : '#1a1008'),
                            transition: 'color 0.18s',
                          }}>{p.label}</div>
                          <div style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '0.6rem', color: dark ? '#6a5a40' : '#A08050', marginTop: 1,
                          }}>
                            ₹{p.per}/mo equivalent
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: isSel ? accentClr : (dark ? '#e8ddd0' : '#0F0A04'), letterSpacing: '-0.02em' }}>
                          ₹{p.price}
                        </span>
                        {p.save && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 3,
                            background: dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.25)',
                            borderRadius: 100, padding: '2px 7px',
                          }}>
                            <Tag size={8} color="#22c55e" />
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: '#16a34a', letterSpacing: '0.06em' }}>
                              {p.save}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* What you get */}
              <div style={{
                background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${dark ? 'rgba(255,200,100,0.08)' : 'rgba(180,130,70,0.18)'}`,
                borderRadius: 14, padding: '14px 14px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
                }}>
                  <Sparkles size={12} color={accentClr} />
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.54rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: dark ? '#6a5a40' : '#A08050',
                  }}>What you get</span>
                </div>
                {(plan?.features || []).slice(0, 4).map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                    <Check size={11} color={accentClr} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.74rem', color: dark ? '#8a7a60' : '#6a5030' }}>
                      {f.text}
                    </span>
                  </div>
                ))}
                {plan?.features?.length > 4 && (
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: accentClr, marginTop: 4 }}>
                    +{plan.features.length - 4} more features
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — payment */}
            <div style={{ padding: '22px 22px 24px' }}>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: dark ? '#6a5a40' : '#A08050', marginBottom: 12,
              }}>
                // Payment Details
              </div>

              {/* Total chip */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px',
                background: accentLight,
                border: `1.5px solid ${accentBorder}`,
                borderRadius: 12, marginBottom: 18,
              }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.54rem', color: dark ? '#8a6a40' : '#8a6030', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Total due today
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: accentClr, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 2 }}>
                    ₹{activePeriod?.price}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: dark ? '#6a5a40' : '#A08050' }}>
                    {activePeriod?.label}
                  </div>
                  {activePeriod?.save && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', marginTop: 2 }}>
                      {activePeriod.save}
                    </div>
                  )}
                </div>
              </div>

              {/* Security note */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                marginTop: 14,
                marginBottom: 16
              }}>
                {[
                  { icon: Lock,        text: 'SSL Secured' },
                  { icon: ShieldCheck, text: 'PCI Compliant' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon size={10} color={dark ? '#5a4a30' : '#B8741A'} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: dark ? '#5a4a30' : '#B09060', letterSpacing: '0.08em' }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={loading || success}
                style={{
                  width: '100%', marginTop: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  padding: '14px 0', borderRadius: 13,
                  background: success
                    ? 'rgba(34,197,94,0.15)'
                    : accentClr,
                  border: success ? '1.5px solid rgba(34,197,94,0.4)' : 'none',
                  color: success ? '#16a34a' : '#fff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: '0.92rem',
                  cursor: loading || success ? 'default' : 'pointer',
                  transition: 'all 0.25s',
                  letterSpacing: '-0.01em',
                  boxShadow: success ? 'none' : `0 6px 22px ${accentClr}55`,
                }}
                onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {loading ? (
                  <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Processing…</>
                ) : success ? (
                  <><Check size={16} strokeWidth={2.5} />Subscribed! Welcome aboard</>
                ) : (
                  <>Pay ₹{activePeriod?.price} · {activePeriod?.label}<ChevronRight size={16} style={{ opacity: 0.7 }} /></>
                )}
              </button>

              {/* Security note */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                marginTop: 14,
              }}>
                {[
                  { icon: Lock,        text: 'SSL Secured' },
                  { icon: ShieldCheck, text: 'PCI Compliant' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon size={10} color={dark ? '#5a4a30' : '#B8741A'} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: dark ? '#5a4a30' : '#B09060', letterSpacing: '0.08em' }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;