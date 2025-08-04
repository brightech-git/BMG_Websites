import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

const ImageGallery = ({ images }) => {
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomImgSrc, setZoomImgSrc] = useState('');
    const [zoomLevel, setZoomLevel] = useState(1);
    const zoomRef = useRef(null);

    // Custom arrow components
    const Arrow = ({ onClick, direction }) => (
        <ArrowButton onClick={onClick} direction={direction}>
            {direction === 'prev' ? <FaChevronLeft /> : <FaChevronRight />}
        </ArrowButton>
    );

    const mainSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        asNavFor: nav2,
        prevArrow: <Arrow onClick direction="prev" />,
        nextArrow: <Arrow onClick direction="next" />,
        beforeChange: (_, next) => setCurrentSlide(next),
        lazyLoad: 'progressive',
        speed: 300,
        cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };

    const thumbSettings = {
        slidesToShow: Math.min(images.length, 5),
        slidesToScroll: 1,
        asNavFor: nav1,
        focusOnSelect: true,
        swipeToSlide: true,
        arrows: images.length > 5,
        dots: false,
        centerMode: images.length > 5,
        infinite: images.length > 5,
        prevArrow: <Arrow onClick direction="prev" />,
        nextArrow: <Arrow onClick direction="next" />,
        responsive: [
            {
                breakpoint: 992,
                settings: { slidesToShow: Math.min(images.length, 5), centerMode: images.length > 4 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: Math.min(images.length, 3), centerMode: images.length > 3, arrows: false }
            },
            {
                breakpoint: 576,
                settings: { slidesToShow: Math.min(images.length, 3), centerMode: false, arrows: false }
            }
        ]
    };

    const handleImageClick = (imgSrc) => {
        setZoomImgSrc(imgSrc);
        setIsZoomed(true);
        setZoomLevel(1);
        document.body.style.overflow = 'hidden';
    };

    const handleWheelZoom = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setZoomLevel(prev => Math.min(Math.max(1, prev + delta), 3));
    };

    const closeZoom = () => {
        setIsZoomed(false);
        document.body.style.overflow = 'auto';
    };

    useEffect(() => {
        if (isZoomed && zoomRef.current) {
            zoomRef.current.addEventListener('wheel', handleWheelZoom, { passive: false });
        }
        return () => {
            if (zoomRef.current) {
                zoomRef.current.removeEventListener('wheel', handleWheelZoom);
            }
            document.body.style.overflow = 'auto';
        };
    }, [isZoomed]);

    return (
        <GalleryContainer>
            {/* Main Image Slider */}
            <MainContainer>
                <SlideCounter>
                    {currentSlide + 1} / {images.length}
                </SlideCounter>
                <Slider {...mainSettings} ref={setNav1}>
                    {images.map((item, index) => (
                        <Slide key={`main-${index}`}>
                            <ImageWrapper onClick={() => handleImageClick(item.img)}>
                                <img
                                    src={item.img}
                                    alt={`Product view ${index + 1}`}
                                    loading={index < 3 ? "eager" : "lazy"}
                                />
                                <ZoomOverlay>
                                    <FaSearchPlus />
                                    <span>Click to zoom</span>
                                </ZoomOverlay>
                            </ImageWrapper>
                        </Slide>
                    ))}
                </Slider>
            </MainContainer>

            {/* Thumbnail Slider */}
            <ThumbnailContainer>
                <Slider {...thumbSettings} ref={setNav2}>
                    {images.map((item, index) => (
                        <ThumbSlide key={`thumb-${index}`}>
                            <ThumbWrapper $active={currentSlide === index}>
                                <img
                                    src={item.img}
                                    alt={`Thumbnail ${index + 1}`}
                                    loading="lazy"
                                />
                                <ThumbOverlay>
                                    <FaSearchPlus />
                                </ThumbOverlay>
                            </ThumbWrapper>
                        </ThumbSlide>
                    ))}
                </Slider>
            </ThumbnailContainer>

            {/* Zoom Modal */}
            {isZoomed && (
                <ZoomModal>
                    <ZoomContent ref={zoomRef}>
                        <CloseButton onClick={closeZoom}>
                            <FaTimes />
                        </CloseButton>
                        <ZoomImageContainer style={{ transform: `scale(${zoomLevel})` }}>
                            <img
                                src={zoomImgSrc}
                                alt="Zoomed product view"
                            />
                        </ZoomImageContainer>
                        <ZoomControls>
                            <ZoomButton onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.2))}>
                                <FaSearchMinus />
                            </ZoomButton>
                            <ZoomLevel>{(zoomLevel * 100).toFixed(0)}%</ZoomLevel>
                            <ZoomButton onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.2))}>
                                <FaSearchPlus />
                            </ZoomButton>
                        </ZoomControls>
                    </ZoomContent>
                </ZoomModal>
            )}
        </GalleryContainer>
    );
};

