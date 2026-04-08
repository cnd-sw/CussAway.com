import { motion } from 'framer-motion';

export default function LanguageGrid({ languages, selectedLang, onSelect, wordCounts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-white/5">
      {languages.map((lang, index) => {
        const flagGradient = lang.flagColors 
          ? `linear-gradient(135deg, ${lang.flagColors.join(', ')})` 
          : 'var(--color-accent)';

        return (
          <motion.div
            key={lang.code}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSelect(lang)}
            className={`group cursor-pointer p-10 border-r border-b border-white/5 transition-all duration-500 relative overflow-hidden ${
              selectedLang?.code === lang.code ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
            }`}
          >
            {/* DYNAMIC FLAG BG SWEEP */}
            <div 
              className="absolute inset-x-0 bottom-0 h-1 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 group-active:translate-y-0"
              style={{ background: flagGradient }}
            />
            
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] group-active:opacity-[0.05] transition-opacity duration-700 pointer-events-none"
              style={{ 
                background: flagGradient,
                filter: 'blur(40px)'
              }} 
            />

            {/* TECHNICAL INDEX */}
            <span className="absolute top-4 left-6 label-spec text-[7px] text-white/20 z-10">
              IDX_{index.toString().padStart(3, '0')}
            </span>
            
            <div className="space-y-6 pt-6 relative z-10">
              <h4 className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-mono font-black tracking-tighter transition-all duration-500 uppercase leading-[0.9] group-hover:translate-x-2 group-active:translate-x-2">
              {lang.name}
            </h4>
              <div className="flex items-center gap-3">
                <span 
                  className="w-10 h-[1px] transition-all duration-500 group-hover:w-20 group-active:w-20" 
                  style={{ backgroundColor: lang.flagColors?.[0] || 'var(--color-accent)' }}
                />
                <p className="label-spec text-white/40">{lang.region}</p>
              </div>
              
              <div className="pt-10 flex items-end justify-between">
                <div>
                  <p className="label-spec text-[7px] text-white/20 mb-1 uppercase">Entry_Count</p>
                  <p 
                    className="font-mono text-xs font-bold transition-colors duration-500"
                    style={{ color: selectedLang?.code === lang.code ? (lang.flagColors?.[0] || 'var(--color-accent)') : 'white' }}
                  >
                    {wordCounts[lang.code] || '00'}
                  </p>
                </div>
                <div 
                  className="w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:rotate-90 group-active:rotate-90"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <span className="font-mono text-[10px] text-white/20 group-hover:text-white group-active:text-white">+</span>
                </div>
              </div>
            </div>
            
            {/* DECORATIVE CORNER */}
            <div 
              className="absolute top-0 right-0 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300" 
              style={{ borderColor: lang.flagColors?.[0] || 'var(--color-accent)' }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
