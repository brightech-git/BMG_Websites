import React, { Component } from 'react';
import logo from '../../assets/img/logo1.jpg';

class Preloader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchSuccess: false
        }
    }
    componentDidMount() {
        window.addEventListener('load', () => {
            this.setState({
                fetchSuccess: true
            });
        });
    }
    render() {
        const classNamess = this.state.fetchSuccess ? 'd-none' : '';
        return (
            <div className={`preloader ${classNamess}`}>
                <img
                    src={logo} // e.g., "/assets/images/loader.gif"
                    alt="Loading..."
                    className="preloader-image"
                />
            </div>

        );
    }
}

export default Preloader;