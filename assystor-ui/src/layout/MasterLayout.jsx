import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MasterLayout = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar /> {/* Sidebar appears on all protected pages */}            <div style={{ flex: 1, marginLeft: '200px' }}> {/* تعويض عرض Sidebar */}
                <Navbar /> {/* Navbar appears on all protected pages */}                <main style={{ padding: '1rem' }}>
                    <Outlet /> {/* Show sub-content here */}                </main>
            </div>
        </div>);
};

export default MasterLayout;