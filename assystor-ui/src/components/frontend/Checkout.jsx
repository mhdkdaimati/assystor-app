import axios from 'axios';
import React , {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';


function Checkout(){

    const[loading, setLoading] = useState(true);
    const[cart, setCart] = useState([]);
    const history = useHistory();
    var totalCartPrice = 0;

    const[checkoutInput, setCheckoutInput] = useState({
        firstname: '',
        lastname:'',
        phone: '',
        email:'',
        address:'',
        city:'',
        state:'',
        zipcode:'',
    });


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

    const handleInput = (e)=>{
        e.persist();
        setCheckoutInput({...checkoutInput, [e.target.name]: e.target.value});
    }
    const [error, setError] = useState([]);

    const submitOrder = (e) =>{
        e.preventDefault();

        const data ={
            firstname: checkoutInput.firstname,
            lastname: checkoutInput.lastname,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            address: checkoutInput.address,
            city: checkoutInput.city,
            state: checkoutInput.state,
            zipcode: checkoutInput.zipcode,
        }
        axios.post(`/api/place-order`, data).then(res=>{
            if(res.data.status === 200){
                swal("Order Placed Successfully",res.data.message,"success");
                setError();
                history.push('/thank-you');

            }else if(res.data.status === 422){
                swal("All fields are mandetory","","error");
                setError(res.data.errors);



            }
        });

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
        var cartView = '';

        if(cart.length > 0){
            cartView =
        <div className="row">
            <div className="col-7">
            {/* input start */}
            <div className="row">
            <div className="col-6">
            <div className="form-floating">
            <input type="text" name="firstname" onChange={handleInput} value={checkoutInput.firstname} className="form-control" id="floatingName" placeholder="first_name"/>
            <label htmlFor="floatingName">first_name</label>
            <span style={{color: "red"}}>{error.firstname}</span>
            </div>
            </div>
            <div className="col-6">
            <div className="form-floating">
            <input type="text" name="lastname" onChange={handleInput} value={checkoutInput.lastname} className="form-control" id="floatingName" placeholder="last_name"/>
            <label htmlFor="floatingName">last_name</label>
            <span style={{color: "red"}}>{error.lastname}</span>
            </div>
            </div>
            </div>
            <br></br>
            <div className="row">
            <div className="col-6">
            <div className="form-floating">
            <input type="number" name="phone" onChange={handleInput} value={checkoutInput.phone} className="form-control" id="floatingName" placeholder="phone_number"/>
            <label htmlFor="floatingName">phone_number</label>
            <span style={{color: "red"}}>{error.phone}</span>
            </div>
            </div>
            <div className="col-6">
            <div className="form-floating">
            <input type="text" name="email" onChange={handleInput} value={checkoutInput.email} className="form-control" id="floatingName" placeholder="email"/>
            <label htmlFor="floatingName">email</label>
            <span style={{color: "red"}}>{error.email}</span>
            </div>
            </div>
            </div>
            <br></br>
            <div className="row">
            <div className="col-4">
            <div className="form-floating">
            <input type="text" name="state" onChange={handleInput} value={checkoutInput.state} className="form-control" id="floatingName" placeholder="state"/>
            <label htmlFor="floatingName">state</label>
            <span style={{color: "red"}}>{error.state}</span>
            </div>
            </div>
            <div className="col-4">
            <div className="form-floating">
            <input type="text" name="city" onChange={handleInput} value={checkoutInput.city} className="form-control" id="floatingName" placeholder="city"/>
            <label htmlFor="floatingName">city</label>
            <span style={{color: "red"}}>{error.city}</span>
            </div>
            </div>
            <div className="col-4">
            <div className="form-floating">
            <input type="number" name="zipcode" onChange={handleInput} value={checkoutInput.zipcode} className="form-control" id="floatingName" placeholder="zip_code"/>
            <label htmlFor="floatingName">zip_code</label>
            <span style={{color: "red"}}>{error.zipcode}</span>
            </div>
            </div>
            </div>
            <br></br>
            <div className="row">
            <div className="col-12">
            <div className="form-floating">
            <textarea className="form-control" name="address" onChange={handleInput} value={checkoutInput.address} placeholder="address" id="floatingTextarea">
            </textarea>
            <label htmlFor="floatingTextarea">address</label>
            <span style={{color: "red"}}>{error.address}</span>
            </div>                
            </div>

            </div>
            <br></br>
            <div className="row">
            <div className="col-12">
            <div className="form-group text-end">
            <button className="btn btn-primary" onClick={submitOrder}>Order</button>
            </div>
            </div>
            </div>
            <br></br>
            {/* input end */}
            </div>
            <div className="col-5">
            {/* card */}
            <div className="card shadow">
            <div className="card-header">
                myInvoice
            </div>
            <div className="card-body">
            <h5 className="card-title">Cart Items</h5>
            <table className="table table-hover text-center">
            <thead>
                <tr>
                <th>Product</th>
                <th>Unit Price $</th>
                <th>Quantity</th>
                <th>Total</th>
                </tr>
            </thead>
            <tbody>{
                cart.map((item)=>{
                    totalCartPrice += item.product.selling_price * item.product_quantity;
                    return(
                            <tr key={item.id}>
                            <td>{item.product.name}</td>
                            <td>{item.product.selling_price}</td>
                            <td>{item.product_quantity}</td>
                            <td>{item.product_quantity * item.product.selling_price}</td>
                            </tr>
                    )
                })}
            </tbody>
            </table>
            <br></br>
            <table className="table table-striped">
                <thead>
                    <tr>
                    <th>Total Amount</th>
                    <th>{totalCartPrice}</th>
                    </tr>
                </thead>
            </table>
            <br></br>
                <div className="form-group text-end">
                <Link to="/cart" className="btn btn-primary">myCart</Link>
                </div>
            </div>
            </div>        
            {/* card end */}
    </div>
    </div>

}else{
        cartView = 
        <div className="alert alert-info shadow" role="alert">
        No Items added in <span style={{fontWeight: "bold"}}>myCart</span>.
        </div>    
    }
    }

return(
    
<div className="container">

    <br/>
    <div className="shadow">
    <div className="alert alert-success" role="alert">
    <h6 className="alert-heading text-left">
    <Link to="/" className="btn btn-link">Home</Link>
    / Checkout
    </h6>
    </div>
    </div>
        {cartView}
</div>
);
}
export default Checkout;



