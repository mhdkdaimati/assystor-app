import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';




const AddCustomerGroup = () => {
    const navigate = useNavigate();


    const [customerGroupInput, setCustomergroup] = useState({
        name: '',
        error_list: [],
    });

    const handleInput = (e) => {
        e.preventDefault();
        setCustomergroup({


            ...customerGroupInput, [e.target.name]: e.target.value
        });
    }
    const customerGroupSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: customerGroupInput.name,

        }
        //console.log("Sending:", data);

        axios.post(`/api/store-customer-group`, data).then(res => {
            if (res.data.status === 201) {
                setCustomergroup({
                    name: '',
                    error_list: [],
                });

                swal("Operation is completed", res.data.message, "success");
                document.getElementById('CUSTOMER_GROUP_FORM').reset();
                navigate('/view-customer-group');


            } else if (res.data.status === 400) {

                swal("Operation is incompleted", res.data.message, "error");

            } else {
                setCustomergroup({ ...customerGroupInput, error_list: res.data.errors });
                swal("Operation is incompleted", "Adding new customer group couldn't be completed, please check the errors.", "error");
                console.log(res.data.errors);
            }
        });
    }


    return (
<div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
    <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
            <div className="card shadow rounded-4 border-0">
                <div className="card-header bg-gradient bg-primary text-white text-center rounded-top-4">
                    <h3 className="mb-0">👤 Add New Customer Group</h3>
                    <Link to="/view-customer-group" className="btn btn-sm btn-outline-light rounded-pill">
                        <i className="bi bi-arrow-left me-1"></i> Back
                    </Link>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={customerGroupSubmit} id="CUSTOMER_GROUP_FORM">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-semibold">Name</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={handleInput}
                                    value={customerGroupInput.name}
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter customer group name"
                                />
                            </div>
                            <small className="text-danger">{customerGroupInput.error_list.name}</small>
                        </div>

                        <div className="mb-4">
                            <button type="submit" className="btn btn-primary w-100 rounded-pill shadow-sm fw-bold">
                                <i className="bi bi-person-add me-2"></i> Save Customer Group
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
    );
}
export default AddCustomerGroup;