import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        date: "",
        contract: "",
        location: "",
        access: "",
        tariff: "",
        options: "",
        hardware: "",
        free_gift: "",
        imei: "",
        customer_id: "",
        customer_number: "",
        phone_number: "",
        note: ""
    });

    // جلب الفيدباك والزبائن
    useEffect(() => {
        fetchFeedbacks();
        fetchCustomers();
    }, []);

    const fetchFeedbacks = async () => {
        const res = await axios.get("/api/feedbacks");
        setFeedbacks(res.data);
    };

    const fetchCustomers = async () => {
        const res = await axios.get("/api/valid-customers-with-companies");
        setCustomers(res.data.customers);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("/api/feedbacks", form);
        setShowModal(false);
        setForm({
            date: "",
            contract: "",
            location: "",
            access: "",
            tariff: "",
            options: "",
            hardware: "",
            free_gift: "",
            imei: "",
            customer_id: "",
            customer_number: "",
            phone_number: "",
            note: ""
        });
        fetchFeedbacks();
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Feedbacks</h3>
                <Button onClick={() => setShowModal(true)}>Add Feedback</Button>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Contract</th>
                            <th>Location</th>
                            <th>Access</th>
                            <th>Tariff</th>
                            <th>Options</th>
                            <th>Hardware</th>
                            <th>Free Gift</th>
                            <th>IMEI</th>
                            <th>Customer Number</th>
                            <th>Phone Number</th>
                            <th>Note</th>
                            <th>Created By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map(fb => (
                            <tr key={fb.id}>
                                <td>{fb.date || ""}</td>
                                <td>{fb.customer ? `${fb.customer.first_name} ${fb.customer.last_name}` : ""}</td>
                                <td>{fb.contract}</td>
                                <td>{fb.location}</td>
                                <td>{fb.access}</td>
                                <td>{fb.tariff}</td>
                                <td>{fb.options}</td>
                                <td>{fb.hardware}</td>
                                <td>{fb.free_gift}</td>
                                <td>{fb.imei}</td>
                                <td>{fb.customer_number}</td>
                                <td>{fb.phone_number}</td>
                                <td>{fb.note}</td>
                                <td>{fb.creator ? fb.creator.name : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal لإضافة فيدباك جديد */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={form.date} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Customer</Form.Label>
                            <Form.Select name="customer_id" value={form.customer_id} onChange={handleChange} required>
                                <option value="">Select Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.first_name} {c.last_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Contract</Form.Label>
                            <Form.Control name="contract" value={form.contract} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="location" value={form.location} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Access</Form.Label>
                            <Form.Control name="access" value={form.access} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Tariff</Form.Label>
                            <Form.Control name="tariff" value={form.tariff} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Options</Form.Label>
                            <Form.Control name="options" value={form.options} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Hardware</Form.Label>
                            <Form.Control name="hardware" value={form.hardware} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Free Gift</Form.Label>
                            <Form.Control name="free_gift" value={form.free_gift} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>IMEI</Form.Label>
                            <Form.Control name="imei" value={form.imei} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Customer Number</Form.Label>
                            <Form.Control name="customer_number" value={form.customer_number} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control name="phone_number" value={form.phone_number} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Note</Form.Label>
                            <Form.Control as="textarea" name="note" value={form.note} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Feedback;