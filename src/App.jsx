import { useState, useEffect, useCallback, useRef } from 'react';
import Fuse from 'fuse.js';
import AgeGate from './components/AgeGate';
import LanguageGrid from './components/LanguageGrid';
import WordList from './components/WordList';
import SearchBar from './components/SearchBar';

export default function App() {
  const [ageVerified, setAgeVerified]   = useState(false);
  const [languages, setLanguages]       = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [langData, setLangData]         = useState(null);
  const [loading, setLoading]           = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [wordCounts, setWordCounts]     = useState({});
  const [filter, setFilter]             = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const fuseRef = useRef(null);

  // Load language index
  useEffect(() => {
    if (!ageVerified) return;
    fetch('/data/index.json')
      .then((r) => r.json())
      .then(setLanguages)
      .catch(console.error);
  }, [ageVerified]);

  // Pre-load entry counts for all languages
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
    setLoading(true);
    setFilter('all');
    fetch(`/data/${selectedLang.file}`)
      .then((r) => r.json())
      .then((data) => {
        setLangData(data);
        // Set up Fuse.js for this language's entries
        fuseRef.current = new Fuse(data.entries, {
          keys: ['word', 'transliteration', 'meaning', 'context'],
          threshold: 0.35,
          includeScore: true,
        });
        setLoading(false);
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
      // Search within selected language
      const results = fuseRef.current.search(searchQuery).map((r) => r.item);
      setSearchResults(results);
    }
  }, [searchQuery, langData]);

  const handleSelectLang = useCallback((lang) => {
    setSelectedLang(lang);
    setSearchQuery('');
    setSearchResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = () => {
    setSelectedLang(null);
    setLangData(null);
    setSearchQuery('');
    setSearchResults(null);
    setFilter('all');
  };

  // Derive entries to show
  const displayEntries = searchResults !== null
    ? { ...langData, entries: searchResults }
    : langData;

  return (
    <>
      {/* Background glow layer */}
      <div className="bg-glow" aria-hidden="true" />

      {/* Age gate */}
      {!ageVerified && <AgeGate onConfirm={() => setAgeVerified(true)} />}

      {ageVerified && (
        <div className="app">
          {/* Header */}
          <header className="header">
            <div className="header-logo">
              <div className="header-logo-icon">🌐</div>
              <span className="header-logo-text">LinguaGuard</span>
            </div>
            <span className="header-badge">18+ Educational</span>
          </header>

          {/* Hero */}
          {!selectedLang && (
            <section className="hero">
              <div className="hero-tag">Traveler Safety · Linguistic Awareness</div>
              <h1 className="hero-title">
                Understand what's being <span>said around you</span>
              </h1>
              <p className="hero-subtitle">
                An educational reference for travelers — learn to recognize potentially
                hostile language in foreign environments so you can stay calm and
                respond appropriately.
              </p>
            </section>
          )}

          {/* Search bar */}
          {selectedLang && (
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          )}

          {/* Main content */}
          <main className="main-content">
            {/* Language browser */}
            {!selectedLang && (
              <>
                <div className="section-header">
                  <h2 className="section-title">Select a Language</h2>
                  <span className="section-count">{languages.length} languages</span>
                </div>
                <LanguageGrid
                  languages={languages}
                  selectedLang={selectedLang}
                  onSelect={handleSelectLang}
                  wordCounts={wordCounts}
                />
              </>
            )}

            {/* Word panel */}
            {selectedLang && (
              <>
                <div className="words-panel-header">
                  <button id="back-btn" className="back-btn" onClick={handleBack}>
                    ← Back
                  </button>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="spinner" />
                    Loading entries…
                  </div>
                ) : langData ? (
                  <WordList
                    langData={displayEntries}
                    filter={filter}
                    setFilter={setFilter}
                  />
                ) : null}
              </>
            )}
          </main>

          {/* Footer */}
          <footer className="footer">
            For educational and safety awareness purposes only · Adults 18+ · Content is documented, not endorsed
          </footer>
        </div>
      )}
    </>
  );
}
