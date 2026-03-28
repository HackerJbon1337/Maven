import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Terminal, Anchor } from 'lucide-react';

interface NavCard {
  label: string;
  icon: React.ElementType;
  description: string;
  links: { label: string; href: string }[];
  accent: string;
}

const cards: NavCard[] = [
  {
    label: 'Platform',
    icon: Activity,
    description: 'The core intelligence engine.',
    links: [
      { label: 'Architecture', href: '#' },
      { label: 'Telemetry', href: '#' },
      { label: 'AI Node', href: '#' },
    ],
    accent: '#00f0ff',
  },
  {
    label: 'Ecosystem',
    icon: Globe,
    description: 'Global network of logistics nodes.',
    links: [
      { label: 'Port Partners', href: '#' },
      { label: 'Integrations', href: '#' },
      { label: 'Data Sources', href: '#' },
    ],
    accent: '#10b981',
  },
  {
    label: 'Developers',
    icon: Terminal,
    description: 'Build on top of MAVEN 6.7.',
    links: [
      { label: 'API Docs', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'Status Page', href: '#' },
    ],
    accent: '#ffffff',
  },
];

interface CardNavProps {
  onNavigate?: (path: string) => void;
}

export default function CardNav({ onNavigate }: CardNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 font-mono text-sm tracking-widest px-4 py-2 rounded-full border transition-all ${
          isOpen
            ? 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10'
            : 'border-[#333] text-gray-400 hover:text-white hover:border-[#555]'
        }`}
      >
        <span className="hidden md:block">Menu</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 flex flex-col justify-center gap-1"
        >
          <span className="block h-px w-full bg-current" />
          <span className="block h-px w-full bg-current" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-3 w-[600px] bg-black/90 backdrop-blur-2xl border border-[#222] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-3 gap-0">
              {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 border-r border-[#111] last:border-r-0 cursor-pointer transition-colors hover:bg-[#0a0a0a]`}
                    onMouseEnter={() => setActiveCard(idx)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
                      style={{ background: activeCard === idx ? `${card.accent}20` : '#111', border: `1px solid ${activeCard === idx ? card.accent + '50' : '#222'}` }}
                    >
                      <Icon
                        size={18}
                        style={{ color: activeCard === idx ? card.accent : '#555' }}
                        className="transition-colors"
                      />
                    </div>
                    <h3
                      className="font-mono font-bold tracking-widest text-sm mb-1 transition-colors"
                      style={{ color: activeCard === idx ? card.accent : 'white' }}
                    >
                      {card.label}
                    </h3>
                    <p className="text-gray-600 text-xs font-mono mb-4 tracking-wider">{card.description}</p>
                    <div className="flex flex-col gap-2">
                      {card.links.map((link, li) => (
                        <a
                          key={li}
                          href={link.href}
                          className="text-gray-500 text-xs font-mono tracking-wider hover:text-white transition-colors"
                        >
                          → {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#111] p-4 flex justify-between items-center">
              <span className="font-mono text-xs text-gray-600 tracking-widest">MAVEN 6.7 // GLOBAL TELEMETRY ENGINE</span>
              <span className="flex items-center gap-2 font-mono text-xs text-[#10b981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                SYSTEMS NOMINAL
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
