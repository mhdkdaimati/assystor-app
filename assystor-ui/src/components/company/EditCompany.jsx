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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="shadow p-4 rounded bg-white">
                        <div className="alert alert-success text-center" role="alert">
                            <h4 className="alert-heading m-0">Edit Company</h4>
                            <hr />
                            <div className="text-end">
                                <Link to="/view-company" className="btn btn-sm btn-outline-secondary">
                                    Back
                                </Link>
                            </div>
                        </div>

                        <form onSubmit={companyUpdate} id="COMPANY_FORM" encType="multipart/form-data">
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
                                <label htmlFor="floatingName">Name</label>
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
                                <label htmlFor="floatingResponsible">Responsible person</label>
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
                                <label htmlFor="floatingTel">Tel number</label>
                                {error.tel_number && <div className="text-danger mt-1">{error.tel_number}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="statusSelect" className="form-label">Status</label>
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

                            <button className="btn btn-success w-100" type="submit">
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default EditCompany;