import React from 'react';
import {Link} from 'react-router-dom';

const Sidebar = () =>{

    var loggedUser = '';

    if(localStorage.getItem('auth_token')){
        loggedUser = (<span className="small">{localStorage.getItem('auth_name')}</span>)
    }
    return (
        <div id="layoutSidenav_nav">
        <nav className="sb-sidenav accordion sb-sidenav-dark shadow" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <div className="sb-sidenav-menu-heading">front page management</div>
                    <div className="sb-sidenav-menu-heading">Category</div>


                    <Link className="nav-link" to="/admin/view-category">
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        View and Manage Category
                    </Link>

                    <Link className="nav-link" to="/admin/add-category">
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        Add Category
                    </Link>

                    <div className="sb-sidenav-menu-heading">Product</div>


                    <Link className="nav-link" to="/admin/view-product">
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        View and Manage Product
                    </Link>

                    <Link className="nav-link" to="/admin/add-product">
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        Add Product
                    </Link>






                    <div className="sb-sidenav-menu-heading">Front Page</div>
                    <Link className="nav-link" to="/">
                        <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                        Front Page View
                    </Link>
                </div>
            </div>
            <div className="sb-sidenav-footer">
                <div className="small">Logged in as: {loggedUser}</div>
                
            </div>
        </nav>
    </div>

        );
}
export default Sidebar;