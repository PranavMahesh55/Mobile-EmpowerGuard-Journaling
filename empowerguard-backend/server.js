import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { analyzeEmotionalTone } from './emotionalAnalysis.js'; // Use the ESM version

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define a Schema and Model for journal entries
const journalEntrySchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: String,
  date: String,
  mediaFiles: [String],
  geolocation: {
    latitude: Number,
    longitude: Number
  },
  weather: Object,
  emotionalContext: {
    // These fields come from text analysis for the Home screen
    tone: { type: String, default: "Not provided" },
    recommendations: { type: [String], default: [] },
    // We no longer use face-based data; force it to be empty
    faceLog: { type: [{
      emotion: { type: String },
      timestamp: { type: String }
    }], default: [] }
  }
});

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

// POST /api/journal - Create new journal entry
app.post('/api/journal', async (req, res) => {
  console.log("Request body received:", req.body);
  try {
    const { title, content, tags, date, geolocation, weather, mediaFiles } = req.body;
    
    // Run text-based analysis for tone & recommendations
    const textAnalysis = await analyzeEmotionalTone(content);
    
    // Build final emotionalContext using text analysis results only
    const finalEmotionalContext = {
      tone: textAnalysis.tone,
      recommendations: textAnalysis.recommendations.length > 0
        ? textAnalysis.recommendations
        : [
            "Consider taking a short break.",
            "Talk to someone you trust.",
            "Try deep breathing exercises."
          ],
      faceLog: [] // Force empty since we're not using face data now
    };
    
    const newEntry = new JournalEntry({
      title,
      content,
      tags,
      date,
      geolocation,
      weather,
      mediaFiles,
      emotionalContext: finalEmotionalContext,
    });
    
    await newEntry.save();
    return res.status(201).json({ message: "Journal entry created", entry: newEntry });
  } catch (error) {
    console.error("Error saving journal entry:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/journal - Retrieve all journal entries
app.get('/api/journal', async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ _id: -1 });
    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/journal/:id - Delete a journal entry
app.delete('/api/journal/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json({ message: "Entry deleted", entry });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));