import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';

const ViewCustomerGroup = () => {
    const [loading, setLoading] = useState(true);
    const [customerGroupList, setCustomerGroupList] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCustomerGroups, setFilteredCustomerGroups] = useState([]);

    useEffect(() => {
        document.title = 'View Customer Groups';

        axios.get(`/api/customer-groups`).then(res => {
            if (res.data.customer_groups) {
                setCustomerGroupList(res.data.customer_groups);
                setFilteredCustomerGroups(res.data.customer_groups); // Set filtered data
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const result = customerGroupList.filter(group => {
            return group.name.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredCustomerGroups(result);
    }, [search, customerGroupList]);

    const deleteCustomerGroup = (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting...";

        axios.delete(`/api/delete-customer-group/${id}`).then(res => {
            if (res.status === 200) {
                swal("Operation is completed", res.data.message, "success");
                setCustomerGroupList(customerGroupList.filter(group => group.id !== id));
            } else if (res.status === 404) {
                swal("Operation is incompleted", res.data.message, "error");
                thisClicked.innerText = "Delete";
            }
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredCustomerGroups);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CustomerGroups");
        XLSX.writeFile(workbook, "CustomerGroups.xlsx");
    };

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
        },
        //customers_count
        {
            name: 'Customers count',
            selector: row => row.customers_count,
            sortable: true,
        },

        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Link to={`/edit-customer-group/${row.id}`} className="btn btn-outline-success btn-sm me-2">Edit</Link>
                    <button
                        type="button"
                        onClick={(e) => deleteCustomerGroup(e, row.id)}
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
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
                            <h4 className="mb-0 fw-bold text-primary">
                                <i className="bi bi-person-lines-fill me-2"></i> Customer Group List
                            </h4>
                            <div>
                                <button
                                    className="btn btn-success rounded-pill shadow-sm me-2"
                                    onClick={exportToExcel}
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
                                </button>
                                <Link to="/add-customer-group" className="btn btn-primary rounded-pill shadow-sm">
                                    <i className="bi bi-plus-circle me-1"></i> Add Customer Group
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive shadow-sm rounded-4 bg-white p-3">
                        <DataTable
                            columns={columns}
                            data={filteredCustomerGroups}
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

export default ViewCustomerGroup;