import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover Opportunities <br /> That Match Your Skills
                    </h1>
                    <p className="hero-subtitle">
                        SkillLens bridges the gap between your potential and real-world experience.
                        AI-powered matching for internships, hackathons, and career roadmaps.
                    </p>
                    <div className="hero-actions">
                        <Link to="/profile">
                            <button className="btn-hero-primary">Upload Resume</button>
                        </Link>
                        <Link to="/opportunities">
                            <button className="btn-hero-secondary">Explore Opportunities</button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why SkillLens?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-icon">🧠</span>
                        <h3 className="feature-title">AI Skill Extraction</h3>
                        <p className="feature-description">
                            Upload your resume and let our AI instantly identify your strong suits and gaps.
                        </p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🎯</span>
                        <h3 className="feature-title">Smart Matching</h3>
                        <p className="feature-description">
                            We match you with internships and hackathons where you have ≥ 80% skill compatibility.
                        </p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🗺️</span>
                        <h3 className="feature-title">Personalized Roadmaps</h3>
                        <p className="feature-description">
                            Get clear, actionable steps to learn the skills you're missing for your dream role.
                        </p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🚀</span>
                        <h3 className="feature-title">Hackathons & Internships</h3>
                        <p className="feature-description">
                            One platform for all early-career opportunities. No more switching tabs.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <h3 className="step-title">Upload Resume</h3>
                        <p className="step-desc">Simply drop your PDF resume. We parse it securely.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <h3 className="step-title">Analyze Skills</h3>
                        <p className="step-desc">Our AI parses your skills and matches them against thousands of listings.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <h3 className="step-title">Get Recommendations</h3>
                        <p className="step-desc">See "Recommended" badges on opportunities that fit you perfectly.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">4</div>
                        <h3 className="step-title">Apply & Win</h3>
                        <p className="step-desc">Apply with confidence knowing you're a great fit.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
