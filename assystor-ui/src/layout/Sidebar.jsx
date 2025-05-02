import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // الحصول على المسار الحالي
  const authRole = localStorage.getItem('auth_role'); // تخزين دور المستخدم

  return (
    <aside style={sidebarStyle}>
      <ul style={listStyle}>
        <li>
          <Link
            to="/"
            style={location.pathname === '/' ? activeLinkStyle : linkStyle}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            style={location.pathname === '/dashboard' ? activeLinkStyle : linkStyle}
          >
            Dashboard
          </Link>
        </li>
        {authRole === 'admin' && (
          <>
            <hr />
            <li><b>Management</b></li>
            <li>
              <Link
                to="/view-user"
                style={location.pathname === '/view-user' ? activeLinkStyle : linkStyle}
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                to="/view-company"
                style={location.pathname === '/view-company' ? activeLinkStyle : linkStyle}
              >
                Companies
              </Link>
            </li>
            <li>
              <Link
                to="/view-customer"
                style={location.pathname === '/view-customer' ? activeLinkStyle : linkStyle}
              >
                Customers
              </Link>
            </li>
            <li>
              <Link
                to="/product-page"
                style={location.pathname === '/product-page' ? activeLinkStyle : linkStyle}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/view-customer-group"
                style={location.pathname === '/view-customer-group' ? activeLinkStyle : linkStyle}
              >
                Customer Groups
              </Link>
            </li>
            <hr />
            <li>
              <Link
                to="/customer-group-page"
                style={location.pathname === '/customer-group-page' ? activeLinkStyle : linkStyle}
              >
                Customer Group page
              </Link>
            </li>
            <li>
              <Link
                to="/incompleted-customer-groups"
                style={location.pathname === '/incompleted-customer-groups' ? activeLinkStyle : linkStyle}
              >
                Incompleted customer groups
              </Link>
            </li>
            <hr />
          </>
        )}
      </ul>
    </aside>
  );
};

// CSS Styles
const sidebarStyle = {
  width: '200px',
  background: '#6c757d', // لون Bootstrap الرمادي (bg-secondary)
  color: '#ffffff', // لون النص الأبيض
  height: '100vh',
  padding: '1rem',
  position: 'fixed', // تثبيت Sidebar
  top: 0,
  left: 0,
  overflowY: 'auto', // تفعيل التمرير العمودي
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0, // إزالة الهوامش
};

const linkStyle = {
  color: '#ffffff', // لون النص الأبيض
  textDecoration: 'none',
  display: 'block',
  padding: '0.5rem 0',
  transition: 'color 0.3s',
};

const activeLinkStyle = {
  ...linkStyle,
  backgroundColor: '#495057', // لون أغمق للصفحة النشطة
  borderRadius: '4px', // إضافة زوايا مستديرة
};

export default Sidebar;