import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FaceApiEmotionAnalysis from './FaceApiEmotionAnalysis';


const Home = ({ username }) => {
  const [entries, setEntries] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Fetch entries from the backend on mount
  useEffect(() => {
    fetchEntries();
  }, []);
  const aggregateEmotionLog = (log) => {
    return log.reduce((acc, { emotion }) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});
  };

  const fetchEntries = () => {
    axios.get('/api/journal')
      .then(response => setEntries(response.data))
      .catch(error => console.error('Error fetching entries:', error));
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`/api/journal/${id}`);
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('An error occurred while deleting the entry.');
    }
  };

  // Filter entries by title or tags based on searchTerm
  const filteredEntries = entries.filter(entry => {
    const term = searchTerm.toLowerCase();
    return (
      (entry.title && entry.title.toLowerCase().includes(term)) ||
      (entry.tags && entry.tags.toLowerCase().includes(term))
    );
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.headerText}>Welcome to EmpowerGuard Journaling</h2>
      
      {/* Search/Filter Bar */}
      <div style={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Search by title or tags..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Centered Button to create a new journal entry */}
      <Link to="/journal" style={styles.newEntryButton}>New Journal Entry</Link>

      <section style={styles.entriesSection}>
        <h3 style={styles.sectionHeader}>Previously Saved Journal Entries</h3>
        {filteredEntries.length === 0 ? (
          <p>No entries found. Start by creating a new journal entry.</p>
        ) : (
          filteredEntries.map((entry, index) => (
            <div key={entry._id} style={styles.entryCard}>
              <div style={styles.entryHeader}>
                <h4 style={styles.entryTitle}>{entry.title || "Untitled Entry"}</h4>
                <span style={styles.entryDate}>{entry.date}</span>
              </div>
              <p style={styles.tags}><strong>Tags:</strong> {entry.tags || "None"}</p>
              
              {expandedIndex === index ? (
  <div style={styles.expandedContent}>
    {/* Journal Entry Content */}
    <div 
      dangerouslySetInnerHTML={{ __html: entry.content }} 
      style={styles.entryContent} 
    />

    {/* Display Emotional Tone */}
    {entry.emotionalContext && entry.emotionalContext.tone && (
      <p style={styles.toneText}>
        <strong>Emotional Tone:</strong> {entry.emotionalContext.tone}
      </p>
    )}

    {/* Display Recommendations */}
    {entry.emotionalContext && (
      <div style={styles.recommendations}>
        <h5>Recommendations:</h5>
        {entry.emotionalContext.recommendations && entry.emotionalContext.recommendations.length > 0 ? (
          entry.emotionalContext.recommendations.map((rec, i) => (
            <p key={i} style={styles.recommendationItem}>{rec}</p>
          ))
        ) : (
          <p style={styles.recommendationItem}>No recommendations available.</p>
        )}
      </div>
    )}

    {/* Media Files */}
    {entry.mediaFiles && entry.mediaFiles.length > 0 && (
      <ul style={styles.mediaList}>
        {entry.mediaFiles.map((file, i) => (
          <li key={i} style={styles.mediaItem}>{file}</li>
        ))}
      </ul>
    )}

    {/* Geolocation */}
    {entry.geolocation && (
      <p style={styles.locationText}>
        Location: Lat {entry.geolocation.latitude}, Lon {entry.geolocation.longitude}
      </p>
    )}

    {/* Button Group for Hide and Delete */}
    <div style={styles.buttonGroup}>
      <button onClick={() => toggleExpand(index)} style={styles.button}>
        Hide
      </button>
      <button 
        onClick={() => deleteEntry(entry._id)} 
        style={{ ...styles.button, backgroundColor: 'red' }}
      >
        Delete
      </button>
    </div>
  </div>
) : (
  <button onClick={() => toggleExpand(index)} style={styles.button}>
    View
  </button>
)}
            </div>
          ))
        )}
      </section>

      {/* Fixed Help Button on Bottom Right */}
      <button 
        style={styles.helpButton} 
        onClick={() => setShowHelpModal(!showHelpModal)}
      >
        Need Help?
      </button>

      {/* Human Rights Help Modal */}
      {showHelpModal && (
        <div style={styles.modalOverlay} onClick={() => setShowHelpModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Human Rights Support</h3>
            <p>If you need help, please consider the following resources:</p>
            <p><strong>Emergency:</strong> Call 911 immediately if you are in immediate danger.</p>
            <p>
              For further assistance, visit{" "}
              <a href="https://www.humanrightscare.org" target="_blank" rel="noopener noreferrer">
                Human Rights Care
              </a>
            </p>
            <p>
              Or contact our Crisis Hotline at{" "}
              <a href="tel:911" target="_blank" rel="noopener noreferrer">
                911
              </a>
            </p>
            <button onClick={() => setShowHelpModal(false)} style={styles.closeModalButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    maxWidth: '900px',
    margin: '0 auto'
  },
  headerText: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px'
  },
  emotionLog: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  emotionLogItem: {
    fontSize: '14px',
    marginBottom: '5px'
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  searchInput: {
    width: '80%',
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  newEntryButton: {
    display: 'block',
    width: 'fit-content',
    padding: '10px 15px',
    backgroundColor: '#1976d2',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    margin: '0 auto 20px auto'
  },
  entriesSection: {
    marginTop: '20px'
  },
  sectionHeader: {
    borderBottom: '2px solid #1976d2',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  entryCard: {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  entryTitle: {
    margin: 0,
    fontSize: '20px'
  },
  entryDate: {
    fontSize: '14px',
    color: '#666'
  },
    emotionSummary: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#f0f8ff',
      border: '1px solid #ccc',
      borderRadius: '5px'
    },
    emotionSummaryItem: {
      fontSize: '14px',
      marginBottom: '5px'
    },
  tags: {
    marginBottom: '10px',
    fontStyle: 'italic'
  },
  toneText: {
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '10px'
  },
  recommendations: {
    backgroundColor: '#e7f3ff',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px'
  },
  recommendationItem: {
    fontSize: '14px',
    marginBottom: '5px'
  },
  entryContent: {
    border: '1px solid #eee',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f5f5f5'
  },
  mediaList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '10px'
  },
  mediaItem: {
    fontSize: '14px',
    marginBottom: '5px'
  },
  locationText: {
    fontSize: '14px',
    color: '#444',
    marginBottom: '10px'
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  helpButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '15px 20px',
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    fontSize: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  closeModalButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Home;