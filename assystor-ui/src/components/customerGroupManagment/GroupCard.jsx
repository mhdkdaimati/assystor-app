import React from 'react';

const GroupCard = ({ group, onViewCustomers, onAddCustomers, isSelected }) => (
  <div
    className={`card shadow-sm mb-4 ${isSelected ? 'border-primary' : ''}`} // تغيير اللون عند الاختيار
    style={{ cursor: 'pointer' }}
  >
    <div className="card-body">
      <h5 className="card-title">{group.name}</h5>
      <p className="card-text">Customers: {group.customers_count ?? 'N/A'}</p>
      <button
        onClick={() => onViewCustomers(group.id, group.name)} // إرسال اسم المجموعة إلى handler
        className="btn btn-primary btn-sm mr-2"
      >
        View Customers
      </button>
      <button
        onClick={() => onAddCustomers(group.id)} // فتح نافذة إضافة زبائن
        className="btn btn-secondary btn-sm"
      >
        Add Customers
      </button>
    </div>
  </div>
);

export default GroupCard;
