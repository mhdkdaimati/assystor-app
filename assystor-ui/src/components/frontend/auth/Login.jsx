import axios from 'axios';
import swal from 'sweetalert';
import {useHistory, Link} from 'react-router-dom';
import React, { useState } from 'react';

function Login(){
    const history = useHistory();
    const [loginInput, setLogin] = useState({
        email:'',
        password:'',
        error_list:[],
    });
    const handleInput = (e)=>{
        e.persist();
        setLogin({...loginInput, [e.target.name]: e.target.value});
    }
    const loginSubmit = (e)=>{
            e.preventDefault();
            const data = {
                email: loginInput.email,
                password: loginInput.password,
            }
            axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/login`, data).then(res => {
                if(res.data.status === 200 ){

                    localStorage.setItem('auth_token',res.data.token);
                    localStorage.setItem('auth_name',res.data.username);
                    swal("Operation is completed", res.data.message, "success");
                    if(res.data.role === 'admin'){
                        history.push('/admin/dashboard');
                    }else{
                        history.push('/');
                    }


                }else if(res.data.status === 401){
                    swal("Operation is incompleted", res.data.message, "error");
                }else{
                    setLogin ({...loginInput, error_list: res.data.validator_errors});
                    swal("Operation is incompleted", "Your loggin couldn't be completed, please check the errors.", "error");
                }
                    });
                });
        }

return(
        <div className="container">
            <br/>
            <div className="row">
            <div className="col-4">
            
            </div>

            <div className="col-4">
            <main className="form-signin">
                <form onSubmit={loginSubmit}>
                    <h1 className="h3 mb-3 fw-normal text-center">Login</h1>
                    <div className="form-floating">
                        <input type="text" name="email" onChange={handleInput} value={loginInput.email} className="form-control" id="floatingEmail" placeholder="name@example.com"/>
                        <label htmlFor="floatingEmail">Email address</label>
                        <span style={{color: "red"}}>{loginInput.error_list.email}</span>
                    </div>
                    <br/>
                    <div className="form-floating">
                        <input type="password" name="password" onChange={handleInput} value={loginInput.password} className="form-control" id="floatingPassword" placeholder="Password"/>
                        <label htmlFor="floatingPassword">Password</label>
                        <span style={{color: "red"}}>{loginInput.error_list.password}</span>
                    </div>
                    <br/>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
                </form>
                
                <br/>
                <div className="text-center">
                    <p>don't have an account?</p>
                    <Link className="w-100 btn btn-sm btn-outline-success" to="/register">Register</Link>
                </div>
                </main>
        </div>
        <div className="col-4">
            
        </div>

        </div>
    </div>
);
}
export default Login;