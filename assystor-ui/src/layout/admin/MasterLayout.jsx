import React from 'react';
import NavbarAdmin from './NavbarAdmin';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../assets/admin/css/styles.css';
import '../../assets/admin/js/scripts';
import routes from '../../routes/routes';
// import { Routes } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import { Switch, Route, Redirect } from 'react-router-dom';

const MasterLayout = () =>{
    return (
        <div className="sb-nav-fixed">
            <NavbarAdmin />
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>
                <div id="layoutSidenav_content">
                    <main>
                    <Routes>
                            { routes.map((route, idx)=>{
                                return(
                                    route.component && (
                                        <Route 
                                        key={idx}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        render={
                                            (props)=> (
                                                <route.component {...props}/> 
                                            )
                                        }
                                        />
                                        )
                                    )
                                }
                            )
                        }
                            {/* <Redirect from="/admin" to="/admin/dashboard "/>  */}
                            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                        </Routes>



                    </main>
                    <Footer />
            </div>
            </div>
        </div>
    );
}
export default MasterLayout;