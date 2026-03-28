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
import FramerGlobe from '../components/ui/FramerGlobe';
import ScrollRevealText from '../components/ui/ScrollRevealText';

// Font tokens
const SERIF = "'Instrument Serif', serif";
const SANS  = "'Plus Jakarta Sans', sans-serif";

// ─────────────────────────────────────────────────────────────
// Frosted-glass pill Navbar — centred, floats above content
// ─────────────────────────────────────────────────────────────
function FrostedNav({ onDash, onLogin, onPortal }: { onDash: () => void; onLogin: () => void; onPortal: () => void }) {
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
      className="fixed z-[300]"
      style={{
        top: '18px',
        left: '50%',
        width: 'min(900px, calc(100vw - 40px))',
      }}
    >
      {/* Frosted glass pill */}
      <div
        className="w-full flex items-center justify-between gap-4"
        style={{
          padding: '10px 20px',
          borderRadius: '999px',
          background: 'rgba(10,10,10,0.55)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 2px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Brand — banner only, no icon or text */}
        <div className="flex items-center shrink-0 h-7 overflow-hidden">
          <img
            src="/banner.png"
            alt="MAVEN"
            style={{ height: '100%', width: 'auto', objectFit: 'contain', maxWidth: '120px' }}
          />
        </div>

        {/* Centre nav */}
        <nav
          className="hidden md:flex gap-6 text-[11px] tracking-[0.18em] text-[#999]"
          style={{ fontFamily: SANS, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        >
          {['Platform', 'Telemetry', 'Pricing'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <button onClick={onPortal} className="hover:text-white transition-colors duration-200">Portal</button>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onLogin}
            className="hidden md:block text-[11px] tracking-widest text-[#aaa] hover:text-white transition-colors px-2"
            style={{ fontFamily: SANS }}
          >
            Login
          </button>
          <button
            onClick={onDash}
            className="text-[11px] tracking-[0.12em] font-semibold px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: SANS,
              background: scrolled ? '#10b981' : 'rgba(255,255,255,0.92)',
              color: 'black',
              boxShadow: scrolled ? '0 0 18px rgba(16,185,129,0.35)' : 'none',
              transition: 'all 0.4s ease',
            }}
          >
            {scrolled ? '→ Dashboard' : 'Get Started'}
          </button>
        </div>

        {/* Top specular line */}
        <div
          className="absolute top-0 left-6 right-6 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
        />
      </div>
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo marquee constants
// ─────────────────────────────────────────────────────────────
const MARQUEE_LOGOS = [
  { name: 'MAERSK', icon: '⬡' },
  { name: 'COSCO', icon: '◈' },
  { name: 'DHL', icon: '◆' },
  { name: 'FEDEX', icon: '▲' },
  { name: 'MSC', icon: '⬢' },
  { name: 'CARGILL', icon: '◉' },
  { name: 'EVERGREEN', icon: '⬟' },
  { name: 'HAPAG', icon: '◈' },
  { name: 'UPS', icon: '◆' },
  { name: 'KUEHNE', icon: '⬡' },
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
  { title: 'Predictive Risk Engine', subtitle: '// 00A', accent: '#00f0ff', content: <p style={{ fontFamily: SANS }} className="text-[#bbb] text-sm leading-relaxed">Analyzes 4M+ historical parameters and live OSINT to detect geopolitical choke points 96 hours in advance.</p> },
  { title: 'Autonomous Rerouting', subtitle: '// 00B', accent: '#10b981', content: <p style={{ fontFamily: SANS }} className="text-[#bbb] text-sm leading-relaxed">Webhooks directly to your ERP in milliseconds — zero human intervention required.</p> },
  { title: 'Gemini 3.1 Intel Node', subtitle: '// 00C', accent: '#ffffff', content: <p style={{ fontFamily: SANS }} className="text-[#bbb] text-sm leading-relaxed">Ask "Which vessels face delays this week?" in plain English and get instant structured answers.</p> },
];

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  const rawX  = useTransform(scrollY, [0, 400, 800, 1400, 2200], [0, 100, -200, 200, -200]);
  const rawYG = useTransform(scrollY, [0, 400, 800, 1400], [0, 60, 120, 180]);
  const rawSc = useTransform(scrollY, [0, 500, 1800], [1.1, 0.68, 0.52]);
  const rawOp = useTransform(scrollY, [0, 400, 1200, 3000], [1, 0.9, 0.4, 0.1]);

  const springCfg = { stiffness: 38, damping: 18, mass: 1.2 };
  const globeX  = useSpring(rawX, springCfg);
  const globeYG = useSpring(rawYG, springCfg);
  const globeSc = useSpring(rawSc, springCfg);

  return (
    <ClickSpark sparkColor="rgba(255,255,255,0.7)" sparkCount={10} duration={600}>
      <div
        className="relative bg-[#020202] text-[#e8e8e8] selection:bg-white/10 overflow-x-hidden"
        style={{ fontFamily: SANS }}
      >

        {/* Dither grid */}
        <div className="fixed inset-0 z-[1] pointer-events-none">
          <Dither color="#ffffff" opacity={0.018} />
        </div>

        {/* Fixed moving COBE globe (background) */}
        <motion.div
          className="fixed z-[1] pointer-events-none"
          style={{
            width: '110vmax',
            height: '110vmax',
            top: '50%',
            left: '50%',
            marginTop: '-55vmax',
            marginLeft: '-55vmax',
            x: globeX,
            y: globeYG,
            scale: globeSc,
            opacity: rawOp,
          }}
        >
          <CobeMavenGlobe />
        </motion.div>

        {/* Radial vignette */}
        <div
          className="fixed inset-0 z-[2] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(2,2,2,0.92) 0%, rgba(2,2,2,0.6) 40%, transparent 65%), radial-gradient(ellipse 120% 120% at 75% 50%, transparent 40%, rgba(2,2,2,0.4) 75%, rgba(2,2,2,0.98) 100%)',
          }}
        />

        {/* Frosted Navbar */}
        <FrostedNav onDash={() => navigate('/dashboard')} onLogin={() => navigate('/login')} onPortal={() => navigate('/portal')} />

        {/* ════════════════════════════════════════════════════
            HERO — full bleed, globe right, text left
            ════════════════════════════════════════════════════ */}
        <section className="relative z-[10] min-h-screen overflow-hidden flex items-center">

          {/* Framer Globe — shifted right, oversized to push its own text off-screen left */}
          <div
            className="absolute top-0 right-0 h-full z-0 overflow-hidden pointer-events-auto"
            style={{ width: '70vw' }}
          >
            <iframe
              src="https://aquamarine-interaction-645656.framer.app/"
              style={{
                width: '160vw',
                height: '140%',
                position: 'absolute',
                right: '-20vw',   /* push globe body into right corner */
                top: '-20%',
                border: 'none',
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 18%, black 40%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 18%, black 40%)',
              }}
              title="Interactive 3D Globe"
              allow="autoplay; fullscreen; pointer-lock"
            />
          </div>

          {/* Safety-net gradient mask — punches a dark pocket for the text */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: [
                /* strong left-side dark shield */
                'radial-gradient(ellipse 55% 90% at 22% 50%, rgba(2,2,2,0.98) 0%, rgba(2,2,2,0.85) 55%, rgba(2,2,2,0) 100%)',
                /* soft top fade */
                'linear-gradient(to bottom, rgba(2,2,2,0.5) 0%, transparent 20%, transparent 80%, rgba(2,2,2,0.6) 100%)',
              ].join(', '),
            }}
          />

          {/* Hero text — free-positioned, no max-w container */}
          <div className="relative z-[2] w-full px-8 md:px-16 lg:px-20 pt-32 pb-20 pointer-events-none">
            <div className="w-full md:w-[48%] lg:w-[42%] flex flex-col justify-center pointer-events-auto">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-8 text-[10px] tracking-[0.36em] w-fit"
                style={{
                  fontFamily: SANS,
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.22)',
                  color: '#10b981',
                  borderRadius: 999,
                  padding: '6px 16px',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" style={{ boxShadow: '0 0 6px #10b981' }} />
                GLOBAL TELEMETRY ENGINE V6.7
              </motion.div>

              {/* H1 */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(36px, 5.5vw, 76px)',
                    lineHeight: 1.05,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    fontWeight: 400,
                  }}
                >
                  A new way of<br />rerouting supply chains.
                </motion.h1>
              </div>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.72 }}
                className="mt-6 max-w-md leading-[1.75]"
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(14px, 1.3vw, 17px)',
                  color: '#d0d0d0',
                  fontWeight: 400,
                }}
              >
                The global supply chain is your platform — every vessel, port,
                and route updated every 12ms. We handle the intelligence.
                All that's left for you is to command.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.95 }}
                className="flex flex-wrap gap-3 mt-9"
              >
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative overflow-hidden font-semibold text-sm tracking-wide px-7 py-3.5 transition-all hover:opacity-90 active:scale-95"
                  style={{
                    fontFamily: SANS,
                    background: '#ffffff',
                    color: '#000',
                    borderRadius: 8,
                  }}
                >
                  <span className="absolute inset-0 bg-[#10b981]/15 -translate-x-full group-hover:translate-x-full transition-transform duration-600 skew-x-6" />
                  <span className="relative z-10">Activate System</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="font-semibold text-sm tracking-wide px-7 py-3.5 transition-all hover:bg-white/5 active:scale-95"
                  style={{
                    fontFamily: SANS,
                    color: '#e0e0e0',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                >
                  Explore Platform
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 2 — ARCHITECTURE
            ════════════════════════════════════════════════════ */}
        <section
          id="platform"
          className="relative z-[10] border-t"
          style={{ background: 'rgba(4,4,4,0.55)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <HugeRevealText text="PREDICTIVE ROUTING">
            <div className="flex flex-col md:flex-row gap-16 py-40 items-center px-8 md:px-16 lg:px-20">
              <div className="flex-1 md:max-w-lg">
                <Trench>
                  <p className="text-[10px] tracking-[0.45em] mb-5" style={{ color: '#10b981', fontFamily: SANS }}>
                    // GLOBAL INTELLIGENCE NODE
                  </p>
                </Trench>
                <Trench delay={0.07}>
                  <h2
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(36px, 5vw, 72px)',
                      lineHeight: 1.0,
                      fontWeight: 400,
                    }}
                    className="mb-8"
                  >
                    Scalable Supply<br />Intelligence.
                  </h2>
                </Trench>
                <Trench delay={0.13}>
                  <p className="leading-relaxed text-base mb-10" style={{ color: '#d8d8d8', fontFamily: SANS }}>
                    Instead of reacting to global delays, MAVEN 6.7 synchronizes with satellite weather overlays
                    and open-source intelligence — calculating millions of probability matrices every 12ms to
                    keep your fleet moving.
                  </p>
                </Trench>
                <Trench delay={0.19}>
                  <div className="flex flex-wrap gap-2">
                    {['Real-time AI', 'OSINT Feeds', 'Gemini 3.1', 'Global Scale'].map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-[0.22em] px-4 py-1.5 rounded-full border border-white/10 text-[#ccc] hover:border-white/25 hover:text-white transition-colors cursor-default"
                        style={{ fontFamily: SANS }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Trench>
              </div>

              {/* Stats panel */}
              <GradualBlur delay={0.2} className="flex-1 w-full">
                <LiquidGlassCard glowColor="#10b981" className="p-10 bg-black/20">
                  <div className="space-y-8">
                    {[
                      { label: 'REAL-TIME REROUTING', value: '<12ms', color: '#10b981' },
                      { label: 'FUEL SAVINGS',         value: '18.4%',   color: '#fff' },
                      { label: 'DISRUPTIONS AVOIDED',  value: '4,293+',  color: '#ef4444' },
                      { label: 'ASSETS TRACKED',       value: '18,504',  color: '#a855f7' },
                    ].map(s => (
                      <div key={s.label}>
                        <p
                          className="text-[10px] tracking-[0.35em] mb-1"
                          style={{ color: '#888', fontFamily: SANS }}
                        >
                          {s.label}
                        </p>
                        <p
                          className="text-4xl font-bold"
                          style={{ color: s.color, fontFamily: SERIF }}
                        >
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </LiquidGlassCard>
              </GradualBlur>
            </div>
          </HugeRevealText>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 3 — HORIZONTAL SCROLL BENTO
            ════════════════════════════════════════════════════ */}
        <div id="telemetry" className="relative z-[10]">
          <HorizontalScrollBento />
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 3B — SEQUENCE ACCORDION
            ════════════════════════════════════════════════════ */}
        <section
          className="relative z-[10] border-t py-28"
          style={{ background: 'rgba(2,2,2,0.65)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="px-8 md:px-16 lg:px-20 max-w-5xl">
            <GradualBlur className="mb-12">
              <p className="text-[10px] tracking-[0.4em] mb-3" style={{ color: '#555', fontFamily: SANS }}>// OPERATIONAL SEQUENCE</p>
              <h2
                style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 400 }}
              >
                How MAVEN Thinks.
              </h2>
            </GradualBlur>
            <BentoAccordion />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 4 — CORE PILLARS
            ════════════════════════════════════════════════════ */}
        <section
          className="relative z-[10] border-t py-36"
          style={{ background: 'rgba(4,4,4,0.58)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="px-8 md:px-16 lg:px-20">
            <GradualBlur className="mb-16">
              <p className="text-[10px] tracking-[0.4em] mb-4" style={{ color: '#555', fontFamily: SANS }}>// CORE SERVICES</p>
              <h2
                style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 5vw, 68px)', fontWeight: 400 }}
              >
                The Three Pillars.
              </h2>
            </GradualBlur>

            <div className="hidden md:grid grid-cols-3 gap-5">
              {[
                {
                  icon: <ShieldAlert className="w-7 h-7" />,
                  accent: '#ef4444',
                  tag: 'RISK',
                  title: 'Dynamic Risk Avoidance',
                  items: ['Geopolitical choke-point detection', 'Hurricane weather rerouting', 'Predictive piracy alerts'],
                },
                {
                  icon: <Terminal className="w-7 h-7" />,
                  accent: '#00f0ff',
                  tag: 'AI',
                  title: 'Gemini 3.1 Synthesis',
                  items: ['Natural language fleet querying', 'Continuous context window sync', 'Autonomous multi-agent verification'],
                },
                {
                  icon: <Anchor className="w-7 h-7" />,
                  accent: '#10b981',
                  tag: 'FINANCE',
                  title: 'Automated Freight Pricing',
                  items: ['Live API rail & sea integrations', 'Real-time crude oil calculations', 'Port congestion predictions'],
                },
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
                      <span
                        className="text-[9px] tracking-[0.3em] px-3 py-1 rounded-full"
                        style={{ background: p.accent + '12', color: p.accent, border: `1px solid ${p.accent}30`, fontFamily: SANS }}
                      >
                        {p.tag}
                      </span>
                    </div>
                    <h3
                      className="font-semibold text-xl mb-5"
                      style={{ fontFamily: SERIF, fontWeight: 400, color: '#f0f0f0' }}
                    >
                      {p.title}
                    </h3>
                    <ul className="space-y-3 flex-1">
                      {p.items.map((item, j) => (
                        <li key={j} className="flex gap-3 items-start text-sm" style={{ color: '#c0c0c0', fontFamily: SANS }}>
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
            SECTION 5 — SCROLL REVEAL
            ════════════════════════════════════════════════════ */}
        <section
          className="relative z-[10] border-t py-48"
          style={{ background: 'rgba(2,2,2,0.68)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="px-8 md:px-16 lg:px-20 flex flex-col items-center text-center">
            <div
              className="relative w-full rounded-3xl overflow-hidden py-24 px-10 md:px-20 border border-white/5"
              style={{ background: 'rgba(6,6,6,0.6)', boxShadow: '0 0 0 1px rgba(255,255,255,0.02) inset, 0 40px 100px rgba(0,0,0,0.8)' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-[#00f0ff]/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

              <GradualBlur className="mb-12 relative z-10">
                <ShieldAlert className="w-12 h-12 text-[#00f0ff] opacity-90 mb-6 mx-auto drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" strokeWidth={1.5} />
                <p
                  className="text-sm md:text-xl tracking-[0.4em] text-white uppercase opacity-90 mb-10 font-semibold"
                  style={{ fontFamily: SANS }}
                >
                  // Core Philosophy
                </p>
              </GradualBlur>

              <div className="relative z-10 max-w-5xl mx-auto">
                <ScrollRevealText
                  text="maven 6.7 is not a standard routing engine. it is a living neural network designed to understand the chaotic flow of global commerce. by ingesting billions of data points across oceanic, aerial, and land-based networks, it calculates thousands of probability grids instantly. it doesn't just react to problems, it anticipates them — ensuring your fleet remains untouchable. built for absolute scale. engineered for speed. executing complex logistics autonomously, every twelve milliseconds."
                  className="text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight leading-[1.15] text-white justify-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 6 — PRICING
            ════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className="relative z-[10] border-t py-36"
          style={{ background: 'rgba(3,3,3,0.62)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="px-8 md:px-16 lg:px-20">
            <GradualBlur className="mb-20">
              <h2
                style={{ fontFamily: SERIF, fontSize: 'clamp(38px, 6vw, 90px)', fontWeight: 400, letterSpacing: '-0.01em' }}
                className="mb-4"
              >
                Resource Allocation.
              </h2>
              <p className="text-[#aaa] text-sm tracking-[0.2em] uppercase" style={{ fontFamily: SANS }}>
                Select your operational tier.
              </p>
            </GradualBlur>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              {[
                { title: 'SINGLE VESSEL', price: '$19',   sub: '/ month', desc: 'Monitor one high-value asset end-to-end.',   btn: 'Start Tracking',  color: '#444',    popular: false },
                { title: 'FLEET COMMAND', price: '$89',   sub: '/ month', desc: 'Full fleet intelligence for up to 500 assets.', btn: 'Deploy Now',   color: '#10b981', popular: true },
                { title: 'ENTERPRISE',   price: 'CUSTOM', sub: '',         desc: 'Custom AI modeling for global operations.',  btn: 'Talk to Sales', color: '#444',    popular: false },
              ].map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.09 }}
                  className={tier.popular ? 'md:-translate-y-5' : ''}
                >
                  <LiquidGlassCard
                    glowColor={tier.color}
                    className={`p-9 flex flex-col items-center text-center ${tier.popular ? 'bg-[#10b981]/6' : 'bg-black/20'}`}
                  >
                    {tier.popular && (
                      <div className="bg-[#10b981] text-black text-[9px] font-bold tracking-[0.3em] px-4 py-1 rounded-full mb-6 uppercase" style={{ fontFamily: SANS }}>
                        Most Popular
                      </div>
                    )}
                    <h3
                      className="font-semibold tracking-widest mb-2 text-sm"
                      style={{ fontFamily: SANS, color: tier.popular ? '#10b981' : '#e8e8e8' }}
                    >
                      {tier.title}
                    </h3>
                    <p className="text-[#aaa] text-xs mb-8 min-h-[40px]" style={{ fontFamily: SANS }}>{tier.desc}</p>
                    <p className="text-5xl mb-2" style={{ fontFamily: SERIF, fontWeight: 400 }}>{tier.price}</p>
                    <p className="text-[#777] text-xs tracking-widest mb-10 uppercase" style={{ fontFamily: SANS }}>
                      {tier.sub || '\u00a0'}
                    </p>
                    <button
                      className="w-full py-4 rounded-xl font-semibold text-xs tracking-[0.15em] uppercase transition-all hover:scale-[1.02]"
                      style={
                        tier.popular
                          ? { background: '#10b981', color: 'black', fontFamily: SANS, boxShadow: '0 0 20px rgba(16,185,129,0.2)' }
                          : tier.price === 'CUSTOM'
                          ? { background: 'white', color: 'black', fontFamily: SANS }
                          : { border: '1px solid rgba(255,255,255,0.10)', color: '#bbb', fontFamily: SANS }
                      }
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
        <footer
          className="relative z-[10] border-t pt-28 pb-10 overflow-hidden"
          style={{ background: 'rgba(2,2,2,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="relative z-10 px-8 md:px-16 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-4">
              <h3
                className="text-xl font-normal mb-3 tracking-wide text-[#00f0ff]"
                style={{ fontFamily: SERIF }}
              >
                MAVEN 6.7
              </h3>
              <p className="text-[#999] text-sm mb-6 leading-relaxed" style={{ fontFamily: SANS }}>
                Next-generation global supply chain intelligence and predictive routing terminal.
              </p>
            </div>
            {[
              { title: 'COMPANY', links: [{ name: 'About', path: '/about' }, { name: 'Contact', path: '/contact' }] },
              { title: 'LEGAL',   links: [{ name: 'Legal Overview', path: '/legal' }, { name: 'Help Links', path: '/links' }] },
            ].map((col, i) => (
              <div
                key={i}
                className={`md:col-span-2 ${i === 0 ? 'md:col-start-7' : ''} flex flex-col gap-3 text-xs tracking-widest`}
                style={{ color: '#888', fontFamily: SANS }}
              >
                <span className="text-[#e8e8e8] font-semibold mb-2 tracking-widest text-[10px] uppercase">{col.title}</span>
                {col.links.map(l => (
                  <a key={l.name} href={l.path} className="hover:text-white transition-colors tracking-wide">{l.name}</a>
                ))}
              </div>
            ))}
          </div>

          <div className="relative z-10 w-full text-center select-none pointer-events-none overflow-hidden mb-6">
            <h1
              className="font-normal tracking-tighter leading-none"
              style={{ fontSize: 'clamp(52px, 12vw, 160px)', fontFamily: SERIF, color: 'rgba(255,255,255,0.06)' }}
            >
              MAVEN 6.7
            </h1>
          </div>

          <div
            className="relative z-10 px-8 md:px-16 lg:px-20 flex justify-between items-center text-[9px] uppercase tracking-[0.2em] border-t border-white/5 pt-8"
            style={{ color: '#666', fontFamily: SANS }}
          >
            <span>© 2026 MAVEN SUPPLY CHAIN ENGINE.</span>
            <span>POWERED BY GEMINI 3.1 PRO NEURAL ENGINE</span>
          </div>
        </footer>

        {/* Global Aurora Background */}
        <div className="fixed inset-0 z-[0] pointer-events-none overflow-hidden mix-blend-screen opacity-40">
          <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[60vh] bg-[#00f0ff] opacity-[0.12] blur-[180px] rounded-full" />
          <div className="absolute top-[50%] -right-[10%] w-[50vw] h-[70vh] bg-[#10b981] opacity-[0.10] blur-[200px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[50vh] bg-[#4f46e5] opacity-[0.15] blur-[160px] rounded-full" />
        </div>

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
