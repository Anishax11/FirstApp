import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="skeleton-wrapper">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-subtitle"></div>
            <div className="skeleton-text skeleton-desc"></div>
            <div className="skeleton-text skeleton-desc" style={{ width: '80%' }}></div>
            <div className="skeleton-tags">
                <div className="skeleton-text skeleton-tag"></div>
                <div className="skeleton-text skeleton-tag"></div>
                <div className="skeleton-text skeleton-tag"></div>
            </div>
            <div className="skeleton-text" style={{ height: '40px', marginTop: '1.5rem', borderRadius: '12px' }}></div>
        </div>
    );
};

export default SkeletonCard;
