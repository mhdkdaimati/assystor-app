import axios from 'axios';

import React , {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';



function ViewCategory(){

    const[loading, setLoading] = useState(true)
    const[category, setCategory] = useState([]);

    useEffect (()=>{

        axios.get(`/api/getCategory`).then(res =>{


            if(res.data.status === 200){
                setCategory(res.data.category);
            }
            setLoading(false);



        })
    },[]);

    var ViewCategory = '';

    if(loading){

        return(
            
            <div className="d-flex justify-content-center" style={{margin:"200px"}}>
                <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
)

    }else{
        ViewCategory = category.map((item)=>{

            return(
                <div className="card col-sm-6 text-center shadow" style={{width: "18rem", margin:"10px"}} key={item.id}>
                    <div className="card-body">
                        <Link className="btn btn-outline-primary" to={`collections/${item.id}`}>
                        {item.name}
                        </Link>
                        <p className="card-text">{item.description}</p>
                    </div>
                </div>
            )
        })
    }

return(
    <div className="container">
                <br/>
    <div className="shadow">
        <div className="alert alert-success" role="alert">
        <h6 className="alert-heading text-center">Collections</h6>
    </div>
    </div>

        <br/>
        <div className="row">
            {ViewCategory}
        </div>
    </div>    


);
}
export default ViewCategory;