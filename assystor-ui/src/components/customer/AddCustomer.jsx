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
        <div className="container">
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">Add Customer</h4>
                </div>
            </div>
            <form onSubmit={customerSubmit} id="CATEGORY_FORM" encType="multipart/form-data">
                <div className="form-floating">
                    <input type="text" name="email" onChange={handleInput} value={customerInput.email} className="form-control" id="floatingName" placeholder="email" />
                    <label htmlFor="floatingName">email</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.email}</span>
                </div>

                <br />
                <div>
                    <select className="form-select" name="company_id" onChange={handleInput} value={customerInput.company_id}>
                        <option>Select Company</option>
                        {
                            companyList.map((item) => {
                                return (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                )
                            })
                        }
                    </select>
                    
                </div>
                <br />
                <select name="gender" onChange={handleInput} value={customerInput.gender} className="form-select" aria-label="Default select example">
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>

                <span style={{ color: "red" }}>{customerInput.error_list.gender}</span>

                <br />
                <div className="form-floating">
                    <input type="text" name="first_name" onChange={handleInput} value={customerInput.first_name} className="form-control" id="floatingName" placeholder="first_name" />
                    <label htmlFor="floatingName">first_name</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.first_name}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input type="text" name="last_name" onChange={handleInput} value={customerInput.last_name} className="form-control" id="floatingName" placeholder="last_name" />
                    <label htmlFor="floatingName">last_name</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.last_name}</span>
                </div>

                <br />
                <div className="form-floating">
                    <input type="date" name="birth_day" onChange={handleInput} value={customerInput.birth_day} className="form-control" id="floatingName" placeholder="birth_day" />
                    <label htmlFor="floatingName">birth_day</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.birth_day}</span>
                </div>

                <br />
                <div className="form-floating">
                    <input type="text" name="street" onChange={handleInput} value={customerInput.street} className="form-control" id="floatingName" placeholder="street" />
                    <label htmlFor="floatingName">street</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.street}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input type="text" name="zip_code" onChange={handleInput} value={customerInput.zip_code} className="form-control" id="floatingName" placeholder="zip_code" />
                    <label htmlFor="floatingName">zip_code</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.zip_code}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input type="text" name="place" onChange={handleInput} value={customerInput.place} className="form-control" id="floatingName" placeholder="place" />
                    <label htmlFor="floatingName">place</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.place}</span>
                </div>


                <br />
                <div className="form-floating">
                    <input type="text" name="iban" onChange={handleInput} value={customerInput.iban} className="form-control" id="floatingName" placeholder="iban" />
                    <label htmlFor="floatingName">iban</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.iban}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input type="text" name="contact_number" onChange={handleInput} value={customerInput.contact_number} className="form-control" id="floatingName" placeholder="contact_number" />
                    <label htmlFor="floatingName">contact_number</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.contact_number}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input type="text" name="pkk" onChange={handleInput} value={customerInput.pkk} className="form-control" id="floatingName" placeholder="pkk" />
                    <label htmlFor="floatingName">pkk</label>
                    <span style={{ color: "red" }}>{customerInput.error_list.pkk}</span>
                </div>
                <br />
                <button className="w-100 btn btn-lg btn-outline-primary" type="submit">Add customer</button>
            </form>

        </div>
    );
}
export default AddCustomer;