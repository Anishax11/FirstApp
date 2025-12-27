import React from 'react';

const Opportunities = () => {
    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Opportunities</h1>
            <p>Explore upcoming hackathons, coding contests, and other events to showcase your skills.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
                    <h3>Hackathon 2025</h3>
                    <p>Join the biggest student hackathon of the year.</p>
                    <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View Details</button>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
                    <h3>Code Challenge</h3>
                    <p>Test your algorithms skills in this weekend challenge.</p>
                    <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View Details</button>
                </div>
            </div>
        </div>
    );
};

export default Opportunities;
