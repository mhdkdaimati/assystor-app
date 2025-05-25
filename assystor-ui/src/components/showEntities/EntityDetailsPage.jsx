import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal } from "react-bootstrap";

export default function EntityDetailsPage({ entity, customers, onBack }) {
    const [entityValues, setEntityValues] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState("");

    useEffect(() => {
        if (entity) {
            axios.get(`/api/entity-field-values?entity_id=${entity.id}`).then(res => {
                setEntityValues(res.data);
            });
        }
    }, [entity]);

    const handleAdd = () => {
        setFieldValues({});
        setSelectedCustomer("");
        setShowAdd(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await axios.post("/api/field-values/bulk", {
            customer_id: selectedCustomer,
            entity_id: entity.id,
            fields: fieldValues
        });
        setShowAdd(false);
        axios.get(`/api/entity-field-values?entity_id=${entity.id}`).then(res => {
            setEntityValues(res.data);
        });
    };

    if (!entity) return null;

    return (
        <div className="container py-4">
            <Button variant="link" onClick={onBack} className="p-0 mb-3">&larr; Back</Button>
            <h3>{entity.name}</h3>
            <div className="text-muted mb-3">{entity.description}</div>
            <Button onClick={handleAdd} className="mb-3">+ Add Value</Button>

            {/* مودال الإضافة */}
            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Value</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Customer</Form.Label>
                            <Form.Select
                                value={selectedCustomer}
                                onChange={e => setSelectedCustomer(e.target.value)}
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.first_name} {c.last_name} ({c.email})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        {entity.fields.map(field => (
                            <Form.Group className="mb-3" key={field.id}>
                                <Form.Label>{field.label}</Form.Label>
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
                            <Button type="submit" variant="primary" className="ms-2">Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer</th>
                        {entity.fields.map(field => (
                            <th key={field.id}>{field.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entityValues.length === 0 && (
                        <tr>
                            <td colSpan={2 + entity.fields.length} className="text-center text-muted">
                                No data found.
                            </td>
                        </tr>
                    )}
                    {entityValues.map((row, idx) => (
                        <tr key={row.id || idx}>
                            <td>{idx + 1}</td>
                            <td>{row.customer_name || row.customer_id}</td>
                            {entity.fields.map(field => (
                                <td key={field.id}>
                                    {row.values?.[field.id] ?? "-"}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}