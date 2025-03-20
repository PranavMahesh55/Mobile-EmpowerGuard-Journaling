import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmotionTrendChart from '../components/EmotionTrendChart'; // Ensure EmotionTrendChart is updated accordingly

// Color mapping for tone (keys in lowercase)
const toneColors = {
  angry: '#ff4d4d',
  sad: '#4da6ff',
  neutral: '#999999',
  happy: '#ffd11a'
};

// Tone mapping: assign numeric values to tones (max value = 4)
const toneMapping = {
  Angry: 1,
  Sad: 2,
  Neutral: 3,
  Happy: 4,
  "Not provided": 3,
};

// Normalization function for tone strings
const normalizeTone = (tone) => {
  if (!tone) return "Not provided";
  const normalized = tone.charAt(0).toUpperCase() + tone.slice(1).toLowerCase();
  if (normalized === "Anger") return "Angry";
  if (normalized === "Positive") return "Happy";
  return normalized;
};

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [emotionSummary, setEmotionSummary] = useState({}); // Overall summary based on text tone
  const [refreshToggle, setRefreshToggle] = useState(false); // Optional: force re-fetch when needed
  const [showCameraNotice, setShowCameraNotice] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [refreshToggle]);

  const fetchEntries = () => {
    axios.get('/api/journal')
      .then(response => {
        console.log("Fetched entries from API:", response.data);
        setEntries(response.data);
        aggregateAllTones(response.data);
      })
      .catch(error => console.error("Error fetching entries:", error));
  };

  // Aggregate overall tone counts from text-based analysis
  const aggregateAllTones = (entries) => {
    const counts = {};
    let total = 0;
    entries.forEach(entry => {
      if (entry.emotionalContext && entry.emotionalContext.tone && entry.emotionalContext.tone !== "Not provided") {
        const normalizedTone = normalizeTone(entry.emotionalContext.tone);
        counts[normalizedTone] = (counts[normalizedTone] || 0) + 1;
        total++;
      }
    });
    const percentages = {};
    if(total > 0) {
      Object.keys(counts).forEach(tone => {
        percentages[tone] = ((counts[tone] / total) * 100).toFixed(1);
      });
    }
    setEmotionSummary(percentages);
  };

  // Compute average mood score from text-based tone using a simple mapping
  const computeAverageMoodScore = () => {
    let totalScore = 0;
    let count = 0;
    entries.forEach(entry => {
      if (entry.emotionalContext && entry.emotionalContext.tone) {
        const normalizedTone = normalizeTone(entry.emotionalContext.tone);
        if (toneMapping[normalizedTone] !== undefined) {
          totalScore += toneMapping[normalizedTone];
          count++;
        }
      }
    });
    return count > 0 ? (totalScore / count).toFixed(2) : "N/A";
  };

  return (
    <div style={styles.container}>
      {showCameraNotice && (
        <div style={styles.modalOverlay} onClick={() => setShowCameraNotice(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Camera Notice</h3>
            <p>
              For the purpose of analyzing your mood, your camera is being used to track your facial expressions.
              This data helps provide you with personalized insights and recommendations.
            </p>
            <button onClick={() => setShowCameraNotice(false)} style={styles.closeModalButton}>
              OK
            </button>
          </div>
        </div>
      )}
      <h2 style={styles.header}>Dashboard</h2>
      
      {/* Overall Emotion Summary Panel (Text-based tone) */}
      <div style={styles.overallSummary}>
        <h3>Overall Emotion Summary (All Journals)</h3>
        {Object.keys(emotionSummary).length > 0 ? (
          <div style={styles.emotionBarContainer}>
            {Object.entries(emotionSummary).map(([tone, percent]) => (
              <div
                key={tone}
                style={{
                  ...styles.emotionBarSegment,
                  backgroundColor: toneColors[tone.toLowerCase()] || '#000',
                  width: `${percent}%`
                }}
              >
                <span style={styles.emotionBarLabel}>{tone} {percent}%</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No emotion data available.</p>
        )}
      </div>

      {/* Average Mood Score Panel with additional context */}
      <div style={styles.summaryPanel}>
        <h3>Average Mood Score</h3>
        <p>
          This score is calculated from your journal entries’ overall emotional tone (as determined by text analysis).
          It ranges from 1 (low mood, e.g. Angry or Sad) to 4 (high mood, e.g. Happy).
          A higher score indicates you are generally feeling more positive.
        </p>
        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{computeAverageMoodScore()}</p>
      </div>

      {/* Interactive Charts Section (Tone Trend) */}
      <div style={styles.chartSection}>
        <h3>Tone Trend Over Time</h3>
        <EmotionTrendChart entries={entries} />
      </div>

      {/* List of Journal Entries with Individual Mood Meters */}
      <div style={styles.entriesList}>
        <h3>Your Journal Entries - Mood Analysis</h3>
        {entries.length === 0 ? (
          <p>No journal entries found.</p>
        ) : (
          entries.map(entry => {
            const tone = entry.emotionalContext && entry.emotionalContext.tone;
            const normalizedTone = normalizeTone(tone);
            let toneValue = 0;
            if (normalizedTone && toneMapping[normalizedTone]) {
              toneValue = toneMapping[normalizedTone];
            }
            // Calculate fill percentage based on a max value of 4
            const fillPercentage = toneValue ? (toneValue / 4) * 100 : 0;
            return (
              <div key={entry._id} style={styles.entryCard}>
                <h4>{entry.title || "Untitled Entry"}</h4>
                <p>{entry.date}</p>
                {normalizedTone && normalizedTone !== "Not provided" ? (
                  <div style={styles.moodMeterContainer}>
                    <div
                      style={{
                        ...styles.moodMeterFill,
                        width: `${fillPercentage}%`,
                        backgroundColor: toneColors[normalizedTone.toLowerCase()] || '#000',
                      }}
                    />
                    <span style={styles.moodMeterLabel}>
                      {normalizedTone} ({fillPercentage.toFixed(0)}%)
                    </span>
                  </div>
                ) : (
                  <p>No tone data available.</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '20px'
  },
  overallSummary: {
    marginBottom: '40px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  },
  emotionBarContainer: {
    display: 'flex',
    width: '100%',
    height: '25px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    overflow: 'hidden',
    marginTop: '10px'
  },
  emotionBarSegment: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff'
  },
  emotionBarLabel: {
    padding: '0 4px'
  },
  summaryPanel: {
    marginBottom: '40px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#e8f5e9'
  },
  chartSection: {
    marginBottom: '40px'
  },
  entriesList: {
    marginTop: '20px'
  },
  entryCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  moodMeterContainer: {
    position: 'relative',
    height: '25px',
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: '5px',
    marginTop: '10px'
  },
  moodMeterFill: {
    height: '100%',
    borderRadius: '5px 0 0 5px'
  },
  moodMeterLabel: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    textAlign: 'center',
    lineHeight: '25px',
    fontSize: '12px',
    color: '#000'
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  closeModalButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Dashboard;