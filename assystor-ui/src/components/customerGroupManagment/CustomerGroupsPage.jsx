import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const CustomerGroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupCustomers, setGroupCustomers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [availableCustomers, setAvailableCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]); // الزبائن المحددين للإضافة
    const [selectedRemoveIds, setSelectedRemoveIds] = useState([]); // الزبائن المحددين للحذف

    useEffect(() => {
        fetchGroups();
        fetchAllCustomers();
    }, []);

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
            const res = await axios.get('/api/all-customers');
            setAllCustomers(res.data.customer);
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
        setSelectedCustomerIds([]); // إعادة تعيين الزبائن المحددين للإضافة
        setSelectedRemoveIds([]); // إعادة تعيين الزبائن المحددين للحذف
    };

    const handleCheckboxChange = (customerId, type) => {
        if (type === "add") {
            setSelectedCustomerIds(prev =>
                prev.includes(customerId)
                    ? prev.filter(id => id !== customerId) // إزالة الزبون إذا كان محددًا مسبقًا
                    : [...prev, customerId] // إضافة الزبون إذا لم يكن محددًا
            );
        } else if (type === "remove") {
            setSelectedRemoveIds(prev =>
                prev.includes(customerId)
                    ? prev.filter(id => id !== customerId) // إزالة الزبون إذا كان محددًا مسبقًا
                    : [...prev, customerId] // إضافة الزبون إذا لم يكن محددًا
            );
        }
    };

    const handleSaveChanges = async () => {
        if (selectedCustomerIds.length === 0 && selectedRemoveIds.length === 0) {
            swal("Warning", "Please select customers to add or remove.", "warning");
            return;
        }

        try {
            // تحديث الزبائن في المجموعة
            const updatedCustomerIds = [
                ...groupCustomers.map(c => c.id).filter(id => !selectedRemoveIds.includes(id)), // حذف الزبائن المحددين للحذف
                ...selectedCustomerIds, // إضافة الزبائن المحددين للإضافة
            ];

            const res = await axios.post(`/api/customer-groups/${selectedGroup.id}/assign-customers`, {
                customer_ids: updatedCustomerIds,
            });

            if (res.status === 200) {
                swal("Success", "Changes saved successfully!", "success");

                // تحديث عدد الزبائن في المجموعة
                setGroups(prevGroups =>
                    prevGroups.map(group =>
                        group.id === selectedGroup.id
                            ? { ...group, customers_count: updatedCustomerIds.length }
                            : group
                    )
                );

                fetchGroupCustomers(selectedGroup.id);
                setSelectedCustomerIds([]); // إعادة تعيين الزبائن المحددين للإضافة
                setSelectedRemoveIds([]); // إعادة تعيين الزبائن المحددين للحذف
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
            (c.email?.toLowerCase() || "").includes(searchLower) ||
            (c.contact_number?.toLowerCase() || "").includes(searchLower) ||
            (c.company_name?.toLowerCase() || "").includes(searchLower)
        );
    });

    return (
        <div className="container my-5">
    <div className="row">
        <div className="col-md-4">
            <h4>Groups</h4>
            <ul className="list-group">
                {groups && groups.length > 0 ? (
                    groups.map(group => (
                        <li
                            key={group.id}
                            className={`list-group-item ${selectedGroup?.id === group.id ? 'bg-light' : ''}`}
                            onClick={() => handleGroupClick(group)}
                            style={{ cursor: "pointer" }}
                        >
                            {group.name} ({group.customers_count})
                        </li>
                    ))
                ) : (
                    <p className="text-muted">No groups available.</p>
                )}
            </ul>
        </div>

        <div className="col-md-8">
            {selectedGroup && (
                <>
                    <h4 className="mb-4">Manage Customers in Group: <span className="text-primary">{selectedGroup.name}</span></h4>

                    {/* قسم إضافة الزبائن */}
                    <div className="mb-5">
                        <h5 className="text-success">Add Customers to Group</h5>
                        <p className="text-muted">Select customers from the cards below to add them to the group.</p>
                        {availableCustomers.length > 0 ? (
                            <>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Search by name, email, phone, or company..."
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
                                                <p>Email: {customer.email}</p>
                                                <p>Phone: {customer.contact_number}</p>
                                                <p>Company: {customer.company_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-muted">No customers available to add to this group.</p>
                        )}
                    </div>

                    {/* قسم حذف الزبائن */}
                    <div>
                        <h5 className="text-danger">Remove Customers from Group</h5>
                        <p className="text-muted">Select customers from the table below to remove them from the group.</p>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Company</th>
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
                                                onChange={() => handleCheckboxChange(customer.id, "remove")}
                                            />
                                        </td>
                                        <td>{customer.first_name} {customer.last_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.contact_number}</td>
                                        <td>{customer.company_name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* زر الحفظ */}
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
    );
};

export default CustomerGroupsPage;