import { useState } from "react";
import { getAuth } from "firebase/auth";
import Modal from "./Modal";
import {BASE_URL} from "../api";
import "./InternshipCard.css";

const InternshipCard = ({ internship, isRecommended }) => {
  const [analysis, setAnalysis] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const title = internship.title || internship.Title || "No Title";
  const company = internship.company || internship.Company || "No Company";
  const description =
    internship.description || internship.Description || "No Description";
  const skills =
    internship.skills ||
    internship.skillsRequired ||
    internship.SkillsRequired ||
    [];
  const applyLink = internship.applyLink || internship.ApplyLink || "#";

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      console.log(token);
      if (!token) throw new Error("User not logged in");

      const response = await fetch(`${BASE_URL}/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          internshipId: internship.id,
          type: "internship",
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setAnalysis(data.analysis || "No analysis available.");
      setModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`internship-card ${isRecommended ? "recommended" : ""}`}>
      <div className="card-header">
        <h3 className="internship-title">{title}</h3>
        <p className="company-name">{company}</p>
      </div>

      <p className="description">{description}</p>

      {skills.length > 0 && (
        <div className="skills-container">
          {skills.map((skill, i) => (
            <span key={i} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      {isRecommended && (
        <div className="match-reason">✨ Matches your profile</div>
      )}

      <div className="card-actions">
        <a href={applyLink} target="_blank" rel="noopener noreferrer">
          <button className="apply-btn">Apply</button>
        </a>

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Gemini Analysis"
      >
        <p>{analysis}</p>
      </Modal>
    </div>
  );
};

export default InternshipCard;
