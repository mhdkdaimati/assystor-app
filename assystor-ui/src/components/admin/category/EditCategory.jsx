import React, {useState, useEffect } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import {useNavigate, Link} from 'react-router-dom';

const EditCategory = (props) =>{

    const history = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);




    useEffect(()=>{
        document.title= 'EditCategory';


    const category_id = props.match.params.id;

    axios.get(`/api/edit-category/${category_id}`).then(res =>{
        if(res.data.status === 200){

            setCategory(res.data.category)
            setCheckboxes(res.data.category)


        }else if(res.data.status === 404){
            alert("Error", res.data.message, "error");
            history('admin/view-category');

        }
        setLoading(false);


    });
},[props.match.params.id, history]);



    
//categoryInput
    const [categoryInput, setCategory] = useState({
        name:'',
        description:'',
        meta_title:'',
        meta_keyword:'',
        meta_description:'',
        
        error_list:[],
    });
//handleImage


    const handleInput = (e)=>{
        e.persist ();
        setCategory({ 
            ...categoryInput, [e.target.name]: e.target.value});
    }
    const [allCheckbox, setCheckboxes] = useState([]);

    const handleCheckbox = (e)=>{
        e.persist ();
        setCheckboxes({ 
            ...allCheckbox, [e.target.name]: e.target.checked});
    }



    const productUpdate = (e)=>{
        e.preventDefault();

        const category_id = props.match.params.id;

        
        const data = {
            name: categoryInput.name,
            description: categoryInput.description,
            status: allCheckbox.status,

            meta_title: categoryInput.meta_title,
            meta_keyword: categoryInput.meta_keyword,
            meta_description: categoryInput.meta_description,
            
        }
        console.log(data);

        
                axios.put(`/api/update-category/${category_id}`,data).then(res => {
            if(res.data.status === 200 ){

                alert("Operation is completed", res.data.message, "success");
                setError([]);
                history.push('/admin/view-category');


            }else if(res.data.status === 422){
                alert("Operation is incompleted", "Updating Category couldn't be completed, please check the errors.", "error");


                setError(res.data.errors);

            }else if(res.data.status === 404){
                alert("Error", res.data.message, "error");
                history.push('/admin/view-category');

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
        <h4 className="alert-heading text-center">Edit Category</h4>
        <hr/>
        <Link to="/admin/view-category" className="card-link">Back</Link>

    </div>

    </div>
    {/* card end */}
{/* tabs */}
        <form onSubmit={productUpdate} id="CATEGORY_FORM" encType="multipart/form-data">


                    
        <div className="form-floating">
            <input type="text" name="name" onChange={handleInput} value={categoryInput.name} className="form-control" id="floatingName" placeholder="Name"/>
            <label htmlFor="floatingName">Name</label>
            <span style={{color: "red"}}>{error.name}</span>

        </div>
        <br/>
        <div className="form-floating">
            <textarea name="description" onChange={handleInput} value={categoryInput.description} className="form-control" id="floatingName" placeholder="Description">
            
            </textarea>   
            <label htmlFor="floatingName">Description</label>
            <span style={{color: "red"}}>{error.description}</span>

        </div>
        <br/>


<div className="form-floating">
    <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title} className="form-control" id="floatingName" placeholder="meta_title"/>
    <label htmlFor="floatingName">meta_title</label>
    <span style={{color: "red"}}>{error.meta_title}</span>

</div>
<br/>

<div className="form-floating">
    <textarea name="meta_keyword" onChange={handleInput} value={categoryInput.meta_keyword} className="form-control" id="floatingName" placeholder="meta_keyword">
    
    </textarea>   
    <label htmlFor="floatingName">meta_keyword</label>
    <span style={{color: "red"}}>{error.meta_keyword}</span>

</div>
<br/>

<div className="form-floating">
    <textarea name="meta_description" onChange={handleInput} value={categoryInput.meta_description} className="form-control" id="floatingName" placeholder="meta_description">
    
    </textarea>   
    <label htmlFor="floatingName">meta_description</label>
    <span style={{color: "red"}}>{error.meta_description}</span>

</div>
<br/>

<div>
            <input type="checkbox" name="status" onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true:false} /> Hide

        </div>

        <br/>
        <button className="w-100 btn btn-lg btn-outline-success" type="submit">Update Category</button>

        </form>


                
{/* tabs end */}
</div>
        );
}
export default EditCategory;