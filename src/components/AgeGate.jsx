import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const AGE_KEY = 'cussaway_age_verified';

export default function AgeGate({ onConfirm }) {
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem(AGE_KEY);
    if (verified === 'true') onConfirm();
  }, [onConfirm]);

  const handleConfirm = () => {
    sessionStorage.setItem(AGE_KEY, 'true');
    onConfirm();
  };

  const handleDeny = () => {
    setDenied(true);
  };

  if (denied) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-10 text-center uppercase font-mono">
        <ShieldAlert className="w-20 h-20 text-red-600 mb-10" />
        <h2 className="text-4xl font-black text-red-600 tracking-tighter mb-4">ACCESS_DENIED</h2>
        <p className="max-w-md text-white/30 text-[10px] leading-relaxed tracking-widest">
          SYSTEM_RESTRICTION: MINOR_AGE_PROTOCOL_DETECTED. 
          EXITING_ENVIRONMENT...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-y-auto overflow-x-hidden">
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full p-6 sm:p-20 relative"
      >
        {/* CROSSHAIR CORNERS */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/20" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/20" />

        <div className="text-center space-y-10 sm:space-y-12">
          <div className="space-y-6">
            <img src="/logo.png" alt="Mascot" className="w-16 h-16 sm:w-24 sm:h-24 mx-auto brightness-200" />
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-[calc(-0.06em)] uppercase leading-[0.75] break-words">CUSSAWAY</h1>
            <p className="label-spec text-accent text-[10px] sm:text-sm">Linguistic Intelligence Database</p>
          </div>

          <div className="h-[1px] w-full bg-white/10" />

          <div className="space-y-6">
            <h3 className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-tighter">Identity_Verification</h3>
            <p className="text-sm sm:text-xl text-white/60 leading-relaxed max-w-xl mx-auto font-mono">
              You are accessing professional documentation of offensive language for industrial safety. 
              Please confirm you are of legal age (18+) to synchronize with the database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-10">
            <button 
              onClick={handleConfirm}
              className="w-full sm:w-auto px-10 py-5 bg-accent text-black font-mono font-black uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 active:scale-95"
            >
              [ SYNC_ACCESS ]
            </button>
            <button 
              onClick={handleDeny}
              className="label-spec hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
            >
              Terminate_Session
            </button>
          </div>

          <div className="pt-10 sm:pt-20">
            <p className="label-spec text-[8px] opacity-20">
              SECURE_LINK // END_TO_END_ANONYMITY // NODE_ID: 0x9210
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
