
import React from 'react';
import { Link } from 'react-router-dom';
import techBg from '../assets/tech-bg.jpg';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="background-grid"></div>

            {/* 1. Hero Section */}
            <section className="about-hero">
                <div className="container hero-container centered-hero">
                    <div className="hero-content text-center mx-auto">
                        <div className="badge-pill mx-auto">
                            <span className="badge-dot"></span>
                            AI-Powered Career Growth
                        </div>
                        <h1 className="hero-title">
                            Unlock Your <span className="text-gradient">True Career Potential</span> with AI
                        </h1>
                        <p className="hero-subtitle mx-auto">
                            SkillLens bridges the gap between your resume and real opportunities using intelligent skill matching. Stop guessing, start achieving.
                        </p>
                        <div className="hero-actions justify-center">
                            <Link to="/opportunities" className="btn-primary-glow">
                                Get Started
                                <span className="arrow-icon">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Features Grid */}
            <section className="features-section">
                <div className="container">
                    <div className="section-head text-center">
                        <h2 className="section-title">Everything You Need to Succeed</h2>
                        <p className="section-desc">Comprehensive tools designed to accelerate your tech career.</p>
                    </div>

                    <div className="features-grid">
                        <FeatureCard
                            icon={<FileTextIcon />}
                            title="Resume Analysis"
                            desc="Get instant AI feedback on your resume's strength and ATS compatibility."
                        />
                        <FeatureCard
                            icon={<TargetIcon />}
                            title="Skill Matching"
                            desc="Find opportunities where you are an 80%+ match instantly."
                        />
                        <FeatureCard
                            icon={<MapIcon />}
                            title="Career Roadmaps"
                            desc="Step-by-step guides to bridge your skill gaps effectively."
                        />
                        <FeatureCard
                            icon={<TrophyIcon />}
                            title="Hackathons"
                            desc="Discover global challenges to prove your skills and win prizes."
                        />
                        <FeatureCard
                            icon={<BriefcaseIcon />}
                            title="Internships"
                            desc="Connect with top companies looking for fresh talent like you."
                        />
                        <FeatureCard
                            icon={<ChartIcon />}
                            title="Live Analytics"
                            desc="Track your application readiness with real-time data."
                        />
                    </div>
                </div>
            </section>

            {/* 3. Mission / Vision Section */}
            <section className="mission-section">
                <div className="container">
                    {/* Centered Header */}
                    <div className="mission-header text-center mx-auto">
                        <span className="section-tag">OUR MISSION</span>
                        <h2 className="mission-title">Empowering the Next Generation</h2>
                        <p className="mission-desc mx-auto">
                            We believe that talent is universal, but opportunity is not.
                            Our mission is to democratize career growth by providing every student the data-driven tools they need to succeed.
                        </p>
                    </div>

                    {/* Split Body */}
                    <div className="mission-split-body split-layout">
                        <div className="mission-points">
                            <MissionPoint title="First-Follower Approach" desc="We advocate for you when no one else will." />
                            <MissionPoint title="Fast Results" desc="Instant analysis, no waiting times." />
                            <MissionPoint title="Global Reach" desc="Access opportunities from anywhere in the world." />
                            <MissionPoint title="Secure & Private" desc="Your data is yours. We prioritize privacy." />
                        </div>
                        <div className="mission-visual">
                            <div className="glow-circle"></div>
                            <div className="glass-panel-large">
                                <h3>Trusted by Students</h3>
                                <div className="stat-row">
                                    <span className="big-num">10k+</span>
                                    <span className="label">Active Users</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '85%' }}></div>
                                </div>
                                <p className="small-note">Growing every day 🚀</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Trust / Stats Section */}
            <section className="stats-section">
                <div className="container stats-container">
                    <div className="stat-box">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Students</span>
                    </div>
                    <div className="stat-separator"></div>
                    <div className="stat-box">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Opportunities</span>
                    </div>
                    <div className="stat-separator"></div>
                    <div className="stat-box">
                        <span className="stat-number">AI</span>
                        <span className="stat-label">Powered Matching</span>
                    </div>
                    <div className="stat-separator"></div>
                    <div className="stat-box">
                        <span className="stat-number">Real-Time</span>
                        <span className="stat-label">Analysis</span>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="footer-cta">
                <div className="container text-center">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join SkillLens today and stop applying in the dark.</p>
                    <Link to="/opportunities" className="btn-primary-glow large">
                        Launch App
                    </Link>
                </div>
            </section>
        </div>
    );
};

// --- Sub-Components & Icons ---

const FeatureCard = ({ icon, title, desc }) => (
    <div className="feature-card">
        <div className="icon-wrapper">
            {icon}
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

const MissionPoint = ({ title, desc }) => (
    <div className="mission-point">
        <div className="check-icon">✓</div>
        <div className="point-text">
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    </div>
);

// Inline SVGs for Premium Look
const FileTextIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>;
const TargetIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
const MapIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>;
const TrophyIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>;
const BriefcaseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const ChartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;

export default About;
