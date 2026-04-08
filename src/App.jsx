import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import AgeGate from './components/AgeGate';
import LanguageGrid from './components/LanguageGrid';
import WordList from './components/WordList';
import SearchBar from './components/SearchBar';
import SuggestForm from './components/SuggestForm';
import LegalModal from './components/LegalModal';

export default function App() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [langData, setLangData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wordCounts, setWordCounts] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const [legalView, setLegalView] = useState(null);
  const fuseRef = useRef(null);

  // GESTURE NAVIGATION (History API for swipe-back)
  useEffect(() => {
    const handlePopState = (event) => {
      if (selectedLang) {
        setSelectedLang(null);
        setLangData(null);
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedLang]);

  // Load language index
  useEffect(() => {
    if (!ageVerified) return;
    fetch('/data/index.json')
      .then((r) => r.json())
      .then(setLanguages)
      .catch(console.error);
  }, [ageVerified]);

  // Pre-load entry counts
  useEffect(() => {
    if (!languages.length) return;
    const counts = {};
    const promises = languages.map((l) =>
      fetch(`/data/${l.file}`)
        .then((r) => r.json())
        .then((d) => { counts[l.code] = d.entries.length; })
        .catch(() => { counts[l.code] = 0; })
    );
    Promise.all(promises).then(() => setWordCounts({ ...counts }));
  }, [languages]);

  // Load selected language data
  useEffect(() => {
    if (!selectedLang) return;
    setFilter('all');
    fetch(`/data/${selectedLang.file}`)
      .then((r) => r.json())
      .then((data) => {
        setLangData(data);
        fuseRef.current = new Fuse(data.entries, {
          keys: ['word', 'transliteration', 'meaning', 'context'],
          threshold: 0.35,
          includeScore: true,
        });
        setLoading(false);
        // Scroll only when content is ready
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      })
      .catch(() => setLoading(false));
  }, [selectedLang]);

  // Global search handling
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    if (langData && fuseRef.current) {
      const results = fuseRef.current.search(searchQuery).map((r) => r.item);
      setSearchResults(results);
    }
  }, [searchQuery, langData]);

  const handleSelectLang = useCallback((lang) => {
    setLoading(true);
    setSelectedLang(lang);
    setSearchQuery('');
    setSearchResults(null);
    window.history.pushState({ type: 'language', code: lang.code }, '');
  }, []);

  const handleBack = () => {
    if (window.history.state?.type === 'language') {
      window.history.back();
    } else {
      setSelectedLang(null);
      setLangData(null);
      setSearchQuery('');
      setSearchResults(null);
      setFilter('all');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const displayEntries = searchResults !== null
    ? { ...langData, entries: searchResults }
    : langData;

  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="selection:bg-accent selection:text-black">
      <AnimatePresence>
        {!ageVerified && (
          <AgeGate key="age-gate" onConfirm={() => setAgeVerified(true)} />
        )}
        {showSuggest && (
          <SuggestForm key="suggest" onClose={() => setShowSuggest(false)} />
        )}
        {legalView && (
          <LegalModal key="legal" type={legalView} onClose={() => setLegalView(null)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen relative overflow-hidden">
        <div className="bg-mesh" />

        {ageVerified && (
          <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
            {/* TECHNICAL HEADER */}
            <header className="flex flex-col sm:flex-row items-start justify-between gap-10 mb-24 border-b border-white/10 pb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 grayscale brightness-200" />
                  <div>
                    <h1 className="text-4xl font-mono tracking-tight leading-none uppercase">CussAway</h1>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      <p className="label-spec uppercase">Global Data · Vol. 0.0.1</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowSuggest(true)}
                  className="btn-industrial"
                >
                  [ SUGGEST_ENTRY ]
                </button>
                <div className="px-4 py-2 border border-white/5 bg-white/5 font-mono text-xs uppercase">
                  <p className="label-spec text-[8px] opacity-40">Status</p>
                  <p className="text-accent font-black tracking-widest">Live_Access</p>
                </div>
              </div>
            </header>

            {/* HERO SECTION */}
            <AnimatePresence mode="wait">
              {!selectedLang && (
                <motion.section 
                  key="hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-end"
                >
                  <div>
                    <h2 className="text-5xl sm:text-7xl lg:text-[7.5rem] xl:text-[9rem] font-mono font-black mb-12 leading-[0.8] tracking-tighter uppercase">
                      Linguistic<br />
                      <span className="text-accent">Intelligence</span>
                    </h2>
                    <div className="dashed-line mb-10 w-1/2" />
                    <p className="text-xl sm:text-2xl text-gray-spec max-w-xl leading-relaxed font-light font-mono">
                      Technical documentation of offensive language for traveler awareness. 
                      Structured for de-escalation and risk identification in industrial environments.
                    </p>
                  </div>
                  <div className="hidden lg:block border-l border-white/10 pl-10 space-y-6">
                    <p className="label-spec text-xs uppercase opacity-40">System Metadata</p>
                    <div className="space-y-4 font-mono text-xs text-white/40 uppercase">
                      <p>PROTOCOL: ANONYMOUS_ACCESS</p>
                      <p>DATA_ENCRYPTION: AES_256_LOCAL</p>
                      <p>REGIONS_LOADED: {languages.length}</p>
                      <p>CURATION_DATE: 2026.04.08</p>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* SEARCH SECTION */}
            <div className="sticky top-0 z-50 mb-20 bg-black/80 backdrop-blur-md py-6 border-y border-white/10">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder={selectedLang ? `QUERY_DB :: ${selectedLang.name}` : "QUERY_GLOBAL_DATABASE..."}
              />
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="min-h-[60vh] relative">
              <AnimatePresence mode="wait">
                {!selectedLang ? (
                  <motion.div
                    key="browser"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-4 mb-12">
                      <div className="h-[1px] flex-1 bg-white/10" />
                      <h3 className="label-spec uppercase opacity-40">Available_Resources</h3>
                      <div className="h-[1px] w-20 bg-accent/30" />
                    </div>
                    <LanguageGrid
                      languages={filteredLanguages}
                      selectedLang={selectedLang}
                      onSelect={handleSelectLang}
                      wordCounts={wordCounts}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="words-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <div className="mb-12">
                      <button 
                        onClick={handleBack}
                        className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-accent flex items-center gap-2 group"
                      >
                        <span className="group-hover:-translate-x-1 transition-transform">&lt;--</span> [ RETURN_TO_ROOT ]
                      </button>
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-40 border border-white/5 border-dashed bg-black/50 backdrop-blur-sm">
                        <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden mb-8">
                          <motion.div 
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-accent"
                          />
                        </div>
                        <p className="label-spec animate-pulse uppercase tracking-[0.3em] text-accent/50">Synchronizing_Database...</p>
                      </div>
                    ) : langData ? (
                      <WordList
                        langData={displayEntries}
                        filter={filter}
                        setFilter={setFilter}
                      />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* INDUSTRIAL FOOTER */}
            <footer className="mt-60 pt-20 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 grayscale contrast-150" />
                    <span className="font-mono font-black text-xs uppercase tracking-widest">CussAway_Project</span>
                  </div>
                  <p className="label-spec lowercase normal-case text-gray-spec text-xs leading-relaxed max-w-xs font-mono opacity-60">
                    Proprietary documentation initiative for traveler safety. 
                    All entries recorded for education and hostility de-escalation.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="label-spec text-accent uppercase text-[10px] font-black">Legal_Resources</h4>
                    <div className="space-y-3">
                      <button onClick={() => setLegalView('privacy')} className="block text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest">Privacy</button>
                      <button onClick={() => setLegalView('terms')} className="block text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest">Terms</button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="label-spec text-accent uppercase text-[10px] font-black">System_Core</h4>
                    <div className="space-y-3">
                      <button onClick={() => setLegalView('trademark')} className="block text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest">Trademark</button>
                      <button onClick={() => setLegalView('license')} className="block text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest">License</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 text-right md:text-left">
                  <p className="label-spec uppercase opacity-40">End_Of_Transmission</p>
                  <p className="font-mono text-[9px] text-white/10 uppercase tracking-tighter leading-tight">
                    © 2026 CussAway_Intel_Systems<br />
                    Secure_Node_Active
                  </p>
                </div>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
