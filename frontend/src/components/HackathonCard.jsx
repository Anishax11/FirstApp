import React from 'react';
import './InternshipCard.css'; // can reuse the same CSS

const HackathonCard = ({ hackathon, isRecommended }) => {
  const title = hackathon.title || "No Title";
  const description = hackathon.description || "No Description";
  const skills = hackathon.skillsRequired || [];
  const link = hackathon.link || '#'; // optional: link to hackathon page

  return (
    <div className="internship-card"> {/* reusing InternshipCard styles */}
      <h3>{title}</h3>
      <p>{description}</p>

      {skills.length > 0 && (
        <div className="skills-container">
          {skills.map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {isRecommended && (
        <p className="match-reason">✨ Matches your skills profile</p>
      )}

      {link && link !== '#' && (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <button>View / Join</button>
        </a>
      )}
    </div>
  );
};

export default HackathonCard;

  
  