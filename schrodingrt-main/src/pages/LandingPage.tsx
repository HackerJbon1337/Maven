import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  Activity, Globe, Github,
  ShieldAlert, Terminal, Anchor, CheckCircle,
} from 'lucide-react';

import CobeMavenGlobe from '../components/ui/CobeMavenGlobe';
import LiquidGlassCard from '../components/ui/LiquidGlassCard';
import CountUp from '../components/ui/CountUp';
import Dock, { DockIcon } from '../components/ui/Dock';
import KineticGrid from '../components/ui/KineticGrid';
import CardNav from '../components/ui/CardNav';
import ColourBlends from '../components/ui/ColourBlends';
import HugeRevealText from '../components/ui/HugeRevealText';
import BentoAccordion from '../components/ui/BentoAccordion';
import ClickSpark from '../components/ui/ClickSpark';
import Dither from '../components/ui/Dither';
import GradualBlur from '../components/ui/GradualBlur';
import Carousel from '../components/ui/Carousel';
import HorizontalScrollBento from '../components/ui/HorizontalScrollBento';
import ShipmentGlobe from '../components/ui/ShipmentGlobe';
import DepthGlobe from '../components/ui/DepthGlobe';

// ─────────────────────────────────────────────────────────────
// Dynamic Island Navbar — liquid glass pill, morphs on scroll
// ─────────────────────────────────────────────────────────────
function DynamicIslandNav({ onDash, onLogin, onPortal }: { onDash: () => void; onLogin: () => void; onPortal: () => void }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -80, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-[300] flex items-center"
      style={{
        top: scrolled ? '12px' : '16px',
        left: '50%',
        transition: 'top 0.4s ease, width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        width: scrolled ? 'min(360px, calc(100vw - 32px))' : 'min(980px, calc(100vw - 32px))',
      }}
    >
      {/* The glass pill */}
      <div
        className="w-full flex items-center justify-between gap-4 overflow-hidden"
        style={{
          padding: scrolled ? '10px 18px' : '12px 24px',
          borderRadius: '999px',
          background: 'rgba(8,8,8,0.72)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.3)',
          transition: 'padding 0.4s ease, border-radius 0.4s ease, background 0.4s ease',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,240,255,0.15)', border: '1px solid rgba(0,240,255,0.3)' }}
          >
            <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
          </div>
          <motion.span
            className="font-bold text-white text-sm tracking-widest"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            animate={{ opacity: scrolled ? 0 : 1, width: scrolled ? 0 : 'auto', marginRight: scrolled ? 0 : undefined }}
            transition={{ duration: 0.3 }}
          >
            {!scrolled && 'MAVEN 6.7'}
          </motion.span>
        </div>

        {/* Centre nav — hides when scrolled */}
        <AnimatePresence>
          {!scrolled && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden md:flex gap-5 lg:gap-7 text-xs tracking-[0.22em] text-gray-500 absolute left-1/2 -translate-x-1/2"
            >
              {['Platform', 'Telemetry', 'Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors duration-200">
                  {item}
                </a>
              ))}
              <button onClick={onPortal} className="hover:text-white transition-colors duration-200">Portal</button>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!scrolled && (
            <button onClick={onLogin} className="text-xs tracking-widest text-gray-500 hover:text-white transition-colors hidden md:block px-2">
              Login
            </button>
          )}
          <button
            onClick={onDash}
            className="text-xs tracking-[0.15em] font-bold uppercase px-5 py-2 rounded-full transition-all hover:scale-105"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: scrolled ? '#00f0ff' : 'rgba(255,255,255,0.92)',
              color: 'black',
              boxShadow: scrolled ? '0 0 20px rgba(0,240,255,0.4)' : 'none',
              transition: 'all 0.4s ease',
            }}
          >
            {scrolled ? '→ Dashboard' : 'Get Started'}
          </button>
        </div>

        {/* Top specular line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
        />
      </div>
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo marquee constants for hero bottom strip
// ─────────────────────────────────────────────────────────────
const MARQUEE_LOGOS = [
  { name: 'MAERSK',    icon: '⬡' },
  { name: 'COSCO',     icon: '◈' },
  { name: 'DHL',       icon: '◆' },
  { name: 'FEDEX',     icon: '▲' },
  { name: 'MSC',       icon: '⬢' },
  { name: 'CARGILL',   icon: '◉' },
  { name: 'EVERGREEN', icon: '⬟' },
  { name: 'HAPAG',     icon: '◈' },
  { name: 'UPS',       icon: '◆' },
  { name: 'KUEHNE',    icon: '⬡' },
];

// ─────────────────────────────────────────────────────────────
// Trench reveal
// ─────────────────────────────────────────────────────────────
function Trench({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Carousel items (mobile)
// ─────────────────────────────────────────────────────────────
const CAROUSEL_ITEMS = [
  { title: 'Predictive Risk Engine', subtitle: '// 00A', accent: '#00f0ff', content: <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-gray-400 text-sm leading-relaxed">Analyzes 4M+ historical parameters and live OSINT to detect geopolitical choke points 96 hours in advance.</p> },
  { title: 'Autonomous Rerouting',   subtitle: '// 00B', accent: '#10b981', content: <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-gray-400 text-sm leading-relaxed">Webhooks directly to your ERP in milliseconds — zero human intervention required.</p> },
  { title: 'Gemini 3.1 Intel Node', subtitle: '// 00C', accent: '#ffffff', content: <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-gray-400 text-sm leading-relaxed">Ask "Which vessels face delays this week?" in plain English and get instant structured answers.</p> },
];

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // ── Globe position: LERP spring-driven ──────────────────────
  // in hero    → centre (x=0)
  // section 2  → right (+35%)
  // section 3  → left (–35%)
  // section 4+ → right (+28%)
  const rawX  = useTransform(scrollY, [0, 400, 800, 1400, 2200], [0, 100, -200, 200, -200]);
  const rawYG = useTransform(scrollY, [0, 400, 800, 1400], [0, 60, 120, 180]);
  const rawSc = useTransform(scrollY, [0, 500, 1800], [1.1, 0.68, 0.52]);
  const rawOp = useTransform(scrollY, [0, 400, 1200, 3000], [1, 0.9, 0.4, 0.1]);

  const springCfg = { stiffness: 38, damping: 18, mass: 1.2 };
  const globeX  = useSpring(rawX,  springCfg);
  const globeYG = useSpring(rawYG, springCfg);
  const globeSc = useSpring(rawSc, springCfg);

  return (
    <ClickSpark sparkColor="rgba(255,255,255,0.7)" sparkCount={10} duration={600}>
      <div
        className="relative bg-[#020202] text-[#e0e0e0] selection:bg-white/10 overflow-x-hidden"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >

        {/* ── Kinetic interactive grid ───────────────────── */}
        <div className="fixed inset-0 z-[0] pointer-events-none">
          <KineticGrid
            backgroundColor="transparent"
            gridColor="#ffffff"
            dotColor="#ffffff"
            hoverColor="#10b981"
            gridSize={60}
            repulsionStrength={-0.65}
            radius={300}
            dotSize={2}
            gridThickness={0.8}
            baseOpacity={0.16}
          />
        </div>

        {/* ── Dither grid ──────────────────────────── */}
        <div className="fixed inset-0 z-[1] pointer-events-none">
          <Dither color="#ffffff" opacity={0.018} />
        </div>

        {/* ════════════════════════════════════════════════════
            GLOBE — fixed global 3D background, LERP springs
            Moves left / right between sections like butter.
            ════════════════════════════════════════════════════ */}
        <motion.div
          className="fixed z-[1] pointer-events-none"
          style={{
            width:      '110vmax',
            height:     '110vmax',
            top:        '50%',
            left:       '50%',
            marginTop:  '-55vmax',
            marginLeft: '-55vmax',
            x:          globeX,
            y:          globeYG,
            scale:      globeSc,
            opacity:    rawOp,
          }}
        >
          <CobeMavenGlobe />
        </motion.div>

        {/* Radial vignette — left-side stronger, right side open so globe is visible */}
        <div
          className="fixed inset-0 z-[2] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(2,2,2,0.92) 0%, rgba(2,2,2,0.6) 40%, transparent 65%), radial-gradient(ellipse 120% 120% at 75% 50%, transparent 40%, rgba(2,2,2,0.4) 75%, rgba(2,2,2,0.98) 100%)',
          }}
        />

        {/* Dynamic Island Navbar */}
        <DynamicIslandNav onDash={() => navigate('/dashboard')} onLogin={() => navigate('/login')} onPortal={() => navigate('/portal')} />

        {/* ════════════════════════════════════════════════════
            HERO — Framer-style left-aligned layout
            ════════════════════════════════════════════════════ */}
        <section className="relative z-[10] h-screen flex flex-col justify-between" style={{ paddingTop: '0' }}>

          {/* ── NEW badge — top right, inside hero ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute top-24 right-8 z-20 flex items-center gap-3"
          >
            <div className="flex items-center gap-2 text-[10px] tracking-[0.28em]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#555' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" style={{ boxShadow: '0 0 6px #10b981' }} />
              <span style={{ color: '#10b981' }}>NEW</span>
              <span className="text-[#333]">·</span>
              <span>V6.7 NOW LIVE</span>
            </div>
          </motion.div>

          {/* ── Main content wrapper — two columns ── */}
          <div className="flex-1 flex w-full max-w-7xl mx-auto px-6 lg:px-12 items-center">
            
            {/* Left Side — Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              {/* Status chip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-8 text-[10px] tracking-[0.36em] w-fit"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: '#10b981',
                  borderRadius: 999,
                  padding: '6px 16px',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" style={{ boxShadow: '0 0 6px #10b981' }} />
                GLOBAL TELEMETRY ENGINE V6.7
              </motion.div>

              {/* Headline — 2 lines max, font sized to fit like Framer reference */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="font-black tracking-tight"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(38px, 4.8vw, 72px)',
                    lineHeight: 0.92,
                    color: '#ffffff',
                    letterSpacing: '-0.03em',
                  }}
                >
                  A new way<br />to orchestrate.
                </motion.h1>
              </div>

              {/* Sub-headline — gray, 3 lines */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.72 }}
                className="mt-7 max-w-md leading-relaxed"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(14px, 1.2vw, 17px)',
                  color: '#666',
                }}
              >
                The global supply chain is your platform — every vessel, port,
                and route updated every 12ms. We handle the intelligence.
                All that's left for you is to command.
              </motion.p>

              {/* CTA buttons — pill shaped like the Framer reference */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.95 }}
                className="flex flex-wrap gap-3 mt-9 z-20"
              >
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative overflow-hidden font-bold text-sm tracking-wide px-7 py-3 transition-all hover:opacity-90 active:scale-95"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: '#ffffff',
                    color: '#000',
                    borderRadius: 6,
                  }}
                >
                  <span className="absolute inset-0 bg-[#10b981]/15 -translate-x-full group-hover:translate-x-full transition-transform duration-600 skew-x-6" />
                  <span className="relative z-10">Activate System</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="font-bold text-sm tracking-wide px-7 py-3 transition-all hover:bg-white/5 active:scale-95"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: '#ccc',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Explore Platform
                </button>
              </motion.div>
            </div>

            {/* Right Side — DepthGlobe */}
            <div className="hidden md:flex w-full md:w-1/2 items-center justify-center relative" style={{ overflow: 'visible' }}>
              <div style={{ width: 420, height: 420, overflow: 'visible', position: 'relative' }}>
                <DepthGlobe width="420px" height="420px" />
              </div>
            </div>

          </div>

          {/* ── Logo marquee strip at bottom of hero ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.0 }}
            className="relative z-20 border-t overflow-hidden py-5"
            style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(2,2,2,0.6)', backdropFilter: 'blur(12px)' }}
          >
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(2,2,2,0.95), transparent)' }} />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(2,2,2,0.95), transparent)' }} />

            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
              className="flex gap-12 items-center whitespace-nowrap"
              style={{ width: 'max-content' }}
            >
              {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-[11px] tracking-[0.28em] font-semibold select-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#3a3a3a' }}
                >
                  <span style={{ fontSize: '0.9rem', color: '#333' }}>{logo.icon}</span>
                  {logo.name}
                </div>
              ))}
            </motion.div>
          </motion.div>

        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 2 — ARCHITECTURE (globe moves RIGHT)
            ════════════════════════════════════════════════════ */}
        <section
          id="platform"
          className="relative z-[10] border-t"
          style={{ background: 'rgba(4,4,4,0.55)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <HugeRevealText text="PREDICTIVE ROUTING">
            <div className="flex flex-col md:flex-row gap-20 py-40 items-center max-w-7xl mx-auto px-6">
              <div className="flex-1 md:max-w-lg">
                <Trench><p className="text-[10px] tracking-[0.45em] mb-5" style={{ color: '#10b981', fontFamily: "'Outfit', sans-serif" }}>// MAVEN ARCHITECTURE / CORE.01</p></Trench>
                <Trench delay={0.07}>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[0.9]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Scalable Supply<br />Intelligence.
                  </h2>
                </Trench>
                <Trench delay={0.13}>
                  <p className="text-gray-500 leading-relaxed text-base mb-10">
                    Instead of reacting to global delays, MAVEN 6.7 synchronizes with satellite weather overlays and open-source intelligence — calculating millions of probability matrices every 12ms to keep your fleet moving.
                  </p>
                </Trench>
                <Trench delay={0.19}>
                  <div className="flex flex-wrap gap-2">
                    {['Real-time AI', 'OSINT Feeds', 'Gemini 3.1', 'Global Scale'].map(tag => (
                      <span key={tag} className="text-[10px] tracking-[0.22em] px-4 py-1.5 rounded-full border border-white/6 text-gray-600 hover:border-white/15 hover:text-gray-300 transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Trench>
              </div>

              {/* Liquid glass stats panel */}
              <GradualBlur delay={0.2} className="flex-1 w-full">
                <LiquidGlassCard glowColor="#10b981" className="p-10 bg-black/20">
                  <div className="space-y-8">
                    {[
                      { label: 'EXECUTION LATENCY', value: '<12ms', color: '#10b981' },
                      { label: 'SYSTEM COHERENCE',  value: '99.9%', color: '#fff' },
                      { label: 'ANOMALIES STOPPED', value: '93+',   color: '#ef4444' },
                      { label: 'ASSETS TRACKED',    value: '18,504',color: '#a855f7' },
                    ].map(s => (
                      <div key={s.label}>
                        <p className="text-gray-700 text-[10px] tracking-[0.35em] mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{s.label}</p>
                        <p className="text-4xl font-black" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </LiquidGlassCard>
              </GradualBlur>
            </div>
          </HugeRevealText>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 3 — HORIZONTAL SCROLL BENTO (globe LEFT)
            GSAP ScrollTrigger — cards slide horizontally on scroll
            ════════════════════════════════════════════════════ */}
        <div id="telemetry" className="relative z-[10]">
          <HorizontalScrollBento />
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 3B — SEQUENCE ACCORDION
            ════════════════════════════════════════════════════ */}
        <section
          className="relative z-[10] border-t py-28"
          style={{ background: 'rgba(2,2,2,0.65)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <GradualBlur className="mb-12 text-center">
              <p className="text-[10px] tracking-[0.4em] text-gray-700 mb-3">// OPERATIONAL SEQUENCE</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>How MAVEN Thinks.</h2>
            </GradualBlur>
            <BentoAccordion />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 4 — CORE PILLARS (globe RIGHT)
            ════════════════════════════════════════════════════ */}
        <section
          className="relative z-[10] border-t py-36"
          style={{ background: 'rgba(4,4,4,0.58)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <GradualBlur className="mb-16 text-center">
              <p className="text-[10px] tracking-[0.4em] text-gray-700 mb-4">// CORE SERVICES</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Three Pillars.</h2>
            </GradualBlur>

            <div className="hidden md:grid grid-cols-3 gap-5">
              {[
                { icon: <ShieldAlert className="w-7 h-7" />, accent: '#ef4444', tag: 'RISK',    title: 'Dynamic Risk Avoidance',   items: ['Geopolitical choke-point detection', 'Hurricane weather rerouting', 'Predictive piracy alerts'] },
                { icon: <Terminal    className="w-7 h-7" />, accent: '#00f0ff', tag: 'AI',      title: 'Gemini 3.1 Synthesis',     items: ['Natural language DB querying', 'Continuous context window sync', 'Autonomous multi-agent verification'] },
                { icon: <Anchor      className="w-7 h-7" />, accent: '#10b981', tag: 'FINANCE', title: 'Automated Freight Pricing', items: ['Live API rail & sea integrations', 'Real-time crude oil calculations', 'Port congestion predictions'] },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 36, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.09 }}
                >
                  <LiquidGlassCard glowColor={p.accent} className="p-8 bg-black/20 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div style={{ color: p.accent }}>{p.icon}</div>
                      <span className="text-[9px] tracking-[0.3em] px-3 py-1 rounded-full" style={{ background: p.accent + '12', color: p.accent, border: `1px solid ${p.accent}30` }}>{p.tag}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-5 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.title}</h3>
                    <ul className="space-y-3 flex-1">
                      {p.items.map((item, j) => (
                        <li key={j} className="flex gap-3 items-start text-gray-500 text-sm">
                          <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: p.accent }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </LiquidGlassCard>
                </motion.div>
              ))}
            </div>

            <div className="md:hidden">
              <Carousel items={CAROUSEL_ITEMS} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 5 — TESTIMONIALS
            ════════════════════════════════════════════════════ */}
        <section
          className="relative z-[10] border-t"
          style={{ background: 'rgba(2,2,2,0.68)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <HugeRevealText text="CONSENSUS LOGS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-24 pb-40 max-w-7xl mx-auto px-6">
              {[
                { accent: '#fff',     quote: '"MAVEN 6.7 predicted the Suez bottleneck 4 days before it happened. We rerouted and saved $1.2M."', name: 'Marcus R.', role: 'VP Ops, Global Logistics Solutions' },
                { accent: '#10b981', quote: '"We phased out 4 legacy platforms the day we booted MAVEN. The Gemini node answers routing queries instantly."', name: 'Sarah L.', role: 'CTO, Pan-Atlantic Freighters' },
              ].map((t, i) => (
                <GradualBlur key={i} delay={i * 0.1}>
                  <LiquidGlassCard glowColor={t.accent} className={`p-8 flex flex-col justify-between h-full ${i === 1 ? 'bg-[#10b981]/4' : 'bg-black/20'}`}>
                    <div className="flex gap-1 text-[#10b981] mb-8">{[...Array(5)].map((_, si) => <StarIcon key={si} />)}</div>
                    <p className="text-lg font-medium leading-relaxed mb-10" style={{ color: i === 1 ? '#10b981' : '#c0c0c0' }}>{t.quote}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.accent + '10', border: `1px solid ${t.accent}22` }}>
                        <Activity size={15} style={{ color: t.accent === '#fff' ? '#888' : t.accent }} />
                      </div>
                      <div>
                        <p className="font-bold tracking-widest text-sm text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.name}</p>
                        <p className="text-xs tracking-wider text-gray-600">{t.role}</p>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </GradualBlur>
              ))}
            </div>
          </HugeRevealText>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 6 — PRICING
            ════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className="relative z-[10] border-t py-36"
          style={{ background: 'rgba(3,3,3,0.62)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <GradualBlur className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>RESOURCE ALLOCATION.</h2>
              <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">Select your operational tier.</p>
            </GradualBlur>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              {[
                { title: 'SINGLE VESSEL',       price: '$19',   sub: '/ cycle', desc: 'Track one high-value asset.', btn: 'Initialize Node',   color: '#444', popular: false },
                { title: 'FLEET COMMAND',       price: '$89',   sub: '/ cycle', desc: 'Track up to 500 vessels.',   btn: 'Deploy Cluster',    color: '#10b981', popular: true },
                { title: 'GLOBAL ENTERPRISE',   price: 'CUSTOM',sub: '',        desc: 'Custom neural AI modeling.', btn: 'Contact Command',   color: '#444', popular: false },
              ].map((tier, i) => (
                <motion.div key={i} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.09 }} className={tier.popular ? 'md:-translate-y-5' : ''}>
                  <LiquidGlassCard glowColor={tier.color} className={`p-9 flex flex-col items-center text-center ${tier.popular ? 'bg-[#10b981]/6' : 'bg-black/20'}`}>
                    {tier.popular && <div className="bg-[#10b981] text-black text-[9px] font-bold tracking-[0.3em] px-4 py-1 rounded-full mb-6 uppercase">Most Popular</div>}
                    <h3 className="font-bold tracking-widest mb-2 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: tier.popular ? '#10b981' : 'white' }}>{tier.title}</h3>
                    <p className="text-gray-600 text-xs mb-8 h-8">{tier.desc}</p>
                    <p className="text-5xl font-black mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{tier.price}</p>
                    <p className="text-gray-700 text-xs tracking-widest mb-10 uppercase">{tier.sub || '\u00a0'}</p>
                    <button
                      className="w-full py-4 rounded-xl font-bold text-xs tracking-[0.15em] uppercase transition-all hover:scale-[1.02]"
                      style={tier.popular ? { background: '#10b981', color: 'black', fontFamily: "'Space Grotesk', sans-serif", boxShadow: '0 0 20px rgba(16,185,129,0.2)' } : tier.price === 'CUSTOM' ? { background: 'white', color: 'black', fontFamily: "'Space Grotesk', sans-serif" } : { border: '1px solid rgba(255,255,255,0.08)', color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {tier.btn}
                    </button>
                  </LiquidGlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            FOOTER
            ════════════════════════════════════════════════════ */}
        <footer className="relative z-[10] border-t pt-32 pb-10 overflow-hidden" style={{ background: 'rgba(2,2,2,0.98)', borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-28">
            <div className="md:col-span-6">
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Initialize Intel Updates</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">Get real-time intelligence on shipping anomalies, MAVEN updates, and routing data.</p>
              <div className="flex bg-[#0a0a0a] border border-white/5 p-1 rounded-xl">
                <input type="email" placeholder="ENTER COMM-LINK EMAIL" className="bg-transparent border-none text-white px-4 text-xs tracking-widest flex-1 focus:outline-none" />
                <button className="bg-white text-black px-5 py-2.5 text-[10px] tracking-widest font-bold uppercase rounded-lg hover:bg-[#10b981] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Establish Link
                </button>
              </div>
            </div>
            {[{ title: 'PLATFORM', links: ['Architecture', 'Simulation', 'Pricing'] }, { title: 'DEVELOPERS', links: ['API Docs', 'GitHub', 'Status'] }].map((col, i) => (
              <div key={i} className={`md:col-span-2 ${i === 0 ? 'md:col-start-9' : ''} flex flex-col gap-3 text-sm text-gray-600`}>
                <span className="text-white font-bold mb-1 tracking-widest text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{col.title}</span>
                {col.links.map(l => <a key={l} href="#" className="hover:text-white transition-colors tracking-wide">{l}</a>)}
              </div>
            ))}
          </div>

          <div className="w-full text-center select-none pointer-events-none overflow-hidden mb-8">
            <h1 className="font-black tracking-tighter leading-none" style={{ fontSize: 'clamp(52px, 12vw, 160px)', fontFamily: "'Space Grotesk', sans-serif", color: '#0c0c0c' }}>
              MAVEN 6.7
            </h1>
          </div>

          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] text-[#1e1e1e] border-t border-white/3 pt-6">
            <span>© 2026 MAVEN SUPPLY CHAIN ENGINE.</span>
            <span>POWERED BY GEMINI 3.1 PRO NEURAL ENGINE</span>
          </div>
        </footer>

        {/* Dock */}
        <Dock>
          <DockIcon icon={<Globe size={20} />} label="Home"      isActive={true} />
          <DockIcon icon={<Activity size={20} />} label="Dashboard" onClick={() => navigate('/dashboard')} />
          <DockIcon icon={<Github size={20} />}   label="Source"    onClick={() => window.open('https://github.com/jeswanthd')} />
        </Dock>

      </div>
    </ClickSpark>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
