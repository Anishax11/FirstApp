import React, { useEffect, useState } from 'react';
import { fetchHackathons } from '../api';
import HackathonCard from './HackathonCard';
import './InternshipList.css';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading hackathons...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="hackathon-grid">
      {hackathons.map((hackathon, index) => (
        <HackathonCard
          key={index}
          hackathon={hackathon}
          isRecommended={false} // badge hidden for all hackathons
        />
      ))}
    </div>
  );
};

export default HackathonList;
