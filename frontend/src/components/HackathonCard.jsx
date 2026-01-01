import { useState } from 'react';
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
    const skillsRequired = hackathon.skillsRequired ;
  const handleAnalyze = async () => {
    console.log("Analyzing hackathon ID:", hackathon.id);
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;

      if (!token) throw new Error("User not logged in");

      const response = await fetch(`${BASE_URL}/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hackathonId: hackathon.id,
          type: "hackathon", // useful if backend distinguishes
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("Hackathon analysis response:", data);

      if (typeof data === "string") {
        setAnalysis(data);
      } else if (data.success) {
        setAnalysis(data.analysis || "No analysis available.");
      } else {
        setAnalysis("No analysis available.");
      }

      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hackathon-card">
      <h3>{title}</h3>
      <p className="organizer">{organizer}</p>

      {(startDate || endDate) && (
        <p className="dates">
          🗓 {startDate || "?"} – {endDate || "?"}
        </p>
      )}

      <p>{description}</p>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Gemini Hackathon Analysis"
      >
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
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default HackathonCard;
