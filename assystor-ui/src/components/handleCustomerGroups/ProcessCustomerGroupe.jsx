import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProcessCustomerGroup = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [customerList, setCustomerList] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [fieldValues, setFieldValues] = useState({});
    const [history, setHistory] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get(`/api/customer-groups/${id}/customers/incomplete`)
            .then(res => {
                if (res.status === 200) {
                    setCustomerList(res.data);
                    res.data.forEach(customer => loadHistory(customer.id));
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching customers:", error);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`/api/products`)
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data);
                }
            })
            .catch(error => {
                console.error("There was an error fetching products:", error);
            });
    }, []);

    const loadHistory = async (customerId) => {
        try {
            const res = await axios.get(`/api/customers/${customerId}/product-history`);
            setHistory(prev => ({
                ...prev,
                [customerId]: res.data
            }));
        } catch (error) {
            console.error(`Error loading history for customer ${customerId}:`, error);
        }
    };

    const handleOpenModal = (customerId) => {
        setSelectedCustomer(customerId);
        setSelectedProduct(null);
        setFieldValues({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSelectProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
        setFieldValues({});
    };

    const handleFieldChange = (fieldId, value) => {
        setFieldValues(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleSaveProduct = async () => {
        if (!selectedProduct) return;

        try {
            await axios.post(`/api/field-values/bulk`, {
                customer_id: selectedCustomer,
                product_id: selectedProduct.id,
                fields: fieldValues
            });

            swal("Product data saved successfully!");
            loadHistory(selectedCustomer);
            handleCloseModal();
        } catch (error) {
            console.error("Error saving product data:", error);
            swal("An error occurred while saving data.");
        }
    };

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            {/* <h3 className="text-center mb-4">Customer Group Management</h3> */}
            <div className="accordion" id="customerAccordion">
                {customerList.length > 0 ? (
                    customerList.map((customer) => (
                        <div className="accordion-item" key={customer.id}>
                            <h2 className="accordion-header" id={`heading${customer.id}`}>
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${customer.id}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${customer.id}`}
                                >
                                    {customer.first_name} {customer.last_name}
                                </button>
                            </h2>
                            <div
                                id={`collapse${customer.id}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${customer.id}`}
                                data-bs-parent="#customerAccordion"
                            >
                                <div className="accordion-body">
                                    <CustomerDetails customer={customer} />
                                    <button
                                        className="btn btn-outline-primary w-100 mb-3"
                                        onClick={() => handleOpenModal(customer.id)}
                                    >
                                        Add Product
                                    </button>
                                    <CustomerHistory history={history[customer.id]} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-warning text-center" role="alert">
                        No customers found in this group.
                    </div>
                )}
            </div>

            {/* Modal for Adding Product */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label>Select Product</label>
                        <select
                            className="form-select"
                            onChange={(e) => handleSelectProduct(Number(e.target.value))}
                            value={selectedProduct?.id || ''}
                        >
                            <option value="">-- Choose a product --</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedProduct?.fields?.length > 0 && (
                        <div>
                            <h6>Fields for {selectedProduct.name}</h6>
                            {selectedProduct.fields.map((field) => (
                                <div key={field.id} className="mb-2">
                                    <label>{field.name}</label>
                                    <input
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        className="form-control"
                                        placeholder={`Enter ${field.name}`}
                                        value={fieldValues[field.id] || ''}
                                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveProduct}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const CustomerDetails = ({ customer }) => (
    <div className="card mb-3 shadow-sm">
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
                <i className="bi bi-person-lines-fill me-2"></i>
                Customer Details
            </h5>
        </div>
        <div className="card-body">
            <div className="row">
                <div className="col-md-6 mb-2">
                    <strong>Email:</strong> {customer.email}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>Gender:</strong> {customer.gender || 'Not provided'}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>Birthdate:</strong> {customer.birth_day}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>Street:</strong> {customer.street}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>Zip Code:</strong> {customer.zip_code}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>Place:</strong> {customer.place}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>IBAN:</strong> {customer.iban}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>Contact Number:</strong> {customer.contact_number}
                </div>
                <div className="col-md-6 mb-2">
                    <strong>Status:</strong> {customer.pivot.status}
                </div>
            </div>
        </div>
    </div>
);

const CustomerHistory = ({ history }) => (
    history && Object.keys(history).length > 0 && (
        <div className="mt-4">
            <h5 className="mb-3">
                <i className="bi bi-clock-history me-2"></i>
                Product History
            </h5>
            {Object.entries(history).map(([productId, entries]) => (
                <div key={productId} className="card mb-3 shadow-sm">
                    <div className="card-header bg-secondary text-white">
                        <strong>{entries[0]?.product?.name || `Product ID: ${productId}`}</strong>
                    </div>
                    <ul className="list-group list-group-flush">
                        {entries.map(entry => (
                            <li key={entry.id} className="list-group-item d-flex justify-content-between align-items-start">
                                <div>
                                    <div><strong>{entry.field?.name}:</strong> {entry.value}</div>
                                    <small className="text-muted">
                                        Created at: {new Date(entry.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
);

export default ProcessCustomerGroup;