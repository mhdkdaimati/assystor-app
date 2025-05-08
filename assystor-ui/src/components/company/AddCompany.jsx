import React, { useState } from 'react';
import axios from 'axios';
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
        navigate('/view-company');


      } else if (res.data.status === 400) {

        swal("Operation is incompleted", res.data.message, "error");

      } else {
        setCompany({ ...companyInput, error_list: res.data.errors });
        swal("Operation is incompleted", "Adding new company couldn't be completed, please check the errors.", "error");
        console.log(res.data.errors);
      }
    });
  }


  return (
    <>
      <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card shadow rounded-4 border-0">
              <div className="card-header bg-gradient bg-primary text-white text-center rounded-top-4">
                <h3 className="mb-0">🏢 Add New Company</h3>
                <Link to="/view-company" className="btn btn-sm btn-outline-light rounded-pill">
                  <i className="bi bi-arrow-left me-1"></i> Back
                </Link>

              </div>
              <div className="card-body p-4">
                <form onSubmit={companySubmit} id="COMPANY_FORM">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Company Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-building"></i></span>
                      <input
                        type="text"
                        name="name"
                        onChange={handleInput}
                        value={companyInput.name}
                        className="form-control"
                        id="name"
                        placeholder="Enter company name"
                      />
                    </div>
                    <small className="text-danger">{companyInput.error_list.name}</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="responsible_person" className="form-label fw-semibold">
                      Responsible Person
                    </label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person-badge-fill"></i></span>
                      <input
                        type="text"
                        name="responsible_person"
                        onChange={handleInput}
                        value={companyInput.responsible_person}
                        className="form-control"
                        id="responsible_person"
                        placeholder="Enter name"
                      />
                    </div>
                    <small className="text-danger">{companyInput.error_list.responsible_person}</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="tel_number" className="form-label fw-semibold">
                      Telephone Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
                      <input
                        type="text"
                        name="tel_number"
                        onChange={handleInput}
                        value={companyInput.tel_number}
                        className="form-control"
                        id="tel_number"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <small className="text-danger">{companyInput.error_list.tel_number}</small>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="status" className="form-label fw-semibold">Status</label>
                    <select
                      name="status"
                      onChange={handleInput}
                      value={companyInput.status}
                      className="form-select"
                      id="status"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 rounded-pill shadow-sm fw-bold">
                    <i className="bi bi-building-add me-2"></i> Save Company
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddCompany;