import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import Modal from './Modal';
import SkillAnalysisModalContent from './SkillAnalysisModalContent';
import { BASE_URL } from '../api';
// import './InternshipCard.css'; // If this relies on OpportunityCard.css, we should perhaps import that or ensure styles are global? 
// Assuming OpportunityCard.css is global or we want to switch to it? The user wants consistency.
// Let's stick to existing styles but update the Modal usage.

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
    setError(null);

    // 1. Check Auth
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to use AI Analysis.");
      setLoading(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${BASE_URL}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          internshipId: internship.id,
          type: 'internship'
        })
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        setModalOpen(true);
      } else {
        setAnalysis({ error: data.error || "Failed to analyze." });
        setModalOpen(true);
      }

    } catch (err) {
      console.error("Analysis Error:", err);
      setAnalysis({ error: "Network error during analysis." });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
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
        <button style={{ marginRight: '0.5rem' }}>Apply Now</button>
      </a>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <p className="error">{error}</p>}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Skill Match Analysis"
        className="dark-modal"
      >
        <SkillAnalysisModalContent analysis={analysis} />

        <div style={{ marginTop: '0.5rem', textAlign: 'right', padding: '0 0.5rem 1rem' }}>
          <button
            onClick={() => setModalOpen(false)}
            style={{
              padding: "0.5rem 1.5rem",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
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
