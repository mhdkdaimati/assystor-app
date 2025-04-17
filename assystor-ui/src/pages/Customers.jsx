import { useEffect, useState } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/customers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setCustomers(res.data));
  }, []);

  return (
    <div>
      <h2>Customers List</h2>
      <ul>
        {customers.map(c => (
          <li key={c.id}>{c.name} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Customers;
