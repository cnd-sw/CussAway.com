export default function SearchBar({ value, onChange }) {
  return (
    <section className="search-section">
      <div className="search-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          id="global-search"
          type="search"
          className="search-input"
          placeholder="Search a word, language, or meaning…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search words or languages"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </section>
  );
}
