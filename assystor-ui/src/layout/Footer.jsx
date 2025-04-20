import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer style={{
    background: '#2c3e50',
    color: '#ecf0f1',
    padding: '2rem 1rem',
    textAlign: 'center',
    borderTop: '4px solid #1abc9c',
  }}>
    <div style={{ marginBottom: '1rem' }}>
      <strong>MyCompany</strong> &copy; {new Date().getFullYear()} - All rights reserved
    </div>
    
    <div style={{ marginBottom: '1rem' }}>
      <a href="/about" style={linkStyle}>About</a>
      <a href="/contact" style={linkStyle}>Contact</a>
      <a href="/privacy" style={linkStyle}>Privacy</a>
    </div>

    <div>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={iconStyle}><FaFacebookF /></a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconStyle}><FaTwitter /></a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconStyle}><FaLinkedinIn /></a>
    </div>
  </footer>
);

const linkStyle = {
  margin: '0 10px',
  color: '#ecf0f1',
  textDecoration: 'none',
  fontWeight: 'bold'
};

const iconStyle = {
  margin: '0 8px',
  color: '#ecf0f1',
  fontSize: '18px',
  textDecoration: 'none'
};

export default Footer;
