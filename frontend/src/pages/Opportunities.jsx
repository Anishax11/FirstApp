import React, { useEffect, useState } from 'react';
import { fetchInternships, fetchHackathons, fetchMatchingInternships, fetchMatchingHackathons } from '../api';
import RecommendationToggle from '../components/RecommendationToggle';
import ResumeWarningBanner from '../components/ResumeWarningBanner';
import OpportunityCard from '../components/OpportunityCard';
import SkeletonCard from '../components/SkeletonCard';
import './Opportunities.css';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRecommended, setShowRecommended] = useState(false);
    const [recommendedOps, setRecommendedOps] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    // Fetch all items initially
    useEffect(() => {
        const loadAll = async () => {
            try {
                const [internships, hackathons] = await Promise.all([
                    fetchInternships(),
                    fetchHackathons()
                ]);

                // Tag them
                const taggedInternships = internships.map(i => ({ ...i, type: 'internship' }));
                const taggedHackathons = hackathons.map(h => ({ ...h, type: 'hackathon' }));

                // Shuffle or just concat
                setOpportunities([...taggedInternships, ...taggedHackathons]);
            } catch (error) {
                console.error("Error fetching opportunities:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    // Fetch recommendations when toggled
    useEffect(() => {
        if (showRecommended && recommendedOps.length === 0) {
            setLoadingRecs(true);
            Promise.all([fetchMatchingInternships(), fetchMatchingHackathons()])
                .then(([ints, hacks]) => {
                    const combined = [
                        ...ints.map(i => ({ ...i, type: 'internship' })),
                        ...hacks.map(h => ({ ...h, type: 'hackathon' }))
                    ];
                    // Sort combined by match percentage
                    const sorted = combined.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
                    setRecommendedOps(sorted);
                })
                .catch(console.error)
                .finally(() => setLoadingRecs(false));
        }
    }, [showRecommended]);

    const displayedOps = showRecommended
        ? opportunities.filter(op => !recommendedOps.some(r => r.id === op.id && r.type === op.type))
        : opportunities;

    return (
        <div className="opportunities-container">
            <div className="page-header">
                <div>
                    <h1>Opportunities</h1>
                    <p className="subtitle">Internships, hackathons, and challenges tailored for your growth</p>
                </div>
                <RecommendationToggle showRecommended={showRecommended} setShowRecommended={setShowRecommended} />
            </div>

            <ResumeWarningBanner />

            {showRecommended && (
                <section className="highlight-section">
                    <div className="section-badge">
                        <span className="star-icon">⭐</span> Recommended For You
                    </div>
                    {loadingRecs ? (
                        <p>Finding best matches...</p>
                    ) : (
                        <div className="ops-grid">
                            {recommendedOps.map((op, i) => (
                                <OpportunityCard
                                    key={`rec-${op.id}`}
                                    item={op}
                                    type={op.type}
                                    isRecommended={true}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            <section className="all-ops-section">
                {!showRecommended && <h2>Explore All</h2>}
                {loading ? (
                    <div className="ops-grid">
                        {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
                    </div>
                ) : (
                    <div className="ops-grid">
                        {displayedOps.map((op, i) => (
                            <div key={`${op.type}-${op.id}`} className="card-wrapper">
                                <OpportunityCard
                                    item={op}
                                    type={op.type}
                                    isRecommended={false}
                                />
                            </div>
                        ))}
                        {displayedOps.length === 0 && <p className="empty-state">No opportunities found.</p>}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Opportunities;
