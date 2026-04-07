import { useState, useEffect } from 'react';

const AGE_KEY = 'lingua_guard_age_verified';

export default function AgeGate({ onConfirm }) {
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    // Check if already verified this session
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
      <div className="blocked-screen">
        <span style={{ fontSize: 56 }}>🚫</span>
        <h2>Access Restricted</h2>
        <p>This resource is only available to individuals aged 18 and above.</p>
        <p style={{ marginTop: 8, fontSize: 13 }}>Please close this page.</p>
      </div>
    );
  }

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-card">
        <span className="age-gate-icon">🌐</span>

        <h1 className="age-gate-title">Age Verification Required</h1>
        <p className="age-gate-subtitle">
          This is an educational resource for adults. It contains explicit
          language documented for linguistic awareness and traveler safety.
        </p>

        <div className="age-gate-disclaimer">
          <strong>Educational Purpose Only</strong><br />
          This tool helps travelers recognize potentially hostile language in
          foreign countries so they can stay calm, respond appropriately, and
          de-escalate situations — not to promote or spread offensive language.
        </div>

        <div className="age-gate-buttons">
          <button id="age-confirm-btn" className="btn-confirm" onClick={handleConfirm}>
            ✓ &nbsp;I am 18 or older
          </button>
          <button id="age-deny-btn" className="btn-deny" onClick={handleDeny}>
            I am under 18
          </button>
        </div>
      </div>
    </div>
  );
}
