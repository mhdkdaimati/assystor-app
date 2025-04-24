import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';




const AddCustomerGroup = () => {
    const navigate = useNavigate();


    const [customerGroupInput, setCustomergroup] = useState({
        name: '',
        error_list: [],
    });

    const handleInput = (e) => {
        e.preventDefault();
        setCustomergroup({


            ...customerGroupInput, [e.target.name]: e.target.value
        });
    }
    const customerGroupSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: customerGroupInput.name,

        }
        //console.log("Sending:", data);

        axios.post(`/api/store-customer-group`, data).then(res => {
            if (res.data.status === 201) {
                setCustomergroup({
                    name: '',
                    error_list: [],
                });

                swal("Operation is completed", res.data.message, "success");
                document.getElementById('CUSTOMER_GROUP_FORM').reset();
                navigate('/view-customer-group');


            } else if (res.data.status === 400) {

                swal("Operation is incompleted", res.data.message, "error");

            } else {
                setCustomergroup({ ...customerGroupInput, error_list: res.data.errors });
                swal("Operation is incompleted", "Adding new customer group couldn't be completed, please check the errors.", "error");
                console.log(res.data.errors);
            }
        });
    }


    return (
        <>
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">Add Customer Group</h4>
                </div>
            </div>

            <form onSubmit={customerGroupSubmit} id="CUSTOMER_GROUP_FORM" >

                <div className="form-floating">
                    <input type="text" name="name" onChange={handleInput} value={customerGroupInput.name} className="form-control" id="floatingName" placeholder="Name" />
                    <label htmlFor="floatingName">Name</label>
                    <span style={{ color: "red" }}>{customerGroupInput.error_list.name}</span>
                </div>
                <br />

                <button className="w-100 btn btn-lg btn-outline-primary" type="submit">Save</button>
            </form>
        </>
    );
}
export default AddCustomerGroup;