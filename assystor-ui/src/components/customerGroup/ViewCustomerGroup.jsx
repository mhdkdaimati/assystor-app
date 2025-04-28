import React, {useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';

const ViewCustomerGroup = () =>{

    const [loading, setLoading] = useState(true);
    const [customerGroupList, setCustomerGroup] = useState([]);

    useEffect (()=>{

        axios.get(`/api/customer-groups`).then(res =>{


            if(res.data.customer_group){
                //console.log(res.data.customer_group.length);
                setCustomerGroup(res.data.customer_group);

            }

            setLoading(false);



        })

    },[]);
    
const deleteCustomerGroup = (e, id) =>{
    e.preventDefault()
    const thisClicked = e.currentTarget;
    thisClicked.innerText = "Deletting";

    axios.delete(`/api/delete-customer-group/${id}`).then(res =>{


        if(res.status === 200){

            swal("Operation is completed", res.data.message, "success");
            thisClicked.closest("tr").remove();

        }else if(res.status === 404){
            swal("Operation is incompleted", res.data.message, "error");
            thisClicked.innerText = "Delete";



        }


    })

}
    var view_customer_group_HTML_table = "";

    if(loading){
        return(
            <div className="d-flex justify-content-center" style={{margin:"200px"}}>
                    
            <div className="spinner-grow" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
            )
        }else{

        view_customer_group_HTML_table = customerGroupList.map((item)=>{

            return(

                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                    <Link to={`/edit-customer-group/${item.id}`} className="btn btn-outline-success btn-sm">Edit</Link>
                    </td>
                    <td>
                    <button type="button" onClick={(e)=> deleteCustomerGroup(e, item.id)} className="btn btn-outline-danger btn-sm">Delete</button>
                    </td>
                </tr>
            )
        })
    }
    return (
<div className="container">
    {/* card */}
    <br/>
    <div className="shadow">
        <div className="alert alert-success" role="alert">
        <h4 className="alert-heading text-center">View Customer Group</h4>
        <hr/>
    <Link to="/add-customer-group" className="card-link">Add Customer Group</Link>

    </div>
    </div>
    <table className="table table-striped table-hover shadow text-center">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col" colSpan="2">Action</th>
            </tr>
        </thead>
        <tbody>
            {view_customer_group_HTML_table}
        </tbody>
</table>
</div>
        );
}
export default ViewCustomerGroup;