// Styled Components
const GalleryContainer = styled.div`
    width: 85%;
    max-width: 85%;
    margin: 0 auto;
    background: var(--primary-card-color);
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
`;

const MainContainer = styled.div`
    position: relative;
    background: var(--primary-card-color);
`;

const SlideCounter = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: var(--primary-color);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-family: var(--secondary-font);
    font-weight: 500;
    z-index: 10;
    backdrop-filter: blur(10px);
`;

const Slide = styled.div`
    outline: none;
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    cursor: zoom-in;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.3s ease;
        background: var(--primary-card-color);
    }
    
    &:hover img {
        transform: scale(1.02);
    }
`;

const ZoomOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: white;
    backdrop-filter: blur(2px);
    
    ${ImageWrapper}:hover & {
        opacity: 1;
    }
    
    svg {
        font-size: 2rem;
    }
    
    span {
        font-size: 0.875rem;
        font-family: var(--secondary-font);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
`;

const ArrowButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: var(--primary-text-color);
    cursor: pointer;
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    left: ${props => props.direction === 'prev' ? '1rem' : 'auto'};
    right: ${props => props.direction === 'next' ? '1rem' : 'auto'};
    
    &:hover {
        background: rgba(255, 255, 255, 1);
        transform: translateY(-50%) scale(1.1);
    }
    
    &:active {
        transform: translateY(-50%) scale(0.95);
    }
    
    .slick-slider:hover & {
        opacity: 1;
        visibility: visible;
    }
`;

const ThumbnailContainer = styled.div`
    background: var(--primary-card-color);
    padding: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const ThumbSlide = styled.div`
    padding: 0 0.375rem;
    outline: none;
`;

const ThumbWrapper = styled.div`
    position: relative;
    aspect-ratio: 1/1;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid ${props => props.$active ? 'var(--primary-hover-color)' : 'transparent'};
    border-radius: 4px;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: all 0.3s ease;
        opacity: ${props => props.$active ? '1' : '0.8'};
    }
    
    &:hover img {
        opacity: 1;
        transform: scale(1.05);
    }
`;

const ThumbOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: white;
    
    ${ThumbWrapper}:hover & {
        opacity: 1;
    }
    
    svg {
        font-size: 1rem;
    }
`;

const ZoomModal = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
`;

const ZoomContent = styled.div`
    position: relative;
    max-width: 90%;
    max-height: 90%;
    width: auto;
    height: auto;
`;

const CloseButton = styled.button`
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        transform: scale(1.2);
    }
`;

const ZoomImageContainer = styled.div`
    position: relative;
    max-width: 100%;
    max-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease-out;
    transform-origin: center center;
    
    img {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
`;

const ZoomControls = styled.div`
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ZoomButton = styled.button`
    background: none;
    border: none;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: var(--primary-text-color);
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }
`;

const ZoomLevel = styled.span`
    font-family: var(--secondary-font);
    font-weight: 600;
    min-width: 50px;
    text-align: center;
`;

export default ImageGallery;