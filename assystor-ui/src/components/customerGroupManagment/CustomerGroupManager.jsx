import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerGroupManager = () => {
  const [customers, setCustomers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب الزبائن والمجموعات
  useEffect(() => {
    axios.get('/api/all-customers').then(res => setCustomers(res.data.customer));
    axios.get('/api/all-customer-groups').then(res => setGroups(res.data.customer_group));
  }, []);

  // جلب الزبائن المرتبطين بالمجموعة المحددة
  useEffect(() => {
    if (selectedGroupId) {
      axios.get(`/api/all-customer-groups/${selectedGroupId}/customers`)
        .then(res => setAssignedCustomers(res.data));
    }
  }, [selectedGroupId]);

  const handleGroupChange = (e) => {
    setSelectedGroupId(e.target.value);
  };

  const toggleCustomer = (customerId) => {
    setAssignedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const saveChanges = async () => {
    setLoading(true);
    await axios.post(`/api/customer-groups/${selectedGroupId}/assign-customers`, {
      customer_ids: assignedCustomers.map(c => typeof c === 'object' ? c.id : c),
    });

    setLoading(false);
    swal('Updated','','success');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage customer and customer groups</h2>
      <p className="mb-4">Select a group and assign customers to it.</p>
      <div className="mb-4">
        <label className="font-medium">Select group</label>
        <select value={selectedGroupId || ''} onChange={handleGroupChange} className="ml-2 border px-2 py-1">
          <option value="">Select group</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      {selectedGroupId && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {customers.map(customer => (
              <label key={customer.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assignedCustomers.includes(customer.id)}
                  onChange={() => toggleCustomer(customer.id)}
                />
                {customer.first_name} {customer.last_name}
              </label>
            ))}
          </div>

          <button
            className="mt-4 px-4 py-2 rounded"
            onClick={saveChanges}
            disabled={loading}
          >
            {loading ? '...' : 'Save'}
          </button>
        </>
      )}
    </div>
  );
};

export default CustomerGroupManager;
