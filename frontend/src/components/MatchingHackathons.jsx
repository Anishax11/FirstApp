import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { fetchMatchingHackathons } from '../api';
import HackathonCard from './HackathonCard';
import './MatchingInternships.css';

const MatchingHackathons = () => {
  const [matchingHackathons, setMatchingHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatchingHackathons = async () => {
      if (!auth.currentUser) return; // wait for auth
      try {
        const data = await fetchMatchingHackathons();
        setMatchingHackathons(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    loadMatchingHackathons();
  }, [auth.currentUser]);
  

  if (loading) return null;
  if (matchingHackathons.length === 0) return null;

  return (
    <section className="matching-section">
      <div className="matching-header">
        <span className="badge">For You</span>
        <h2 className="section-title">Recommended Hackathons</h2>
        <p className="subtitle">Curated based on your profile and interests</p>
      </div>

      <div className="matching-grid">
        {matchingHackathons.map((hackathon) => (
          <HackathonCard
            key={hackathon.id}
            hackathon={hackathon}
            isRecommended={true}
          />
        ))}
      </div>
    </section>
  );
};

export default MatchingHackathons;

