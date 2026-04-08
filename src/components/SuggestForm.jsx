import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Database } from 'lucide-react';
import { checkRateLimit, sanitizeInput } from '../utils/security';

export default function SuggestForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkRateLimit('suggest_word', 5, 15 * 60 * 1000)) {
      alert("ATTEMPT_LIMIT_REACHED. TRY_AGAIN_IN_15_MIN.");
      return;
    }

    setLoading(true);
    const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!ACCESS_KEY) {
      alert("DEV_ERROR: API_KEY_MISSING");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.target);
    const object = Object.fromEntries(formData);
    object.access_key = ACCESS_KEY;
    object.subject = "New Entry Submission - CussAway";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(object)
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setTimeout(() => onClose(), 3000);
      }
    } catch (error) {
      alert("NETWORK_TRANS_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl w-full border border-white/10 bg-black p-10 sm:p-20 relative"
      >
        <button className="absolute top-10 right-10 text-white/20 hover:text-accent transition-colors" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="py-20 text-center space-y-6">
            <div className="w-16 h-1 w-20 mx-auto bg-accent animate-pulse" />
            <h2 className="text-4xl font-mono font-black uppercase tracking-tighter">DATA_SYNCHRONIZED</h2>
            <p className="label-spec text-white/40">Entry submitted to linguistic queue for analysis</p>
          </div>
        ) : (
          <form className="space-y-12" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-accent" />
                <h2 className="text-3xl font-mono font-black uppercase tracking-tighter">SUBMIT_INTEL</h2>
              </div>
              <p className="label-spec">Provide metadata for new linguistic pattern</p>
            </div>

            <div className="space-y-10">
              <div className="space-y-3">
                <p className="label-spec text-white/40">Field_01::Language_Region</p>
                <input 
                  className="w-full bg-transparent border-b border-white/10 py-2 font-mono text-sm uppercase tracking-widest focus:border-accent focus:outline-none transition-colors"
                  name="language" required placeholder="TARGET_LANGUAGE..."
                />
              </div>

              <div className="space-y-3">
                <p className="label-spec text-white/40">Field_02::Word_Phrase</p>
                <input 
                  className="w-full bg-transparent border-b border-white/10 py-2 font-mono text-sm uppercase tracking-widest focus:border-accent focus:outline-none transition-colors"
                  name="word" required placeholder="INPUT_PHRASE..."
                />
              </div>

              <div className="space-y-3">
                <p className="label-spec text-white/40">Field_03::Context_Description</p>
                <textarea 
                  className="w-full bg-transparent border-b border-white/10 py-2 font-mono text-sm uppercase tracking-widest focus:border-accent focus:outline-none transition-colors resize-none"
                  name="context" required rows="3" placeholder="USAGE_METADATA..."
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-white text-black font-mono font-black uppercase tracking-widest hover:bg-accent hover:shadow-[0_0_30px_#e2fc07] transition-all"
            >
              {loading ? 'TRANSMITTING...' : 'EXECUTE_SUBMISSION'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
