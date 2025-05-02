import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const IncompletedCustomerGroups = () => {
    const [loading, setLoading] = useState(true);
    const [customerGroupList, setCustomerGroupList] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCustomerGroups, setFilteredCustomerGroups] = useState([]);

    useEffect(() => {
        axios.get(`/api/customer-groups/incomplete`).then(res => {
            if (res.data.customer_groups) {
                setCustomerGroupList(res.data.customer_groups);
                setFilteredCustomerGroups(res.data.customer_groups); // تعيين البيانات المفلترة
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

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredCustomerGroups);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "IncompletedCustomerGroups");
        XLSX.writeFile(workbook, "IncompletedCustomerGroups.xlsx");
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
            name: 'Customers Count',
            selector: row => row.customers_count,
            sortable: true,
        },
        {
            name: 'Incomplete Customers Count',
            selector: row => row.incomplete_customers_count,
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/process-customer-group/${row.id}`} className="btn btn-outline-primary btn-sm">
                    Process
                </Link>
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
                                <i className="bi bi-people-fill me-2"></i> Incompleted Customer Groups
                            </h4>
                            <div>
                                <button
                                    className="btn btn-success rounded-pill shadow-sm me-2"
                                    onClick={exportToExcel}
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
                                </button>
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

export default IncompletedCustomerGroups;