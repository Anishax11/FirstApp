import React, { useEffect, useState } from 'react';
import { fetchInternships, fetchMatchingInternships } from '../api';
import RecommendationToggle from './RecommendationToggle';
import ResumeWarningBanner from './ResumeWarningBanner';
import OpportunityCard from './OpportunityCard';
import './InternshipList.css';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showRecommended, setShowRecommended] = useState(false);
    const [recommendedInternships, setRecommendedInternships] = useState([]);
    const [loadingRecommended, setLoadingRecommended] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchInternships();
                if (Array.isArray(data)) {
                    setInternships(data);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (showRecommended && recommendedInternships.length === 0) {
            setLoadingRecommended(true);
            fetchMatchingInternships()
                .then(data => {
                    if (Array.isArray(data)) {
                        // Sort by match percentage if available
                        const sorted = data.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
                        setRecommendedInternships(sorted);
                    }
                })
                .catch(console.error)
                .finally(() => setLoadingRecommended(false));
        }
    }, [showRecommended]);

    if (loading) return <p>Loading internships...</p>;
    if (error) return <p>Error: {error}</p>;

    const displayedInternships = showRecommended
        ? internships.filter(i => !recommendedInternships.some(r => r.id === i.id))
        : internships;

    return (
        <div className="internship-page-container">
            <ResumeWarningBanner />
            <div style={{ padding: '0 2rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <RecommendationToggle showRecommended={showRecommended} setShowRecommended={setShowRecommended} />
            </div>

            {/* 4. Conditionally render MatchingInternships based on showRecommended state */}
            {showRecommended && (
                <section className="recommended-section" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <span className="badge" style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>FOR YOU</span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>Recommended for You</h2>
                    </div>

                    {loadingRecommended ? (
                        <p>Finding best matches...</p>
                    ) : (
                        <div className="internship-grid">
                            {recommendedInternships.map((internship, index) => (
                                <OpportunityCard
                                    key={`rec-${internship.id || index}`}
                                    item={internship}
                                    type="internship"
                                    isRecommended={true}
                                />
                            ))}
                            {recommendedInternships.length === 0 && <p>No specific recommendations found. Keep updating your profile!</p>}
                        </div>
                    )}
                </section>
            )}

            <section className="all-internships-section">
                <h2 className="section-title" style={{ padding: '0 2rem', marginTop: '1rem' }}>All Internships</h2>
                <div className="internship-grid">
                    {displayedInternships.map((internship, index) => (
                        <OpportunityCard
                            key={internship.id || index}
                            item={internship}
                            type="internship"
                            isRecommended={false}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default InternshipList;
