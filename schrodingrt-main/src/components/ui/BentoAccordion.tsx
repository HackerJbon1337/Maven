import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Database, Cpu, Rocket } from 'lucide-react';

const steps = [
  {
    id: 'seq-01',
    seq: '01',
    title: 'Ingestion',
    icon: Database,
    content: 'Real-time parsing of global weather radar, AIS maritime transponders, open-source intelligence feeds, and port congestion telemetry across 140+ nations.',
    metadata: '14ms p99 latency',
    color: '#00f0ff',
  },
  {
    id: 'seq-02',
    seq: '02',
    title: 'Synthesis',
    icon: Cpu,
    content: 'Gemini 3.1 Pro cross-references 4M+ historical freight parameters to instantly detect geopolitical choke points and supply anomalies before they escalate.',
    metadata: '99.9% Context Sync',
    color: '#10b981',
  },
  {
    id: 'seq-03',
    seq: '03',
    title: 'Reroute',
    icon: Rocket,
    content: 'Autonomous issuance of API webhooks directly into ERPs to adjust delivery ETAs and dispatch updated navigation waypoints to automated fleets instantly.',
    metadata: 'Zero-Touch Ops',
    color: '#ffffff',
  },
];

export default function BentoAccordion() {
  const [activeId, setActiveId] = useState('seq-01');

  return (
    <div className="w-full flex flex-col gap-3">
      {steps.map((step) => {
        const isActive = activeId === step.id;
        const Icon = step.icon;

        return (
          <motion.div
            key={step.id}
            layout
            onClick={() => setActiveId(step.id)}
            className="border rounded-2xl cursor-pointer overflow-hidden transition-colors duration-200"
            style={{
              borderColor: isActive ? step.color + '40' : '#1a1a1a',
              backgroundColor: isActive ? '#070707' : '#050505',
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between p-5 gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Sequence number pill */}
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isActive ? step.color + '15' : '#111',
                    border: `1px solid ${isActive ? step.color + '50' : '#222'}`,
                    color: isActive ? step.color : '#555',
                    fontFamily: "'Space Grotesk', monospace",
                  }}
                >
                  {step.seq}
                </div>

                {/* Icon */}
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: isActive ? step.color + '12' : '#0d0d0d',
                    border: `1px solid ${isActive ? step.color + '40' : '#1a1a1a'}`,
                    color: isActive ? step.color : '#444',
                  }}
                >
                  <Icon size={17} />
                </div>

                {/* Title */}
                <div className="min-w-0">
                  <p
                    className="text-[10px] tracking-[0.3em] mb-0.5"
                    style={{ color: isActive ? step.color : '#444', fontFamily: "'Outfit', sans-serif" }}
                  >
                    SEQUENCE {step.seq}
                  </p>
                  <h3
                    className="font-bold tracking-wide text-sm leading-none"
                    style={{
                      color: isActive ? '#fff' : '#555',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Metadata + chevron */}
              <div className="flex items-center gap-3 shrink-0">
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden sm:block text-[10px] tracking-widest px-3 py-1 rounded-full"
                    style={{
                      background: step.color + '12',
                      color: step.color,
                      border: `1px solid ${step.color}30`,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {step.metadata}
                  </motion.span>
                )}
                <motion.div
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: isActive ? step.color : '#333' }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </div>
            </div>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    className="px-6 pb-6 text-sm leading-relaxed border-t"
                    style={{
                      color: '#888',
                      borderColor: step.color + '15',
                      paddingTop: '1rem',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {step.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
