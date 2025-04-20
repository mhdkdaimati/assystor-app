import axios from 'axios';
import React , {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';


function Cart(){

    const[loading, setLoading] = useState(true);
    const[cart, setCart] = useState([]);
    const history = useHistory();
    var totalCartPrice = 0;

    if(!localStorage.getItem('auth_token')){
        history.push('/');
        swal('Warning','Login to view myCart','error');
    }


    useEffect (()=>{

        axios.get(`/api/cart`).then(res =>{

            if(res.data.status === 200){

                setCart(res.data.cart);

            }else if(res.data.status === 401){

                history.push('/');
                swal("warning",res.data.message,"error");

            }
            setLoading(false);

        })
    },[history]);

    const handleDecrement = (cart_id)=>{
        setCart(cart =>
            cart.map((item)=>
            cart_id === item.id ? {...item, product_quantity: item.product_quantity - (item.product_quantity > 1 ? 1:0) } : item
            )
            )
            updateCartQuantity(cart_id, "dec")

    }
    const handleIncrement = (cart_id)=>{
        setCart(cart =>
            cart.map((item)=>
            cart_id === item.id ? {...item, product_quantity: item.product_quantity + (item.product_quantity < 100 ? 1:0)} : item
            )
            )
            updateCartQuantity(cart_id, "inc")

    }
    function updateCartQuantity(cart_id, scope){
        axios.put(`api/cart-updateQuantity/${cart_id}/${scope}`).then(res=>{
            if(res.data.status === 200){
                //swal("Success",res.data.message,"success")

            }

        })
    }
    const deleteCartItem = (e, cart_id)=>{
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerHTML ="Removing Item";

        axios.delete(`api/delete-cartItem/${cart_id}`).then(res =>{
            if(res.data.status === 200){
                history.push('/cart')

                swal("Success",res.data.message,"success");
                thisClicked.closest("tr").remove();
                history.push('/cart')

            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
                thisClicked.innerHTML ="Remove";
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
        var itemView = '';

        if(cart.length >0){
            itemView =
            <div className="row">
            <div className="col-12">


            <table className="table table-hover text-center">
            <thead>
                <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Unit Price $</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>{
        cart.map((item)=>{
            totalCartPrice += item.product.selling_price * item.product_quantity;

            return(
                    <tr key={item.id}>
                    <td><img src={`http://127.0.0.1:8000/${item.product.image}`} width="50px" height="50px" alt=""/></td>
                    <td>{item.product.name}</td>
                    <td>{item.product.selling_price}</td>
                    <td>
                        <div className="input-group">
                            <button className="btn btn-small btn-outline-secondary" onClick={()=>handleDecrement(item.id)}>-</button>
                                <div className="form-control">{item.product_quantity}</div>
                            <button className="btn btn-small btn-outline-secondary" onClick={()=>handleIncrement(item.id)}>+</button>

                        </div>
                    </td>
                    <td>{item.product_quantity * item.product.selling_price}</td>
                    <td>
                        <button className="btn btn-small btn-outline-danger" onClick={(e)=>deleteCartItem(e,item.id)}>Remove</button>
                    </td>
                    </tr>
            )
        })}
            </tbody>
            </table>  
            </div>
            <div className="col-8"></div>
            <div className="col-4">
                <div className="card card-body mt-3 shadow">
                    <h6>Grand Amount
                        <span className="float-end">{totalCartPrice}</span>
                    </h6>
                    <hr></hr>
                    <Link to="/checkout" className="btn btn-primary">Checkout</Link>
                </div>
            </div>
            </div>





    
    
    }else{
        itemView = 
        <div className="alert alert-info shadow" role="alert">
        No Items added in <span style={{fontWeight: "bold"}}>myCart</span>.
        </div>    
    }
    }
    
    return (

        <div className="container">
            <br/>
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                <h6 className="alert-heading text-left">
                <Link to="/" className="btn btn-link">Home</Link>
                / myCart
                </h6>
                </div>
            </div>
            {itemView}
        </div>
);
}
export default Cart;