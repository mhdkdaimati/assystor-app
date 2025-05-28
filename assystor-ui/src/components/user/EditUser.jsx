import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

/*



            'name' => 'required|min:3|max:191',
            'email' => 'required|email|max:191|unique:users,email',
            'password' => 'required|min:5',
            'role' => 'required|in:admin,manager,operator', 


*/

const EditUser = () => {

    const navigate = useNavigate();
    const { id } = useParams(); // Use useParams to get the identifier
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);
    const [userInput, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        error_list: [],
    });

    useEffect(() => {
        document.title = 'Edit User';

        axios.get(`/api/get-user/${id}`).then((res) => {
            if (res.data.status === 200) {
                setUser(res.data.user);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate('/view-user');
            }
            setLoading(false);
        });
    }, [id, navigate]);

    const handleInput = (e) => {
        e.persist();
        setUser({
            ...userInput,
            [e.target.name]: e.target.value,
        });
    };


    const userUpdate = (e) => {
        e.preventDefault();

        const data = {

            name: userInput.name,
            email: userInput.email,
            password: userInput.password,
            role: userInput.role,

        };

        axios.put(`/api/update-user/${id}`, data).then((res) => {
            if (res.data.status === 200) {
                swal("Operation is completed", res.data.message, "success");
                setError([]);
                navigate('/view-user');
            } else if (res.data.status === 422) {
                swal("Operation is incomplete", "Updating user couldn't be completed, please check the errors.", "error");
                setError(res.data.errors);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate('/view-user');
            }
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ margin: "200px" }}>
                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center rounded-top-4 px-4 py-3">
                            <h5 className="mb-0 text-success fw-bold">
                                <i className="bi bi-pencil-square me-2"></i>Edit User
                            </h5>
                            <Link to="/view-user" className="btn btn-sm btn-outline-secondary rounded-pill">
                                <i className="bi bi-arrow-left me-1"></i> Back
                            </Link>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={userUpdate} encType="multipart/form-data">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={handleInput}
                                        value={userInput.name}
                                        className="form-control"
                                        id="floatingName"
                                        placeholder="Name"
                                    />
                                    <label htmlFor="floatingName">Full Name</label>
                                    {error.name && <div className="text-danger mt-1">{error.name}</div>}
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        name="email"
                                        type="email"
                                        onChange={handleInput}
                                        value={userInput.email}
                                        className="form-control"
                                        id="floatingEmail"
                                        placeholder="Email"
                                    />
                                    <label htmlFor="floatingEmail">Email Address</label>
                                    {error.email && <div className="text-danger mt-1">{error.email}</div>}
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleInput}
                                        value={userInput.password}
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="Password"
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                    {error.password && <div className="text-danger mt-1">{error.password}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="roleSelect" className="form-label">Role</label>
                                    <select
                                        name="role"
                                        onChange={handleInput}
                                        value={userInput.role}
                                        className="form-select"
                                        id="roleSelect"
                                    >
                                        <option value="operator">Operator</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {error.role && <div className="text-danger mt-1">{error.role}</div>}
                                </div>

                                <button className="btn btn-success w-100 rounded-pill shadow-sm" type="submit">
                                    <i className="bi bi-check-circle me-1"></i> Update User
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default EditUser;