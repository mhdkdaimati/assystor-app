import React from "react";
import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Home from "./Home";
import Login from './Login'
import Register from './Register'

const Header = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">Assystor CRM</Link>
                    <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">


                        <ul className="navbar-nav mb-2 mb-lg-0">

                            {
                                localStorage.getItem('user-info') ?
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/add-product">Add product</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/update-product">Update product</Link>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/register">Register</Link>
                                        </li>

                                    </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Header;