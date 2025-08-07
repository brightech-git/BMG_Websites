import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import $ from 'jquery';
import 'magnific-popup';

import img1 from '../../../assets/img/gallery/5.jpg';
import img2 from '../../../assets/img/gallery/5.jpg';
import img3 from '../../../assets/img/gallery/3.jpg';
import img4 from '../../../assets/img/gallery/4.jpg';
import img5 from '../../../assets/img/gallery/5.jpg';
import img6 from '../../../assets/img/gallery/3.jpg';
import img7 from '../../../assets/img/gallery/5.jpg';
import img8 from '../../../assets/img/gallery/5.jpg';

const galleryposts = [
    { img: img1, delay: 0.3 },
    { img: img2, delay: 0.4 },
    { img: img3, delay: 0.5 },
    { img: img4, delay: 0.6 },
    { img: img5, delay: 0.7 },
    { img: img6, delay: 0.8 },
    { img: img7, delay: 0.9 },
    { img: img8, delay: 1.1 },
];

const Content = () => {
    useEffect(() => {
        $('.gallery-loop .popup-image').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
            },
            mainClass: 'mfp-fade',
        });
    }, []);

    return (
        <div className="gallery-wrappper pt-120 pb-120">
            <div className="container">
                <div className="gallery-loop">
                    {galleryposts.map((item, i) => (
                        <motion.div
                            className="single-gallery-image"
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: item.delay, duration: 0.5 }}
                        >
                            <Link to={item.img} className="popup-image">
                                <img src={item.img} alt={`Gallery ${i}`} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Content;
