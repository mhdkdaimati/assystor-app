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
    };

    const handleAddCustomer = async (customerId) => {
        try {
            const res = await axios.post(`/api/customer-groups/${selectedGroup.id}/assign-customers`, {
                customer_ids: [...groupCustomers.map(c => c.id), customerId],
            });
            if (res.status === 200) {
                swal("Success", "Customer added to group successfully!", "success");

                // تحديث عدد الزبائن في المجموعة
                setGroups(prevGroups =>
                    prevGroups.map(group =>
                        group.id === selectedGroup.id
                            ? { ...group, customers_count: group.customers_count + 1 }
                            : group
                    )
                );

                fetchGroupCustomers(selectedGroup.id);
            }
        } catch (error) {
            swal("Error", "Failed to add customer to group.", "error");
            console.error(error);
        }
    };

    const handleRemoveCustomer = async (customerId) => {
        try {
            const remainingIds = groupCustomers.map(c => c.id).filter(id => id !== customerId);
            const res = await axios.post(`/api/customer-groups/${selectedGroup.id}/assign-customers`, {
                customer_ids: remainingIds,
            });
            if (res.status === 200) {
                swal("Success", "Customer removed from group successfully!", "success");

                // تحديث عدد الزبائن في المجموعة
                setGroups(prevGroups =>
                    prevGroups.map(group =>
                        group.id === selectedGroup.id
                            ? { ...group, customers_count: group.customers_count - 1 }
                            : group
                    )
                );

                fetchGroupCustomers(selectedGroup.id);
            }
        } catch (error) {
            swal("Error", "Failed to remove customer from group.", "error");
            console.error(error);
        }
    };
    const filteredAvailableCustomers = availableCustomers.filter(c => {
        const searchLower = searchTerm.toLowerCase();
        return (
            c.first_name.toLowerCase().includes(searchLower) ||
            c.last_name.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.contact_number.toLowerCase().includes(searchLower) ||
            (c.company_name && c.company_name.toLowerCase().includes(searchLower))
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
            <h4>Customers in {selectedGroup.name}</h4>
            {availableCustomers.length > 0 ? (
                <>
                    {filteredAvailableCustomers.length > 0 || searchTerm === '' ? (
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
                                        <div className="card p-2">
                                            <h5>{customer.first_name} {customer.last_name}</h5>
                                            <p>Email: {customer.email}</p>
                                            <p>Phone: {customer.contact_number}</p>
                                            <p>Company: {customer.company_name || 'N/A'}</p>
                                            <button className="btn btn-success btn-sm" onClick={() => handleAddCustomer(customer.id)}>Add to Group</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-muted">No customers available to add to this group.</p>
                    )}
                </>
            ) : (
                <p className="text-muted">No customers available to add to this group.</p>
            )}
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {groupCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.first_name} {customer.last_name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.contact_number}</td>
                            <td>{customer.company_name || 'N/A'}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveCustomer(customer.id)}>Remove from Group</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )}
</div>



            </div>
        </div>
    );
};

export default CustomerGroupsPage;