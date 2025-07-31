import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ReactWOW from 'react-wow';
import { useVideos } from '../../../hook/video/useVideoQuery';
import './Videos.css'
const Video = () => {
    const history = useHistory();
    const videoRef = useRef(null);
    const baseUrl = 'https://bmgjewellers.com';
    const { data: videos, isLoading, isError } = useVideos();

    // useEffect(() => {
    //     if (videoRef.current) {
    //         videoRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, [videos]);

    if (isLoading) return <div className="loading-spinner">Loading video...</div>;
    if (isError) return <div className="error-message">Error loading video</div>;

    const videoData = videos?.data?.[0];
    const videoUrl = videoData?.video_path ? `${baseUrl}${videoData.video_path}` : '';

    const handleSeeMore = () => {
        history.push('/shop-left');
    };

    return (
        <section className="video-section with-pattern pt-85 pb-85">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-6 col-md-10 order-2 order-lg-1">
                        <div className="video-content">
                            <div className="section-title mb-20">
                                <h2>Make Your Day Brighter</h2>
                            </div>
                            <p className="video-description">
                                Elevate your look with handcrafted silver pieces designed to shine with simplicity and grace.
                            </p>
                            <button
                                onClick={handleSeeMore}
                                className="main-btns btn-filled mt-40"
                            >
                                See More
                            </button>
                        </div>
                    </div>

                    <ReactWOW animation="fadeInRight" data-wow-delay=".3s">
                        <div className="col-lg-6 col-md-10 order-1 order-lg-2">
                            {videoUrl && (
                                <div className="video-container" ref={videoRef}>
                                    <video
                                        width="100%"
                                        height="100%"
                                        src={videoUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        controls={false}
                                        className="video-element"
                                    />
                                   
                                </div>
                            )}
                        </div>
                    </ReactWOW>
                </div>
            </div>

            <div className="pattern-overlay">
                <div className="pattern" />
            </div>
        </section>
    );
};

export default Video;