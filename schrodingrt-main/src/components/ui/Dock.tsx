import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function Dock({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-[#333] rounded-full px-6 py-3 shadow-[0_0_30px_rgba(0,240,255,0.1)]"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function DockIcon({ icon, label, onClick, isActive }: { icon: ReactNode, label: string, onClick?: () => void, isActive?: boolean }) {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-center items-center w-12 h-12 rounded-full cursor-pointer transition-all hover:scale-125 hover:-translate-y-2 hover:bg-[#1a1a1a] border ${isActive ? 'bg-[#111] border-neon-cyan/50' : 'border-transparent'}`}
    >
      <div className={`${isActive ? 'text-neon-cyan' : 'text-gray-400'} group-hover:text-white transition-colors`}>
        {icon}
      </div>
      
      {/* Tooltip */}
      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-[#333] text-xs font-mono px-2 py-1 rounded text-white pointer-events-none whitespace-nowrap">
        {label}
      </span>
      
      {/* Active Dot */}
      {isActive && (
        <span className="absolute -bottom-1.5 w-1 h-1 bg-neon-cyan rounded-full shadow-[0_0_8px_#00f0ff]" />
      )}
    </div>
  );
}
