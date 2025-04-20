import React, { useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import { useNavigate, Link } from 'react-router-dom';




const AddCategory = () => {
    const navigate = useNavigate();


    const [categoryInput, setCategory] = useState({
        name: '',

        description: '',
        status: '',


        meta_title: '',
        meta_keyword: '',
        meta_description: '',

        error_list: [],
    });

    const handleInput = (e) => {
        e.preventDefault();
        setCategory({


            ...categoryInput, [e.target.name]: e.target.value
        });
    }
    const categorySubmit = (e) => {
        e.preventDefault();
        const data = {
            name: categoryInput.name,
            description: categoryInput.description,
            status: categoryInput.status,
            meta_title: categoryInput.meta_title,
            meta_keyword: categoryInput.meta_keyword,
            meta_description: categoryInput.meta_description,

        }
        //console.log(data.status);
        axios.post(`/api/store-category`, data).then(res => {
            if (res.data.status === 200) {

                alert("Operation is completed", res.data.message, "success");
                document.getElementById('CATEGORY_FORM').reset();
                navigate('/admin/view-category');


            } else if (res.data.status === 400) {

                swal("Operation is incompleted", res.data.message, "error");

            } else {
                setCategory({ ...categoryInput, error_list: res.data.validator_errors });
                swal("Operation is incompleted", "Adding new Category couldn't be completed, please check the errors.", "error");
            }
        });
    }


    return (
        <div className="container">
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">Add Category</h4>
                </div>
            </div>

            <form onSubmit={categorySubmit} id="CATEGORY_FORM">

                <div className="form-floating">
                    <input type="text" name="name" onChange={handleInput} value={categoryInput.name} className="form-control" id="floatingName" placeholder="Name" />
                    <label htmlFor="floatingName">Name</label>
                    <span style={{ color: "red" }}>{categoryInput.error_list.name}</span>
                </div>
                <br />
                <div className="form-floating">
                    <textarea name="description" onChange={handleInput} value={categoryInput.description} className="form-control" id="floatingName" placeholder="Description">
                    </textarea>
                    <label htmlFor="floatingName">Description</label>
                    <span style={{ color: "red" }}>{categoryInput.error_list.description}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title} className="form-control" id="floatingName" placeholder="meta_title" />
                    <label htmlFor="floatingName">meta_title</label>
                    <span style={{ color: "red" }}>{categoryInput.error_list.meta_title}</span>
                </div>
                <br />
                <div className="form-floating">
                    <textarea name="meta_keyword" onChange={handleInput} value={categoryInput.meta_keyword} className="form-control" id="floatingName" placeholder="meta_keyword">
                    </textarea>
                    <label htmlFor="floatingName">meta_keyword</label>
                    <span style={{ color: "red" }}>{categoryInput.error_list.meta_keyword}</span>
                </div>
                <br />
                <div className="form-floating">
                    <textarea name="meta_description" onChange={handleInput} value={categoryInput.meta_description} className="form-control" id="floatingName" placeholder="meta_description">
                    </textarea>
                    <label htmlFor="floatingName">meta_description</label>
                    <span style={{ color: "red" }}>{categoryInput.error_list.meta_description}</span>
                </div>
                <br />
                <div>
                    <input type="checkbox" name="status" onChange={handleInput} value={categoryInput.status} /> Hide
                </div>
                <br />
                <button className="w-100 btn btn-lg btn-outline-primary" type="submit">Add Category</button>
            </form>
        </div>
    );
}
export default AddCategory;