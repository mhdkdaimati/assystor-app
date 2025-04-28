import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ViewCompany = () => {

    const [loading, setLoading] = useState(true);
    const [companyList, setCompanyList] = useState([

    ]);

    useEffect(() => {

        axios.get(`/api/all-companies`).then(res => {


            if (res.status === 200) {

                setCompanyList(res.data.companies)
            }
            setLoading(false);


        })

    }, []);

    const deleteCompany = (e, id) => {
        e.preventDefault()
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deletting";

        axios.delete(`/api/delete-company/${id}`).then(res => {


            if (res.status === 200) {

                swal("Operation is completed", res.data.message, "success");
                thisClicked.closest("tr").remove();

            } else if (res.status === 404) {
                swal("Operation is incompleted", res.data.message, "error");
                thisClicked.innerText = "Delete";



            }


        })

    }
    var view_company_HTML_table = "";

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ margin: "200px" }}>

                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        )
    } else {

        view_company_HTML_table = companyList.map((item) => {

            return (

                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.responsible_person}</td>
                    <td>{item.tel_number}</td>
                    <td>{item.status}</td>
                    <td>
                        <Link to={`/edit-company/${item.id}`} className="btn btn-outline-success btn-sm">Edit</Link>
                    </td>
                    <td>
                        <button type="button" onClick={(e) => deleteCompany(e, item.id)} className="btn btn-outline-danger btn-sm">Delete</button>
                    </td>
                </tr>
            )
        })
    }
    return (
        <div className="container">
            {/* card */}
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">View Company</h4>
                    <hr />
                    <Link to="/add-company" className="card-link">Add company</Link>

                </div>
            </div>
            <table className="table table-striped table-hover shadow text-center">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Responsible person</th>
                        <th scope="col">Tel number</th>
                        <th scope="col">Status</th>
                        <th scope="col" colSpan="2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {view_company_HTML_table}
                </tbody>
            </table>
        </div>
    );
}
export default ViewCompany;


