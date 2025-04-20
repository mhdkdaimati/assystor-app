import React, {useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import {useNavigate, Link} from 'react-router-dom';

const ViewCategory = () =>{

    const [loading, setLoading] = useState(true);
    const [categoryList, setCategoryList] = useState([

    ]);

    useEffect (()=>{

        axios.get(`/api/view-category`).then(res =>{


            if(res.status === 200){

                setCategoryList(res.data.category)
            }
            setLoading(false);


        })

    },[]);
    
const deleteCategory = (e, id) =>{
    e.preventDefault()
    const thisClicked = e.currentTarget;
    thisClicked.innerText = "Deletting";

    axios.delete(`/api/delete-category/${id}`).then(res =>{


        if(res.status === 200){

            alert("Operation is completed", res.data.message, "success");
            thisClicked.closest("tr").remove();

        }else if(res.status === 404){
            alert("Operation is incompleted", res.data.message, "error");
            thisClicked.innerText = "Delete";



        }


    })

}
    var ViewCategory_HTML_table = "";

    if(loading){
        return(
            <div className="d-flex justify-content-center" style={{margin:"200px"}}>
                    
            <div className="spinner-grow" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
            )
        }else{

        ViewCategory_HTML_table = categoryList.map((item)=>{
            let visibilityStatus = '';

            if(item.status == 0){

                visibilityStatus = 'Visible'

            }else{
                visibilityStatus = 'Hidden'


            }

            return(

                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{visibilityStatus}</td>
                    <td>
                    <Link to={`edit-category/${item.id}`} className="btn btn-outline-success btn-sm">Edit</Link>
                    </td>

                    <td>

                    <button type="button" onClick={(e)=> deleteCategory(e, item.id)} className="btn btn-outline-danger btn-sm">Delete</button>

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
        <h4 className="alert-heading text-center">View Category</h4>
        <hr/>
    <Link to="/admin/add-category" className="card-link">Add Category</Link>

    </div>
    </div>
    <table className="table table-striped table-hover shadow text-center">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">status</th>
            <th scope="col" colSpan="2">Action</th>
            </tr>
        </thead>
        <tbody>
            {ViewCategory_HTML_table}
        </tbody>
</table>
</div>
        );
}
export default ViewCategory;


