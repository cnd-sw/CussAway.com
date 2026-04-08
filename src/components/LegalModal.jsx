import { motion } from 'framer-motion';
import { X, Shield, FileText, Scale, Award } from 'lucide-react';
import { useEffect } from 'react';

export default function LegalModal({ type, onClose }) {
  const content = {
    privacy: {
      title: "PRIVACY_PROTOCOL",
      icon: <Shield className="w-8 h-8 text-accent" />,
      body: (
        <div className="space-y-12">
          <section className="space-y-4">
            <h3 className="text-white font-mono font-bold text-sm tracking-[0.2em] border-l-2 border-accent pl-4 uppercase">01. Data Architecture</h3>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed pl-5 font-mono">CussAway is engineered for zero-persistence. Our system does not deploy external trackers, cookies, or analytics nodes. Any local session data is destroyed immediately upon browser closure.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-mono font-bold text-sm tracking-[0.2em] border-l-2 border-accent pl-4 uppercase">02. Transmission Security</h3>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed pl-5 font-mono">Submissions via the "Suggest Word" feature are transmitted through SSL/TLS encrypted tunnels. All IP metadata is stripped from packets before they enter our analysis environment.</p>
          </section>
        </div>
      )
    },
    terms: {
      title: "OPERATING_TERMS",
      icon: <FileText className="w-8 h-8 text-accent" />,
      body: (
        <div className="space-y-12">
          <section className="space-y-4">
            <h3 className="text-white font-mono font-bold text-sm tracking-[0.2em] border-l-2 border-accent pl-4 uppercase">01. Usage Restriction</h3>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed pl-5 font-mono">This database is provided strictly for educational and traveler safety identification. This system is not a platform for the propagation of harassment or hate speech.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-mono font-bold text-sm tracking-[0.2em] border-l-2 border-accent pl-4 uppercase">02. Liability Limitation</h3>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed pl-5 font-mono">End-users assume full responsibility for their real-world interactions. Linguistic data is subject to extreme regional variance and must be interpreted with caution.</p>
          </section>
        </div>
      )
    },
    trademark: {
      title: "IDENTITY_IP",
      icon: <Scale className="w-8 h-8 text-accent" />,
      body: (
        <div className="space-y-12">
          <section className="space-y-4">
            <h3 className="text-white font-mono font-bold text-sm tracking-[0.2em] border-l-2 border-accent pl-4 uppercase">01. Brand Ownership</h3>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed pl-5 font-mono">The CussAway trademark, visual identity, mascot assets, and technical UI architecture are proprietary intellectual property. Unauthorized commercial redistribution is strictly prohibited.</p>
          </section>
        </div>
      )
    },
    license: {
      title: "SOFTWARE_LICENSE",
      icon: <Award className="w-8 h-8 text-accent" />,
      body: (
        <div className="space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-4">MIT Open Source License</p>
          <div className="font-mono text-[11px] sm:text-xs text-white/50 leading-relaxed normal-case bg-white/[0.02] p-8 border border-white/5 whitespace-pre-wrap">
{`Copyright (c) 2026 the CussAway Project

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`}
          </div>
        </div>
      )
    }
  }[type];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-4xl w-full border border-white/10 bg-black p-8 sm:p-12 md:p-20 relative overflow-hidden flex flex-col"
      >
        {/* CORNER DECOR */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rotate-45 translate-x-16 -translate-y-16" />
        
        <button className="absolute top-8 right-8 sm:top-12 sm:right-12 text-white/20 hover:text-accent transition-colors z-20" onClick={onClose}>
          <X className="w-8 h-8" />
        </button>

        <div className="relative z-10 space-y-12 flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-6 shrink-0">
            {content.icon}
            <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tighter">{content.title}</h2>
          </div>

          <div className="h-[1px] w-full bg-white/10 shrink-0" />

          <div className="overflow-y-auto pr-6 custom-scrollbar flex-1">
            {content.body}
          </div>

          <div className="pt-10 shrink-0 border-t border-white/5">
            <button 
              onClick={onClose}
              className="w-full py-5 bg-white text-black font-mono font-black text-sm uppercase tracking-widest hover:bg-accent transition-all"
            >
              [ I_ACKNOWLEDGE_THESE_TERMS ]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
