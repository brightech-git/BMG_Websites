import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import img1 from '../../../assets/img/gallery/01.jpg';
import img2 from '../../../assets/img/gallery/02.jpg';
import img3 from '../../../assets/img/gallery/12.jpg';
import img4 from '../../../assets/img/gallery/04.jpg';
import img5 from '../../../assets/img/gallery/05.jpg';
import img6 from '../../../assets/img/gallery/13.jpg';
import img7 from '../../../assets/img/gallery/07.jpg';
import img8 from '../../../assets/img/gallery/08.jpg';
import img9 from '../../../assets/img/gallery/11.jpg';

const galleryposts = [
    { img: img1 },
    { img: img2 },
    { img: img3 },
    { img: img4 },
    { img: img5 },
    { img: img6 },
    { img: img7 },
    { img: img8 },
    { img: img9 },
];

const Content = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    return (
        <div className="gallery-wrappper pt-120 pb-120">
            <div className="container">
                <div className="gallery-loop columns-3">
                    {galleryposts.map((item, i) => (
                        <motion.div
                            key={i}
                            className="single-gallery-image"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => {
                                setIsOpen(true);
                                setPhotoIndex(i);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={item.img} alt={`Gallery ${i + 1}`} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {isOpen && (
                <Lightbox
                    mainSrc={galleryposts[photoIndex].img}
                    nextSrc={galleryposts[(photoIndex + 1) % galleryposts.length].img}
                    prevSrc={galleryposts[(photoIndex + galleryposts.length - 1) % galleryposts.length].img}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() =>
                        setPhotoIndex((photoIndex + galleryposts.length - 1) % galleryposts.length)
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % galleryposts.length)
                    }
                />
            )}
        </div>
    );
};

export default Content;
