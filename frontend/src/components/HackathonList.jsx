import React, { useEffect, useState } from 'react';
import { fetchHackathons, fetchMatchingHackathons } from '../api';
import RecommendationToggle from './RecommendationToggle';
import ResumeWarningBanner from './ResumeWarningBanner';
import OpportunityCard from './OpportunityCard';
import './InternshipList.css';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRecommended, setShowRecommended] = useState(false);
  const [recommendedHackathons, setRecommendedHackathons] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchHackathons();
        if (Array.isArray(data)) {
          setHackathons(data);
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
    if (showRecommended && recommendedHackathons.length === 0) {
      setLoadingRecommended(true);
      fetchMatchingHackathons()
        .then(data => {
          if (Array.isArray(data)) {
            const sorted = data.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
            setRecommendedHackathons(sorted);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingRecommended(false));
    }
  }, [showRecommended, recommendedHackathons.length]);

  if (loading) return <p>Loading hackathons...</p>;
  if (error) return <p>Error: {error}</p>;

  const displayedHackathons = showRecommended
    ? hackathons.filter(h => !recommendedHackathons.some(r => r.id === h.id))
    : hackathons;

  return (
    <div className="hackathon-page-container">
      <ResumeWarningBanner />
      <div style={{ padding: '0 2rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <RecommendationToggle showRecommended={showRecommended} setShowRecommended={setShowRecommended} />
      </div>

      {showRecommended && (
        <section className="recommended-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)' }}>FOR YOU</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>Recommended for You</h2>
          </div>

          {loadingRecommended ? (
            <p>Finding best matches...</p>
          ) : (
            <div className="hackathon-grid">
              {recommendedHackathons.map((hackathon, index) => (
                <OpportunityCard
                  key={`rec-${hackathon.id || index}`}
                  item={hackathon}
                  type="hackathon"
                  isRecommended={true}
                />
              ))}
              {recommendedHackathons.length === 0 && <p>No specific recommendations found.</p>}
            </div>
          )}
        </section>
      )}

      <section className="all-hackathons-section">
        <h2 className="section-title">All Hackathons</h2>
        <div className="hackathon-grid">
          {displayedHackathons.map((hackathon, index) => (
            <OpportunityCard
              key={hackathon.id || index}
              item={hackathon}
              type="hackathon"
              isRecommended={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HackathonList;

