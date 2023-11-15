import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [videoSrc, setVideoSrc] = useState(
    "https://www.shutterstock.com/shutterstock/videos/1033213934/preview/stock-footage-portrait-of-white-furry-cat-in-fashion-eyeglasses-studio-neon-light-footage-luxurious-domestic.webm"
  );
  const [adSrc, setAdSrc] = useState(
    "https://www.shutterstock.com/shutterstock/videos/1098637537/preview/stock-footage-portrait-of-a-disco-fluffy-cat-wearing-trendy-glasses-on-a-studio-neon-glowing-wall.webm"
  );
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [originalVideoCurrentTime, setOriginalVideoCurrentTime] = useState(0);

  const videoRef = useRef(null);
  const adRef = useRef(null);

  useEffect(() => {
    // Auto-play the main video when the page loads
    if (videoRef.current) {
      videoRef.current.play();
    }

    const timer = setTimeout(() => {
      if (videoRef.current) {
        setOriginalVideoCurrentTime(videoRef.current.currentTime);
        videoRef.current.pause();
        switchToAd();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const switchToAd = () => {
    setIsAdPlaying(true);
    setShowSkipButton(true);

    // Auto-play the ad video
    if (adRef.current) {
      adRef.current.play();
    }
  };

  const skipAd = () => {
    setIsAdPlaying(false);

    // Set the original video back to its previous state
    if (videoRef.current) {
      videoRef.current.currentTime = originalVideoCurrentTime;
      videoRef.current.play();
    }

    setShowSkipButton(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {isAdPlaying ? (
        <div>
          <AdOverlay handleSkipAd={skipAd} />
          <AdVideo adSrc={adSrc} adRef={adRef} handleSkipAd={skipAd} />
        </div>
      ) : (
        <OriginalVideo videoSrc={videoSrc} videoRef={videoRef} />
      )}
    </div>
  );
};

const AdOverlay = ({ handleSkipAd }) => (
  <div>
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        color: "white",
        fontSize: "14px",
        textDecoration: "underline",
        cursor: "pointer",
        backdropFilter: "blur(5px)"
      }}
    >
      Visit the advertiser
    </div>
    <SkipAdButton handleSkipAd={handleSkipAd} />
  </div>
);

const SkipAdButton = ({ handleSkipAd }) => (
  <button
    style={{
      position: "absolute",
      bottom: "10px",
      right: "10px",
      cursor: "pointer",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      backdropFilter: "blur(5px)"
    }}
    onClick={handleSkipAd}
  >
    Skip Ad
  </button>
);

const AdVideo = ({ adSrc, adRef, handleSkipAd }) => (
  <div>
    <video ref={adRef} controls autoPlay onEnded={handleSkipAd}>
      <source type="video/webm" src={adSrc} />
    </video>
    <p
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        color: "white",
        fontSize: "14px",
        backdropFilter: "blur(5px)"
      }}
    >
      Sponsored
    </p>
  </div>
);

const OriginalVideo = ({ videoSrc, videoRef }) => (
  <video
    ref={videoRef}
    controls
    autoPlay
    style={{ width: "100%", height: "100%" }}
  >
    <source type="video/webm" src={videoSrc} />
  </video>
);

export default App;
