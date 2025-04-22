import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer style={footerStyle}>
    <div>
    </div>
  </footer>
);

const footerStyle = {
  background: '#2c3e50',
  color: '#ecf0f1',
  padding: '1rem 1rem',
  textAlign: 'center',
  borderTop: '4px solid #1abc9c',
  position: 'fixed', // يجعل الفوتر ثابتًا
  bottom: 0, // يضع الفوتر في أسفل الصفحة
  left: 0,
  width: '100%', // يجعل الفوتر يمتد بعرض الصفحة بالكامل
};

const iconStyle = {
  margin: '0 8px',
  color: '#ecf0f1',
  fontSize: '18px',
  textDecoration: 'none',
};

export default Footer;