import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Backtotop.css';

class Backtotop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTop: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  // Add scroll event listener
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  // Remove listener when component unmounts
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  // Check scroll position
  handleScroll() {
    const scrollTop = window.scrollY;
    const show = scrollTop > 300;
    if (this.state.isTop !== show) {
      this.setState({ isTop: show });
    }
  }

  // Scroll to top with smooth behavior
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  render() {
    const { isTop } = this.state;
    return (
      <Link
        to="#"
        className={`back-to-top-btn ${isTop ? 'back-to-top-visible' : ''}`}
        id="backToTop"
        onClick={(e) => {
          e.preventDefault(); // Prevent jumping
          this.scrollToTop();
        }}
        aria-label="Scroll to top"
      >
        <i className="fas fa-angle-double-up back-to-top-icon" />
      </Link>
    );
  }
}

export default Backtotop;