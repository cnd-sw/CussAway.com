import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { sanitizeInput } from '../utils/security';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
        <Terminal className="w-4 h-4 text-accent/50 group-focus-within:text-accent transition-colors" />
      </div>
      <input
        id="global-search"
        type="search"
        className="block w-full bg-transparent border-none py-4 pl-14 pr-10 font-mono text-sm uppercase tracking-widest placeholder:text-white/20 focus:outline-none focus:ring-0"
        placeholder={placeholder || "EXECUTE_SEARCH_COMMAND..."}
        value={value}
        onChange={(e) => onChange(sanitizeInput(e.target.value))}
        autoComplete="off"
        spellCheck={false}
      />
      
      {/* SCANLINE EFFECT */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-1/3 h-full bg-accent shadow-[0_0_10px_#e2fc07]"
        />
      </div>
    </div>
  );
}
