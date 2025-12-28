import React, { useEffect, useState } from 'react';
import { fetchMatchingInternships } from '../api';
import InternshipCard from './InternshipCard';
import './MatchingInternships.css';



const MatchingInternships = () => {
  const [matchingInternships, setMatchingInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatchingInternships = async () => {
      try {
        const data = await fetchMatchingInternships();
        setMatchingInternships(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchingInternships();
  }, []);

  if (loading) return null;
  if (matchingInternships.length === 0) return null;

  return (
    <section className="matching-section">
      <div className="matching-header">
        <span className="badge">For You</span>
        <h2 className="section-title">Recommended Internships</h2>
        <p className="subtitle">Curated based on your profile and skills</p>
      </div>

      <div className="matching-grid">
        {matchingInternships.map((internship) => (
          <InternshipCard
            key={internship.id}
            internship={internship}
            isRecommended={true}
          />
        ))}
      </div>
    </section>
  );
};

export default MatchingInternships;
