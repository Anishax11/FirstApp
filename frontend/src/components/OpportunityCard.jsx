import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import Modal from './Modal';

import {BASE_URL} from "../api";
import './OpportunityCard.css';


const calculateMatchPercentage = (userSkills = [], requiredSkills = []) => {
    if (!userSkills.length || !requiredSkills.length) return 0;

    const user = userSkills.map(s => s.toLowerCase());
    const required = requiredSkills.map(s => s.toLowerCase());

    const matched = required.filter(skill => user.includes(skill));
    return Math.round((matched.length / required.length) * 100);
};

const OpportunityCard = ({ item, type, isRecommended }) => {
    // Normalizing data fields
    const title = item.title || item.Title || "Untitled Opportunity";
    const company = item.company || item.organizer || item.Company || "Unknown Organization";
    const description = item.description || item.Description || "No description provided.";
    const skills = item.skills || item.skillsRequired || item.SkillsRequired || [];
    const applyLink = item.applyLink || item.registerLink || item.ApplyLink || '#';
    const startDate = item.startDate;
    const endDate = item.endDate;

    // Explicit type badge
    let displayType = type;
    if (!displayType) {
        // Infer from data if not passed
        if (item.organizer) displayType = 'hackathon';
        else displayType = 'internship';
    }

    // Analysis Logic
    const { userData } = useAuth();
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState(null);


    const matchPercentage = calculateMatchPercentage(userData?.skills, skills);
    const isSkillRecommended = matchPercentage >= 80;

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
                    internshipId: type === 'internship' ? item.id : undefined,
                    hackathonId: type === 'hackathon' ? item.id : undefined,
                    type: type
                })
            });

            const data = await response.json();

            if (data.success && data.analysis) {
                // Backend now returns plain text string
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

        <div className={`opportunity-card ${isRecommended ? 'recommended' : ''} ${isSkillRecommended ? 'with-badge' : ''}`}>
            {isSkillRecommended && (
                <span className="recommended-badge">
                    Recommended
                </span>
            )}

            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                <span className={`type-badge ${displayType}`}>{displayType}</span>
            </div>

            <div className="card-meta">
                <span className="company-name">{company}</span>
                {(startDate || endDate) && (
                    <div className="meta-dates">
                        📅 {startDate || '?'} – {endDate || '?'}
                    </div>
                )}
            </div>

            {isRecommended && (
                <div className="match-badge">
                    ⭐ Recommended for you
                </div>
            )}



            <p className="card-description">{description}</p>

            {skills.length > 0 && (
                <div className="skills-container">
                    {skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="skill-pill">{skill}</span>
                    ))}
                    {skills.length > 4 && <span className="skill-pill">+{skills.length - 4}</span>}
                </div>
            )}

            <div className="card-actions">
                <button
                    className="btn-secondary"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? <><span className="spinner"></span>Analyzing...</> : 'Analyze'}
                </button>
                <a href={applyLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary">
                        {displayType === 'hackathon' ? 'View Details' : 'Apply Now'}
                    </button>
                </a>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Skill Match Analysis">
                <div style={{ textAlign: 'left' }}>
                    {analysis && !analysis.error ? (
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#334155' }}>
                            {typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2)}
                        </div>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            {analysis?.error || "Unable to retrieve analysis."}
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <button onClick={() => setModalOpen(false)} className="btn-secondary">Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default OpportunityCard;
