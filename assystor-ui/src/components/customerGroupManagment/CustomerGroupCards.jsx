import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GroupCard from './GroupCard'; // تأكد من استيراد GroupCard

const CustomerGroupCards = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState(""); // لتخزين اسم المجموعة المختارة
  const [showModal, setShowModal] = useState(false); // للتحكم في ظهور نافذة إضافة الزبائن
  const [availableCustomers, setAvailableCustomers] = useState([]); // لتخزين الزبائن المتاحين للاختيار
  const [selectedCustomers, setSelectedCustomers] = useState([]); // الزبائن المختارين لإضافتهم

  // جلب بيانات المجموعات
  useEffect(() => {
    axios.get('/api/customer-groups').then(res => setGroups(res.data.customer_group));
    axios.get('/api/all-customers') // جلب كل الزبائن المتاحين
      .then(res => setAvailableCustomers(res.data));
  }, []);

  // عرض الزبائن في المجموعة المحددة
  const handleViewCustomers = (groupId, groupName) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName); // تعيين اسم المجموعة
    axios.get(`/api/customer-groups/${groupId}/customers`)
      .then(res => setCustomers(res.data));
  };

  // فتح نافذة إضافة الزبائن
  const handleAddCustomers = (groupId) => {
    setSelectedGroupId(groupId); // تعيين المجموعة المستهدفة
    setShowModal(true); // إظهار نافذة إضافة الزبائن
  };

  // اختيار الزبائن
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers(prevState => 
      prevState.includes(customerId) 
        ? prevState.filter(id => id !== customerId) 
        : [...prevState, customerId]
    );
  };

  // حفظ الزبائن في المجموعة
  const handleSaveCustomers = () => {
    axios.post(`/api/customer-groups/${selectedGroupId}/assign-customers`, { customer_ids: selectedCustomers })
      .then(res => {
        if (res.status === 200) {
          alert('Customers added successfully!');
          setShowModal(false);
          setSelectedCustomers([]); // إعادة تعيين الزبائن المختارين
          // يمكنك إعادة تحميل الزبائن في المجموعة إذا أردت
          axios.get(`/api/customer-groups/${selectedGroupId}/customers`)
            .then(res => setCustomers(res.data));
        }
      })
      .catch(err => {
        alert('Error adding customers');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Customer Groups</h2>

      {/* Group Cards */}
      <div className="row">
        {groups.map(group => (
          <div key={group.id} className="col-md-4">
            <GroupCard 
              group={group} 
              onViewCustomers={handleViewCustomers} 
              onAddCustomers={handleAddCustomers} // تمرير دالة إضافة الزبائن
              isSelected={selectedGroupId === group.id} 
            />
          </div>
        ))}
      </div>

      {/* Customers in Selected Group */}
      {selectedGroupId && (
        <div className="mt-5">
          <h3 className="mb-3">Customers in <b>{selectedGroupName}</b></h3>
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>{index + 1}</td>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding Customers */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Customers to Group</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h6>Select customers to add</h6>
                <div className="form-check">
                  {availableCustomers.map(customer => (
                    <div key={customer.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={customer.id}
                        onChange={() => handleCustomerSelect(customer.id)}
                        checked={selectedCustomers.includes(customer.id)}
                      />
                      <label className="form-check-label">{customer.first_name} {customer.last_name}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveCustomers}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerGroupCards;
