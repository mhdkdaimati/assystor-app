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
    const [customerProduct, setCustomerProduct] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false); // New state for End Session module
    const [customerHistory, setCustomerHistory] = useState({});
    // Define session status and comment
    const [sessionStatus, setSessionStatus] = useState('');
    const [sessionComment, setSessionComment] = useState('');

    useEffect(() => {
        axios.get(`/api/customer-groups/${id}/customers/incomplete`)
            .then(res => {
                if (res.status === 200) {
                    setCustomerList(res.data);
                    res.data.forEach(customer => {
                        loadCustomerProducts(customer.id);
                        loadCustomerHistory(customer.id); // Download customer history
                    });
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching customers:", error);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`/api/products-with-fields`)
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data);
                }
            })
            .catch(error => {
                console.error("There was an error fetching products:", error);
            });
    }, []);

    const loadCustomerHistory = async (customerId) => {
        try {
            const res = await axios.get(`/api/get-customer-history/${customerId}`);
            setCustomerHistory(prev => ({
                ...prev,
                [customerId]: res.data
            }));
        } catch (error) {
            console.error(`Error loading customer history. customerId: ${customerId}:`, error);
        }
    };

    const loadCustomerProducts = async (customerId) => {
        try {
            const res = await axios.get(`/api/customer-products/${customerId}`);
            setCustomerProduct(prev => ({
                ...prev,
                [customerId]: res.data
            }));
        } catch (error) {
            console.error(`Error loading customer products. customerId: ${customerId}:`, error);
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

    const handleOpenSessionModal = (customerId) => {
        setSelectedCustomer(customerId);
        setShowSessionModal(true);
    };

    const handleCloseSessionModal = () => {
        setShowSessionModal(false);
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
        // product-field-values/bulk
        try {
            await axios.post(`/api/product-field-values/bulk`, {
                customer_id: selectedCustomer,
                product_id: selectedProduct.id,
                fields: fieldValues
            });

            swal("Product data saved successfully!");
            loadCustomerProducts(selectedCustomer);
            handleCloseModal();
        } catch (error) {
            console.error("Error saving product data:", error);
            swal("An error occurred while saving data.");
        }
    };

    const handleCloseCustomerSession = async () => {

        if (!sessionComment.trim()) {
            swal("Error", "Comment is required.", "error");
            return;
        }
        try {
            const payload = {
                customer_id: selectedCustomer,
                group_id: id,
                status: sessionStatus || 'customer_completed',
                comment: sessionComment,
            };

            // Send the first request to close the session

            //in close session we need only customer_id and group_id
            await axios.post(`/api/customer-groups/close-session`, payload);

            // Send the second request to record the history
            await axios.post(`/api/store-history`, payload);

            swal("Session closed and history saved successfully.");

            // Filter the list to remove the customer whose session was closed
            setCustomerList(prev => prev.filter(c => c.id !== selectedCustomer));

            //Reset values
            setSessionStatus('');
            setSessionComment('');
            handleCloseSessionModal();
        } catch (error) {
            console.error("Error closing session:", error);
            swal("An error occurred.");
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
            <h5 className="text-center mb-4">Incomplete customers in Group {id}</h5>
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
                                    <CustomerDetails
                                        customer={customer}
                                        handleOpenSessionModal={handleOpenSessionModal}
                                    />
                                    <button

                                        className="btn btn-outline-success w-100 mb-3"
                                        onClick={() => handleOpenSessionModal(customer.id)}
                                    >
                                        End session
                                    </button>
                                    <br />

                                    <button
                                        className="btn btn-outline-primary w-100 mb-3"
                                        onClick={() => handleOpenModal(customer.id)}
                                    >
                                        Add Product
                                    </button>
                                    <CustomerProduct customer_products={customerProduct[customer.id]} />
                                    <CustomerHistory history={customerHistory[customer.id]} />
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
                            <option value="">Choose a product</option>
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
                                    {field.type === 'select' ? (
                                        <select
                                            className="form-control"
                                            value={fieldValues[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select {field.name}
                                            </option>
                                            {field.options.map((option) => (
                                                <option key={option.id} value={option.name}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            className="form-control"
                                            value={fieldValues[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        />
                                    )}
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

            {/* Modal for Closing Session */}
            <Modal show={showSessionModal} onHide={handleCloseSessionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Close Customer Session</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="statusSelect" className="form-label">Customer Status</label>
                        <select
                            id="statusSelect"
                            className="form-select"
                            value={sessionStatus}
                            onChange={(e) => setSessionStatus(e.target.value)}
                        >
                            <option value="customer_completed">customer_completed</option>
                            <option value="repeat_later">repeat_later</option>
                            <option value="not_answer">not_answer</option>
                            <option value="quarantine">quarantine</option>
                            <option value="not_interested">not_interested</option>
                            <option value="not_want_to_be_contacted">not_want_to_be_contacted</option>
                            <option value="mailbox_comes">mailbox_comes</option>
                            {/* <option value="cacs">cacs</option>
                            <option value="rnv">rnv</option>
                            <option value="n_months">n_months</option>
                            <option value="data_cards">data_cards</option> */}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="comment" className="form-label">Comment</label>
                        <textarea
                            id="comment"
                            className="form-control"
                            rows="3"
                            value={sessionComment}
                            onChange={(e) => setSessionComment(e.target.value)}
                            placeholder="Enter your comment here..."
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSessionModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseCustomerSession}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const CustomerDetails = ({ customer, handleOpenSessionModal }) => (
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
                <div>
                </div>
            </div>
        </div>
    </div>
);

const CustomerHistory = ({ history }) => (
    history && history.length > 0 ? (
        <div className="mt-4">
            <h5 className="mb-3 text-primary">
                <i className="bi bi-journal-text me-2"></i>
                Customer History
            </h5>
            <div className="timeline">
                {history.map((entry, index) => (
                    <div key={entry.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                        <div className="timeline-badge">
                            <i className="bi bi-clock-history text-secondary"></i>
                        </div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h6 className="text-primary">
                                    <strong>Group:</strong> {entry.group?.name || ''}
                                </h6>
                                <p className="text-muted">
                                    <strong>Created At:</strong> {entry.created_at ? new Date(entry.created_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <div className="timeline-body">
                                <p><strong>Status:</strong> {entry.status}</p>
                                <p><strong>Comment:</strong> {entry.comment || 'No comment provided'}</p>
                                <p><strong>Employee:</strong> {entry.employee?.name || ''}</p>
                                <p><strong>Group:</strong> {entry.group?.name || ''}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className="alert alert-info mt-4">
            <i className="bi bi-info-circle me-2"></i>
            No history available for this customer.
        </div>
    )
);

const CustomerProduct = ({ customer_products }) => (
    customer_products && customer_products.length > 0 ? (
        <div className="mt-4">
            <h5 className="mb-3">
                <i className="bi bi-box-seam me-2"></i>
                Customer Products
            </h5>
            {customer_products.map((product, idx) => (
                <div key={idx} className="card mb-3 shadow-sm">
                    <div className="card-header bg-secondary text-white">
                        <strong>{product.product_name || `Product ${idx}`}</strong>
                    </div>
                    <div className="card-body">
                        <p><strong>Description:</strong> {product.product_description || 'N/A'}</p>
                        <p><strong>Status:</strong> {product.status || 'N/A'}</p>
                        <p><strong>Employee:</strong> {product.employee_name || 'N/A'}</p>
                        <p><strong>Created At:</strong> {product.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}</p>
                        <p><strong>Last Updated:</strong> {product.updated_at ? new Date(product.updated_at).toLocaleString() : 'N/A'}</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        {product.fields.map((field, idx) => (
                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
                                <div>
                                    <div><strong>{field.field_name}:</strong> {field.value}</div>
                                    <small className="text-muted">
                                        <strong>Created At:</strong> {field.created_at ? new Date(field.created_at).toLocaleString() : 'N/A'}
                                        <br />
                                        <strong>Last Updated:</strong> {field.updated_at ? new Date(field.updated_at).toLocaleString() : 'N/A'}
                                    </small>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    ) : (
        <div className="alert alert-info mt-4">
            <i className="bi bi-info-circle me-2"></i>
            No products available for this customer.
        </div>
    )
);
export default ProcessCustomerGroup;