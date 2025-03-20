// Camera.js
import React, { useRef, useEffect, useState } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.warn("Play interrupted:", err);
          });
        }
        setIsCapturing(true);
      } catch (error) {
        console.error("Camera access error:", error);
        setIsCapturing(false);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: '320px', height: '240px', background: '#000' }} muted />
    </div>
  );
};

export default React.memo(Camera);