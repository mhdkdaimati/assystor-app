import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import { useNavigate, Link, useParams } from 'react-router-dom';


const EditCustomer = () => {

    const { id } = useParams(); // استخدام useParams للحصول على المعرف


    const navigate = useNavigate();
    const [companyList, setCompanyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);




    useEffect(() => {
        document.title = 'Edit Customer';

        axios.get(`/api/all-companies`).then(res => {
            if (res.data.status === 200) {
                setCompanyList(res.data.companies);
            }

        })

        //2 set the axios
        axios.get(`/api/show-customer/${id}`).then(res => {
            if (res.data.status === 200) {

                setCustomer(res.data.customer)


            } else if (res.data.status === 404) {
                alert("Error", res.data.message, "error");
                navigate('/view-customer');

            }
            setLoading(false);


        });
    }, [id, navigate]);





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



    const customerUpdate = (e) => {
        e.preventDefault();


        const data = {
            email: customerInput.email,
            company_id: customerInput.company_id,
            gender: customerInput.gender,//
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


        axios.put(`/api/update-customer/${id}`, data).then(res => {
            if (res.data.status === 200) {

                swal("Operation is completed", res.data.message, "success");
                setError([]);

                navigate('/view-customer');



            } else if (res.data.status === 422) {

                swal("Operation is incompleted", "Updating customer couldn't be completed, please check the errors.", "error");
                setError(res.data.errors);



            } else if (res.data.status === 404) {
                setCustomer({ ...customerInput, error_list: res.data.validator_errors });
                swal("Operation is incompleted", res.data.message, "error");
            }
        });
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ margin: "200px" }}>

                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-4">
            {/* card header */}
            <div className="shadow mb-4">
                <div className="alert alert-success text-center mb-0" role="alert">
                    <h4 className="alert-heading">Edit Customer</h4>
                </div>
            </div>

            <form onSubmit={customerUpdate} id="CUSTOMER_FORM" encType="multipart/form-data">
                <div className="row g-3">

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="email" name="email" onChange={handleInput} value={customerInput.email || ''} className="form-control" placeholder="email" />
                            <label>email</label>
                            <span className="text-danger">{error.email}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <select className="form-select" name="company_id" onChange={handleInput} value={customerInput.company_id || ''}>
                                <option value="">Select company</option>
                                {
                                    companyList.map(item => (
                                        <option value={item.id} key={item.id}>{item.name}</option>
                                    ))
                                }
                            </select>
                            <label>Company</label>
                        </div>
                    </div>

                    {/* <div className="col-md-6">
                        <div className="form-floating">
                            <select name="gender" onChange={handleInput} value={customerInput.gender || ''} className="form-select">
                                <option value="male">male</option>
                                <option value="female">female</option>
                            </select>
                            <label>Gender</label>
                        </div>
                    </div> */}




                    <div className="col-md-6">
                        <div className="form-floating">
                            <select name="gender" onChange={handleInput} value={customerInput.gender || ''} className="form-select" id="floatingGender">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <label htmlFor="floatingGender">Gender</label>
                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="first_name" onChange={handleInput} value={customerInput.first_name} className="form-control" placeholder="first_name" />
                            <label>First Name</label>
                            <span className="text-danger">{error.first_name}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="last_name" onChange={handleInput} value={customerInput.last_name} className="form-control" placeholder="last_name" />
                            <label>Last Name</label>
                            <span className="text-danger">{error.last_name}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="date" name="birth_day" onChange={handleInput} value={customerInput.birth_day} className="form-control" placeholder="birth_day" />
                            <label>Birth Day</label>
                            <span className="text-danger">{error.birth_day}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="street" onChange={handleInput} value={customerInput.street} className="form-control" placeholder="street" />
                            <label>Street</label>
                            <span className="text-danger">{error.street}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="zip_code" onChange={handleInput} value={customerInput.zip_code} className="form-control" placeholder="zip_code" />
                            <label>Zip Code</label>
                            <span className="text-danger">{error.zip_code}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="place" onChange={handleInput} value={customerInput.place} className="form-control" placeholder="place" />
                            <label>Place</label>
                            <span className="text-danger">{error.place}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="iban" onChange={handleInput} value={customerInput.iban} className="form-control" placeholder="iban" />
                            <label>IBAN</label>
                            <span className="text-danger">{error.iban}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="contact_number" onChange={handleInput} value={customerInput.contact_number} className="form-control" placeholder="contact_number" />
                            <label>Contact Number</label>
                            <span className="text-danger">{error.contact_number}</span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input type="text" name="pkk" onChange={handleInput} value={customerInput.pkk} className="form-control" placeholder="pkk" />
                            <label>PKK</label>
                            <span className="text-danger">{error.pkk}</span>
                        </div>
                    </div>

                </div>

                <div className="mt-4">
                    <button className="w-100 btn btn-lg btn-outline-success" type="submit">Update</button>
                </div>
            </form>
        </div>
    );
}
export default EditCustomer;