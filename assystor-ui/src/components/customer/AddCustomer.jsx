import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="shadow p-4 rounded bg-white mb-4">
                        <div className="alert alert-success text-center" role="alert">
                            <h4 className="alert-heading m-0">Add Customer</h4>
                        </div>
                        <form onSubmit={customerSubmit} id="CATEGORY_FORM" encType="multipart/form-data">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="email" onChange={handleInput} value={customerInput.email} className="form-control" id="floatingEmail" placeholder="Email" />
                                        <label htmlFor="floatingEmail">Email</label>
                                        <span className="text-danger small">{customerInput.error_list.email}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select className="form-select" name="company_id" onChange={handleInput} value={customerInput.company_id} id="floatingCompany">
                                            <option value="">Select Company</option>
                                            {companyList.map(item => (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="floatingCompany">Company</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select name="gender" onChange={handleInput} value={customerInput.gender} className="form-select" id="floatingGender">
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                        <label htmlFor="floatingGender">Gender</label>
                                        <span className="text-danger small">{customerInput.error_list.gender}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="first_name" onChange={handleInput} value={customerInput.first_name} className="form-control" id="floatingFirstName" placeholder="First Name" />
                                        <label htmlFor="floatingFirstName">First Name</label>
                                        <span className="text-danger small">{customerInput.error_list.first_name}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="last_name" onChange={handleInput} value={customerInput.last_name} className="form-control" id="floatingLastName" placeholder="Last Name" />
                                        <label htmlFor="floatingLastName">Last Name</label>
                                        <span className="text-danger small">{customerInput.error_list.last_name}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="date" name="birth_day" onChange={handleInput} value={customerInput.birth_day} className="form-control" id="floatingBirthDay" placeholder="Birth Day" />
                                        <label htmlFor="floatingBirthDay">Birth Day</label>
                                        <span className="text-danger small">{customerInput.error_list.birth_day}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="street" onChange={handleInput} value={customerInput.street} className="form-control" id="floatingStreet" placeholder="Street" />
                                        <label htmlFor="floatingStreet">Street</label>
                                        <span className="text-danger small">{customerInput.error_list.street}</span>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input type="text" name="zip_code" onChange={handleInput} value={customerInput.zip_code} className="form-control" id="floatingZip" placeholder="Zip Code" />
                                        <label htmlFor="floatingZip">Zip Code</label>
                                        <span className="text-danger small">{customerInput.error_list.zip_code}</span>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input type="text" name="place" onChange={handleInput} value={customerInput.place} className="form-control" id="floatingPlace" placeholder="Place" />
                                        <label htmlFor="floatingPlace">Place</label>
                                        <span className="text-danger small">{customerInput.error_list.place}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="iban" onChange={handleInput} value={customerInput.iban} className="form-control" id="floatingIban" placeholder="IBAN" />
                                        <label htmlFor="floatingIban">IBAN</label>
                                        <span className="text-danger small">{customerInput.error_list.iban}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="contact_number" onChange={handleInput} value={customerInput.contact_number} className="form-control" id="floatingContact" placeholder="Contact Number" />
                                        <label htmlFor="floatingContact">Contact Number</label>
                                        <span className="text-danger small">{customerInput.error_list.contact_number}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="pkk" onChange={handleInput} value={customerInput.pkk} className="form-control" id="floatingPKK" placeholder="PKK" />
                                        <label htmlFor="floatingPKK">PKK</label>
                                        <span className="text-danger small">{customerInput.error_list.pkk}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button className="w-100 btn btn-lg btn-outline-primary" type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default AddCustomer;