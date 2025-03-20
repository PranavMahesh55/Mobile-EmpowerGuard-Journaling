// EmotionTrendChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Tone to numeric mapping (covers uppercase & lowercase)
function getToneValue(toneString) {
  const tone = toneString.toLowerCase();
  switch (tone) {
    case "angry":
    case "anger":
      return 1;
    case "sad":
      return 2;
    case "neutral":
      return 3;
    case "happy":
      return 4;
    default:
      return 0; // fallback if it's not recognized
  }
}

// For display on the y-axis
const reverseTone = {
  0: "Unknown",
  1: "Anger",
  2: "Sad",
  3: "Neutral",
  4: "Happy"
};

const EmotionTrendChart = ({ entries }) => {
  // 1. Sort entries by date (oldest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // 2. Labels (the date of each entry)
  const labels = sortedEntries.map(entry => entry.date);

  // 3. Convert each entry's text-based tone to a numeric value
  const dataPoints = sortedEntries.map(entry => {
    if (entry.emotionalContext && entry.emotionalContext.tone) {
      return getToneValue(entry.emotionalContext.tone);
    }
    return 0; // no tone
  });

  // 4. Chart data & config
  const data = {
    labels,
    datasets: [
      {
        label: "Tone Trend",
        data: dataPoints,
        fill: false,
        borderColor: "#1976d2",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: "Tone Trend Over Time" },
    },
    scales: {
      y: {
        min: 0,
        max: 4, // We have 4 levels: 1=Anger, 2=Sad, 3=Neutral, 4=Happy
        ticks: {
          stepSize: 1,
          callback: (value) => reverseTone[value] || "Unknown",
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default EmotionTrendChart;