import { useState } from 'react';

export default function SuggestForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔴 SECURE: Pulling the key from a local .env file so it NEVER goes into GitHub
    const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!ACCESS_KEY) {
        alert("Developer Note: Please configure your VITE_WEB3FORMS_KEY in a .env file.");
        setLoading(false);
        return;
    }

    const formData = new FormData(e.target);
    const object = Object.fromEntries(formData);
    object.access_key = ACCESS_KEY;
    object.subject = "New Word Suggestion - CussAway";
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(object)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setTimeout(() => onClose(), 3000);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {submitted ? (
          <div className="modal-success">
            <div className="success-icon">📬</div>
            <h2>Suggestion Sent!</h2>
            <p>Our reviewers will check the accuracy before adding it to the database.</p>
          </div>
        ) : (
          <form className="suggest-form" onSubmit={handleSubmit}>
            <h2>Suggest a Word</h2>
            <p>Know a term travelers should be aware of? Submit it anonymously.</p>

            <div className="form-group">
              <label>Language & Region</label>
              <input className="form-input" name="language" required placeholder="e.g. Hindi, French, Italian" />
            </div>

            <div className="form-group">
              <label>The Word / Phrase</label>
              <input className="form-input" name="word" required placeholder="The exact word in native script or English" />
            </div>

            <div className="form-group">
              <label>Meaning & Context</label>
              <textarea className="form-input" name="context" required rows="3" placeholder="Literal meaning, and when/why locals say it..." />
            </div>

            <div className="form-group">
              <label>Severity Level</label>
              <select className="form-input" name="severity" required>
                <option value="mild">🟢 Mild (Mockery / Casual insult)</option>
                <option value="moderate">🟡 Moderate (Strong insult)</option>
                <option value="severe">🔴 Severe (Profanity / Threat)</option>
              </select>
            </div>

            <button type="submit" className="btn-confirm mt-3" disabled={loading}>
              {loading ? 'Sending...' : 'Submit for Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
