import React, {useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import {useNavigate, Link} from 'react-router-dom';




const AddProduct = () =>{

    const [categoryList, setCategoryList] = useState([
        
    ]);


    useEffect(()=>{
        document.title= 'AddProduct';

        axios.get(`/api/all-category`).then(res=>{
            if(res.data.status === 200){
                setCategoryList(res.data.category);
            }

        })
    },[]);



    const history = useNavigate();
    

    const [productInput, setProduct] = useState({
        name:'',
        category_id:'',
        brand:'',
        description:'',
        status:'',
        meta_title:'',
        meta_keyword:'',
        meta_description:'',
        selling_price:'',
        original_price:'',
        quantity:'',
        featured:'',
        popular:'',
        
        error_list:[],
    });
//handleImage

const [image, setImage] = useState([]);

    const handleInput = (e)=>{
        e.persist ();
        setProduct({ 
            ...productInput, [e.target.name]: e.target.value});
    }

    const handleImage = (e)=>{
        setImage({ image: e.target.files[0]});
    }

    const productSubmit = (e)=>{
        e.preventDefault();

        const formData = new FormData();
        
        formData.append('image',image.image);
        formData.append('name',productInput.name);
        formData.append('category_id',productInput.category_id);
        formData.append('description',productInput.description);
        formData.append('status',productInput.status);
        formData.append('meta_title',productInput.meta_title);
        formData.append('meta_keyword',productInput.meta_keyword);
        formData.append('meta_description',productInput.meta_description);
        formData.append('selling_price',productInput.selling_price);
        formData.append('original_price',productInput.original_price);
        formData.append('quantity',productInput.quantity);
        formData.append('featured',productInput.featured);
        formData.append('popular',productInput.popular);
        formData.append('brand',productInput.brand);
        



        let axiosConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            }
        };
        axios.post(`/api/store-product`, formData, axiosConfig).then(res => {
            if(res.data.status === 200 ){

                alert("Operation is completed", res.data.message, "success");
                document.getElementById('CATEGORY_FORM').reset();
                history.push('/admin/view-product');


            }else if(res.data.status === 400){

                alert("Operation is incompleted", res.data.message, "error");
            
            }else{
                setProduct ({...productInput, error_list: res.data.validator_errors});
                alert("Operation is incompleted", "Adding new Category couldn't be completed, please check the errors.", "error");
            }
                });
    }


    return (
<div className="container">
    <br/>
    <div className="shadow">
        <div className="alert alert-success" role="alert">
        <h4 className="alert-heading text-center">Add Product</h4>
    </div>
    </div>
        <form onSubmit={productSubmit} id="CATEGORY_FORM" encType="multipart/form-data">
            <div className="form-floating">
                <input type="text" name="name" onChange={handleInput} value={productInput.name} className="form-control" id="floatingName" placeholder="Name"/>
                <label htmlFor="floatingName">Name</label>
                <span style={{color: "red"}}>{productInput.error_list.name}</span>
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
                <span style={{color: "red"}}>{productInput.error_list.brand}</span>
            </div>
            <br/>

            <div className="form-floating">
            <textarea name="description" onChange={handleInput} value={productInput.description} className="form-control" id="floatingName" placeholder="Description">
            </textarea>   
            <label htmlFor="floatingName">Description</label>
            <span style={{color: "red"}}>{productInput.error_list.description}</span>
        </div>
        <br/>
        <div className="form-floating">
                <input type="number" name="quantity" onChange={handleInput} value={productInput.quantity} className="form-control" id="floatingName" placeholder="quantity"/>
                <label htmlFor="floatingName">quantity</label>
                <span style={{color: "red"}}>{productInput.error_list.quantity}</span>
            </div>
            <div className="mb-3">
            <label htmlFor="formFile" className="form-label">Image</label>
            <input className="form-control" type="file" id="formFile" name="image" onChange={handleImage}/>
        </div>
        <br/>
        <div className="form-floating">
                <input type="text" name="meta_title" onChange={handleInput} value={productInput.meta_title} className="form-control" id="floatingName" placeholder="meta_title"/>
                <label htmlFor="floatingName">meta_title</label>
                <span style={{color: "red"}}>{productInput.error_list.meta_title}</span>
            </div>
        <br/>
        <div className="form-floating">
            <textarea name="meta_keyword" onChange={handleInput} value={productInput.meta_keyword} className="form-control" id="floatingName" placeholder="meta_keyword">
            
            </textarea>   
            <label htmlFor="floatingName">meta_keyword</label>
            <span style={{color: "red"}}>{productInput.error_list.meta_keyword}</span>
        </div>
        <br/>
        <div className="form-floating">
                <textarea name="meta_description" onChange={handleInput} value={productInput.meta_description} className="form-control" id="floatingName" placeholder="meta_description">
                </textarea>   
                <label htmlFor="floatingName">meta_description</label>
                <span style={{color: "red"}}>{productInput.error_list.meta_description}</span>
            </div>
        <br/>
        <div className="form-floating">
                <input type="number" name="selling_price" onChange={handleInput} value={productInput.selling_price} className="form-control" id="floatingName" placeholder="selling_price"/>
                <label htmlFor="floatingName">selling_price</label>
                <span style={{color: "red"}}>{productInput.error_list.selling_price}</span>
            </div>
        <br/>
        <div className="form-floating">
                <input type="number" name="original_price" onChange={handleInput} value={productInput.original_price} className="form-control" id="floatingName" placeholder="original_price"/>
                <label htmlFor="floatingName">original_price</label>
                <span style={{color: "red"}}>{productInput.error_list.original_price}</span>
        </div>
        <br/>
        <div>
                <input type="checkbox" name="fetured" onChange={handleInput} value={productInput.fetured} /> fetured
            </div>
            <br/>
            <div>
                <input type="checkbox" name="popular" onChange={handleInput} value={productInput.popular} /> popular
            </div>
            <br/>
            <div>
                <input type="checkbox" name="status" onChange={handleInput} value={productInput.status} /> Hide
            </div>
        <br/>
        <button className="w-100 btn btn-lg btn-outline-primary" type="submit">Add Product</button>
        </form>
                
</div>
        );
}
export default AddProduct;