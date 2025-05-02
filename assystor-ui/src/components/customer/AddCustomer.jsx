import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';




const AddCustomer = () => {

    const [companyList, setCompanyList] = useState([

    ]);


    useEffect(() => {
        document.title = 'Add Customer';

        axios.get(`/api/all-companies`).then(res => {
            if (res.data.status === 200) {
                setCompanyList(res.data.companies);
            }

        })
    }, []);



    const navigate = useNavigate();

    const [customerInput, setCustomer] = useState({
        email: '',
        company_id: '',
        gender: '',
        first_name: '',
        last_name: '',
        birth_day: '',
        street: '',
        zip_code: '',
        place: '',
        iban: '',
        contact_number: '',
        pkk: '',

        error_list: [],
    });


    const handleInput = (e) => {
        e.persist();
        setCustomer({
            ...customerInput, [e.target.name]: e.target.value
        });
    }


    const customerSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: customerInput.email,
            company_id: customerInput.company_id,
            gender: customerInput.gender,
            first_name: customerInput.first_name,
            last_name: customerInput.last_name,
            birth_day: customerInput.birth_day,
            street: customerInput.street,
            zip_code: customerInput.zip_code,
            place: customerInput.place,
            iban: customerInput.iban,
            contact_number: customerInput.contact_number,
            pkk: customerInput.pkk,

        }
        axios.post(`/api/store-customer`, data).then(res => {
            if (res.data.status === 200) {

                setCustomer({
                    email: '',
                    company_id: '',
                    gender: '',
                    first_name: '',
                    last_name: '',
                    birth_day: '',
                    street: '',
                    zip_code: '',
                    place: '',
                    iban: '',
                    contact_number: '',
                    pkk: '',
                    error_list: [],
                });



                swal("Operation is completed", res.data.message, "success");
                // document.getElementById('CATEGORY_FORM').reset();
                // navigate('/view-customer');
            } else if (res.data.status === 400) {

                swal("Operation is incompleted", res.data.message, "error");

            } else {
                setCustomer({ ...customerInput, error_list: res.data.validator_errors });
                swal("Operation is incompleted", "Adding new Category couldn't be completed, please check the errors.", "error");
            }
        });
    }


    return (
        <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-6">
                    <div className="card shadow rounded-4 border-0">
                        <div className="card-header bg-gradient bg-primary text-white text-center rounded-top-4">
                            <h3 className="mb-0">👤 Add New Customer</h3>
                            <Link to="/view-customer" className="btn btn-sm btn-outline-light rounded-pill">
                                <i className="bi bi-arrow-left me-1"></i> Back
                            </Link>

                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={customerSubmit} id="CATEGORY_FORM" encType="multipart/form-data">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                                        <input
                                            type="text"
                                            name="email"
                                            onChange={handleInput}
                                            value={customerInput.email}
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter email"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.email}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="company_id" className="form-label fw-semibold">Company</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-building"></i></span>
                                        <select
                                            className="form-select"
                                            name="company_id"
                                            onChange={handleInput}
                                            value={customerInput.company_id}
                                            id="company_id"
                                        >
                                            <option value="">Select Company</option>
                                            {companyList.map(item => (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.company_id}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label fw-semibold">Gender</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-gender-ambiguous"></i></span>
                                        <select
                                            name="gender"
                                            onChange={handleInput}
                                            value={customerInput.gender}
                                            className="form-select"
                                            id="gender"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.gender}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="first_name" className="form-label fw-semibold">First Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                        <input
                                            type="text"
                                            name="first_name"
                                            onChange={handleInput}
                                            value={customerInput.first_name}
                                            className="form-control"
                                            id="first_name"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.first_name}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="last_name" className="form-label fw-semibold">Last Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                        <input
                                            type="text"
                                            name="last_name"
                                            onChange={handleInput}
                                            value={customerInput.last_name}
                                            className="form-control"
                                            id="last_name"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.last_name}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="street" className="form-label fw-semibold">street</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                        <input
                                            type="text"
                                            name="street"
                                            onChange={handleInput}
                                            value={customerInput.street}
                                            className="form-control"
                                            id="street"
                                            placeholder="Enter street"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.street}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="zip_code" className="form-label fw-semibold">zip_code</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                        <input
                                            type="text"
                                            name="zip_code"
                                            onChange={handleInput}
                                            value={customerInput.zip_code}
                                            className="form-control"
                                            id="zip_code"
                                            placeholder="Enter zip_code"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.street}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="place" className="form-label fw-semibold">place</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                        <input
                                            type="text"
                                            name="place"
                                            onChange={handleInput}
                                            value={customerInput.place}
                                            className="form-control"
                                            id="place"
                                            placeholder="Enter place"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.place}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="iban" className="form-label fw-semibold">iban</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                        <input
                                            type="text"
                                            name="iban"
                                            onChange={handleInput}
                                            value={customerInput.iban}
                                            className="form-control"
                                            id="iban"
                                            placeholder="Enter iban"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.place}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="pkk" className="form-label fw-semibold">pkk</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                                        <input
                                            type="text"
                                            name="pkk"
                                            onChange={handleInput}
                                            value={customerInput.pkk}
                                            className="form-control"
                                            id="pkk"
                                            placeholder="Enter pkk"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.pkk}</small>
                                </div>



                                <div className="mb-3">
                                    <label htmlFor="birth_day" className="form-label fw-semibold">Birth Day</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-calendar-fill"></i></span>
                                        <input
                                            type="date"
                                            name="birth_day"
                                            onChange={handleInput}
                                            value={customerInput.birth_day}
                                            className="form-control"
                                            id="birth_day"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.birth_day}</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="contact_number" className="form-label fw-semibold">Contact Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
                                        <input
                                            type="text"
                                            name="contact_number"
                                            onChange={handleInput}
                                            value={customerInput.contact_number}
                                            className="form-control"
                                            id="contact_number"
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                    <small className="text-danger">{customerInput.error_list.contact_number}</small>
                                </div>

                                <div className="mb-4">
                                    <button type="submit" className="btn btn-primary w-100 rounded-pill shadow-sm fw-bold">
                                        <i className="bi bi-person-add me-2"></i> Save Customer
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
export default AddCustomer;