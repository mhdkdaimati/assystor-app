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
        <div className="container">
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">Edit Company</h4>
                    <hr />
                    <Link to="/view-company" className="card-link">Back</Link>
                </div>
            </div>
            <form onSubmit={companyUpdate} id="COMPANY_FORM" encType="multipart/form-data">
                <div className="form-floating">
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
                    <span style={{ color: "red" }}>{error.name}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input
                        name="responsible_person"
                        onChange={handleInput}
                        value={companyInput.responsible_person}
                        className="form-control"
                        id="floatingresponsible_person"
                        placeholder="Responsible person"
                    />
                    <label htmlFor="floatingresponsible_person">Responsible person</label>
                    <span style={{ color: "red" }}>{error.responsible_person}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input
                        type="text"
                        name="tel_number"
                        onChange={handleInput}
                        value={companyInput.tel_number}
                        className="form-control"
                        id="floatingtel_number"
                        placeholder="Tel Number"
                    />
                    <label htmlFor="floatingtel_number">Tel number</label>
                    <span style={{ color: "red" }}>{error.tel_number}</span>
                </div>
                <br />
                <select name="status" onChange={handleInput} value={companyInput.status} className="form-select" aria-label="Default select example">
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                </select>

                <br />
                <button className="w-100 btn btn-lg btn-outline-success" type="submit">
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditCompany;