import React, {useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import {useNavigate, Link} from 'react-router-dom';




const ViewProduct = () =>{

    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState([

    ]);

    useEffect (()=>{
        document.title= 'ViewProduct';

        axios.get(`/api/view-product`).then(res =>{

            if(res.status === 200){

                setProductList(res.data.product)
            }
            setLoading(false);
        })

    },[]);
const deleteProduct = (e, id) =>{
    e.preventDefault()
    const thisClicked = e.currentTarget;
    thisClicked.innerText = "Deletting";

    axios.delete(`/api/delete-product/${id}`).then(res =>{


        if(res.status === 200){

            alert("Operation is completed", res.data.message, "success");
            thisClicked.closest("tr").remove();

        }else if(res.status === 404){
            alert("Operation is incompleted", res.data.message, "error");
            thisClicked.innerText = "Delete";
        }
    })

}
    var ViewProduct_HTML_table = "";

    if(loading){
        return(
            <div className="d-flex justify-content-center" style={{margin:"200px"}}>
                    
            <div className="spinner-grow" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
            )
        }else{
            
        var productStatus = '';

        ViewProduct_HTML_table = productList.map((item)=>{

            if(item.status == '0'){

                productStatus = 'Shown';

            }else{
                productStatus = 'Hidden';
            }

            return(

                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><img src={`http://127.0.0.1:8000/${item.image}`} width="50px" height="50px" alt=""/></td>
                    <td>{item.name}</td>
                    <td>{item.category.name}</td>
                    <td>{productStatus}</td>
                    <td>{item.quantity}</td>
                    <td>
                    <Link to={`edit-product/${item.id}`} className="btn btn-outline-success btn-sm">Edit</Link>
                    </td>
                    {/* <td>
                    <button type="button" onClick={(e)=> deleteProduct(e, item.id)} className="btn btn-outline-danger btn-sm">Delete</button>
                    </td> */}
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
        <h4 className="alert-heading text-center">View Product</h4>
        <hr/>
    <Link to="/admin/add-product" className="card-link">Add Product</Link>

    </div>
    </div>
    <table className="table table-striped table-hover shadow text-center">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">image</th>
            <th scope="col">name</th>
            <th scope="col">category_id</th>
            <th scope="col">status</th>
            <th scope="col">quantity</th>
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
export default ViewProduct;


