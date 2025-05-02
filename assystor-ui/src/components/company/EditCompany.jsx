import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';


const EditCompany = () => {

    const navigate = useNavigate();
    const { id } = useParams(); // استخدام useParams للحصول على المعرف
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);
    const [companyInput, setCompany] = useState({
        name: '',
        responsible_person: '',
        tel_number: '',
        status: '',
        error_list: [],
    });

    useEffect(() => {
        document.title = 'Edit Company';

        axios.get(`/api/show-company/${id}`).then((res) => {
            if (res.data.status === 200) {
                setCompany(res.data.company);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate('/view-company');
            }
            setLoading(false);
        });
    }, [id, navigate]);

    const handleInput = (e) => {
        e.persist();
        setCompany({
            ...companyInput,
            [e.target.name]: e.target.value,
        });
    };


    const companyUpdate = (e) => {
        e.preventDefault();

        const data = {

            name: companyInput.name,
            responsible_person: companyInput.responsible_person,
            tel_number: companyInput.tel_number,
            status: companyInput.status,

        };

        axios.put(`/api/update-company/${id}`, data).then((res) => {
            if (res.data.status === 200) {
                swal("Operation is completed", res.data.message, "success");
                setError([]);
                navigate('/view-company');
            } else if (res.data.status === 422) {
                swal("Operation is incomplete", "Updating company couldn't be completed, please check the errors.", "error");
                setError(res.data.errors);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate('/view-company');
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
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4 px-4 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-building me-2"></i>Edit Company
          </h5>
          <Link to="/view-company" className="btn btn-sm btn-outline-light rounded-pill">
            <i className="bi bi-arrow-left me-1"></i> Back
          </Link>
        </div>
        <div className="card-body p-4">
          <form onSubmit={companyUpdate} encType="multipart/form-data">
            <div className="form-floating mb-3">
              <input
                type="text"
                name="name"
                onChange={handleInput}
                value={companyInput.name}
                className="form-control"
                id="floatingName"
                placeholder="Name"
              />
              <label htmlFor="floatingName">Company Name</label>
              {error.name && <div className="text-danger mt-1">{error.name}</div>}
            </div>

            <div className="form-floating mb-3">
              <input
                name="responsible_person"
                onChange={handleInput}
                value={companyInput.responsible_person}
                className="form-control"
                id="floatingResponsible"
                placeholder="Responsible person"
              />
              <label htmlFor="floatingResponsible">Responsible Person</label>
              {error.responsible_person && <div className="text-danger mt-1">{error.responsible_person}</div>}
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                name="tel_number"
                onChange={handleInput}
                value={companyInput.tel_number}
                className="form-control"
                id="floatingTel"
                placeholder="Tel Number"
              />
              <label htmlFor="floatingTel">Telephone Number</label>
              {error.tel_number && <div className="text-danger mt-1">{error.tel_number}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="statusSelect" className="form-label fw-semibold">Status</label>
              <select
                name="status"
                onChange={handleInput}
                value={companyInput.status}
                className="form-select"
                id="statusSelect"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button className="btn btn-primary w-100 rounded-pill shadow-sm" type="submit">
              <i className="bi bi-check-circle me-1"></i> Update Company
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>


    );
};

export default EditCompany;