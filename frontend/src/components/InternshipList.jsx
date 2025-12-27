import React, { useEffect, useState } from 'react';
import { fetchInternships } from '../api';
import InternshipCard from './InternshipCard';
import './InternshipList.css';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Loading internships...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="internship-grid">
            {internships.map((internship, index) => (
                <InternshipCard
                    key={index}
                    internship={internship}
                    isRecommended={true}
                />
            ))}
        </div>
    );
};

export default InternshipList;
