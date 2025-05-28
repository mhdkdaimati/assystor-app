import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import swal from 'sweetalert';
import { useNavigate, Link, useParams } from 'react-router-dom';


const EditCustomer = () => {

  const { id } = useParams();


  const navigate = useNavigate();
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);




  useEffect(() => {
    document.title = 'Edit Customer';

    axios.get(`/api/all-companies`).then(res => {
      if (res.data.status === 200) {
        setCompanyList(res.data.companies);
      }

    })

    //2 set the axios
    axios.get(`/api/get-customer/${id}`).then(res => {
      if (res.data.status === 200) {

        setCustomer(res.data.customer)


      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
        navigate('/view-customer');

      }
      setLoading(false);


    });
  }, [id, navigate]);





  const [customerInput, setCustomer] = useState({


    email: '',
    company_id: '',
    gender: '',
    first_name: '',
    last_name: '',
    birth_day: '',
    street: '',
    zip_code: '',
    place: '',
    iban: '',
    contact_number: '',
    pkk: '',

    error_list: [],
  });


  const handleInput = (e) => {
    e.persist();
    setCustomer({
      ...customerInput, [e.target.name]: e.target.value
    });
  }



  const customerUpdate = (e) => {
    e.preventDefault();


    const data = {
      first_name: customerInput.first_name,
      last_name: customerInput.last_name,
      contact_number: customerInput.contact_number,

      birth_day: customerInput.birth_day,
      street: customerInput.street,
      zip_code: customerInput.zip_code,
      place: customerInput.place,
      iban: customerInput.iban,
      pkk: customerInput.pkk,
      email: customerInput.email,
      company_id: customerInput.company_id,
      gender: customerInput.gender,//

    }


    axios.put(`/api/update-customer/${id}`, data).then(res => {
      if (res.data.status === 200) {

        swal("Operation is completed", res.data.message, "success");
        setError([]);

        navigate('/view-customer');



      } else if (res.data.status === 422) {

        swal("Operation is incompleted", "Updating customer couldn't be completed, please check the errors.", "error");
        setError(res.data.errors);



      } else if (res.data.status === 404) {
        setCustomer({ ...customerInput, error_list: res.data.validator_errors });
        swal("Operation is incompleted", res.data.message, "error");
      }
    });
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center" style={{ margin: "200px" }}>

        <div className="spinner-grow" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4 px-4 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-person-lines-fill me-2"></i>Edit Customer
              </h5>
              <Link to="/view-customer" className="btn btn-sm btn-outline-light rounded-pill">
                <i className="bi bi-arrow-left me-1"></i> Back
              </Link>
            </div>
            <div className="card-body p-4">
              <form onSubmit={customerUpdate} id="CUSTOMER_FORM" encType="multipart/form-data">


                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="first_name"
                    onChange={handleInput}
                    value={customerInput.first_name || ''}
                    className="form-control"
                    id="floatingFirstName"
                    placeholder="First Name"
                  />
                  <label htmlFor="floatingFirstName">First Name</label>
                  <div className="text-danger mt-1">{error.first_name}</div>
                </div>



                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="last_name"
                    onChange={handleInput}
                    value={customerInput.last_name || ''}
                    className="form-control"
                    id="floatingLastName"
                    placeholder="Last Name"
                  />
                  <label htmlFor="floatingLastName">Last Name</label>
                  <div className="text-danger mt-1">{error.last_name}</div>
                </div>



                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="contact_number"
                    onChange={handleInput}
                    value={customerInput.contact_number || ''}
                    className="form-control"
                    id="floatingContactNumber"
                    placeholder="Contact Number"
                  />
                  <label htmlFor="floatingContactNumber">Contact Number</label>
                  <div className="text-danger mt-1">{error.contact_number}</div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    name="email"
                    onChange={handleInput}
                    value={customerInput.email || ''}
                    className="form-control"
                    id="floatingEmail"
                    placeholder="Email"
                  />
                  <label htmlFor="floatingEmail">Email</label>
                  <div className="text-danger mt-1">{error.email}</div>
                </div>

                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    name="company_id"
                    onChange={handleInput}
                    value={customerInput.company_id || ''}
                    id="floatingCompany"
                  >
                    <option value="">Select Company</option>
                    {companyList.map(item => (
                      <option value={item.id} key={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <label htmlFor="floatingCompany">Company</label>
                </div>

                <div className="form-floating mb-3">
                  <select
                    name="gender"
                    onChange={handleInput}
                    value={customerInput.gender || ''}
                    className="form-select"
                    id="floatingGender"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <label htmlFor="floatingGender">Gender</label>
                </div>



                <div className="form-floating mb-3">
                  <input
                    type="date"
                    name="birth_day"
                    onChange={handleInput}
                    value={customerInput.birth_day || ''}
                    className="form-control"
                    id="floatingBirthDay"
                    placeholder="Birth Day"
                  />
                  <label htmlFor="floatingBirthDay">Birth Day</label>
                  <div className="text-danger mt-1">{error.birth_day}</div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="street"
                    onChange={handleInput}
                    value={customerInput.street || ''}
                    className="form-control"
                    id="floatingStreet"
                    placeholder="Street"
                  />
                  <label htmlFor="floatingStreet">Street</label>
                  <div className="text-danger mt-1">{error.street}</div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="zip_code"
                    onChange={handleInput}
                    value={customerInput.zip_code || ''}
                    className="form-control"
                    id="floatingZipCode"
                    placeholder="Zip Code"
                  />
                  <label htmlFor="floatingZipCode">Zip Code</label>
                  <div className="text-danger mt-1">{error.zip_code}</div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="place"
                    onChange={handleInput}
                    value={customerInput.place || ''}
                    className="form-control"
                    id="floatingPlace"
                    placeholder="Place"
                  />
                  <label htmlFor="floatingPlace">Place</label>
                  <div className="text-danger mt-1">{error.place}</div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="iban"
                    onChange={handleInput}
                    value={customerInput.iban || ''}
                    className="form-control"
                    id="floatingIBAN"
                    placeholder="IBAN"
                  />
                  <label htmlFor="floatingIBAN">IBAN</label>
                  <div className="text-danger mt-1">{error.iban}</div>
                </div>


                <div className="form-floating mb-4">
                  <input
                    type="text"
                    name="pkk"
                    onChange={handleInput}
                    value={customerInput.pkk || ''}
                    className="form-control"
                    id="floatingPKK"
                    placeholder="PKK"
                  />
                  <label htmlFor="floatingPKK">PKK</label>
                  <div className="text-danger mt-1">{error.pkk}</div>
                </div>

                <button className="btn btn-primary w-100 rounded-pill shadow-sm" type="submit">
                  <i className="bi bi-check-circle me-1"></i> Update Customer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
export default EditCustomer;