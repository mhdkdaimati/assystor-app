import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const EntityTab = ({ entity, loading, entityData, customerId, entityId, onAdded }) => {
    const [showAdd, setShowAdd] = useState(false);
    const [fields, setFields] = useState([]);
    const [fieldValues, setFieldValues] = useState({});
    const [saving, setSaving] = useState(false);


    const [showProcessModal, setShowProcessModal] = useState(false);
    const [processingEntityId, setProcessingEntityId] = useState(null);
    const [processStatus, setProcessStatus] = useState("");
    const [processComment, setProcessComment] = useState("");
    const [processLoading, setProcessLoading] = useState(false);

    // جلب الحقول عند فتح المودال
    const handleShowAdd = async () => {
        setShowAdd(true);
        // جلب كل الكيانات ثم استخراج الحقول الخاصة بالانتيتي الحالي
        const res = await axios.get("/api/entities");
        const found = res.data.find(e => e.id === entityId);
        setFields(found ? found.fields : []);
        setFieldValues({});
    };

    // حفظ القيم
    const handleAddValue = async (e) => {
        e.preventDefault();
        setSaving(true);
        await axios.post("/api/field-values/bulk", {
            customer_id: customerId,
            entity_id: entityId,
            fields: fieldValues
        });
        setShowAdd(false);
        setSaving(false);
        setFieldValues({});
        if (onAdded) onAdded();
    };
    const handleOpenProcessModal = (customerEntityId) => {
        setProcessingEntityId(customerEntityId);
        setProcessStatus("");
        setProcessComment("");
        setShowProcessModal(true);
    };


    const handleProcessEntity = async () => {
        if (!processingEntityId || !processStatus) return;
        setProcessLoading(true);
        try {
            await axios.put(`/api/update-customer-entity-status/${processingEntityId}`, {
                status: processStatus,
                comment: processComment
            });
            setShowProcessModal(false);
            setProcessingEntityId(null);
            setProcessStatus("");
            setProcessComment("");
            if (onAdded) onAdded(); // لإعادة تحميل البيانات
        } catch (e) {
            alert("Error processing entity");
        }
        setProcessLoading(false);
    };


    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h5>{entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}</h5>
            <Button className="mb-3" onClick={handleShowAdd}>
                + Add Value
            </Button>


            <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered table-sm align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Status</th>
                            <th>Comment</th>
                            <th>Added User</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            {/* الحقول الديناميكية */}
                            {Array.isArray(entityData) && entityData.length > 0 && Array.isArray(entityData[0]?.fields)
                                ? entityData[0].fields.map(field => (
                                    <th key={field.field_id}>{field.field_name}</th>
                                ))
                                : null}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(entityData) && entityData.length > 0 ? entityData.map((row, idx) => (
                            <tr key={row.customer_entity_id}>
                                <td>{idx + 1}</td>
                                <td>{row.status}</td>
                                <td>{row.comment}</td>
                                <td>{row.added_user}</td>
                                <td>{row.created_at}</td>
                                <td>{row.updated_at}</td>
                                {Array.isArray(row.fields) && row.fields.map(field => {
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
                                <td>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleOpenProcessModal(row.customer_entity_id)}
                                        disabled={row.status === "approved" || row.status === "rejected"}
                                    >
                                        Process
                                    </Button>                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>
            {/* Modal لإضافة قيمة */}
            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Value</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddValue}>
                        {fields.map(field => (
                            <Form.Group className="mb-3" key={field.id}>
                                <Form.Label>{field.label || field.name}</Form.Label>
                                {field.type === "select" ? (
                                    <Form.Select
                                        required={field.required}
                                        value={fieldValues[field.id] || ""}
                                        onChange={e => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                                    >
                                        <option value="">Choose</option>
                                        {field.options.map(opt => (
                                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                                        ))}
                                    </Form.Select>
                                ) : field.type === "checkbox" ? (
                                    <div>
                                        {field.options.map(opt => (
                                            <Form.Check
                                                key={opt.id}
                                                type="checkbox"
                                                label={opt.name}
                                                value={opt.name}
                                                checked={Array.isArray(fieldValues[field.id]) && fieldValues[field.id].includes(opt.name)}
                                                onChange={e => {
                                                    const checked = e.target.checked;
                                                    const prev = Array.isArray(fieldValues[field.id]) ? fieldValues[field.id] : [];
                                                    setFieldValues({
                                                        ...fieldValues,
                                                        [field.id]: checked
                                                            ? [...prev, opt.name]
                                                            : prev.filter(v => v !== opt.name)
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Form.Control
                                        type={field.type}
                                        required={field.required}
                                        value={fieldValues[field.id] || ""}
                                        onChange={e => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                                    />
                                )}
                            </Form.Group>
                        ))}
                        <div className="text-end">
                            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" className="ms-2" disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
              <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Process Entity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={processStatus}
                                onChange={e => setProcessStatus(e.target.value)}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={processComment}
                                onChange={e => setProcessComment(e.target.value)}
                                placeholder="Enter comment (optional)"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowProcessModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleProcessEntity}
                        disabled={processLoading || !processStatus}
                    >
                        {processLoading ? "Processing..." : "Process"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EntityTab;