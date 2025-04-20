import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import {useHistory, Link} from 'react-router-dom';

function Register(){
    const history = useHistory();
    const [registerInput, setRegister] = useState({
        name:'',
        email:'',
        password:'',
        // confirm_password:'',
        error_list:[],
    });
    const handleInput = (e)=>{
        e.persist();
        setRegister({...registerInput, [e.target.name]: e.target.value});
    }
    const registerSubmit = (e)=>{
        // if(registerInput.password === registerInput.confirm_password){
            e.preventDefault();
            const data = {
                name: registerInput.name,
                email: registerInput.email,
                password: registerInput.password,
            }
            axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/register`, data).then(res => {
                if(res.data.status ===200 ){
                    // localStorage.setItem('auth_token',res.data.token);
                    // localStorage.setItem('auth_name',res.data.username);
                    swal("Operation is completed, Please login", res.data.message, "success");
                    history.push('/login')
                    }else{
                        setRegister({...registerInput, error_list: res.data.validator_errors});
                        swal("Operation is inompleted", "Your registration couldn't be completed, please check the errors.", "error");
                    }
                    });
                });
            // }else{
            //     swal("Operation Incompletion", "Your registration couldn't be deu to password mismatched, please try again.", "error");
            // }
        }
return(
        <div className="container ">
            <br/>
            <div className="row">
                <div className="col-4">
                    
                </div>
            <div className="col-4">
            <main className="form-signin">
                <form onSubmit={registerSubmit}>
                    <h1 className="h3 mb-3 fw-normal text-center">Register</h1>
                    <div className="form-floating">
                        <input type="text" name="name" onChange={handleInput} value={registerInput.name} className="form-control" id="floatingName" placeholder="Full Name"/>
                        <label htmlFor="floatingName">Full Name</label>
                        <span style={{color: "red"}}>{registerInput.error_list.name}</span>
                    </div>
                    <br/>
                    <div className="form-floating">
                        <input type="email" name="email" onChange={handleInput} value={registerInput.email} className="form-control" id="floatingEmail" placeholder="name@example.com"/>
                        <label htmlFor="floatingEmail">Email address</label>
                        <span style={{color: "red"}}>{registerInput.error_list.email}</span>
                    </div>
                    <br/>
                    <div className="form-floating">
                        <input type="password" name="password" onChange={handleInput} value={registerInput.password} className="form-control" id="floatingPassword" placeholder="Password"/>
                        <label htmlFor="floatingPassword">Password</label>
                        <span style={{color: "red"}}>{registerInput.error_list.password}</span>
                    </div>
                    <br/>
                    {/* <div className="form-floating">
                        <input type="password" name="confirm_password" onChange={handleInput} value={registerInput.confirm_password} className="form-control" id="floatingConfirmPassword" placeholder="Confirm Password"/>
                        <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                    </div> */}
                    <br/>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
                </form>
                <br/>
                <div className="text-center">
                    <p>already have an account?</p>
                    <Link className="w-100 btn btn-sm btn-outline-success" to="/login">Login</Link>
                </div>
                </main>
        </div>
        <div className="col-4">
                    
        </div>
    
        </div>

    </div>
);
}
export default Register;