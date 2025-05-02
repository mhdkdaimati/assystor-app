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
<div className="container py-5">
  <div className="row justify-content-center">
    <div className="col-md-8 col-lg-6">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center rounded-top-4 px-4 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-people-fill me-2"></i>Edit Customer Group
          </h5>
          <Link to="/view-customer-group" className="btn btn-sm btn-outline-light rounded-pill">
            <i className="bi bi-arrow-left me-1"></i> Back
          </Link>
        </div>
        <div className="card-body p-4">
          <form onSubmit={customerGroupUpdate} id="CUSTOMER_GROUP_FORM" encType="multipart/form-data">
            <div className="form-floating mb-3">
              <input
                type="text"
                name="name"
                onChange={handleInput}
                value={customergroupInput.name || ''}
                className="form-control"
                id="floatingName"
                placeholder="Name"
              />
              <label htmlFor="floatingName">Name</label>
              <div className="text-danger mt-1">{error.name}</div>
            </div>

            <button className="btn btn-success w-100 rounded-pill shadow-sm" type="submit">
              <i className="bi bi-check-circle me-1"></i> Update Group
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

    );
};

export default EditCustomerGroup;