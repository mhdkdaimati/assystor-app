import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import { useNavigate, Link,useParams } from 'react-router-dom';


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
        <div className="container">
            {/* card */}
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">Edit customer</h4>
                </div>
            </div>
            {/* card end */}

            <form onSubmit={customerUpdate} id="CATEGORY_FORM" encType="multipart/form-data">

                <div className="form-floating">
                    <input type="email" name="email" onChange={handleInput} value={customerInput.email ||''} className="form-control" id="floatingName" placeholder="email" />
                    <label htmlFor="floatingName">email</label>
                    <span style={{ color: "red" }}>{error.email}</span>
                </div>
                <br />
                <div>
                    <select className="form-select" name="category_id" onChange={handleInput} value={customerInput.company_id || ''}>
                        <option>Select company</option>
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
                
                <select name="gender" onChange={handleInput} value={customerInput.gender ||''} className="form-select" aria-label="Default select example">
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
                <br />

                <div className="form-floating">
                    <input type="text" name="first_name" onChange={handleInput} value={customerInput.first_name} className="form-control" id="floatingName" placeholder="first_name" />
                    <label htmlFor="floatingName">first_name</label>
                    <span style={{ color: "red" }}>{error.first_name}</span>
                </div>
                <br />

                <div className="form-floating">
                    <input type="text" name="last_name" onChange={handleInput} value={customerInput.last_name} className="form-control" id="floatingName" placeholder="last_name" />
                    <label htmlFor="floatingName">last_name</label>
                    <span style={{ color: "red" }}>{error.last_name}</span>
                </div>
                <br />
                
                <div className="form-floating">
                    <input type="date" name="birth_day" onChange={handleInput} value={customerInput.birth_day} className="form-control" id="floatingName" placeholder="birth_day" />
                    <label htmlFor="floatingName">birth_day</label>
                    <span style={{ color: "red" }}>{error.birth_day}</span>
                </div>
                <br />
                
                <div className="form-floating">
                    <input type="text" name="street" onChange={handleInput} value={customerInput.street} className="form-control" id="floatingName" placeholder="street" />
                    <label htmlFor="floatingName">street</label>
                    <span style={{ color: "red" }}>{error.street}</span>
                </div>
                <br />



                


                <div className="form-floating">
                    <input type="text" name="zip_code" onChange={handleInput} value={customerInput.zip_code} className="form-control" id="floatingName" placeholder="zip_code" />
                    <label htmlFor="floatingName">zip_code</label>
                    <span style={{ color: "red" }}>{error.zip_code}</span>
                </div>
                <br />
                
                <div className="form-floating">
                    <input type="text" name="place" onChange={handleInput} value={customerInput.place} className="form-control" id="floatingName" placeholder="place" />
                    <label htmlFor="floatingName">place</label>
                    <span style={{ color: "red" }}>{error.place}</span>
                </div>
                <br />

                
                <div className="form-floating">
                    <input type="text" name="iban" onChange={handleInput} value={customerInput.iban} className="form-control" id="floatingName" placeholder="iban" />
                    <label htmlFor="floatingName">iban</label>
                    <span style={{ color: "red" }}>{error.iban}</span>
                </div>
                <br />
                


                <div className="form-floating">
                    <input type="text" name="contact_number" onChange={handleInput} value={customerInput.contact_number} className="form-control" id="floatingName" placeholder="contact_number" />
                    <label htmlFor="floatingName">contact_number</label>
                    <span style={{ color: "red" }}>{error.contact_number}</span>
                </div>
                <br />
                
                <div className="form-floating">
                    <input type="text" name="pkk" onChange={handleInput} value={customerInput.pkk} className="form-control" id="floatingName" placeholder="pkk" />
                    <label htmlFor="floatingName">pkk</label>
                    <span style={{ color: "red" }}>{error.pkk}</span>
                </div>
                <br />
                <button className="w-100 btn btn-lg btn-outline-success" type="submit">Update Customer</button>
            </form>

        </div>
    );
}
export default EditCustomer;