import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import { useNavigate, Link } from 'react-router-dom';




const ViewCustomer = () => {

    const [loading, setLoading] = useState(true);
    const [customerList, setCustomerList] = useState([

    ]);

    useEffect(() => {
        document.title = 'View Customer';

        axios.get(`/api/all-customers`).then(res => {

            if (res.status === 200) {

                setCustomerList(res.data.customer)
            }
            setLoading(false);
        })

    }, []);
    const deleteCustomer = (e, id) => {
        e.preventDefault()
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deletting";

        axios.delete(`/api/delete-customer/${id}`).then(res => {


            if (res.status === 200) {

                alert("Operation is completed", res.data.message, "success");
                thisClicked.closest("tr").remove();

            } else if (res.status === 404) {
                alert("Operation is incompleted", res.data.message, "error");
                thisClicked.innerText = "Delete";
            }
        })

    }
    var ViewProduct_HTML_table = "";

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ margin: "200px" }}>

                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        )
    } else {


        ViewProduct_HTML_table = customerList.map((item) => {

            return (

                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.company_id}</td>
                    <td>{item.gender}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>{item.birth_day}</td>
                    <td>{item.street}</td>
                    <td>{item.zip_code}</td>
                    <td>{item.place}</td>
                    <td>{item.iban}</td>
                    <td>{item.contact_number}</td>
                    <td>{item.pkk}</td>
                    <td>
                        <Link to={`/edit-customer/${item.id}`} className="btn btn-outline-success btn-sm">Edit</Link>
                    </td>
                    <td>
                        <button type="button" onClick={(e) => deleteCustomer(e, item.id)} className="btn btn-outline-danger btn-sm">Delete</button>
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
                    <h4 className="alert-heading text-center">View Customer</h4>
                    <hr />
                    <Link to="/admin/add-product" className="card-link">Add Customer</Link>

                </div>
            </div>
            <table className="table table-striped table-hover shadow text-center">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">email</th>
                        <th scope="col">company_id</th>
                        <th scope="col">gender</th>
                        <th scope="col">first_name</th>
                        <th scope="col">last_name</th>
                        <th scope="col">birth_day</th>
                        <th scope="col">street</th>
                        <th scope="col">zip_code</th>
                        <th scope="col">place</th>
                        <th scope="col">iban</th>
                        <th scope="col">contact_number</th>
                        <th scope="col">pkk</th>
                        <th scope="col" colSpan="2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {ViewProduct_HTML_table}
                </tbody>
            </table>
        </div>
    );
}
export default ViewCustomer;


