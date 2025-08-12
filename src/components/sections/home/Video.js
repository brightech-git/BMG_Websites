import React, { useState, useRef, useEffect } from 'react';
import { useVideos } from '../../../hook/video/useVideoQuery';

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
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');

        /* Base layout */
        .video-section {
          padding: 60px 20px;
          background: linear-gradient(135deg, #f6f5f0 0%, #f6f5f0 100%);
          position: relative;
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
        }

        .video-section-title {
          font-family: 'Dancing Script', cursive;
          font-size: 3.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 50px;
          color: #2c2c2c;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .video-section-title::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #f4e4bc, #d4af37);
          border-radius: 2px;
        }

        .video-navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          position: relative;
        }

        /* Video container */
        .video-container {
          display: flex;
          gap: 20px;
          padding: 25px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          width: 80%;
          transition: all 0.3s ease;
        }

        .video-container::-webkit-scrollbar {
          display: none;
        }

        /* Video card styling */
        .video-card {
          scroll-snap-align: center;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          flex: 0 0 auto;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          width: 300px;
          height: 400px;
          background: linear-gradient(45deg, #fff, #fafafa);
        }

        .video-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .video-card.active {
          transform: scale(1.08) translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
          border: 3px solid #d4af37;
        }

        .video-card.active:hover {
          transform: scale(1.1) translateY(-8px);
        }

        .video-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
        }

        .video-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .video-card:hover .video-thumb {
          transform: scale(1.05);
        }

        .video-indicator {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        /* Navigation arrows */
        .nav-arrow {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 10;
          color: #2c2c2c;
          font-weight: bold;
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: scale(0.8);
        }

        .video-section:hover .nav-arrow {
          opacity: 1;
          transform: scale(1);
        }

        .nav-arrow:hover {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          color: white;
          transform: scale(1.15);
          box-shadow: 0 12px 30px rgba(212, 175, 55, 0.4);
        }

        .nav-arrow:active {
          transform: scale(1.05);
        }

        /* Modal styling */
        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
        }

        .video-modal-content {
          position: relative;
          width: 95%;
          height: 95%;
          max-width: 1200px;
          max-height: 90vh;
          background-color: #000;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .video-modal-player {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .video-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 35px;
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          cursor: pointer;
          z-index: 10;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .video-modal-close:hover {
          background: rgba(255, 0, 0, 0.7);
          transform: scale(1.1);
        }

        .modal-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          border: 2px solid rgba(212, 175, 55, 0.5);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          z-index: 10;
          color: #2c2c2c;
          font-weight: bold;
          backdrop-filter: blur(10px);
        }

        .modal-nav-arrow:hover {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          color: white;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 12px 30px rgba(212, 175, 55, 0.4);
        }

        .modal-nav-arrow.prev {
          left: 30px;
        }

        .modal-nav-arrow.next {
          right: 30px;
        }

        /* Loading/Error states */
        .video-loading, .video-error {
          text-align: center;
          font-size: 18px;
          padding: 40px;
          color: #666;
          font-weight: 500;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .video-section-title {
            font-size: 2.8rem;
            margin-bottom: 40px;
          }

          .video-container {
            width: 90%;
            padding:30px;
          }

          .video-card {
            width: 250px;
            height: 350px;
          }

          .nav-arrow {
            width: 45px;
            height: 45px;
            font-size: 20px;
            opacity: 1;
            transform: scale(1);
          }

          .modal-nav-arrow {
            width: 50px;
            height: 50px;
            font-size: 24px;
          }

          .modal-nav-arrow.prev {
            left: 20px;
          }

          .modal-nav-arrow.next {
            right: 20px;
          }
        }

        @media (max-width: 480px) {
          .video-section {
            padding: 40px 15px;
          }

          .video-section-title {
            font-size: 2.2rem;
            margin-bottom: 30px;
          }

          .video-container {
            width: 100%;
            padding: 50px;
          }

          .video-card {
            width: 220px;
            height: 300px;
          }

          .video-navigation {
            gap: 5px;
          }

          .nav-arrow {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .modal-nav-arrow {
            width: 45px;
            height: 45px;
            font-size: 20px;
          }

          .modal-nav-arrow.prev {
            left: 15px;
          }

          .modal-nav-arrow.next {
            right: 15px;
          }

          .video-modal-close {
            width: 45px;
            height: 45px;
            font-size: 30px;
            top: 15px;
            right: 15px;
          }
        }
      `}</style>

            <section className="video-section">
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
        </>
    );
};

export default Video;