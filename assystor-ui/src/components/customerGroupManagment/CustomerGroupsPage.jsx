import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { Modal, Button, Form } from "react-bootstrap";
//fix bug: if there are no groups the customer will not be displayed in the quarantine tab
const CustomerGroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupCustomers, setGroupCustomers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [availableCustomers, setAvailableCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]); // Specific customers to add
    const [selectedRemoveIds, setSelectedRemoveIds] = useState([]); //Customers marked for deletion
    const [quarantinedCustomers, setQuarantinedCustomers] = useState([]);
    const [selectedToQuarantine, setSelectedToQuarantine] = useState([]);

    const [selectedToRemoveFromQuarantine, setSelectedToRemoveFromQuarantine] = useState([]);

    const [showReasonModal, setShowReasonModal] = useState(false);
    const [quarantineReason, setQuarantineReason] = useState("");

    useEffect(() => {
        fetchGroups();
        fetchAllCustomers();
    }, []);
    const fetchQuarantinedCustomers = async () => {
        const res = await axios.get('/api/quarantines');
        setQuarantinedCustomers(res.data.map(q => ({
            ...q.customer,
            quarantine_id: q.id
        })));
    };
    const handleCheckboxRemoveFromQuarantine = (customerId) => {
        setSelectedToRemoveFromQuarantine(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    const handleQuarantineSaveChanges = () => {
        if (selectedToQuarantine.length > 0) {
            setShowReasonModal(true);
        } else {
            processQuarantineChanges("");
        }
    };

    // Save changes button (add and remove in batch)
    const processQuarantineChanges = async (reason) => {
        // Add customers at once with reason
        if (selectedToQuarantine.length > 0) {
            await axios.post('/api/quarantines/bulk', { customer_ids: selectedToQuarantine, reason });
        }
        // Delete customers in bulk
        if (selectedToRemoveFromQuarantine.length > 0) {
            await axios.post('/api/quarantines/bulk-delete', { customer_ids: selectedToRemoveFromQuarantine });
        }


        swal("Success", "Changes saved!", "success");
        fetchQuarantinedCustomers();
        fetchAllCustomers();
        setSelectedToQuarantine([]);
        setSelectedToRemoveFromQuarantine([]);
        setShowReasonModal(false);
        setQuarantineReason("");
    };


    const handleQuarantineTabClick = () => {
        setSelectedGroup({ id: 'quarantine', name: 'Quarantine' });
        fetchQuarantinedCustomers();
        fetchAllCustomers();
        setSelectedToQuarantine([]);
    };


    const handleCheckboxQuarantine = (customerId) => {
        setSelectedToQuarantine(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };
    const handleSendToQuarantine = async () => {
        for (const customerId of selectedToQuarantine) {
            await axios.post('/api/quarantines', { customer_id: customerId });
        }
        swal("Success", "Customers sent to quarantine!", "success");
        fetchQuarantinedCustomers();
        fetchAllCustomers();
        setSelectedToQuarantine([]);
    };
    const fetchGroups = async () => {
        try {
            const res = await axios.get('/api/customer-groups');
            if (res.status === 200) {
                setGroups(res.data.customer_groups);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllCustomers = async () => {
        try {
            const res = await axios.get('/api/valid-customers-with-companies');
            setAllCustomers(res.data.customers);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGroupCustomers = async (groupId) => {
        try {
            const res = await axios.get(`/api/customer-groups/${groupId}/customers`);
            setGroupCustomers(res.data);
            updateAvailableCustomers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateAvailableCustomers = (currentGroupCustomers) => {
        const currentIds = currentGroupCustomers.map(c => c.id);
        const available = allCustomers.filter(c => !currentIds.includes(c.id));
        setAvailableCustomers(available);
    };

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        fetchGroupCustomers(group.id);
        setSelectedCustomerIds([]); // Reassign selected clients to add
        setSelectedRemoveIds([]); // Reassign selected clients for deletion
    };

    const handleCheckboxChange = (customerId, type) => {
        if (type === "add") {
            setSelectedCustomerIds(prev =>
                prev.includes(customerId)
                    ? prev.filter(id => id !== customerId) // Remove the customer if it is already selected
                    : [...prev, customerId] // Add customer if not specified
            );
        } else if (type === "remove") {
            setSelectedRemoveIds(prev =>
                prev.includes(customerId)
                    ? prev.filter(id => id !== customerId)// Remove the customer if it is already selected
                    : [...prev, customerId] // Add customer if not specified
            );
        }
    };

    const handleSaveChanges = async () => {
        if (selectedCustomerIds.length === 0 && selectedRemoveIds.length === 0) {
            swal("Warning", "Please select customers to add or remove.", "warning");
            return;
        }

        try {
            // Update customers in the group
            const updatedCustomerIds = [
                ...groupCustomers.map(c => c.id).filter(id => !selectedRemoveIds.includes(id)), // Delete the selected customers for deletion
                ...selectedCustomerIds,// Add the specified customers to the add-on
            ];

            const res = await axios.post(`/api/customer-groups/${selectedGroup.id}/assign-customers`, {
                customer_ids: updatedCustomerIds,
            });

            if (res.status === 200) {
                swal("Success", "Changes saved successfully!", "success");

                // Update the number of customers in the group
                setGroups(prevGroups =>
                    prevGroups.map(group =>
                        group.id === selectedGroup.id
                            ? { ...group, customers_count: updatedCustomerIds.length }
                            : group
                    )
                );

                fetchGroupCustomers(selectedGroup.id);
                setSelectedCustomerIds([]); // Reassign selected clients to add
                setSelectedRemoveIds([]); // Reassign selected clients for deletion
                fetchGroups();
            }
        } catch (error) {
            swal("Error", "Failed to save changes.", "error");
            console.error(error);
        }
    };

    const filteredAvailableCustomers = availableCustomers.filter(c => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (c.first_name?.toLowerCase() || "").includes(searchLower) ||
            (c.last_name?.toLowerCase() || "").includes(searchLower) ||
            (c.contact_number?.toLowerCase() || "").includes(searchLower)
        );
    });
    return (
        <>
            <div className="container my-5">
                <div className="row">
                    <div className="col-md-4">
                        <h4>Groups</h4>
                        <ul className="list-group">
                            <li
                                className={`list-group-item bg-danger text-white ${selectedGroup?.id === 'quarantine' ? 'border border-dark' : ''}`}
                                style={{ cursor: "pointer" }}
                                onClick={handleQuarantineTabClick}
                            >Quarantine
                                {/* Quarantine ({quarantinedCustomers.length}) */}
                            </li>                    </ul>

                        <ul className="list-group">
                            {groups && groups.length > 0 ? (
                                groups.map(group => (
                                    <li
                                        key={group.id}
                                        className={`list-group-item ${selectedGroup?.id === group.id ? 'bg-light' : ''}`}
                                        onClick={() => handleGroupClick(group)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {group.name}
                                        {/* ({group.customers_count}) */}
                                        <br />{group.status}
                                    </li>
                                ))
                            ) : (
                                <p className="text-muted">No groups available.</p>
                            )}
                        </ul>

                    </div>

                    <div className="col-md-8">

                        {selectedGroup?.id === 'quarantine' && (
                            <>
                                <h5 className="text-success">Add Customers to Quarantine</h5>
                                <div className="row">
                                    {allCustomers
                                        .filter(c => !quarantinedCustomers.some(q => q.id === c.id))
                                        .map(customer => (
                                            <div className="col-md-4 mb-3" key={customer.id}>
                                                <div className="card p-2 border-danger">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectedToQuarantine.includes(customer.id)}
                                                            onChange={() => handleCheckboxQuarantine(customer.id)}
                                                        />
                                                        <label className="form-check-label">
                                                            {customer.first_name} {customer.last_name}
                                                        </label>
                                                    </div>
                                                    {/* <p>Email: {customer.email}</p> */}
                                                    <p>Phone: {customer.contact_number}</p>
                                                    {/* <p>Company: {customer.company?.name || 'N/A'}</p> */}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <button
                                    className="btn btn-danger mt-3"
                                    onClick={handleQuarantineSaveChanges}
                                    disabled={selectedToQuarantine.length === 0 && selectedToRemoveFromQuarantine.length === 0}
                                >
                                    Save Changes
                                </button>
                                <h5 className="mt-5 text-danger">Quarantined Customers</h5>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Select</th>
                                            <th>Name</th>
                                            {/* <th>Email</th> */}
                                            <th>Phone</th>
                                            {/* <th>Company</th> */}
                                            <th>Reason</th>
                                            <th>Added By</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quarantinedCustomers.map(q => (
                                            <tr key={q.quarantine_id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={selectedToRemoveFromQuarantine.includes(q.id)}
                                                        onChange={() => handleCheckboxRemoveFromQuarantine(q.id)}
                                                    />
                                                </td>
                                                <td>{q.first_name} {q.last_name}</td>
                                                {/* <td>{q.email}</td> */}
                                                <td>{q.contact_number}</td>
                                                {/* <td>{q.company?.name || 'N/A'}</td> */}
                                                <td>{q.reason || 'N/A'}</td>
                                                <td>{q.added_by || 'N/A'}</td>
                                                <td>{q.created_at ? new Date(q.created_at).toLocaleString() : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>                            </>
                        )}

                        {selectedGroup && selectedGroup.id !== 'quarantine' && (
                            <>
                                <h4 className="mb-4">Manage Customers in Group: <span className="text-primary">{selectedGroup.name}</span></h4>

                                {/* Add Customers Section */}                            <div className="mb-5">
                                    <h5 className="text-success">Add Customers to Group</h5>
                                    <p className="text-muted">Select customers from the cards below to add them to the group.</p>
                                    {availableCustomers.length > 0 ? (
                                        <>
                                            <input
                                                type="text"
                                                className="form-control mb-3"
                                                placeholder="Search by name or phone..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <div className="row">
                                                {filteredAvailableCustomers.map(customer => (
                                                    <div className="col-md-4 mb-3" key={customer.id}>
                                                        <div className="card p-2 border-success">
                                                            <div className="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={`add-customer-${customer.id}`}
                                                                    checked={selectedCustomerIds.includes(customer.id)}
                                                                    onChange={() => handleCheckboxChange(customer.id, "add")}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`add-customer-${customer.id}`}
                                                                >
                                                                    {customer.first_name} {customer.last_name}
                                                                </label>
                                                            </div>
                                                            {/* <p>Email: {customer.email}</p> */}
                                                            <p>Phone: {customer.contact_number}</p>
                                                            {/* <p>Company: {customer.company?.name || 'N/A'}</p> */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-muted">No customers available to add to this group.</p>
                                    )}
                                </div>
                                <div>
                                    <h5 className="text-danger">Remove Customers from Group</h5>
                                    <p className="text-muted">Select customers from the table below to remove them from the group.</p>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Select</th>
                                                <th>Name</th>
                                                {/* <th>Email</th> */}
                                                <th>Phone</th>
                                                {/* <th>Company</th> */}
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupCustomers.map(customer => (
                                                <tr key={customer.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectedRemoveIds.includes(customer.id)}
                                                            onChange={() => handleCheckboxChange(customer.id, "remove")} />
                                                    </td>
                                                    <td>{customer.first_name} {customer.last_name}</td>
                                                    {/* <td>{customer.email}</td> */}
                                                    <td>{customer.contact_number}</td>
                                                    {/* <td>{customer.company?.name || 'N/A'}</td> */}
                                                    <td>{customer.status || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button
                                    className="btn btn-primary mt-4"
                                    onClick={handleSaveChanges}
                                >
                                    Apply Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Modal show={showReasonModal} onHide={() => setShowReasonModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Reason for Quarantine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Reason</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={quarantineReason}
                                onChange={e => setQuarantineReason(e.target.value)}
                                placeholder="Enter reason for quarantine (optional)"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReasonModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => processQuarantineChanges(quarantineReason)}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

};

export default CustomerGroupsPage;