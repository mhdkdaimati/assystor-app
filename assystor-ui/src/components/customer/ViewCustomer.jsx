import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

const ViewCustomer = () => {
    const [loading, setLoading] = useState(true);
    const [customerList, setCustomerList] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    useEffect(() => {
        document.title = 'View Customer';

        axios.get(`/api/all-customers`).then(res => {
            if (res.status === 200) {
                setCustomerList(res.data.customer);
                setFilteredCustomers(res.data.customer); // تعيين البيانات المفلترة
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const result = customerList.filter(customer => {
            return (
                customer.email.toLowerCase().includes(search.toLowerCase()) ||
                customer.first_name.toLowerCase().includes(search.toLowerCase()) ||
                customer.last_name.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredCustomers(result);
    }, [search, customerList]);

    const deleteCustomer = (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting...";

        axios.delete(`/api/delete-customer/${id}`).then(res => {
            if (res.status === 200) {
                swal("Operation is completed", res.data.message, "success");
                setCustomerList(customerList.filter(customer => customer.id !== id));
            } else if (res.status === 404) {
                swal("Operation is incompleted", res.data.message, "error");
                thisClicked.innerText = "Delete";
            }
        });
    };

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: false,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Company ID',
            selector: row => row.company_id,
            sortable: true,
        },
        {
            name: 'Gender',
            selector: row => row.gender,
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.last_name,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Link to={`/edit-customer/${row.id}`} className="btn btn-outline-success btn-sm me-2">Edit</Link>
                    <button
                        type="button"
                        onClick={(e) => deleteCustomer(e, row.id)}
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
        <div className="container mt-5">
            <div className="card shadow mb-4">
                <div className="card-header bg-primary text-white text-center">
                    <h4>View Customers</h4>
                </div>
                <div className="card-body">
                    <Link to="/add-customer" className="btn btn-success mb-3">Add Customer</Link>
                    <DataTable
                        columns={columns}
                        data={filteredCustomers}
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
    );
};

export default ViewCustomer;