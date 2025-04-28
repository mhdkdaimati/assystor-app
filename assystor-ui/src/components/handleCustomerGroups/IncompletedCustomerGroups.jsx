import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const IncompletedCustomerGroups = () => {

    const [loading, setLoading] = useState(true);
    const [customerGroupList, setCustomerGroup] = useState([]);

    useEffect(() => {

        axios.get(`/api/customer-groups/incomplete`).then(res => {


            if (res.data.customer_groups) {
                setCustomerGroup(res.data.customer_groups);

            }

            setLoading(false);



        })

    }, []);

    var view_customer_group_HTML_table = "";

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ margin: "200px" }}>

                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        )
    } else {

        view_customer_group_HTML_table = customerGroupList.map((item) => {

            return (

                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.customers_count}</td>
                    <td>{item.incomplete_customers_count}</td>
                    <td>
                        <Link to={`/process-customer-group/${item.id}`} className="btn btn-outline-primary btn-sm">Process</Link>
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
                    <h4 className="alert-heading text-center">Process incompleted customer group</h4>

                </div>
            </div>
            <table className="table table-striped table-hover shadow text-center">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">customers_count</th>
                        <th scope="col">incomplete_customers_count</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {view_customer_group_HTML_table}
                </tbody>
            </table>
        </div>
    );
}
export default IncompletedCustomerGroups;


