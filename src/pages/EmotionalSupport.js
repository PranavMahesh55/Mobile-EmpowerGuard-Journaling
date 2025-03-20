import React from 'react';

// Define a mapping from emotional tones to support links
const supportLinks = {
  hopeless: [
    { text: "Depression Help", url: "https://www.depression.org" },
    { text: "Talk to a Counselor", url: "https://www.betterhelp.com" },
  ],
  angry: [
    { text: "Calm Down Techniques", url: "https://www.anger.com" },
    { text: "Mindfulness Meditation", url: "https://www.headspace.com/meditation/mindfulness" },
  ],
  sad: [
    { text: "Coping with Sadness", url: "https://www.samaritans.org" },
    { text: "Crisis Support", url: "https://www.crisistextline.org" },
  ],
  // Add more mappings as needed
};

const EmotionalSupportSidebar = ({ tone }) => {
  let links = [];
  if (tone) {
    const lowerTone = tone.toLowerCase();
    if (lowerTone.includes("hopeless") || lowerTone.includes("depress")) {
      links = supportLinks.hopeless;
    } else if (lowerTone.includes("angry")) {
      links = supportLinks.angry;
    } else if (lowerTone.includes("sad")) {
      links = supportLinks.sad;
    }
  }

  if (links.length === 0) {
    return null; // Or return a default message if no tone is detected
  }

  return (
    <div style={sidebarStyle}>
      <h3>Support Resources</h3>
      <ul style={listStyle}>
        {links.map((link, index) => (
          <li key={index} style={itemStyle}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const sidebarStyle = {
  position: "fixed",
  right: "20px",
  top: "100px",
  width: "250px",
  padding: "15px",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
};

const itemStyle = {
  marginBottom: "10px",
};

const linkStyle = {
  color: "#1976d2",
  textDecoration: "none",
  fontWeight: "bold",
};

export default EmotionalSupportSidebar;