import React from 'react';
import {Link} from 'react-router-dom';

const Page404 = () =>{
    return (
    <main>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="text-center mt-4">
                        <h1 className="display-1">404</h1>
                        <p className="lead"></p>
                        <p>Page not found.</p>
                        <Link to="/">
                            <i className="fas fa-arrow-left me-1"></i>
                            Return to Home Page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </main>

        );
}
export default Page404;