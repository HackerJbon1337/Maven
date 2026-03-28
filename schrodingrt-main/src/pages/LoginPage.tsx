import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import CobeMavenGlobe from '../components/ui/CobeMavenGlobe';
import Dither from '../components/ui/Dither';
import KineticGrid from '../components/ui/KineticGrid';

// ── Liquid glass input ────────────────────────────────────────────
function GlassInput({
  label, type = 'text', value, onChange, placeholder, suffix
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        className="text-[10px] tracking-[0.32em] uppercase"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: focused ? '#00f0ff' : '#444', transition: 'color 0.2s' }}
      >
        {label}
      </label>
      <div
        className="relative flex items-center"
        style={{
          background: focused ? 'rgba(0,240,255,0.04)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${focused ? 'rgba(0,240,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 12,
          transition: 'all 0.25s ease',
          boxShadow: focused ? '0 0 20px rgba(0,240,255,0.08)' : 'none',
        }}
      >
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none text-white placeholder-[#2a2a2a] text-sm px-4 py-3.5 focus:outline-none"
          style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '0.06em' }}
        />
        {suffix && <div className="pr-4">{suffix}</div>}
      </div>
    </div>
  );
}

// ── Google SSO btn ───────────────────────────────────────────────
function GoogleBtn() {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl transition-all"
      style={{
        background: hover ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hover ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)'}`,
        fontFamily: "'Outfit', sans-serif",
        fontSize: '0.8rem',
        color: '#888',
        letterSpacing: '0.08em',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Google logo */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22.54 12.22c0-.71-.07-1.40-.18-2.06H12v3.90h5.92c-.26 1.40-1.03 2.58-2.19 3.37v2.80h3.55c2.08-1.92 3.26-4.74 3.26-8.01z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-0.98 7.28-2.66l-3.55-2.76c-.98.66-2.23 1.06-3.73 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      CONTINUE WITH GOOGLE
    </button>
  );
}

// ── Animated status chars ────────────────────────────────────────
const STATUS_CHARS = ['▓▓▓░░', '▓▓▓▓░', '▓▓▓▓▓'];

export default function LoginPage() {
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [statusI,  setStatusI]  = useState(0);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loading) {
      spinRef.current = setInterval(() => setStatusI(i => (i + 1) % STATUS_CHARS.length), 220);
    } else {
      if (spinRef.current) clearInterval(spinRef.current);
    }
    return () => { if (spinRef.current) clearInterval(spinRef.current); };
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('ALL FIELDS REQUIRED'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    if (email === 'admin@maven.ai' && password === 'maven6.7') {
      navigate('/dashboard');
    } else {
      setError('AUTH FAILED — INVALID CREDENTIALS');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#020202] flex items-center justify-center overflow-hidden relative"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Kinetic interactive grid ───────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <KineticGrid
          backgroundColor="transparent"
          gridColor="#ffffff"
          dotColor="#ffffff"
          hoverColor="#00f0ff"
          gridSize={60}
          repulsionStrength={-0.65}
          radius={280}
          dotSize={2}
          gridThickness={0.8}
          baseOpacity={0.16}
        />
      </div>

      {/* ── Dither background ─────────────── */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <Dither color="#ffffff" opacity={0.022} />
      </div>

      {/* ── Globe — right side background ─ */}
      <div
        className="fixed z-[1] pointer-events-none"
        style={{
          width: '90vmax', height: '90vmax',
          top:  '50%', left: '65%',
          marginTop:  '-45vmax',
          marginLeft: '-45vmax',
          opacity: 0.35,
        }}
      >
        <CobeMavenGlobe />
      </div>

      {/* ── Radial vignette ───────────── */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 55% at 72% 50%, transparent 20%, rgba(2,2,2,0.7) 65%, rgba(2,2,2,0.97) 100%)',
        }}
      />

      {/* ── Top-left logo ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-6 left-8 z-[100] flex items-center gap-2.5 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(0,240,255,0.12)',
            border: '1px solid rgba(0,240,255,0.28)',
          }}
        >
          <Activity className="w-4 h-4 text-[#00f0ff]" />
        </div>
        <span
          className="font-bold text-white text-sm tracking-widest"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          MAVEN 6.7
        </span>
      </motion.div>

      {/* ── Portal link ──────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed top-6 right-8 z-[100] text-[10px] tracking-[0.28em] text-gray-700 hover:text-gray-400 transition-colors uppercase"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        onClick={() => navigate('/portal')}
      >
        ← Portal
      </motion.button>

      {/* ── Main login card ───────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-[10] w-full mx-4"
        style={{ maxWidth: 420 }}
      >
        {/* Card */}
        <div
          style={{
            background: 'rgba(8,8,8,0.70)',
            backdropFilter: 'blur(36px) saturate(160%)',
            WebkitBackdropFilter: 'blur(36px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '2.5rem 2.2rem',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 64px rgba(0,0,0,0.7), 0 0 80px rgba(0,240,255,0.04)',
          }}
        >
          {/* Top specular */}
          <div className="absolute top-0 left-10 right-10 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-5"
            >
              <span
                className="text-[9px] tracking-[0.4em] px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(0,240,255,0.08)',
                  border: '1px solid rgba(0,240,255,0.2)',
                  color: '#00f0ff',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                SECURE CHANNEL ESTABLISHED
              </span>
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Authorize Access
            </h1>
            <p className="text-gray-600 text-xs tracking-wide">
              Enter your operator credentials to access the MAVEN 6.7 intelligence engine.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <GlassInput
              label="Operator Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@domain.com"
            />
            <GlassInput
              label="Passphrase"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder="••••••••••••"
              suffix={
                <button type="button" onClick={() => setShowPw(p => !p)} className="text-gray-700 hover:text-gray-400 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Forgot */}
            <div className="text-right -mt-1">
              <button type="button" className="text-[10px] text-gray-700 hover:text-[#00f0ff] transition-colors tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Reset Passphrase
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertCircle size={13} className="text-red-500 shrink-0" />
                  <span className="text-red-500 text-[10px] tracking-[0.2em] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="relative w-full py-4 rounded-xl font-bold text-xs tracking-[0.18em] uppercase overflow-hidden flex items-center justify-center gap-3 transition-all"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: loading ? 'rgba(16,185,129,0.6)' : '#10b981',
                color: 'black',
                boxShadow: '0 0 30px rgba(16,185,129,0.25)',
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {/* Shimmer */}
              <motion.span
                className="absolute inset-0 bg-white/10 -translate-x-full skew-x-12"
                animate={loading ? {} : { translateX: ['−100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', repeatDelay: 1.2 }}
              />
              {loading ? (
                <>
                  <span className="font-mono text-sm">{STATUS_CHARS[statusI]}</span>
                  <span>INITIALIZING...</span>
                </>
              ) : (
                <>
                  <span>Authorize</span>
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-[9px] tracking-[0.3em] text-gray-700 px-1">OR CONTINUE WITH</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>

          <GoogleBtn />

          {/* Footer link */}
          <p className="text-center mt-6 text-[10px] tracking-widest text-gray-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
            NO ACCOUNT?{' '}
            <button className="text-[#00f0ff] hover:underline transition-all" onClick={() => alert('Contact your operator admin.')}>
              REQUEST ACCESS
            </button>
          </p>
        </div>

        {/* Below card hint */}
        <p className="text-center mt-5 text-[9px] tracking-[0.3em] text-[#1c1c1c]" style={{ fontFamily: "'Outfit', sans-serif" }}>
          ENCRYPTED · TLS 1.3 · ZERO-KNOWLEDGE SESSION
        </p>
      </motion.div>
    </div>
  );
}
