import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ViewUser = () => {

    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([

    ]);

    useEffect(() => {

        axios.get(`/api/all-users`).then(res => {


            if (res.status === 200) {

                setUserList(res.data.users)
            }
            setLoading(false);


        })

    }, []);

    const deleteUser = (e, id) => {
        e.preventDefault()
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deletting";

        axios.delete(`/api/delete-user/${id}`).then(res => {


            if (res.status === 200) {

                swal("Operation is completed", res.data.message, "success");
                thisClicked.closest("tr").remove();

            } else if (res.status === 404) {
                swal("Operation is incompleted", res.data.message, "error");
                thisClicked.innerText = "Delete";



            }


        })

    }
    var view_user_HTML_table = "";

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ margin: "200px" }}>

                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        )
    } else {

        view_user_HTML_table = userList.map((item) => {

            return (

                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>
                        <Link to={`/edit-user/${item.id}`} className="btn btn-outline-success btn-sm">Edit</Link>
                    </td>
                    <td>
                        <button type="button" onClick={(e) => deleteUser(e, item.id)} className="btn btn-outline-danger btn-sm">Delete</button>
                    </td>
                </tr>
            )
        })
    }
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
                            <h4 className="mb-0 fw-bold text-success">
                                <i className="bi bi-people-fill me-2"></i> User List
                            </h4>
                            <Link to="/add-user" className="btn btn-success rounded-pill shadow-sm">
                                <i className="bi bi-plus-circle me-1"></i> Add User
                            </Link>
                        </div>
                    </div>

                    <div className="table-responsive shadow-sm rounded-4 bg-white p-3">
                        <table className="table table-hover table-bordered align-middle text-center mb-0">
                            <thead className="table-success text-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Role</th>
                                    <th scope="col" colSpan="2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {view_user_HTML_table}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ViewUser;


