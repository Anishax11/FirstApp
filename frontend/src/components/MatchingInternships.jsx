import React, { useEffect, useState } from 'react';
import { fetchMatchingInternships } from '../api';
import InternshipCard from './InternshipCard';
import './MatchingInternships.css';

const MatchingInternships = () => {
    const [matchingInternships, setMatchingInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMatching = async () => {
            try {
                // Assuming fetchMatchingInternships handles the fetch, we just wrap it
                const data = await fetchMatchingInternships();
                if (Array.isArray(data)) {
                    setMatchingInternships(data);
                }
            } catch (err) {
                // Handle 401 remotely or specific errors if propagated
                console.warn("Failed to load matching internships (likely 401 or network):", err);
                setMatchingInternships([]); // Fallback to empty to avoid crash
            } finally {
                setLoading(false);
            }
        };

        loadMatching();
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
                        key={internship.id || Math.random()}
                        internship={internship}
                        isRecommended={true}
                    />
                ))}
            </div>
        </section>
    );
};

export default MatchingInternships;
