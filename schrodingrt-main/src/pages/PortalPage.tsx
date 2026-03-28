import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── CRT scanline overlay CSS ──────────────────────────────────────
const crtStyle = `
  @keyframes scanroll {
    0%   { background-position: 0 0; }
    100% { background-position: 0 100vh; }
  }
  .crt-overlay {
    position:fixed;inset:0;pointer-events:none;z-index:9999;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(0,0,0,0.18) 3px,
      rgba(0,0,0,0.18) 4px
    );
    animation: scanroll 8s linear infinite;
  }
  .crt-flicker {
    animation: flicker 0.15s infinite alternate;
  }
  @keyframes flicker {
    0%   { opacity: 1; }
    100% { opacity: 0.97; }
  }
  .bracket-btn {
    font-family: 'VT323', monospace;
    font-size: 1.05rem;
    letter-spacing: 0.12em;
    color: #C1FF72;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    transition: all 0.15s;
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .bracket-btn:hover {
    background: #C1FF72;
    color: #000;
    padding-left: 8px;
  }
  .bracket-btn.locked {
    color: #3a5c20;
    cursor: not-allowed;
  }
  .crt-box {
    border: 1px solid #C1FF72;
    background: rgba(0,12,0,0.55);
  }
  .crt-dashed {
    border: 1px dashed #3a5c20;
    background: rgba(0,8,0,0.4);
  }
  .pixel-text {
    font-family: 'VT323', monospace;
    color: #C1FF72;
  }
  .pixel-dim {
    font-family: 'VT323', monospace;
    color: #3a7a1a;
  }
`;

// ── ASCII boot lines ──────────────────────────────────────────────
const BOOT_LINES = [
  'MAVEN.EXE — v6.7.0 BUILD 1337',
  'INITIALIZING NEURAL CORE...',
  'LOADING GEMINI 3.1 INFERENCE ENGINE.......... [OK]',
  'CONNECTING TO 140+ GLOBAL TRACKING NODES.... [OK]',
  'ACTIVATING PREDICTIVE RISK MATRIX........... [OK]',
  'MOUNTING FREIGHT FORECAST MODULE............ [OK]',
  'SYSTEM READY.',
  '─────────────────────────────────────────────',
];

// ── ASCII Globe art ──────────────────────────────────────────────
const GLOBE_ART = `
  ···········00001·01001·00010···········
  ·····001100·010·10110·01010·100011·····
  ···010·10110010·11001·01011·10001·01···
  ··01001010·01001110·10110·01011·10110··
  ·1001·01001·01010·11001·010·01110·10··
  ·101·01·10110·01001·10110·01001·101···
  ··100101·10011·01001·10110·10010·011··
  ·····01011·01001·01001·01010·10100·····
  ···········01010·10110·10001···········
`;

