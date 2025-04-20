import React from 'react';
import {Link} from 'react-router-dom';

const Page403 = () =>{
    return (
    <main>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="text-center mt-4">
                        <h1 className="display-1">403</h1>
                        <p className="lead">Unauthorized</p>
                        <p>Access to this resource is denied.</p>
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
export default Page403;