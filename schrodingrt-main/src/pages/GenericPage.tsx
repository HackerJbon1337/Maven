import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Dither from '../components/ui/Dither';
import KineticGrid from '../components/ui/KineticGrid';

interface GenericPageProps {
  title: string;
}

export default function GenericPage({ title }: GenericPageProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-[#020202] text-white overflow-x-hidden pt-32 pb-24 px-6 flex flex-col"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <KineticGrid
          backgroundColor="transparent"
          gridColor="#ffffff"
          dotColor="#ffffff"
          hoverColor="#00f0ff"
          gridSize={60}
          repulsionStrength={-0.65}
          radius={280}
          dotSize={1.5}
          gridThickness={0.5}
          baseOpacity={0.05}
        />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <Dither color="#ffffff" opacity={0.022} />
      </div>

      {/* ── Top Navigation ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-6 left-8 z-[100] flex items-center gap-2.5 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="flex items-center justify-center overflow-hidden mix-blend-screen">
          <img src="/logo.png" alt="MAVEN M Logo" className="w-8 h-8 object-contain" style={{ mixBlendMode: 'screen' }} />
        </div>
        <span
          className="font-bold text-white text-sm tracking-widest mt-0.5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          MAVEN 6.7
        </span>
      </motion.div>

      {/* ── Page Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6" 
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#00f0ff' }}
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 max-w-xl text-sm leading-relaxed tracking-wider"
        >
          This section of the MAVEN 6.7 neural framework is currently under active development. Connection parameters and architecture are being finalized for deployment.
        </motion.p>
        
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => navigate(-1)}
            className="mt-12 px-8 py-3 rounded-full text-[10px] tracking-[0.2em] font-bold uppercase transition-all hover:bg-white hover:text-black border border-white/20 text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            Return to Terminal
        </motion.button>
      </div>
    </div>
  );
}
