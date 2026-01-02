import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './RecommendationToggle.css';

const RecommendationToggle = ({ showRecommended, setShowRecommended }) => {
    const { userData } = useAuth();
    const hasResume = !!userData?.resumeUrl;

    if (!hasResume) return null;

    const handleToggle = () => {
        setShowRecommended(!showRecommended);
    };

    return (
        <div className="recommendation-toggle-container">
            <div className="toggle-wrapper" onClick={handleToggle} style={{ cursor: 'pointer' }}>
                <span className="toggle-label">Show Recommended</span>
                <div className={`notification-toggle ${showRecommended ? 'active' : ''}`}>
                    <div className="toggle-circle"></div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationToggle;
