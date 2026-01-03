import React from 'react';
import './SkillAnalysisModal.css';

const SkillAnalysisModalContent = ({ analysis }) => {
    if (!analysis || analysis.error) {
        return (
            <div className="analysis-error">
                <p>⚠️ {analysis?.error || "Unable to load analysis."}</p>
            </div>
        );
    }

    // --- Parser Functions ---

    const parseMatchScore = (text) => {
        const match = text.match(/Overall Match:\s*(\d+)%/i);
        return match ? parseInt(match[1]) : 0;
    };

    const parseVerdict = (text) => {
        const match = text.match(/Application Verdict:\s*(.+)/i);
        return match ? match[1].trim() : "Analysis Available";
    };

    const parseSection = (text, header, nextHeader = null) => {
        const startIndex = text.indexOf(header);
        if (startIndex === -1) return [];

        let part = text.substring(startIndex + header.length);
        if (nextHeader) {
            const endIndex = part.indexOf(nextHeader);
            if (endIndex !== -1) part = part.substring(0, endIndex);
        }

        return part.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && (line.startsWith('✓') || line.startsWith('?') || line.startsWith('•') || line.startsWith('-')))
            .map(line => {
                // Remove bullet point chars
                return line.replace(/^[✓?•-]\s*/, '').trim();
            });
    };

    // --- Data Extraction ---
    const score = parseMatchScore(analysis);
    const verdict = parseVerdict(analysis);
    const matchedSkills = parseSection(analysis, 'Matched Skills:', 'Missing Skills:');
    const missingSkills = parseSection(analysis, 'Missing Skills:', 'Next Steps:');
    const nextSteps = parseSection(analysis, 'Next Steps:');

    // --- Helpers ---
    const getVerdictColor = (v) => {
        const lower = v.toLowerCase();
        if (lower.includes('strongly recommended')) return 'verdict-green';
        if (lower.includes('preparation')) return 'verdict-yellow';
        if (lower.includes('not recommended') || lower.includes('upskill')) return 'verdict-red';
        return 'verdict-neutral';
    };

    const getScoreColor = (s) => {
        if (s >= 80) return '#10b981'; // Green
        if (s >= 50) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    // Circular Progress CSS calculation
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;


    return (
        <div className="skill-analysis-container">

            {/* 1. Header: Score & Verdict */}
            <div className="analysis-header">
                <div className="score-circle-container">
                    <svg className="progress-ring" width="100" height="100">
                        <circle
                            className="progress-ring__circle-bg"
                            stroke="#334155"
                            strokeWidth="8"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                        />
                        <circle
                            className="progress-ring__circle"
                            stroke={getScoreColor(score)}
                            strokeWidth="8"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                            style={{
                                strokeDasharray: `${circumference} ${circumference}`,
                                strokeDashoffset: offset
                            }}
                        />
                    </svg>
                    <div className="score-text">
                        <span className="score-number">{score}%</span>
                        <span className="score-label">Match</span>
                    </div>
                </div>

                <div className="verdict-container">
                    <h4 className="verdict-label">AI VERDICT</h4>
                    <div className={`verdict-badge ${getVerdictColor(verdict)}`}>
                        {verdict}
                    </div>
                </div>
            </div>

            <div className="analysis-divider"></div>

            {/* 2. Matched Skills */}
            <div className="analysis-section">
                <h4 className="section-title text-green">
                    <span className="icon">✓</span> Matched Skills
                </h4>
                {matchedSkills.length > 0 ? (
                    <div className="skills-grid">
                        {matchedSkills.map((skill, i) => (
                            <div key={i} className="skill-item match">
                                <span className="check-icon">✓</span>
                                <span>{skill}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-text">No direct skill matches found yet.</p>
                )}
            </div>

            {/* 3. Missing Skills */}
            <div className="analysis-section">
                <h4 className="section-title text-orange">
                    <span className="icon">⚠️</span> Missing Skills
                </h4>
                {missingSkills.length > 0 ? (
                    <div className="skills-list">
                        {missingSkills.map((skill, i) => (
                            <div key={i} className="skill-item missing">
                                <span className="warn-icon">!</span>
                                <span>{skill}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="success-banner">
                        <span className="success-icon">🎉</span>
                        <div>
                            <strong>No missing skills!</strong>
                            <p>Your profile is a perfect match for this role.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="analysis-divider"></div>

            {/* 4. Next Steps */}
            <div className="analysis-section">
                <h4 className="section-title">🚀 Next Steps</h4>
                <div className="next-steps-list">
                    {nextSteps.map((step, i) => (
                        <div key={i} className="step-card">
                            <span className="step-number">{i + 1}</span>
                            <p>{step}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SkillAnalysisModalContent;
