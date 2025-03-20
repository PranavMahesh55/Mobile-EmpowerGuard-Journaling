// Journal.js
import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { analyzeEmotionalTone } from '../backend/emotionalAnalysis';
import FaceApiEmotionAnalysis from './FaceApiEmotionAnalysis';



const Journal = ({ username }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(new Date());
  const [previewMode, setPreviewMode] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [geolocation, setGeolocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [emotionResult, setEmotionResult] = useState(null);
    // New state: store the emotion log (an array of detected emotions)
    const [emotionLog, setEmotionLog] = useState([]);

    const handleEmotionDetected = useCallback((emotion) => {
      console.log('Detected emotion (camera):', emotion);
      setEmotionLog(prevLog => [
        ...prevLog,
        { emotion, timestamp: new Date().toISOString() }
      ]);
    }, []);

  // Auto-save simulation: auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 30000);
    return () => clearInterval(autoSaveInterval);
    // eslint-disable-next-line
  }, [title, content, tags, mediaFiles, date]);

  const handleAutoSave = async () => {
    console.log("Auto-saving draft...");
    // Optionally, implement auto-save to backend here
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles([...mediaFiles, ...files]);
  };

  const fetchGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGeolocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSave = async () => {
    // Add debug logs here
    console.log("Emotion log before save:", emotionLog);
    console.log("Entry data to be saved:", {
      title,
      content,
      tags,
      date: date.toLocaleString(),
      geolocation,
      weather,
      mediaFiles: mediaFiles.map(file => file.name),
      emotionalContext: {
        tone: emotionLog.length > 0 ? emotionLog[emotionLog.length - 1].emotion : "Not provided",
        faceLog: emotionLog,
      },
    });
  
    try {
      const entryData = {
        title,
        content,
        tags,
        date: date.toLocaleString(),
        geolocation,
        weather,
        mediaFiles: mediaFiles.map(file => file.name),
        emotionalContext: {
          tone: emotionLog.length > 0 ? emotionLog[emotionLog.length - 1].emotion : "Not provided",
          // recommendations: [],
          log: emotionLog,
        },
      };
  
      const response = await axios.post("/api/journal", entryData);
      if (response.status === 201) {
        setTitle("");
        setContent("");
        setTags("");
        setMediaFiles([]);
        setGeolocation(null);
        setWeather(null);
        setEmotionLog([]); // Clear the emotion log after saving
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <h2>Journal Entry</h2>
        <p>Hello, {username}. Start capturing your thoughts.</p>

        {/* Entry Title */}
        <input 
          type="text" 
          placeholder="Entry Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        {/* Date & Time */}
        <div style={styles.date}>
          <span>Date: {date.toLocaleString()}</span>
          <button onClick={() => setDate(new Date())} style={styles.buttonSmall}>
            Update Date
          </button>
        </div>

        {/* Rich Text Editor / Preview */}
        <div style={styles.editorSection}>
          { previewMode ? (
            <div style={styles.preview} dangerouslySetInnerHTML={{__html: content}} />
          ) : (
            <ReactQuill 
              value={content}
              onChange={setContent}
              placeholder="Write your thoughts here..."
              style={styles.editor}
            />
          )}
        </div>

        {/* Tagging / Categorization */}
        <div style={styles.formRow}>
          <label style={styles.label}>Tags:</label>
          <input 
            type="text" 
            placeholder="e.g., work, personal" 
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Media Uploads */}
        <div style={styles.formRow}>
          <label style={styles.label}>Media:</label>
          <input type="file" multiple onChange={handleMediaUpload} style={styles.input} />
        </div>

        {/* Geolocation */}
        <div style={styles.formRow}>
          <button onClick={fetchGeolocation} style={styles.button}>
            Fetch Geolocation
          </button>
          { geolocation && (
            <span style={{ marginLeft: '10px' }}>
              Lat: {geolocation.latitude.toFixed(2)}, Lon: {geolocation.longitude.toFixed(2)}
            </span>
          )}
        </div>

        {/* Preview Mode Toggle */}
        <div style={styles.formRow}>
          <button onClick={() => setPreviewMode(!previewMode)} style={styles.button}>
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </button>
        </div>


        {/* Save Entry Button */} 
        <button onClick={handleSave} style={styles.saveButton}>
          Save Entry
        </button>

                {/* Camera- sed emotion analysis */}
       {/* Integrate the camera component for continuous emotion capture */}
      <FaceApiEmotionAnalysis onEmotionDetected={handleEmotionDetected} />

        {/* Display the captured emotion log */}
      {emotionLog.length > 0 && (
        <div style={styles.emotionLogContainer}>
          <h3>Emotion Log During Session:</h3>
          {emotionLog.map((log, index) => (
            <p key={index} style={styles.emotionLogItem}>
              {new Date(log.timestamp).toLocaleTimeString()}: {log.emotion}
            </p>
          ))}
        </div>
      )}
      </div>

      
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
  },
  mainContent: {
    flex: 1,
    marginRight: '300px', // Reserve space for the sidebar
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
  },
  date: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editorSection: {
    marginBottom: '70px',
  },
  editor: {
    height: '300px',
    marginBottom: '10px',
  },
  preview: {
    height: '300px',
    border: '1px solid #ccc',
    padding: '10px',
    overflowY: 'auto',
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  label: {
    minWidth: '60px',
    marginRight: '10px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  buttonSmall: {
    padding: '5px 10px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: 'green',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Journal;