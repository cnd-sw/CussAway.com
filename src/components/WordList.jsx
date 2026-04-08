import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldAlert, Cpu, Activity } from 'lucide-react';

function WordCard({ entry, index }) {
  const [expanded, setExpanded] = useState(false);

  const severityStyles = {
    mild: 'text-green-500 bg-green-500/5 border-green-500/20',
    moderate: 'text-yellow-500 bg-yellow-500/5 border-yellow-500/20',
    severe: 'text-red-500 bg-red-500/5 border-red-500/20'
  };

  return (
    <div className="border-b border-white/5 last:border-none p-8 hover:bg-white/[0.01] transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[8px] text-white/20">LOG_{index.toString().padStart(4, '0')}</span>
            <div className={`px-2 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-widest ${severityStyles[entry.severity]}`}>
              {entry.severity}
            </div>
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5">
              {entry.category}
            </span>
          </div>

          <div className="flex items-baseline gap-6">
            <h4 className="text-5xl sm:text-7xl md:text-8xl font-mono font-black tracking-[calc(-0.05em)] uppercase leading-[0.85]">{entry.word}</h4>
            <span className="text-sm font-mono text-white/20 lowercase tracking-normal">/{entry.transliteration}/</span>
          </div>
          
          <p className="text-lg text-gray-spec font-light leading-relaxed">
            :: <span className="text-white/80">{entry.meaning}</span>
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="btn-industrial py-2 px-6 flex items-center gap-2 group"
        >
          {expanded ? '[ CLOSE_DATA ]' : '[ ACCESS_INTEL ]'}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-10 mt-10 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 label-spec text-white/40">
                  <Activity className="w-3 h-3 text-accent" />
                  Context_Log
                </div>
                <p className="text-sm font-light text-gray-spec leading-relaxed">{entry.context}</p>
              </div>
              <div className="space-y-4 p-6 bg-accent/[0.02] border border-accent/10">
                <div className="flex items-center gap-2 label-spec text-accent">
                  <ShieldAlert className="w-3 h-3" />
                  Response_Protocol
                </div>
                <p className="text-sm font-bold text-accent/80 leading-relaxed font-mono uppercase tracking-tight">{entry.suggested_response}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WordList({ langData, filter, setFilter }) {
  const filters = ['all', 'mild', 'moderate', 'severe'];

  const filtered = langData.entries.filter((e) =>
    filter === 'all' ? true : e.severity === filter
  );

  return (
    <div className="space-y-16 pb-32">
      <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-white/10 pb-16">
        <div className="space-y-4">
          <h2 className="text-7xl sm:text-9xl font-mono font-black tracking-tighter uppercase leading-[0.8]">
            {langData.language}
          </h2>
          <div className="flex items-center gap-3">
            <span className="label-spec text-accent">{langData.region}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="label-spec">{langData.script}</span>
          </div>
        </div>
        
        <div className="flex border border-white/10 p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-[8px] font-mono font-bold uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-accent text-black' 
                  : 'text-white/40 hover:text-white'
              }`}
            >
              lvl_{f}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        {filtered.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-white/5">
            <p className="label-spec">NO_RECORDS_FOUND_FOR_QUERY</p>
          </div>
        ) : (
          filtered.map((entry, i) => (
            <WordCard key={entry.id} entry={entry} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
