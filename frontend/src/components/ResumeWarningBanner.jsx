import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ResumeWarningBanner.css';

const ResumeWarningBanner = () => {
    const { userData, loading } = useAuth();
    const navigate = useNavigate();

    // Unified check: User has uploaded if resumeText exists OR skills exist
    const hasResume =
        (userData?.resumeText && userData.resumeText.length > 50) ||
        (userData?.skills && userData.skills.length > 0);

    // If still loading or user has a resume, don't show the banner
    if (loading || hasResume) return null;

    return (
        <div className="resume-warning-banner">
            <div className="banner-content">
                <span className="info-icon">📝</span>
                <p>Upload your resume to view personalized recommendations based on your skills.</p>
            </div>
            <div className="banner-actions">
                <button onClick={() => navigate('/profile')} className="upload-btn">
                    Upload Resume
                </button>
            </div>
        </div>
    );
};

export default ResumeWarningBanner;
