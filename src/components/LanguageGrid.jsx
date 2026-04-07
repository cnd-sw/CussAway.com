export default function LanguageGrid({ languages, selectedLang, onSelect, wordCounts }) {
  return (
    <div className="language-grid">
      {languages.map((lang) => (
        <div
          key={lang.code}
          id={`lang-card-${lang.code}`}
          className={`lang-card ${selectedLang?.code === lang.code ? 'active' : ''}`}
          onClick={() => onSelect(lang)}
          role="button"
          aria-label={`Explore ${lang.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(lang)}
        >
          <span className="lang-card-flag">{lang.flag}</span>
          <div className="lang-card-name">{lang.name}</div>
          <div className="lang-card-region">{lang.region}</div>
          {wordCounts[lang.code] !== undefined && (
            <div className="lang-card-count">
              📖 {wordCounts[lang.code]} entries
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
