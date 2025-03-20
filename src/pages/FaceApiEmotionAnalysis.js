// FaceApiEmotionAnalysis.js
import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceApiEmotionAnalysis = ({ onEmotionDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models/face-api';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      console.log('Face-api models loaded');
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Handle play promise
        videoRef.current.play().catch(err => {
          console.warn("Play interrupted:", err);
        });
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  useEffect(() => {
    if (!modelsLoaded) return;
    startVideo();

    const intervalId = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceExpressions();
        if (detection && detection.expressions) {
          // Find the expression with the highest probability
          const expressions = detection.expressions;
          const detectedEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );
          console.log('Detected Emotion:', detectedEmotion);

          // Capitalize the detected emotion, e.g. "happy" → "Happy"
          const capitalizedEmotion =
            detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1);

          // Call the provided callback with the capitalized emotion
          if (onEmotionDetected) {
            onEmotionDetected(capitalizedEmotion);
          }
        }
      }
    }, 5000); // Capture every 5 seconds; adjust as needed

    return () => clearInterval(intervalId);
  }, [modelsLoaded, onEmotionDetected]);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: '320px', height: '240px', background: '#000' }}
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default FaceApiEmotionAnalysis;