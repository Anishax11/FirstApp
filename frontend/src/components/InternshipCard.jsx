import { useState } from 'react';
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

  const handleAnalyze = async () => {
    console.log("handleAnalyze called for internship ID:", internship.id);
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      // console.log("Current user:", user);

      const token = user ? await user.getIdToken() : null;
      // console.log("User token:", token);

      if (!token) throw new Error("User not logged in");

      const response = await fetch(`${BASE_URL}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ internshipId: internship.id })
      });

      console.log("Fetch response status:", response.status);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json(); 
console.log("Raw response data:", data);

// Check if data is string or object
if (typeof data === 'string') {
    setAnalysis(data);
} else if (data.success) {
    setAnalysis(data.analysis || "No analysis available.");
    setModalOpen(true);

} else {
    setAnalysis("No analysis available.");
}
      

      // console.log("Opening modal...");
      setModalOpen(true);
    } catch (err) {
      console.error("Error in handleAnalyze:", err);
      setError(err.message);
    } finally {
      console.log("handleAnalyze finished, setting loading to false");
      setLoading(false);
    }
  };

  return (
    <div className="internship-card">
      <h3>{title}</h3>
      <p>{company}</p>
      <p>{description}</p>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Gemini Analysis">
  <p>{analysis}</p>
  <button
    onClick={() => setModalOpen(false)}
    style={{
      marginTop: "1rem",
      padding: "0.5rem 1rem",
      background: "#f00",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    }}
  >
    Close
  </button>
</Modal>

    </div>
  );
};

export default InternshipCard;
