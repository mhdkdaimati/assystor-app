import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link,useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';

const ViewCompany = () => {
    const [loading, setLoading] = useState(true);
    const [companyList, setCompanyList] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
const navigate = useNavigate();

    useEffect(() => {
        document.title = 'View Company';

        axios.get(`/api/all-companies`).then(res => {
            if (res.status === 200) {
                setCompanyList(res.data.companies);
                setFilteredCompanies(res.data.companies); // Set filtered data
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const result = companyList.filter(company => {
            return (
                company.name.toLowerCase().includes(search.toLowerCase()) ||
                company.responsible_person.toLowerCase().includes(search.toLowerCase()) ||
                company.tel_number.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredCompanies(result);
    }, [search, companyList]);

    const deleteCompany = (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting...";

        axios.delete(`/api/delete-company/${id}`).then(res => {
            if (res.status === 200) {
                swal("Operation is completed", res.data.message, "success");
                setCompanyList(companyList.filter(company => company.id !== id));
            } else if (res.status === 404) {
                swal("Operation is incompleted", res.data.message, "error");
                thisClicked.innerText = "Delete";
            }
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredCompanies);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
        XLSX.writeFile(workbook, "Companies.xlsx");
    };

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Company Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Responsible Person',
            selector: row => row.responsible_person,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.tel_number,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Link to={`/edit-company/${row.id}`} className="btn btn-outline-success btn-sm me-2">Edit</Link>
                    <button
                        type="button"
                        onClick={(e) => deleteCompany(e, row.id)}
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
                            <h4 className="mb-0 fw-bold text-primary">
                                <i className="bi bi-buildings me-2"></i> Company List
                            </h4>
                            <div>
                                <button
                                    className="btn btn-success rounded-pill shadow-sm me-2"
                                    onClick={exportToExcel}
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
                                </button>
                                <Link to="/add-company" className="btn btn-primary rounded-pill shadow-sm">
                                    <i className="bi bi-plus-circle me-1"></i> Add Company
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive shadow-sm rounded-4 bg-white p-3">
                        <DataTable
                            columns={columns}
                            data={filteredCompanies}
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

export default ViewCompany;