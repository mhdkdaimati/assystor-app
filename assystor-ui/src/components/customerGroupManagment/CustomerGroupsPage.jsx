import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerGroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupCustomers, setGroupCustomers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [availableCustomers, setAvailableCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAvailable, setShowAvailable] = useState(false);

    useEffect(() => {
        fetchGroups();
        fetchAllCustomers();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await axios.get('/api/customer-groups');
            if (res.status === 200) {
                setGroups(res.data.customer_group);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllCustomers = async () => {
        try {
            const res = await axios.get('/api/all-customers'); // ⚡ تحتاج تعمل اندبوينت لجميع الزبائن
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
        setShowAvailable(false);
    };

    const handleAddCustomer = async (customerId) => {
        try {
            const res = await axios.post(`/api/customer-groups/${selectedGroup.id}/assign-customers`, {
                customer_ids: [...groupCustomers.map(c => c.id), customerId],
            });
            fetchGroupCustomers(selectedGroup.id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveCustomer = async (customerId) => {
        try {
            const remainingIds = groupCustomers.map(c => c.id).filter(id => id !== customerId);
            await axios.post(`/api/customer-groups/${selectedGroup.id}/assign-customers`, {
                customer_ids: remainingIds,
            });
            fetchGroupCustomers(selectedGroup.id);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredAvailableCustomers = availableCustomers.filter(c => c.first_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="container my-5">
            {/* <h2 className="text-center mb-4">Customer Groups</h2> */}
            <div className="row">
                <div className="col-md-4">
                    <h4>Groups</h4>
                    <ul className="list-group">
                        {groups.map(group => (
                            <li key={group.id} className="list-group-item" onClick={() => handleGroupClick(group)} style={{ cursor: "pointer" }}>
                                {group.name} ({group.customers_count})
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-8">
                    {selectedGroup && (
                        <>
                            <h4>Customers in {selectedGroup.name}</h4>
                            <button className="btn btn-primary my-3" onClick={() => setShowAvailable(!showAvailable)}>
                                {showAvailable ? "Hide Available Customers" : "Show Available Customers"}
                            </button>
                            {showAvailable && (
                                <>
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Search customer..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="row">
                                        {filteredAvailableCustomers.map(customer => (
                                            <div className="col-md-4 mb-3" key={customer.id}>
                                                <div className="card p-2">
                                                    <h5>{customer.first_name}</h5>
                                                    <button className="btn btn-success btn-sm" onClick={() => handleAddCustomer(customer.id)}>Add to Group</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            <table className="table table-bordered mt-4">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupCustomers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.first_name}</td>
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
