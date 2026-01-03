import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import Modal from './Modal';
import { BASE_URL } from '../api'; // backend URL

const InternshipCard = ({ internship, isRecommended, userId }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const title = internship.title || internship.Title || "No Title";
  const company = internship.company || internship.Company || "No Company";
  const description = internship.description || internship.Description || "No Description";
  const skills = internship.skills || internship.skillsRequired || internship.SkillsRequired || [];
  const applyLink = internship.applyLink || internship.ApplyLink || '#';

  // console.log("Rendering InternshipCard for:", title);

  const { userData } = useAuth(); // Access user profile

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    // 1. Use existing recommendation data if available
    if (internship.matchPercentage !== undefined) {
      setAnalysis({
        matchPercentage: internship.matchPercentage,
        matchedKeywords: internship.matchedSkills,
        missingKeywords: internship.missingSkills
      });
      setLoading(false);
      setModalOpen(true);
      return;
    }

    // 2. Client-side Calc
    if (userData && userData.skills && skills.length > 0) { // Ensure internship has skills to compare
      const userSkills = new Set(userData.skills.map(s => s.trim().toLowerCase()));
      const itemSkills = skills.map(s => s.trim().toLowerCase());

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

    // 3. Fallback if user data or internship skills are missing for client-side calc
    if (!userData || !userData.skills) {
      setError("Please ensure your profile has skills to analyze.");
      setLoading(false);
      return;
    }
    if (skills.length === 0) {
      setError("This internship has no listed skills for analysis.");
      setLoading(false);
      return;
    }

    // If we reach here, it means there was an unexpected case, or no skills to compare.
    setAnalysis("Unable to perform skill analysis.");
    setLoading(false);
    setModalOpen(true);
  };

  return (
    <div className="internship-card">
      <h3 className="internship-title">{title}</h3>
      <p className="company-name">{company}</p>
      <p className="description">{description}</p>
      {skills.length > 0 && (
        <div className="skills-container">
          {skills.map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}
      {isRecommended && <p className="match-reason">✨ Matches your skills profile</p>}
      <a href={applyLink} target="_blank" rel="noopener noreferrer">
        <button>Apply Now</button>
      </a>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
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
              {analysis.aiAnalysisText && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>AI Analysis</h4>
                  <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#374151', fontSize: '0.9rem' }}>{analysis.aiAnalysisText}</p>
                </div>
              )}
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

export default InternshipCard;
