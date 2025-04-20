import axios from 'axios';

import React , {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';




function ViewProduct(props){

const[loading, setLoading] = useState(true)
const[product, setProduct] = useState([]);
const[category, setCategory] = useState([]);
const history = useHistory();

const category_id = props.match.params.category_id;

    useEffect (()=>{


        const category_id = props.match.params.category_id;

        axios.get(`/api/getProduct/${category_id}`).then(res =>{


            if(res.data.status === 200){

                setProduct(res.data.product);
                setCategory(res.data.category);



            }else if(res.data.status === 404){

                history.push('/collections');
                swal("warning",res.data.message,"error");

            }
            setLoading(false);



        })
    },[props.match.params.category_id,history]);

    var ViewProductList = '';

    if(loading){

        return(
            
            <div className="d-flex justify-content-center" style={{margin:"200px"}}>
                <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
)

    }else{

        ViewProductList = product.map((item)=>{

            return(
                <div className="card shadow" style={{width: "18rem" , margin:"10px"}} key={item.id}>
                    <img src={`http://127.0.0.1:8000/${item.image}`} className="card-img-top shadow text-center" alt="ImageNotAvailable" style={{width: "262px" , height:"200px", marginTop:"10px"}}/>
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">{item.description}</p>
                        <Link to={`/collections/${category_id}/${item.id}`} className="btn btn-outline-primary shadow"> 
                        Learn More</Link>
                    </div>
                </div>
                
                )
        })
    }
    var alertProduct ='';
    if(ViewProductList.length === 0){
    
        var alertProduct = (

        <div className="container">
        <div className="alert alert-info shadow" role="alert">
        No products in <span style={{fontWeight: "bold"}}>{category.name}</span> category.
        </div>    
        </div>

        )
        
    
    }

return(
    <div className="container">
        <br/>
    <div className="shadow">
        <div className="alert alert-success" role="alert">
        <h6 className="alert-heading text-left"><Link to="/collections" className="btn btn-link">Collections</Link>/ {category.name}</h6>
    </div>
    </div>

        <div className="row">
            {ViewProductList}
            {alertProduct}
        </div>

    </div>

        


);
}
export default ViewProduct;