import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProcessCustomerGroup = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [customerList, setCustomerList] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({}); // customerId -> product

    // تحميل الزبائن
    useEffect(() => {
        axios.get(`/api/customer-groups/${id}/customers/incomplete`)
            .then(res => {
                if (res.status === 200) {
                    setCustomerList(res.data);
                }
                setLoading(false);
            }).catch(error => {
                console.error("There was an error fetching customers:", error);
                setLoading(false);
            });
    }, [id]);

    // تحميل المنتجات
    useEffect(() => {
        axios.get(`/api/products`)
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data); // حسب استجابتك
                }
            }).catch(error => {
                console.error("There was an error fetching products:", error);
            });
    }, []);

    // عند اختيار منتج لزبون
    const handleSelectProduct = async (customerId, productId) => {
        if (!productId) return;

        try {
            const res = await axios.get(`/api/products/${productId}`);
            setSelectedProducts(prev => ({
                ...prev,
                [customerId]: res.data
            }));
        } catch (error) {
            console.error("Error loading product fields:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h3>Group ID: {id}</h3>
            <div className="accordion accordion-flush" id="accordionFlushExample">
                {customerList.length > 0 ? customerList.map((customer) => (
                    <div className="accordion-item" key={customer.id}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#flush-collapse${customer.id}`}
                                aria-expanded="false"
                                aria-controls={`flush-collapse${customer.id}`}
                            >
                                {customer.first_name} {customer.last_name}
                            </button>
                        </h2>
                        <div
                            id={`flush-collapse${customer.id}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li><strong>Email:</strong> {customer.email}</li>
                                    <li><strong>Gender:</strong> {customer.gender || 'Not provided'}</li>
                                    <li><strong>Birthdate:</strong> {customer.birth_day}</li>
                                    <li><strong>Street:</strong> {customer.street}</li>
                                    <li><strong>Zip Code:</strong> {customer.zip_code}</li>
                                    <li><strong>Place:</strong> {customer.place}</li>
                                    <li><strong>IBAN:</strong> {customer.iban}</li>
                                    <li><strong>Contact Number:</strong> {customer.contact_number}</li>
                                    <li><strong>Status:</strong> {customer.pivot.status}</li>
                                </ul>

                                {/* اختيار المنتج */}
                                <div className="mt-3">
                                    <label>Select Product:</label>
                                    <select
                                        className="form-select mt-1"
                                        onChange={(e) => handleSelectProduct(customer.id, e.target.value)}
                                        value={selectedProducts[customer.id]?.id || ''}
                                    >
                                        <option value="">-- Choose a product --</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* عرض الحقول عند اختيار منتج */}
                                {selectedProducts[customer.id]?.fields?.length > 0 && (
                                    <div className="mt-3">
                                        <h5>Fields for {selectedProducts[customer.id].name}</h5>
                                        {selectedProducts[customer.id].fields.map((field, index) => (
                                            <div key={index} className="mb-2">
                                                <label>{field.name}</label>
                                                <input
                                                    type={field.type === 'number' ? 'number' : 'text'}
                                                    className="form-control"
                                                    placeholder={`Enter ${field.name}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="accordion-item">
                        <div className="accordion-header">
                            <button className="accordion-button" type="button" disabled>
                                No Customers Found
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProcessCustomerGroup;
