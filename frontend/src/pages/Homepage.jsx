import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Fighting Food Waste, Feeding Hope</h1>
          <p className="hero-subtitle">
            Connect restaurants with NGOs to reduce food waste and help those in need
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-hero-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-hero-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <div className="food-icon">🍽️</div>
            <div className="heart-icon">❤️</div>
            <div className="people-icon">👥</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">1.3B</h3>
              <p className="stat-label">Tons of Food Wasted Yearly</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">828M</h3>
              <p className="stat-label">People Facing Hunger</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">30%</h3>
              <p className="stat-label">Food Production Lost</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple, efficient, and impactful</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏪</div>
              <h3>For Restaurants</h3>
              <p>List surplus food easily and reduce waste while making a positive impact in your community.</p>
              <ul className="feature-list">
                <li>Quick food listing</li>
                <li>Waste prediction AI</li>
                <li>Track your impact</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>For NGOs</h3>
              <p>Discover available food donations nearby and coordinate pickups to serve those in need.</p>
              <ul className="feature-list">
                <li>Real-time notifications</li>
                <li>Location-based search</li>
                <li>Direct communication</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>For Community</h3>
              <p>Together we create a sustainable solution to food waste and hunger in our communities.</p>
              <ul className="feature-list">
                <li>Reduce environmental impact</li>
                <li>Support local communities</li>
                <li>Build partnerships</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <div className="container">
          <div className="tech-content">
            <div className="tech-text">
              <h2>Smart Technology</h2>
              <h3>AI-Powered Waste Prediction</h3>
              <p>
                Our advanced machine learning system helps restaurants predict food waste,
                optimize inventory, and plan donations more effectively.
              </p>
              <ul className="tech-features">
                <li>📊 Predictive analytics</li>
                <li>🗺️ Location-based matching</li>
                <li>📧 Automated notifications</li>
                <li>📈 Impact tracking & reporting</li>
              </ul>
            </div>
            <div className="tech-visual">
              <div className="tech-animation">
                <div className="pulse-circle"></div>
                <div className="tech-symbol">🤖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join hundreds of restaurants and NGOs fighting food waste together</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-cta">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Food Waste Management</h4>
              <p>Connecting surplus with need, creating sustainable communities.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: vk0327@srmist.edu.in</p>
              <p>Phone: (+91) 8420966737</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Food Waste Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
