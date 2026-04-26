import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2 style={{ color: '#6366f1' }}>{title}</h2>
      <div style={{ 
        backgroundColor: '#fffbeb', 
        border: '1px solid #fde68a', 
        padding: '20px', 
        borderRadius: '12px',
        marginTop: '20px',
        maxWidth: '500px',
        margin: '20px auto'
      }}>
        <p style={{ color: '#92400e', fontWeight: 'bold' }}>🚧 Section Under Maintenance</p>
        <p style={{ color: '#4b5563' }}>
          This feature is currently being developed. It doesn't block your habit tracking!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;