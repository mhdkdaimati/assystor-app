import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button, Form, Card, Modal, ListGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [fields, setFields] = useState([{ name: "", type: "text", options: [] }]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const result = products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(result);
  }, [search, products]);

  const fetchProducts = () => {
    axios.get(`/api/products-with-fields`)
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      });
  };

  // Open the module to add or edit
  const openModal = (product = null) => {
    setEditProduct(product);
    if (product) {
      setForm({ name: product.name, description: product.description || "" });
      axios.get(`/api/get-product/${product.id}`).then(res => {
        setFields(
          (res.data.fields || []).map(f => ({
            ...f,
            options: f.options || []
          }))
        );
      });
    } else {
      setForm({ name: "", description: "" });
      setFields([{ name: "", type: "text", options: [] }]);
    }
    setShowModal(true);
  };

  // Change field data
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...fields];
    updatedFields[index][name] = value;
    setFields(updatedFields);
  };

  // Change field option data
  const handleOptionChange = (fieldIndex, optionIndex, e) => {
    const { name, value } = e.target;
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex][name] = value;
    setFields(updatedFields);
  };

  // Add a new option to a field
  const handleOptionAdd = (fieldIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.push({ name: "" });
    setFields(updatedFields);
  };

  // Delete an option from a field
  const handleOptionRemove = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options = updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setFields(updatedFields);
  };

  // Add a new field
  const addField = () => {
    setFields([...fields, { name: "", type: "text", options: [] }]);
  };

  // Delete field
  const handleRemoveField = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  // Save (add or edit)
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      fields: fields.map(field => ({
        ...field,
        options: field.type === "select" ? field.options : []
      }))
    };
    if (editProduct) {
      await axios.put(`/api/update-product/${editProduct.id}`, payload);
    } else {
      await axios.post("/api/store-product", payload);
    }
    setShowModal(false);
    fetchProducts();
  };

  // Delete product
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`/api/delete-product/${id}`)
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
        });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "Products.xlsx");
  };

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/dashboard')}>
        &larr; Back to Dashboard
      </button>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 fw-bold text-primary">
                <i className="bi bi-box-seam me-2"></i> Product List
              </h4>
              <div>
                <button
                  className="btn btn-success rounded-pill shadow-sm me-2"
                  onClick={exportToExcel}
                >
                  <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
                </button>
                <button
                  className="btn btn-primary rounded-pill shadow-sm"
                  onClick={() => openModal()}
                >
                  <i className="bi bi-plus-circle me-1"></i> Create New Product
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="form-control w-25"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div className="col-md-4 mb-4" key={product.id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{product.name}</h5>
                      <p className="card-text text-muted">{product.description}</p>
                      <p className="card-text">
                        <small className="text-muted">
                          Created At: {new Date(product.created_at).toLocaleString()}
                        </small>
                      </p>
                      <h6 className="text-secondary">Fields:</h6>
                      {product.fields.length > 0 ? (
                        <table className="table table-sm table-bordered">
                          <thead>
                            <tr>
                              <th>Field Name</th>
                              <th>Type</th>
                              <th>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.fields.map(field => (
                              <tr key={field.id}>
                                <td>{field.name}</td>
                                <td>{field.type}</td>
                                <td>
                                  {field.type === 'select' && field.options.length > 0 ? (
                                    <ul className="mb-0 ps-3">
                                      {field.options.map(option => (
                                        <li key={option.id}>
                                          <strong>{option.name}</strong>
                                          {option.description && (
                                            <> – <em>{option.description}</em></>
                                          )}
                                          {option.extra_info && (
                                            <> – <span className="text-muted">{option.extra_info}</span></>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-muted">–</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted">No fields available.</p>
                      )}
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => openModal(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center text-muted">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal to add/edit a product with fields and their options */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editProduct ? "Edit Product" : "Create Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </Form.Group>

            <h5 className="text-secondary mb-3">Fields</h5>
            {fields.map((field, index) => (
              <div className="border p-3 mb-4 rounded" key={index}>
                <div className="row mb-2">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Field name"
                      value={field.name}
                      onChange={e => handleFieldChange(index, e)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      name="type"
                      value={field.type}
                      onChange={e => handleFieldChange(index, e)}
                      required
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemoveField(index)}
                      >
                        Remove Field
                      </button>
                    )}
                  </div>
                </div>
                {field.type === "select" && (
                  <div>
                    <div className="mb-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleOptionAdd(index)}
                      >
                        + Add Option
                      </button>
                    </div>
                    {field.options.map((option, optionIndex) => (
                      <div className="row mb-2" key={optionIndex}>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Option Name"
                            value={option.name}
                            onChange={e => handleOptionChange(index, optionIndex, e)}
                            required
                          />
                        </div>
                        <div className="col-md-1 d-flex align-items-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleOptionRemove(index, optionIndex)}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mb-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addField}
              >
                + Add Field
              </button>
            </div>
            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editProduct ? "Save Changes" : "Create"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductPage;