import React, {useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import {useNavigate, Link} from 'react-router-dom';


const EditProduct = (props) =>{

    const history = useNavigate();
    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);




    useEffect(()=>{
        document.title= 'EditProduct';

        axios.get(`/api/all-category`).then(res=>{
            if(res.data.status === 200){
                setCategoryList(res.data.category);
            }

        })

    const product_id = props.match.params.id;
    //2 set the axios
    axios.get(`/api/edit-product/${product_id}`).then(res =>{
        if(res.data.status === 200){

            setProduct(res.data.product)
            setCheckboxes(res.data.product)


        }else if(res.data.status === 404){
            alert("Error", res.data.message, "error");
            history.push('admin/view-category');

        }
        setLoading(false);


    });
},[props.match.params.id, history]);



    

    const [productInput, setProduct] = useState({
        name:'',
        category_id:'',
        brand:'',
        description:'',
        meta_title:'',
        meta_keyword:'',
        meta_description:'',
        selling_price:'',
        original_price:'',
        quantity:'',
        
        error_list:[],
    });
//handleImage

const [image, setImage] = useState([]);

    const handleInput = (e)=>{
        e.persist ();
        setProduct({ 
            ...productInput, [e.target.name]: e.target.value});
    }
    const [allCheckbox, setCheckboxes] = useState([]);

    const handleCheckbox = (e)=>{
        e.persist ();
        setCheckboxes({ 
            ...allCheckbox, [e.target.name]: e.target.checked});
    }


    const handleImage = (e)=>{
        setImage({ image: e.target.files[0]});
    }

    const productUpdate = (e)=>{
        e.preventDefault();

        const formData = new FormData();
        const product_id = props.match.params.id;

        
        formData.append('image',image.image);
        formData.append('name',productInput.name);
        formData.append('brand',productInput.brand);
        formData.append('category_id',productInput.category_id);
        formData.append('description',productInput.description);
        formData.append('meta_title',productInput.meta_title);
        formData.append('meta_keyword',productInput.meta_keyword);
        formData.append('meta_description',productInput.meta_description);
        formData.append('selling_price',productInput.selling_price);
        formData.append('original_price',productInput.original_price);
        formData.append('quantity',productInput.quantity);

        formData.append('featured',allCheckbox.featured ? '1':'0');
        formData.append('popular',allCheckbox.popular ? '1':'0');
        formData.append('status',allCheckbox.status ? '1':'0');
        console.log(formData);

        
        let axiosConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            }
        };

        axios.post(`/api/update-product/${product_id}`, formData, axiosConfig).then(res => {
            if(res.data.status === 200 ){

                alert("Operation is completed", res.data.message, "success");
                console.log(allCheckbox);
                setError([]);

                history.push('/admin/view-product');



            }else if(res.data.status === 422){

                alert("Operation is incompleted", "Updating Category couldn't be completed, please check the errors.", "error");
                setError(res.data.errors);

                
            
            }else if(res.data.status === 404){
                setProduct ({...productInput, error_list: res.data.validator_errors});
                alert("Operation is incompleted", res.data.message, "error");
            }
                });
    }

    if(loading){
        return(
            <div className="d-flex justify-content-center" style={{margin:"200px"}}>
                    
            <div className="spinner-grow" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
            )
        }

    return (
<div className="container">
    {/* card */}
    <br/>
    <div className="shadow">
        <div className="alert alert-success" role="alert">
        <h4 className="alert-heading text-center">Edit Product</h4>
    </div>
    </div>
    {/* card end */}

    <form onSubmit={productUpdate} id="CATEGORY_FORM" encType="multipart/form-data">

    <div className="form-floating">
    <input type="text" name="name" onChange={handleInput} value={productInput.name} className="form-control" id="floatingName" placeholder="Name"/>
    <label htmlFor="floatingName">Name</label>
    <span style={{color: "red"}}>{error.name}</span>
    </div>
    <br/>
    <div>
    <select className="form-select" name="category_id" onChange={handleInput} value={productInput.category_id}>
    <option>Select Gategory</option>
    {
    categoryList.map( (item) => {
    return(
    <option value={item.id} key={item.id}>{item.name}</option>
    )
    })
    }
    </select>
    </div>
    <br/>
    <div className="form-floating">
    <input type="text" name="brand" onChange={handleInput} value={productInput.brand} className="form-control" id="floatingName" placeholder="Brand"/>
    <label htmlFor="floatingName">Brand</label>
    <span style={{color: "red"}}>{error.brand}</span>
    </div>
    <br/>
    <div className="form-floating">
    <textarea name="description" onChange={handleInput} value={productInput.description} className="form-control" id="floatingName" placeholder="Description">
    </textarea>   
    <label htmlFor="floatingName">Description</label>
    <span style={{color: "red"}}>{error.description}</span>
    </div>
    <br/>
    <div className="form-floating">
    <input type="number" name="quantity" onChange={handleInput} value={productInput.quantity} className="form-control" id="floatingName" placeholder="quantity"/>
    <label htmlFor="floatingName">quantity</label>
    <span style={{color: "red"}}>{error.quantity}</span>
    </div>

    <br/>
    <div className="mb-3">
    <label htmlFor="formFile" className="form-label">Image</label>
    <div>
    <span>Current Image</span>
    <br/>
    <img src={`http://127.0.0.1:8000/${productInput.image}`} width="150px" height="100px" alt=""/>
    </div>
    <br/>
    <input className="form-control" type="file" id="formFile" name="image" onChange={handleImage}/>
    </div>
    <br/>
    <div className="form-floating">
    <input type="text" name="meta_title" onChange={handleInput} value={productInput.meta_title} className="form-control" id="floatingName" placeholder="meta_title"/>
    <label htmlFor="floatingName">meta_title</label>
    <span style={{color: "red"}}>{error.meta_title}</span>
    </div>
    <br/>
    <div className="form-floating">
    <textarea name="meta_keyword" onChange={handleInput} value={productInput.meta_keyword} className="form-control" id="floatingName" placeholder="meta_keyword">

    </textarea>   
    <label htmlFor="floatingName">meta_keyword</label>
    <span style={{color: "red"}}>{error.meta_keyword}</span>
    </div>
    <br/>
    <div className="form-floating">
    <textarea name="meta_description" onChange={handleInput} value={productInput.meta_description} className="form-control" id="floatingName" placeholder="meta_description">
    </textarea>   
    <label htmlFor="floatingName">meta_description</label>
    <span style={{color: "red"}}>{error.meta_description}</span>
    </div>
    <br/>
    <div className="form-floating">
    <input type="number" name="selling_price" onChange={handleInput} value={productInput.selling_price} className="form-control" id="floatingName" placeholder="selling_price"/>
    <label htmlFor="floatingName">selling_price</label>
    <span style={{color: "red"}}>{error.selling_price}</span>
    </div>
    <br/>
    <div className="form-floating">
    <input type="number" name="original_price" onChange={handleInput} value={productInput.original_price} className="form-control" id="floatingName" placeholder="original_price"/>
    <label htmlFor="floatingName">original_price</label>
    <span style={{color: "red"}}>{error.original_price}</span>
    </div>
    <br/>
    <div>
    <input type="checkbox" name="featured" onChange={handleCheckbox} defaultChecked={allCheckbox.featured ===1 ? true:false} /> Fetured
    </div>
    <br/>
    <div>
    <input type="checkbox" name="popular" onChange={handleCheckbox} defaultChecked={allCheckbox.popular ===1 ? true:false} /> Popular
    </div>
    <br/>
    <div>
    <input type="checkbox" name="status" onChange={handleCheckbox} defaultChecked={allCheckbox.status ===1 ? true:false} /> Hide
    </div>
    <br/>
    <button className="w-100 btn btn-lg btn-outline-success" type="submit">Update Product</button>
    </form>
                
</div>
        );
}
export default EditProduct;