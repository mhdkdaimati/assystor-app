import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/customers', {
      headers: {
        Accept: 'application/json',
      }
    })
    .then(res => setCustomers(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Customers</h2>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>{customer.first_name} {customer.last_name} - {customer.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
