import { useState } from 'react';

function WordCard({ entry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="word-card" id={`word-${entry.id}`}>
      <div className="word-card-header">
        <div className="word-card-left">
          <div className="word-text">{entry.word}</div>
          <div className="word-transliteration">/{entry.transliteration}/</div>
          <div className="word-meaning">"{entry.meaning}"</div>
        </div>
        <div className="word-badges">
          <span className={`severity-badge ${entry.severity}`}>
            {entry.severity === 'mild'     && '🟢 Mild'}
            {entry.severity === 'moderate' && '🟡 Moderate'}
            {entry.severity === 'severe'   && '🔴 Severe'}
          </span>
          <span className="category-badge">{entry.category}</span>
        </div>
      </div>

      <button
        className="expand-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        id={`expand-${entry.id}`}
      >
        <span className={`expand-icon ${expanded ? 'open' : ''}`}>▼</span>
        {expanded ? 'Hide details' : 'Show context & response'}
      </button>

      {expanded && (
        <div className="word-card-body">
          <div className="info-block">
            <div className="info-block-label">📍 Context</div>
            <div className="info-block-text">{entry.context}</div>
          </div>
          <div className="info-block response">
            <div className="info-block-label">💬 Suggested Response</div>
            <div className="info-block-text">{entry.suggested_response}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WordList({ langData, filter, setFilter }) {
  const filters = ['all', 'mild', 'moderate', 'severe'];

  const filtered = langData.entries.filter((e) =>
    filter === 'all' ? true : e.severity === filter
  );

  return (
    <div className="words-panel">
      {/* Language title row */}
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div className="lang-title-row">
          <span className="lang-flag-lg">{langData.flag}</span>
          <div>
            <div className="lang-name-lg">{langData.language}</div>
            <div className="lang-meta">{langData.region} · {langData.script}</div>
          </div>
        </div>
      </div>

      {/* Severity filter */}
      <div className="filter-bar">
        {filters.map((f) => (
          <button
            key={f}
            id={`filter-${f}`}
            className={`filter-btn ${f} ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all'      && `All (${langData.entries.length})`}
            {f === 'mild'     && `🟢 Mild`}
            {f === 'moderate' && `🟡 Moderate`}
            {f === 'severe'   && `🔴 Severe`}
          </button>
        ))}
      </div>

      {/* Word entries */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <div className="empty-state-title">No entries for this filter</div>
          <div className="empty-state-sub">Try selecting a different severity level.</div>
        </div>
      ) : (
        <div className="words-list">
          {filtered.map((entry) => (
            <WordCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
