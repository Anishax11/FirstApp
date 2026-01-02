import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import Modal from './Modal';
import { BASE_URL } from '../api';

const HackathonCard = ({ hackathon, isRecommended }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Normalizing fields (handles different backend keys)
  const title = hackathon.title || hackathon.Title || "No Title";
  const organizer = hackathon.organizer || hackathon.Organizer || "Unknown Organizer";
  const description =
    hackathon.description || hackathon.Description || "No Description";
  const themes =
    hackathon.themes || hackathon.domains || hackathon.Themes || [];
  const startDate = hackathon.startDate || hackathon.StartDate;
  const endDate = hackathon.endDate || hackathon.EndDate;
  const registerLink =
    hackathon.registerLink || hackathon.RegistrationLink || "#";
  const skillsRequired = hackathon.skillsRequired;
  const { userData } = useAuth(); // Access user profile

  const handleAnalyze = async () => {
    setLoading(true);

    // 1. Use existing recommendation data if available
    if (hackathon.matchPercentage !== undefined) {
      setAnalysis({
        matchPercentage: hackathon.matchPercentage,
        matchedKeywords: hackathon.matchedSkills,
        missingKeywords: hackathon.missingSkills
      });
      setLoading(false);
      setModalOpen(true);
      return;
    }

    // 2. Client-side Calc
    if (userData && userData.skills) {
      // Handle skillsRequired - verify key name
      const reqSkills = hackathon.skillsRequired || hackathon.skills || [];
      const userSkills = new Set(userData.skills.map(s => s.trim().toLowerCase()));
      const itemSkills = reqSkills.map(s => s.trim().toLowerCase());

      const matched = itemSkills.filter(s => userSkills.has(s));
      const missing = itemSkills.filter(s => !userSkills.has(s));

      const percentage = itemSkills.length > 0
        ? Math.round((matched.length / itemSkills.length) * 100)
        : 0;

      setAnalysis({
        matchPercentage: percentage,
        matchedKeywords: matched,
        missingKeywords: missing
      });
      setLoading(false);
      setModalOpen(true);
      return;
    }
  };

  return (
    <div className="hackathon-card internship-card">
      <h3 className="internship-title">{title}</h3>
      <p className="company-name">{organizer}</p>

      {(startDate || endDate) && (
        <p className="dates">
          🗓 {startDate || "?"} – {endDate || "?"}
        </p>
      )}

      <p className="description">{description}</p>
      {skillsRequired.length > 0 && (
        <div className="skills-container">
          {skillsRequired.map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {themes.length > 0 && (
        <div className="themes-container">
          {themes.map((theme, i) => (
            <span key={i} className="theme-tag">{theme}</span>
          ))}
        </div>
      )}

      {isRecommended && (
        <p className="match-reason">🚀 Recommended based on your profile</p>
      )}

      <a href={registerLink} target="_blank" rel="noopener noreferrer">
        <button>Register</button>
      </a>

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="error">{error}</p>}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Skill Match Analysis">
        <div style={{ textAlign: 'left' }}>
          {analysis && typeof analysis === 'object' ? (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#374151' }}>Match Score</span>
                  <span style={{ fontWeight: 'bold', color: analysis.matchPercentage > 70 ? '#16a34a' : '#ea580c' }}>{analysis.matchPercentage}%</span>
                </div>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${analysis.matchPercentage}%`,
                    height: '100%',
                    background: analysis.matchPercentage > 70 ? '#16a34a' : (analysis.matchPercentage > 40 ? '#f59e0b' : '#ef4444'),
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Matched Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysis.matchedKeywords?.length > 0 ? analysis.matchedKeywords.map((s, i) => (
                    <span key={i} style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '500' }}>✓ {s}</span>
                  )) : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No direct matches found.</span>}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Missing / To Learn</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysis.missingKeywords?.length > 0 ? analysis.missingKeywords.map((s, i) => (
                    <span key={i} style={{ background: '#ffedd5', color: '#9a3412', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '500' }}>! {s}</span>
                  )) : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>You have all required skills!</span>}
                </div>
              </div>
            </>
          ) : (
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#374151' }}>{analysis}</p>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setModalOpen(false)}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#e5e7eb",
              color: "#374151",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HackathonCard;
