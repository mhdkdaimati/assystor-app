import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerGroupsTab from './CustomerGroupsTab';
import ProductsTab from './ProductsTab';
import EntityTab from './EntityTab';

const CustomerTabs = ({ activeTab, setActiveTab, customerId }) => {
  const [entityTypes, setEntityTypes] = useState([]);
  const [entityData, setEntityData] = useState({});
  const [loadingTab, setLoadingTab] = useState(false);

  // جلب أنواع الـ entity عند أول تحميل
  useEffect(() => {
    axios.get('/api/entity-types').then(res => {
      setEntityTypes(res.data || []);
    });
  }, []);

  // جلب بيانات التاب عند تغييره
  useEffect(() => {
    if (activeTab === "products" || activeTab === "customerGroups") return;
    const entity = entityTypes.find(e => e.name === activeTab);
    if (entity) {
      setLoadingTab(true);
      axios
.get(`/api/customer-entities/${customerId}/${entity.id}`)
        .then(res => {
          setEntityData(prev => ({
            ...prev,
            [entity.name]: res.data || []
          }));
          setLoadingTab(false);
        })
        .catch(() => setLoadingTab(false));
    }
  }, [activeTab, customerId, entityTypes]);

  return (
    <>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button
          className={`btn btn${activeTab === "customerGroups" ? "" : "-outline"}-primary`}
          onClick={() => setActiveTab("customerGroups")}
        >
          Customer Groups
        </button>
        <button
          className={`btn btn${activeTab === "products" ? "" : "-outline"}-info`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        {entityTypes.map(entity => (
          <button
            key={entity.id}
            className={`btn btn${activeTab === entity.name ? "" : "-outline"}-dark`}
            onClick={() => setActiveTab(entity.name)}
          >
            {entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "customerGroups" && (
          <CustomerGroupsTab customerId={customerId} />
        )}
        {activeTab === "products" && (
          <ProductsTab customerId={customerId} />
        )}
        {entityTypes.map(entity =>
          activeTab === entity.name && (
            <EntityTab
    key={entity.id}
    entity={entity}
    loading={loadingTab}
    entityData={entityData[entity.name]}
    customerId={customerId}
    entityId={entity.id}
/>)
        )}
      </div>
    </>
  );
};

export default CustomerTabs;