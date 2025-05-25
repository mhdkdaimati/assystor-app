import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const ViewUser = () => {
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
const navigate = useNavigate();

    useEffect(() => {
        document.title = 'View Users';

        axios.get(`/api/all-users`).then(res => {
            if (res.status === 200) {
                setUserList(res.data.users);
                setFilteredUsers(res.data.users); // Set filtered data
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const result = userList.filter(user => {
            return (
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.role.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredUsers(result);
    }, [search, userList]);

    const deleteUser = (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting...";

        axios.delete(`/api/delete-user/${id}`).then(res => {
            if (res.status === 200) {
                swal("Operation is completed", res.data.message, "success");
                setUserList(userList.filter(user => user.id !== id));
            } else if (res.status === 404) {
                swal("Operation is incompleted", res.data.message, "error");
                thisClicked.innerText = "Delete";
            }
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "Users.xlsx");
    };

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Link to={`/edit-user/${row.id}`} className="btn btn-outline-success btn-sm me-2">Edit</Link>
                    <button
                        type="button"
                        onClick={(e) => deleteUser(e, row.id)}
                        className="btn btn-outline-danger btn-sm"
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ];

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
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/dashboard')}>
      &larr; Back to Dashboard
    </button>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
                            <h4 className="mb-0 fw-bold text-success">
                                <i className="bi bi-people-fill me-2"></i> User List
                            </h4>
                            <div>
                                <button
                                    className="btn btn-success rounded-pill shadow-sm me-2"
                                    onClick={exportToExcel}
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
                                </button>
                                <Link to="/add-user" className="btn btn-primary rounded-pill shadow-sm">
                                    <i className="bi bi-plus-circle me-1"></i> Add User
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive shadow-sm rounded-4 bg-white p-3">
                        <DataTable
                            columns={columns}
                            data={filteredUsers}
                            pagination
                            highlightOnHover
                            striped
                            responsive
                            subHeader
                            subHeaderComponent={
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="form-control w-25"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUser;