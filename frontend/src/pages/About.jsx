const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">Revolutionizing Early Career Discovery</h1>
                    <p className="about-subtitle">SkillLens acts as the intelligent bridge between academic potential and industry reality.</p>
                </div>
            </section>

            {/* The Challenge Section */}
            <section className="about-section alt-bg">
                <div className="section-container">
                    <div className="text-content">
                        <h2>The Challenge</h2>
                        <p>
                            Every year, millions of talented students miss out on opportunities simply because they don't know exactly what the industry is looking for.
                            Resumes get lost in black holes, and "apply & pray" has become the standard strategy.
                        </p>
                    </div>
                    <div className="visual-content">
                        <div className="stat-card">
                            <span className="stat-number">70%</span>
                            <span className="stat-label">of resumes are rejected by ATS before a human sees them.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution Grid */}
            <section className="about-section">
                <div className="section-container column-layout">
                    <h2>Our Solution</h2>
                    <div className="about-grid">
                        <div className="about-card vision">
                            <div className="card-icon">👁️</div>
                            <h3>AI Analysis</h3>
                            <p>We don't just read words; we understand skills. Our AI extracts and maps your potential to real-world demands.</p>
                        </div>
                        <div className="about-card solution">
                            <div className="card-icon">💡</div>
                            <h3>Instant Feedback</h3>
                            <p>Stop guessing. Get immediate insights on missing skills and a personalized roadmap to close the gap.</p>
                        </div>
                        <div className="about-card why">
                            <div className="card-icon">🚀</div>
                            <h3>Precision Matching</h3>
                            <p>We highlight opportunities where you are a &gt;80% match, so you can apply with confidence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission / Bottom */}
            <section className="about-section mission-section">
                <div className="mission-content">
                    <h2>Our Mission</h2>
                    <p>
                        To democratize career growth by providing every student, regardless of their background,
                        the data-driven tools they need to succeed in a tech-driven world.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