// ── Mini preview card ────────────────────────────────────────────
function MiniPreview({ title, badge, lines, onClick, locked = false }:
  { title: string; badge: string; lines: string[]; onClick?: () => void; locked?: boolean }) {
  return (
    <div
      className="crt-dashed p-3 flex flex-col gap-2 cursor-pointer group"
      onClick={!locked ? onClick : undefined}
      style={{ minHeight: 160 }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="pixel-text" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>{title}</span>
        <span className="pixel-text" style={{
          fontSize: '0.6rem', letterSpacing: '0.06em',
          background: locked ? '#1a2a0a' : '#C1FF72',
          color: locked ? '#3a5c20' : '#000',
          padding: '1px 6px',
        }}>{badge}</span>
      </div>
      <div className="flex-1 overflow-hidden" style={{ fontSize: '0.52rem', lineHeight: 1.4 }}>
        {lines.map((l, i) => (
          <div key={i} className="pixel-dim truncate">{l}</div>
        ))}
      </div>
      {!locked ? (
        <div className="pixel-dim group-hover:text-[#C1FF72] transition-colors" style={{ fontSize: '0.6rem', letterSpacing: '0.04em' }}>
          [ CLICK TO OPEN ]
        </div>
      ) : (
        <div className="pixel-dim" style={{ fontSize: '0.6rem', letterSpacing: '0.04em' }}>
          [ COMING SOON ]
        </div>
      )}
    </div>
  );
}

// ── Main Portal Page ─────────────────────────────────────────────
export default function PortalPage() {
  const navigate = useNavigate();
  const [bootLines, setBootLines]   = useState<string[]>([]);
  const [bootDone, setBootDone]     = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [time, setTime]             = useState(() => new Date().toLocaleTimeString());
  const termRef                     = useRef<HTMLDivElement>(null);

  // Boot typing effect
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines(p => [...p, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setBootDone(true), 400);
      }
    }, 220);
    return () => clearInterval(iv);
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const NAV_ITEMS = [
    { label: 'GET STARTED',        route: '/',           locked: false },
    { label: 'LOGIN',              route: '/login',       locked: false },
    { label: 'MAIN DASHBOARD',     route: '/dashboard',  locked: false },
    { label: 'FUTURE SIMULATOR',   route: '/simulator',  locked: true  },
    { label: '─────────────────', route: null,           locked: true  },
    { label: 'ABOUT MAVEN',        route: '/',           locked: false },
    { label: 'API DOCUMENTATION',  route: '/',           locked: false },
    { label: 'SYSTEM STATUS',      route: '/',           locked: false },
  ];

  return (
    <div
      className="min-h-screen bg-black crt-flicker overflow-x-hidden"
      style={{ fontFamily: "'VT323', monospace" }}
    >
      {/* Inject CRT CSS */}
      <style>{crtStyle}</style>
      {/* CRT scanline overlay */}
      <div className="crt-overlay" />

      {/* Boot sequence */}
      <AnimatePresence>
        {!bootDone && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col items-start justify-center px-12"
          >
            <p className="pixel-dim text-sm mb-6 tracking-widest">MAVEN GLOBAL SUPPLY CHAIN ENGINE v6.7</p>
            {bootLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="pixel-text text-sm tracking-wider"
              >
                {line}
              </motion.p>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="pixel-text text-lg mt-1"
            >█</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main portal content */}
      <AnimatePresence>
        {bootDone && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-start min-h-screen py-8 px-4"
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            {/* ── Header box ────────────────────── */}
            <div className="w-full crt-box p-6 mb-3 text-center relative">
              <p className="absolute top-3 left-4 pixel-dim" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                MAVEN.EXE v6.7
              </p>
              <p className="absolute top-3 right-4 pixel-dim" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                {time}
              </p>
              <h1 className="pixel-text leading-none" style={{ fontSize: 'clamp(2.4rem, 7vw, 4.5rem)', letterSpacing: '0.04em' }}>
                MAVEN 6.7
              </h1>
              <h2 className="pixel-text mt-1" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)', letterSpacing: '0.12em' }}>
                GLOBAL SUPPLY CHAIN ENGINE
              </h2>
            </div>

            {/* ── Marquee divider ───────────────── */}
            <div className="w-full overflow-hidden mb-3" style={{ borderTop: '1px dashed #3a5c20', borderBottom: '1px dashed #3a5c20', padding: '4px 0' }}>
              <motion.p
                animate={{ x: [0, -800] }}
                transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                className="pixel-dim whitespace-nowrap"
                style={{ fontSize: '0.75rem', letterSpacing: '0.06em' }}
              >
                {'<-== MAVEN GLOBAL SUPPLY ENGINE ==->'}&nbsp;&nbsp;&nbsp;&nbsp;
                TRACKING 18,504 ASSETS IN REAL-TIME &nbsp;&nbsp;&nbsp;&nbsp;
                {'<12ms LATENCY'} &nbsp;&nbsp;&nbsp;&nbsp;
                GEMINI 3.1 AI INTEL NODE ACTIVE &nbsp;&nbsp;&nbsp;&nbsp;
                DYNAMIC RISK AVOIDANCE: ENABLED &nbsp;&nbsp;&nbsp;&nbsp;
                {'<-== MAVEN GLOBAL SUPPLY ENGINE ==->'}&nbsp;&nbsp;&nbsp;&nbsp;
              </motion.p>
            </div>

            {/* ── Main grid: menu + previews ───── */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">

              {/* LEFT: menu */}
              <div className="md:col-span-4 crt-box p-4">
                <p className="pixel-dim mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>MENU SCREEN:</p>
                <div className="flex flex-col gap-0.5">
                  {NAV_ITEMS.map((item, i) => {
                    if (item.label.startsWith('──')) {
                      return <div key={i} className="pixel-dim py-1" style={{ fontSize: '0.55rem' }}>{item.label}</div>;
                    }
                    return (
                      <button
                        key={i}
                        className={`bracket-btn ${item.locked ? 'locked' : ''}`}
                        onClick={() => !item.locked && item.route && navigate(item.route)}
                        onMouseEnter={() => !item.locked && setActiveMenu(item.label)}
                        onMouseLeave={() => setActiveMenu(null)}
                        disabled={item.locked}
                      >
                        <span>[</span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        <span>]</span>
                        {item.locked && <span style={{ fontSize: '0.6rem' }}>⌛</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3" style={{ borderTop: '1px dashed #1e3a0e' }}>
                  <p className="pixel-dim" style={{ fontSize: '0.6rem', letterSpacing: '0.04em' }}>
                    {activeMenu ? `SELECTED: ${activeMenu}` : 'AWAITING INPUT...'}
                  </p>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="pixel-text"
                  >█</motion.span>
                </div>
              </div>

              {/* RIGHT: Globe + Previews */}
              <div className="md:col-span-8 flex flex-col gap-3">
                {/* ASCII Globe */}
                <div className="crt-box p-4 text-center">
                  <div className="flex justify-between items-center mb-2">
                    <span className="pixel-dim" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>GLOBAL ASSET MAP — LIVE</span>
                    <span className="pixel-text" style={{ fontSize: '0.65rem', background: '#C1FF72', color: '#000', padding: '1px 8px', letterSpacing: '0.05em' }}>ONLINE</span>
                  </div>
                  <pre
                    className="pixel-text overflow-hidden text-center"
                    style={{ fontSize: 'clamp(0.55rem, 1.2vw, 0.78rem)', lineHeight: 1.5, letterSpacing: '0.08em' }}
                  >
{`        ···○○○○○○○○○○○○○○○○○○○○○○○○○○···
      ·○○○○○ · · · · · 0 · · · · · ○○○○○·
    ·○○○○·0·1·0·1·1·0·0·1·0·1·0·1·0·○○○○·
   ·○○○○·0·1·0·0·0·1·0·1·1·0·0·1·0·1·○○○·
   ·○○○·0·1·0·1·0·0·1·0·1·0·1·0·0·1·0·○○·
   ·○○○·1·0·1·0·MAVEN·AI·0·1·0·1·0·1·○○·
   ·○○○·0·1·0·0·0·1·0·1·1·0·0·1·0·1·0·○○·
    ·○○○○·0·1·0·1·0·0·1·0·1·0·1·○○○○·
      ·○○○○○ · · · 0 · · · · · ○○○○○·
        ···○○○○○○○○○○○○○○○○○○○○○○○○○○···`}
                  </pre>
                  <p className="pixel-dim mt-2" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>
                    18,504 ASSETS · 140+ NATIONS · 12ms REFRESH
                  </p>
                </div>

                {/* Mini page previews row */}
                <div className="grid grid-cols-2 gap-3">
                  <MiniPreview
                    title="— GET STARTED ────────"
                    badge="ACTIVE"
                    onClick={() => navigate('/')}
                    lines={[
                      '> HERO: MAVEN 6.7 TITLE',
                      '> GLOBE: MONOCHROMATIC 3D',
                      '> SECTION: ARCHITECTURE',
                      '> SECTION: TELEMETRY BENTO',
                      '> SECTION: CORE PILLARS',
                      '> FOOTER: INITIALIZED',
                    ]}
                  />
                  <MiniPreview
                    title="— DASHBOARD ─────────────"
                    badge="ACTIVE"
                    onClick={() => navigate('/dashboard')}
                    lines={[
                      '> AI ORCHESTRATOR V2',
                      '> LIVE ASSET MAP: LEAFLET',
                      '> RISK FEED: 93 ANOMALIES',
                      '> GEMINI CHAT: ENABLED',
                      '> FREIGHT CALCULATOR',
                      '> FINANCIAL GRAPHS: LIVE',
                    ]}
                  />
                  <MiniPreview
                    title="— LOGIN ────────────────"
                    badge="ACTIVE"
                    onClick={() => navigate('/login')}
                    lines={[
                      '> LIQUID GLASS AUTH CARD',
                      '> MAVEN GLOBE BACKGROUND',
                      '> EMAIL + PASSWORD INPUT',
                      '> GOOGLE SSO ENABLED',
                      '> ANIMATED SUBMIT BTN',
                    ]}
                  />
                  <MiniPreview
                    title="— FUTURE SIMULATOR ───────"
                    badge="SOON"
                    locked
                    lines={[
                      '> ROUTE SIM ENGINE v1',
                      '> NEURAL FORECAST MODEL',
                      '> SCENARIO BUILDER',
                      '> RISK PROBABILITY MAP',
                      '> [UNDER CONSTRUCTION]',
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* ── Bottom divider ───────────── */}
            <div className="w-full text-center py-2" style={{ borderTop: '1px dashed #1e3a0e' }}>
              <p className="pixel-dim" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                {'<-== MADE TO EXCEED EXPECTATIONS ==->'} &nbsp;|&nbsp; © 2026 MAVEN SUPPLY CHAIN ENGINE
              </p>
              <p className="pixel-dim mt-1" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>
                POWERED BY GEMINI 3.1 PRO · ALL SYSTEMS OPERATIONAL
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
