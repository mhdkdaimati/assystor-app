import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDetails = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState(null);
    const [groups, setGroups] = useState([]);
    const [history, setHistory] = useState([]);
    const [products, setProducts] = useState([]);
    const [entityTypes, setEntityTypes] = useState([]);
    const [entityData, setEntityData] = useState({});
    const [loadingTab, setLoadingTab] = useState(false);
    const [quarantineInfo, setQuarantineInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/quarantines/check/${id}`).then(res => {
            if (res.data) {
                setQuarantineInfo({
                    quarantined: res.data.quarantined,
                    reason: res.data.reason,
                    addedBy: res.data.added_by,
                    createdAt: res.data.created_at,
                });
            } else {
                setQuarantineInfo(null);
            }
        });
    }, [id]);

    useEffect(() => {
        axios.get(`/api/get-customer/${id}`).then(res => {
            if (res.data.status === 200) {
                setCustomer(res.data.customer);
            }
            setLoading(false);
        });
    }, [id]);

    // Get entity types
    useEffect(() => {
        axios.get('/api/entity-types').then(res => {
            setEntityTypes(res.data || []);
        });
    }, []);

    //Current groups button
    const handleShowGroups = () => {
        setActiveTab("groups");
        setLoadingTab(true);
        axios.get(`/api/customers/${id}/groups`).then(res => {
            setGroups(res.data.groups || []);
            setLoadingTab(false);
        }).catch(() => setLoadingTab(false));
    };

    // History button
    const handleShowHistory = () => {
        setActiveTab("history");
        setLoadingTab(true);
        axios.get(`/api/get-customer-history/${id}`).then(res => {
            setHistory(res.data || []);
            setLoadingTab(false);
        }).catch(() => setLoadingTab(false));
    };

    // Products button
    const handleShowProducts = () => {
        setActiveTab("products");
        setLoadingTab(true);
        axios.get(`/api/customer-products/${id}`).then(res => {
            setProducts(res.data || []);
            setLoadingTab(false);
        }).catch(() => setLoadingTab(false));
    };

    // Dynamic entity button
    const handleShowEntity = (entityName, entityId) => {
        setActiveTab(entityName);
        setLoadingTab(true);
        axios
            .get(`/api/customer-entity-field-values?customer_id=${id}&entity_id=${entityId}`)
            .then(res => {
                setEntityData(prev => ({
                    ...prev,
                    [entityName]: res.data || []
                }));
                setLoadingTab(false);
            })
            .catch(() => setLoadingTab(false));
    };
    if (loading) return <div>Loading...</div>;
    if (!customer) return <div className="alert alert-danger">Customer not found.</div>;

    return (
        <div className="container py-4">
            <button
                className="btn btn-secondary mb-3"
                onClick={() => navigate('/view-customer')}
            >
                Back
            </button>
            <h4>Customer Details</h4>
            <table className="table table-bordered">
                <tbody>
                    {customer.id && (
                        <tr>
                            <th>ID</th>
                            <td>{customer.id}</td>
                        </tr>
                    )}
                    {customer.first_name && (
                        <tr>
                            <th>First Name</th>
                            <td>{customer.first_name}</td>
                        </tr>
                    )}
                    {customer.last_name && (
                        <tr>
                            <th>Last Name</th>
                            <td>{customer.last_name}</td>
                        </tr>
                    )}
                    {customer.email && (
                        <tr>
                            <th>Email</th>
                            <td>{customer.email}</td>
                        </tr>
                    )}
                    {customer.contact_number && (
                        <tr>
                            <th>Contact Number</th>
                            <td>{customer.contact_number}</td>
                        </tr>
                    )}
                    {customer.company_id && (
                        <tr>
                            <th>Company ID</th>
                            <td>{customer.company_id}</td>
                        </tr>
                    )}
                    {customer.gender && (
                        <tr>
                            <th>Gender</th>
                            <td>{customer.gender}</td>
                        </tr>
                    )}
                    {customer.birth_day && (
                        <tr>
                            <th>Birth Day</th>
                            <td>{customer.birth_day}</td>
                        </tr>
                    )}
                    {customer.street && (
                        <tr>
                            <th>Street</th>
                            <td>{customer.street}</td>
                        </tr>
                    )}
                    {customer.zip_code && (
                        <tr>
                            <th>Zip Code</th>
                            <td>{customer.zip_code}</td>
                        </tr>
                    )}
                    {customer.place && (
                        <tr>
                            <th>Place</th>
                            <td>{customer.place}</td>
                        </tr>
                    )}
                    {customer.iban && (
                        <tr>
                            <th>IBAN</th>
                            <td>{customer.iban}</td>
                        </tr>
                    )}
                    {customer.pkk && (
                        <tr>
                            <th>PKK</th>
                            <td>{customer.pkk}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Tab buttons below the table */}
            <div className="mb-3 d-flex gap-2 flex-wrap">
                <button
                    className={`btn btn${activeTab === "groups" ? "" : "-outline"}-primary`}
                    onClick={handleShowGroups}
                >
                    Groups
                </button>
                <button
                    className={`btn btn${activeTab === "history" ? "" : "-outline"}-secondary`}
                    onClick={handleShowHistory}
                >
                    History
                </button>
                <button
                    className={`btn btn${activeTab === "products" ? "" : "-outline"}-info`}
                    onClick={handleShowProducts}
                >
                    Products
                </button>
                {/* Dynamic entity buttons */}
                {entityTypes.map(entity => (
                    <button
                        key={entity.id}
                        className={`btn btn${activeTab === entity.name ? "" : "-outline"}-dark`}
                        onClick={() => handleShowEntity(entity.name, entity.id)}
                    >
                        {entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}
                    </button>
                ))}
            </div>
            {/* Selected tab content */}
            <div>
                {activeTab === "groups" && (
                    <div>
                        <h5>Current customer groups</h5>
                        {quarantineInfo?.quarantined === true && (
                            <div className="alert alert-danger">
                                Customer blocked by: <b>{quarantineInfo.addedBy || "Unknown"}</b><br />
                                Reason: <b>{quarantineInfo.reason || "No reason"}</b><br />
                                Ban date: <b>{quarantineInfo.createdAt}</b>
                            </div>
                        )}
                        {loadingTab ? (
                            <div>Loading...</div>
                        ) : groups.length === 0 ? (
                            <div className="text-muted">There are no groups for this customer.</div>
                        ) : (
                            <ul>
                                {groups.map(group => (
                                    <li key={group.id}>
                                        {group.name} <span className="text-muted">({group.status})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === "history" && (
                    <div>
                        <h5>Customer Groups History</h5>
                        {loadingTab ? (
                            <div>Loading...</div>
                        ) : history.length === 0 ? (
                            <div className="text-muted">No group history for this customer.</div>
                        ) : (
                            <table className="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Group Name</th>
                                        <th>Status</th>
                                        <th>Comment</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item, idx) => (
                                        <tr key={item.id}>
                                            <td>{idx + 1}</td>
                                            <td>{item.group?.name || "-"}</td>
                                            <td>{item.status}</td>
                                            <td>{item.comment}</td>
                                            <td>{item.created_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === "products" && (
                    <div>
                        <h5>Customer Products</h5>
                        {loadingTab ? (
                            <div>Loading...</div>
                        ) : products.length === 0 ? (
                            <div className="text-muted">No products for this customer.</div>
                        ) : (
                            <div>
                                {products.map((product, idx) => (
                                    <div key={idx} className="mb-3 p-2 border rounded">
                                        <div><b>Product Name:</b> {product.product_name}</div>
                                        <div><b>Description:</b> {product.product_description}</div>
                                        <div><b>Status:</b> {product.status}</div>
                                        <div><b>Added User:</b> {product.added_user || "N/A"}</div>
                                        <div><b>Created At:</b> {product.created_at}</div>
                                        {product.fields && product.fields.length > 0 && (
                                            <div className="mt-2">
                                                <b>Fields:</b>
                                                <ul>
                                                    {product.fields.map((field, fidx) => (
                                                        <li key={fidx}>
                                                            {field.field_name}: {field.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Dynamic entity content */}
                {entityTypes.map(entity => (
                    activeTab === entity.name && (
                        <div key={entity.id}>
                            <h5>{entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}</h5>
                            {loadingTab ? (
                                <div>Loading...</div>
                            ) : entityData[entity.name] && entityData[entity.name].length > 0 ? (
                                <div style={{ overflowX: "auto" }}>
                                    <table className="table table-bordered table-sm align-middle" style={{ minWidth: 500, background: "#fff" }}>
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                {entityData[entity.name][0].fields.map(field => (
                                                    <th key={field.field_id}>{field.field_name}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entityData[entity.name].map((row, idx) => (
                                                <tr key={row.customer_entity_id}>
                                                    <td>{idx + 1}</td>
                                                    {row.fields.map(field => {
                                                        let value = field.value;
                                                        let isJson = false;
                                                        let arr = [];
                                                        try {
                                                            const parsed = JSON.parse(value);
                                                            if (Array.isArray(parsed)) {
                                                                isJson = true;
                                                                arr = parsed;
                                                            }
                                                        } catch { /* ليست جيسون */ }
                                                        return (
                                                            <td key={field.field_id}>
                                                                {isJson ? (
                                                                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                                        {arr.map((v, i) => <li key={i}>{v}</li>)}
                                                                    </ul>
                                                                ) : (
                                                                    value
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-muted">No data found for this entity.</div>
                            )}
                        </div>
                    )
                ))}

            </div>
        </div>
    );
};

export default CustomerDetails;