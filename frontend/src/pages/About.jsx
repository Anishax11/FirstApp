import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="mission-card">
                <h1 className="about-title">SkillLens</h1>
                <p className="about-description">
                    We bridge the gap between talented students and real-world opportunities. <br />
                    SkillLens isn't just a job board—it's your intelligent career companion that helps you
                    <span className="highlight"> discover, analyze, and achieve</span> your goals.
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3 className="feature-title">Smart Matching</h3>
                        <p className="feature-text">AI-driven recommendations tailored specifically to your unique skill profile and career interests.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Skill Analysis</h3>
                        <p className="feature-text">Get instant, detailed feedback on how well your resume fits a role and what you need to learn.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌐</div>
                        <h3 className="feature-title">One Hub</h3>
                        <p className="feature-text">Internships and hackathons combined in a single, seamless view so you never miss an opportunity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
