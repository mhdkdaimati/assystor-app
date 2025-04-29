import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';




const AddCompany = () => {
    const navigate = useNavigate();


    const [companyInput, setCompany] = useState({
        name: '',

        responsible_person: '',
        tel_number: '',
        status: 'active',



        error_list: [],
    });

    const handleInput = (e) => {
        e.preventDefault();
        setCompany({


            ...companyInput, [e.target.name]: e.target.value
        });
    }
    const companySubmit = (e) => {
        e.preventDefault();
        const data = {
            name: companyInput.name,
            responsible_person: companyInput.responsible_person,
            tel_number: companyInput.tel_number,
            status: companyInput.status,

        }
        //console.log("Sending:", data);

        //console.log(data.status);
        axios.post(`/api/store-company`, data).then(res => {
            if (res.data.status === 201) {
                setCompany({
                    name: '',
                    responsible_person: '',
                    tel_number: '',
                    status: '',
                    error_list: [],
                });

                swal("Operation is completed", res.data.message, "success");
                document.getElementById('COMPANY_FORM').reset();
                navigate('/view-company');


            } else if (res.data.status === 400) {

                swal("Operation is incompleted", res.data.message, "error");

            } else {
                setCompany({ ...companyInput, error_list: res.data.errors });
                swal("Operation is incompleted", "Adding new company couldn't be completed, please check the errors.", "error");
                console.log(res.data.errors);
            }
        });
    }


    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="shadow p-4 rounded bg-white">
                            <div className="alert alert-success text-center" role="alert">
                                <h4 className="alert-heading m-0">Add Company</h4>
                            </div>

                            <form onSubmit={companySubmit} id="COMPANY_FORM">
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
                                    {companyInput.error_list.name && (
                                        <div className="text-danger mt-1">{companyInput.error_list.name}</div>
                                    )}
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
                                    {companyInput.error_list.responsible_person && (
                                        <div className="text-danger mt-1">{companyInput.error_list.responsible_person}</div>
                                    )}
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="tel_number"
                                        onChange={handleInput}
                                        value={companyInput.tel_number}
                                        className="form-control"
                                        id="floatingTel"
                                        placeholder="Tel number"
                                    />
                                    <label htmlFor="floatingTel">Tel number</label>
                                    {companyInput.error_list.tel_number && (
                                        <div className="text-danger mt-1">{companyInput.error_list.tel_number}</div>
                                    )}
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

                                <button className="btn btn-primary w-100" type="submit">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AddCompany;