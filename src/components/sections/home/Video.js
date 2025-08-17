import React, { useState, useRef, useEffect } from 'react';
import { useVideos } from '../../../hook/video/useVideoQuery';
import './video.css';

const baseUrl = 'https://bmgjewellers.com';

const Video = () => {
  const { data: videos, isLoading, isError } = useVideos();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const videoList = videos?.data || [];

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left - next video
      setCurrentIndex(prev => (prev + 1) % videoList.length);
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right - previous video
      setCurrentIndex(prev => (prev - 1 + videoList.length) % videoList.length);
    }
  };

  // Auto-scroll to current video
  useEffect(() => {
    if (containerRef.current && videoList.length > 0) {
      const container = containerRef.current;
      const videoElement = container.children[currentIndex];
      if (videoElement) {
        const containerWidth = container.offsetWidth;
        const videoWidth = videoElement.offsetWidth;
        const videoLeft = videoElement.offsetLeft;

        container.scrollTo({
          left: videoLeft - (containerWidth / 2) + (videoWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex, videoList.length]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % videoList.length);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + videoList.length) % videoList.length);
  };

  const goToNextModal = () => {
    const nextIndex = (selectedVideoIndex + 1) % videoList.length;
    setSelectedVideoIndex(nextIndex);
    const nextVideoUrl = `${baseUrl}${videoList[nextIndex].video_path}`;
    setSelectedVideo(nextVideoUrl);
  };

  const goToPrevModal = () => {
    const prevIndex = (selectedVideoIndex - 1 + videoList.length) % videoList.length;
    setSelectedVideoIndex(prevIndex);
    const prevVideoUrl = `${baseUrl}${videoList[prevIndex].video_path}`;
    setSelectedVideo(prevVideoUrl);
  };

  const openVideoModal = (videoUrl, index) => {
    setSelectedVideo(videoUrl);
    setSelectedVideoIndex(index);
  };

  if (isLoading) return <div className="video-loading">Loading videos...</div>;
  if (isError) return <div className="video-error">Error loading videos</div>;

  return (
    <section
      className="video-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="video-section-title">Our Video Gallery</h2>

      <div className="video-navigation">
        <button className="nav-arrow prev-arrow" onClick={goToPrev}>
          ←
        </button>

        <div
          className="video-container"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {videoList.map((video, index) => {
            const videoUrl = `${baseUrl}${video.video_path}`;
            const isActive = index === currentIndex;

            return (
              <div
                className={`video-card ${isActive ? 'active' : ''}`}
                key={index}
                onClick={() => openVideoModal(videoUrl, index)}
              >
                <div className="video-wrapper">
                  <video
                    src={videoUrl}
                    className="video-thumb"
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                  />
                  {isActive && (
                    <div className="video-indicator">
                      {index + 1}/{videoList.length}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button className="nav-arrow next-arrow" onClick={goToNext}>
          →
        </button>
      </div>

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <video
              src={selectedVideo}
              autoPlay
              controls
              loop
              playsInline
              className="video-modal-player"
            />

            <button className="modal-nav-arrow prev" onClick={goToPrevModal}>
              ←
            </button>

            <button className="modal-nav-arrow next" onClick={goToNextModal}>
              →
            </button>

            <button
              className="video-modal-close"
              onClick={() => setSelectedVideo(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Video;