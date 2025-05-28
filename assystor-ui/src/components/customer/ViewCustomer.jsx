import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
const ViewCustomer = () => {
    const [loading, setLoading] = useState(true);
    const [customerList, setCustomerList] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'View Customer';

        axios.get(`/api/all-customers`).then(res => {
            if (res.status === 200) {
                setCustomerList(res.data.customers);
                setFilteredCustomers(res.data.customers); // Set filtered data
            }
            setLoading(false);
        });
    }, []);


    useEffect(() => {
        const result = customerList.filter(customer => {
            return (
                (customer.contact_number || "").toLowerCase().includes(search.toLowerCase()) ||
                (customer.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (customer.last_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (customer.email || "").toLowerCase().includes(search.toLowerCase()));
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

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredCustomers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, "Customers.xlsx");
    };

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: false,
        },
        {
            name: 'contact_number',
            selector: row => row.contact_number,
            sortable: true,
        },
        {
            name: 'first_name',
            selector: row => row.first_name ? row.first_name : 'N/A',
            sortable: true,
        },
        {
            name: 'last_name',
            selector: row => row.last_name ? row.last_name : 'N/A',
            sortable: true,
        },
        {
            name: 'email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Link
                        to={`/customer-details/${row.id}`}
                        className="btn btn-outline-info btn-sm me-2"
                        title="Details"
                    >
                        <FaEye />
                    </Link>
                    <Link
                        to={`/edit-customer/${row.id}`}
                        className="btn btn-outline-success btn-sm me-2"
                        title="Edit"
                    >
                        <FaEdit />
                    </Link>
                    <button
                        type="button"
                        onClick={(e) => deleteCustomer(e, row.id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </>),
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
                            <h4 className="mb-0 fw-bold text-primary">
                                <i className="bi bi-person-lines-fill me-2"></i> Customer List
                            </h4>
                            <div>
                                <button
                                    className="btn btn-success rounded-pill shadow-sm me-2"
                                    onClick={exportToExcel}
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
                                </button>
                                <Link to="/upload-customers" className="btn btn-primary rounded-pill shadow-sm me-2">
                                    <i className="bi bi-upload me-1"></i> Import Customers
                                </Link>
                                <Link to="/add-customer" className="btn btn-primary rounded-pill shadow-sm ">
                                    <i className="bi bi-plus-circle me-1"></i> Add Customer
                                </Link>

                            </div>
                        </div>
                    </div>

                    <div className="table-responsive shadow-sm rounded-4 bg-white p-3">
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
        </div>
    );
};

export default ViewCustomer;