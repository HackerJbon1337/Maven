import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, Globe, Terminal, TrendingUp, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    accent: '#ef4444',
    tag:    'REAL-TIME',
    icon:   ShieldAlert,
    title:  'Dynamic Risk Avoidance',
    body:   'Geopolitical choke-points, hurricanes, piracy — handled 96 hrs before impact across every lane.',
    stat:   '96h',
    statLabel: 'ADVANCE WARNING',
  },
  {
    accent: '#00f0ff',
    tag:    'LIVE',
    icon:   Globe,
    title:  '18,504 Assets Tracked',
    body:   'Sea, air, and rail assets updating every 12ms across 140+ countries on a single operations pane.',
    stat:   '12ms',
    statLabel: 'SYNC RATE',
  },
  {
    accent: '#10b981',
    tag:    'GEMINI 3.1',
    icon:   Terminal,
    title:  'AI Intel Node',
    body:   'Natural language querying of your entire supply chain — complex logistics answered in milliseconds.',
    stat:   '99.9%',
    statLabel: 'UPTIME',
  },
  {
    accent: '#a855f7',
    tag:    'FINANCE',
    icon:   TrendingUp,
    title:  'Freight Forecasting',
    body:   'Crude oil, port congestion, and spot rates modeled continuously with live exchange data.',
    stat:   '$1.2M',
    statLabel: 'AVG SAVINGS',
  },
  {
    accent: '#facc15',
    tag:    'SPEED',
    icon:   Zap,
    title:  '<12ms Latency',
    body:   'Sub-millisecond AI sync across the entire global fleet network, zero perceived lag.',
    stat:   '<12ms',
    statLabel: 'P99 LATENCY',
  },
];

/**
 * HorizontalScrollBento — GSAP ScrollTrigger scroll-hijacking horizontal carousel.
 * The outer wrapper is tall (pin height), the inner strip slides left as you scroll.
 */
export default function HorizontalScrollBento() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stripRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const strip = stripRef.current;
    if (!wrap || !strip) return;

    // How far to scroll the strip (total width - 1 screen)
    const getScrollAmount = () => -(strip.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(strip, {
        x: () => getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger:   wrap,
          start:     'top top',
          end:       () => `+=${strip.scrollWidth - window.innerWidth}`,
          pin:       true,
          scrub:     1.4,          // smooth scrub — the "butter" factor
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ background: 'rgba(2,2,2,0.94)' }}
    >
      {/* Section header — visible above the strip */}
      <div className="relative z-10 pt-24 pb-10 max-w-7xl mx-auto px-8">
        <p
          className="text-xs tracking-[0.45em] text-gray-700 mb-3"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          // OPERATIONS HUB — SCROLL TO EXPLORE
        </p>
        <h2
          className="text-4xl md:text-6xl font-black tracking-tight text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Live Telemetry Grid.
        </h2>
        {/* Scroll hint arrow */}
        <div className="flex items-center gap-3 mt-5">
          <div className="w-8 h-px bg-[#333]" />
          <span className="text-xs tracking-[0.3em] text-gray-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
            DRAG OR SCROLL →
          </span>
        </div>
      </div>

      {/* Horizontal sliding strip */}
      <div
        ref={stripRef}
        className="flex gap-5 px-8 pb-24 will-change-transform"
        style={{ width: 'max-content', alignItems: 'stretch' }}
      >
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden flex-shrink-0 flex flex-col justify-between"
              style={{
                width: 'clamp(300px, 28vw, 420px)',
                minHeight: '380px',
                // Liquid Glass card styling
                background:       'rgba(12,12,12,0.55)',
                backdropFilter:   'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border:           `1px solid ${card.accent}20`,
                boxShadow:        `0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.5)`,
                padding:          '2rem',
                transition:       'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = card.accent + '50';
                el.style.boxShadow   = `0 0 48px ${card.accent}15, 0 0 0 1px rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.5)`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = card.accent + '20';
                el.style.boxShadow   = `0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.5)`;
              }}
            >
              {/* Top specular line (liquid glass effect) */}
              <div
                className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
              />

              {/* Card index + tag */}
              <div className="flex items-center justify-between mb-8">
                <span
                  className="text-[10px] tracking-[0.35em] font-bold"
                  style={{
                    color:       card.accent,
                    fontFamily:  "'Space Grotesk', sans-serif",
                    background:  card.accent + '12',
                    padding:     '4px 12px',
                    borderRadius: '999px',
                    border:      `1px solid ${card.accent}30`,
                  }}
                >
                  {card.tag}
                </span>
                <span
                  className="text-[10px] tracking-widest text-gray-700"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(CARDS.length).padStart(2, '0')}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: card.accent + '12', border: `1px solid ${card.accent}30` }}
              >
                <Icon size={22} style={{ color: card.accent }} />
              </div>

              {/* Title + body */}
              <div className="flex-1">
                <h3
                  className="text-xl font-bold mb-3 tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}
                >
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {card.body}
                </p>
              </div>

              {/* Bottom stat */}
              <div
                className="flex items-end justify-between mt-8 pt-5"
                style={{ borderTop: `1px solid ${card.accent}15` }}
              >
                <div>
                  <p
                    className="text-3xl font-black"
                    style={{ color: card.accent, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {card.stat}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.3em] text-gray-700 mt-0.5"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {card.statLabel}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: card.accent + '15', border: `1px solid ${card.accent}30`, color: card.accent }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
