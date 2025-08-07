import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
<<<<<<< Updated upstream
import './NewsletterStyles.css'

import popupimg from '../../assets/img/popup1.jpg';
=======
import popupimg from '../../assets/img/popup.jpg';
>>>>>>> Stashed changes

const Newsletter = () => {
    const [show, setShow] = useState(true);

    return (
        <Modal show={show} onHide={() => setShow(false)} className="on-load-modal" centered>
            <div className="modal-content" style={{ backgroundImage: `url(${popupimg})` }}>
                <Modal.Header>
                    <button type="button" className="close" onClick={() => setShow(false)}>
                        <span aria-hidden="true">×</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-inner">
                        <h3 className="title">Newsletter</h3>
                        <p>Subscribe to our newsletter to receive exclusive offers</p>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Email Address" name="email" />
                            <button type="submit" className="main-btn btn-filled">Subscribe</button>
                        </form>
                    </div>
                </Modal.Body>
            </div>
        </Modal>
    );
};

export default Newsletter;
