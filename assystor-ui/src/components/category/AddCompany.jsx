import React, { useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import { useNavigate, Link } from 'react-router-dom';




const AddCompany = () => {
    const navigate = useNavigate();


    const [companyInput, setCompany] = useState({
        name: '',

        responsible_person: '',
        tel_number: '',
        status: 'active',



        error_list: [],
    });

    const handleInput = (e) => {
        e.preventDefault();
        setCompany({


            ...companyInput, [e.target.name]: e.target.value
        });
    }
    const companySubmit = (e) => {
        e.preventDefault();
        const data = {
            name: companyInput.name,
            responsible_person: companyInput.responsible_person,
            tel_number: companyInput.tel_number,
            status: companyInput.status,

        }
        //console.log("Sending:", data);

        //console.log(data.status);
        axios.post(`/api/store-company`, data).then(res => {
            if (res.data.status === 201) {
                setCompany({
                    name: '',
                    responsible_person: '',
                    tel_number: '',
                    status: '',
                    error_list: [],
                });

                swal("Operation is completed", res.data.message, "success");
                document.getElementById('COMPANY_FORM').reset();
                //navigate('/admin/view-category');


            } else if (res.data.status === 400) {

                swal("Operation is incompleted", res.data.message, "error");

            } else {
                setCompany({ ...companyInput, error_list: res.data.errors });
                swal("Operation is incompleted", "Adding new Category couldn't be completed, please check the errors.", "error");
                console.log(res.data.errors);
            }
        });
    }


    return (
        <>
            <br />
            <div className="shadow">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading text-center">Add Company</h4>
                </div>
            </div>

            <form onSubmit={companySubmit} id="COMPANY_FORM">

                <div className="form-floating">
                    <input type="text" name="name" onChange={handleInput} value={companyInput.name} className="form-control" id="floatingName" placeholder="Name" />
                    <label htmlFor="floatingName">Name</label>
                    <span style={{ color: "red" }}>{companyInput.error_list.name}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input name="responsible_person" onChange={handleInput} value={companyInput.responsible_person} className="form-control" id="floatingName" placeholder="Responsible person" />
                    <label htmlFor="floatingName">Responsible person</label>
                    <span style={{ color: "red" }}>{companyInput.error_list.responsible_person}</span>
                </div>
                <br />
                <div className="form-floating">
                    <input type="text" name="tel_number" onChange={handleInput} value={companyInput.tel_number} className="form-control" id="floatingName" placeholder="Tel number" />
                    <label htmlFor="floatingName">Tel number</label>
                    <span style={{ color: "red" }}>{companyInput.error_list.tel_number}</span>
                </div>
                <br />
                <select name="status" onChange={handleInput} value={companyInput.status} className="form-select" aria-label="Default select example">
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                </select>
                <br />

                <button className="w-100 btn btn-lg btn-outline-primary" type="submit">Add Company</button>
            </form>
        </>
    );
}
export default AddCompany;