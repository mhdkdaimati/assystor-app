import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate, Link } from 'react-router-dom';

function AddUser() {

    const navigate = useNavigate();
    const [registerInput, setRegister] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        error_list: [],
    });

    const handleInput = (e) => {
        e.persist();
        setRegister({ ...registerInput, [e.target.name]: e.target.value });
    }

    const registerSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: registerInput.name,
            email: registerInput.email,
            password: registerInput.password,
            role: registerInput.role || 'operator'
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`api/register`, data).then(res => {
                if (res.data.status === 201) {

                    setRegister({
                        name: '',
                        email: '',
                        password: '',
                        role: '',
                        error_list: [],
                
                    })
                    swal("Operation is completed", res.data.message, "success");
                    document.getElementById('REGISTER_FORM').reset();

                } else {
                    setRegister({ ...registerInput, error_list: res.data.validator_errors });
                    swal("Operation is inompleted", "Your registration couldn't be completed, please check the errors.", "error");
                }
            });
        });

    }
    return (
        <div className="container ">
            <br />
            <div className="row">
                <div className="col-4">

                </div>
                <div className="col-4">
                    <main className="form-signin">
                        <form onSubmit={registerSubmit} id="REGISTER_FORM" encType="multipart/form-data">
                            <h1 className="h3 mb-3 fw-normal text-center">Register</h1>
                            <div className="form-floating">
                                <input type="text" name="name" onChange={handleInput} value={registerInput.name} className="form-control" id="floatingName" placeholder="Full Name" />
                                <label htmlFor="floatingName">Full Name</label>
                                <span style={{ color: "red" }}>{registerInput.error_list.name}</span>
                            </div>
                            <br />
                            <div className="form-floating">
                                <input type="email" name="email" onChange={handleInput} value={registerInput.email} className="form-control" id="floatingEmail" placeholder="name@example.com" />
                                <label htmlFor="floatingEmail">Email address</label>
                                <span style={{ color: "red" }}>{registerInput.error_list.email}</span>
                            </div>
                            <br />
                            <div className="form-floating">
                                <input type="password" name="password" onChange={handleInput} value={registerInput.password} className="form-control" id="floatingPassword" placeholder="Password" />
                                <label htmlFor="floatingPassword">Password</label>
                                <span style={{ color: "red" }}>{registerInput.error_list.password}</span>
                            </div>
                            <br />
                            <div className="form-floating">
                                <select
                                    className="form-select" name="role" onChange={handleInput} value={registerInput.role || 'operator'} id="floatingRole">
                                    <option value="operator">Operator</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <label htmlFor="floatingRole">Role</label>
                                <span style={{ color: "red" }}>{registerInput.error_list.role}</span>
                            </div>



                            <br />
                            <br />
                            <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
                        </form>
                        <br />
                    </main>
                </div>
                <div className="col-4">

                </div>

            </div>

        </div>
    );
}
export default AddUser;