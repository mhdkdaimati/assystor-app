import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';


const EditCustomerGroup = () => {

    const navigate = useNavigate();
    const { id } = useParams(); // استخدام useParams للحصول على المعرف
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);
    const [customergroupInput, setCustomerGroup] = useState({
        name: '',
        error_list: [],
    });

    useEffect(() => {
        document.title = 'Edit Customer Group';

        axios.get(`/api/show-customer-group/${id}`).then((res) => {
            if (res.data.status === 200) {
                setCustomerGroup(res.data.customer_group);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate('/view-customer-group');
            }
            setLoading(false);
        });
    }, [id, navigate]);

    const handleInput = (e) => {
        e.persist();
        setCustomerGroup({
            ...customergroupInput,
            [e.target.name]: e.target.value,
        });
    };


    const customerGroupUpdate = (e) => {
        e.preventDefault();

        const data = {

            name: customergroupInput.name,

        };

        axios.put(`/api/update-customer-group/${id}`, data).then((res) => {
            if (res.data.status === 200) {
                swal("Operation is completed", res.data.message, "success");
                setError([]);
                navigate('/view-customer-group');
            } else if (res.data.status === 422) {
                swal("Operation is incomplete", "Updating customer group couldn't be completed, please check the errors.", "error");
                setError(res.data.errors);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate('/view-customer-group');
            }
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ margin: "200px" }}>
                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">Edit Customer Group</h4>
                    <hr />
                    <Link to="/view-customer-group" className="card-link">Back</Link>
                </div>
            </div>
            <form onSubmit={customerGroupUpdate} id="CUSTOMER_GROUP_FORM" encType="multipart/form-data">
                <div className="form-floating">
                    <input
                        type="text"
                        name="name"
                        onChange={handleInput}
                        value={customergroupInput.name}
                        className="form-control"
                        id="floatingName"
                        placeholder="Name"
                    />
                    <label htmlFor="floatingName">Name</label>
                    <span style={{ color: "red" }}>{error.name}</span>
                </div>
                <br />
                <button className="w-100 btn btn-lg btn-outline-success" type="submit">
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditCustomerGroup;