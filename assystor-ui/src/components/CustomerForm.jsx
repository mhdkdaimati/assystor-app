import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = () => {
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company: '',
    gender: '',
    birth_date: '',
    street: '',
    zip_code: '',
    city: '',
    iban: '',
    contract_number: '',
    bkk: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/customers', form, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setMessage('Customer added successfully!');
      setForm({ ...form, email: '', first_name: '', last_name: '' }); // reset
    } catch (err) {
      console.error(err);
      setMessage('Error adding customer: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>Add Customer</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
        <input type="text" name="company" placeholder="Company" value={form.company} onChange={handleChange} />
        <input type="text" name="gender" placeholder="Gender (male/female)" value={form.gender} onChange={handleChange} />
        <input type="date" name="birth_date" placeholder="Birth Date" value={form.birth_date} onChange={handleChange} />
        <input type="text" name="street" placeholder="Street" value={form.street} onChange={handleChange} />
        <input type="text" name="zip_code" placeholder="ZIP Code" value={form.zip_code} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input type="text" name="iban" placeholder="IBAN" value={form.iban} onChange={handleChange} />
        <input type="text" name="contract_number" placeholder="Contract Number" value={form.contract_number} onChange={handleChange} />
        <input type="text" name="bkk" placeholder="BKK" value={form.bkk} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CustomerForm;
