import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MasterLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar يظهر في جميع الصفحات المحمية */}
      <div style={{ flex: 1 }}>
        <Navbar /> {/* Navbar يظهر في جميع الصفحات المحمية */}
        <main style={{ padding: '1rem' }}>
          <Outlet /> {/* عرض المحتوى الفرعي هنا */}
        </main>
      </div>
    </div>
  );
};

export default MasterLayout;