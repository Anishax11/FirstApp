import React from 'react';
import './InternshipCard.css';

const InternshipCard = ({ internship, isRecommended }) => {
    const title = internship.title || internship.Title || "No Title";
    const company = internship.company || internship.Company || "No Company";
    const description = internship.description || internship.Description || "No Description";
    const skills = internship.skills || internship.skillsRequired || internship.SkillsRequired || [];
    const applyLink = internship.applyLink || internship.ApplyLink || '#';

    return (
        <div className="internship-card">
            <h3>{title}</h3>
            <p>{company}</p>
            <p>{description}</p>

            <div className="skills-container">
                {skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                ))}
            </div>

            {isRecommended && (
                <p className="match-reason">✨ Matches your skills profile</p>
            )}

            <a
                href={applyLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                <button>Apply Now</button>
            </a>
        </div>
    );
};

export default InternshipCard;
