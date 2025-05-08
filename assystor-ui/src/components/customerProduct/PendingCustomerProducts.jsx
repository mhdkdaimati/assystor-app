// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const PendingCustomerProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchPendingProducts = async () => {
//             try {
//                 const response = await axios.get(`api/get-pending-products`);
//                 setProducts(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Failed to fetch data');
//                 setLoading(false);
//             }
//         };

//         fetchPendingProducts();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="container mt-4">
//             <h3 className="mb-4">Pending Customer Products</h3>
//             <table className="table table-bordered table-striped">
//                 <thead className="thead-dark">
//                     <tr>
//                         <th>Product Name</th>
//                         <th>Description</th>
//                         <th>Status</th>
//                         <th>Added User</th>
//                         <th>Customer Name</th>
//                         <th>Email</th>
//                         <th>Contact Number</th>
//                         <th>Address</th>
//                         <th>Fields</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map((product, index) => (
//                         <tr key={index}>
//                             <td>{product.product_name}</td>
//                             <td>{product.product_description}</td>
//                             <td>{product.status}</td>
//                             <td>{product.added_user || 'N/A'}</td>
//                             <td>{product.customer_details.customer_name}</td>
//                             <td>{product.customer_details.email}</td>
//                             <td>{product.customer_details.contact_number}</td>
//                             <td>{product.customer_details.address}</td>
//                             <td>
//                                 <ul>
//                                     {product.fields.map((field, fieldIndex) => (
//                                         <li key={fieldIndex}>
//                                             <strong>{field.field_name}:</strong> {field.value}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default PendingCustomerProducts;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingCustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('completed');

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get-pending-products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchPendingProducts();
  }, []);

  const handleStatusChange = async (productId, customerId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${productId}/customers/${customerId}/status`, {
        status,
        comment,
      });
      alert('Product status updated successfully');
      setComment('');
      setStatus('completed');
    } catch (err) {
      alert('Failed to update product status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Pending Customer Products</h3>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Added User</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Fields</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.product_name}</td>
              <td>{product.product_description}</td>
              <td>{product.status}</td>
              <td>{product.added_user || 'N/A'}</td>
              <td>{product.customer_details.customer_name}</td>
              <td>{product.customer_details.email}</td>
              <td>{product.customer_details.contact_number}</td>
              <td>{product.customer_details.address}</td>
              <td>
                <ul>
                  {product.fields.map((field, fieldIndex) => (
                    <li key={fieldIndex}>
                      <strong>{field.field_name}:</strong> {field.value}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedProduct(product)}
                  data-bs-toggle="modal"
                  data-bs-target="#updateStatusModal"
                >
                  Update Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for updating status */}
      {selectedProduct && (
        <div className="modal fade" id="updateStatusModal" tabIndex="-1" aria-labelledby="updateStatusModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateStatusModalLabel">Update Product Status</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><strong>Product:</strong> {selectedProduct.product_name}</p>
                <p><strong>Customer:</strong> {selectedProduct.customer_details.customer_name}</p>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    id="status"
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Comment</label>
                  <textarea
                    id="comment"
                    className="form-control"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleStatusChange(selectedProduct.id, selectedProduct.customer_details.customer_id)}
                  data-bs-dismiss="modal"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingCustomerProducts;