import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../assets/admin/css/styles.css';
import '../assets/admin/js/scripts';
import { BrowserRouter as Router, Routes, Route, Navigate,Outlet } from 'react-router-dom';
import AddCategory from '../components/category/AddCategory';


const MasterLayout = () => {
    return (
        <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar />

                <main style={{ flex: 1, padding: '1rem' }}>
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>);
}
export default MasterLayout;