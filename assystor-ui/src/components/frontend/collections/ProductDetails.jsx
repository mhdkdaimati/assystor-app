import axios from 'axios';

import React , {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';




function ProductDetails(props){

const[loading, setLoading] = useState(true)
const[product, setProduct] = useState([]);
const[category, setCategory] = useState([]);
const[quantity, setQuantity] = useState(1);



const history = useHistory();

const category_id = props.match.params.category_id;
const product_id = props.match.params.product_id;

    useEffect (()=>{

        const category_id = props.match.params.category_id;
        const product_id = props.match.params.product_id;

        axios.get(`/api/viewProductDetails/${category_id}/${product_id}`).then(res =>{

            if(res.data.status === 200){

                setProduct(res.data.product);
                setCategory(res.data.category);

            }else if(res.data.status === 404){

                history.push('/collections');
                swal("warning",res.data.message,"error");

            }
            setLoading(false);

        })
    },[props.match.params.product_id,props.match.params.category_id,history]);

const handleDecrement = () =>{
    if(quantity > 1){
    
        setQuantity(prevCount => prevCount -1)

    }
}
const handleIncrement = () =>{
    if(quantity < 100){

    setQuantity(prevCount => prevCount + 1)
    }

}
const submitAddToCart = (e) =>{
    e.preventDefault();
    const data = {
        product_id: product.id,
        product_quantity: quantity
    }
    axios.post(`/api/addToCart`, data).then(res=>{
        if(res.data.status === 201){

            swal("Success",res.data.message,"success")

        }else if(res.data.status === 409){

            swal("Info",res.data.message,"info")

        }else if(res.data.status === 401){

            swal("Error",res.data.message,"error")

        }else if(res.data.status === 404){

            swal("Warning",res.data.message,"warning")

        }

    })
}

    if(loading){

        return(
            
            <div className="d-flex justify-content-center" style={{margin:"200px"}}>
                <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
)
    }else{
        var availableStock = '';
        if(product.quantity >= 1 ){
        availableStock = <div>
                            <div className="row">
                                <div className="col-3">
                                    <span className="badge text-bg-success">Available in the stock</span>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="row">
                                <div className="col-3"><span>Required Quantity</span></div>
                                    <div className="col-3">
                                        <div className="input-group">
                                            <button className="btn btn-small btn-primary" onClick={handleIncrement}>+</button>
                                            <div className="form-control">{quantity}</div>
                                            <button className="btn btn-small btn-primary" onClick={handleDecrement}>-</button>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-primary" onClick={submitAddToCart}>Add to cart </button>
                                    </div>
                                </div> 
                        </div>
        }else{
            availableStock = 
                <div className="row">
                    <div className="col-3">
                        <span className="badge text-bg-danger">Out of stock</span>
                    </div>
                </div>

        }
    }

return(
    <div className="container">
        <br/>
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                <h6 className="alert-heading text-left">
                <Link to="/collections" className="btn btn-link">Collections</Link>/
                <Link to={`/collections/${category_id}`} className="btn btn-link">{category.name}</Link> 
                / {product.name}
                </h6>
            </div>
            </div>

            <br/>
            <div className="row">
            <div className="col-6">

                <div className="card mb-3 shadow">
                <img src={`http://127.0.0.1:8000/${product.image}`} className="card-img-top shadow text-center" alt="ImageNotAvailable" style={{width: "auto" , height:"auto"}}/>
                </div> 
            </div>
        
        <div className="col-6">

            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <table className="table table-borderless">
                        <thead>
                            <tr>
                            <th scope="col">Brand</th>
                            <td>{product.brand}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">Price</th>
                            <td>{product.selling_price} $</td>
                            </tr>
                            <tr>
                            <th scope="row">Available Quantity</th>
                            <td>{product.quantity}</td>
                            </tr>
                        </tbody>
                    </table>  
                    {/*in the stock div  */}
                    {availableStock}
                    {/*in the stock div ends */}
                </div>
            </div> 
        </div>
    </div>
</div>

        


);
}
export default ProductDetails;


