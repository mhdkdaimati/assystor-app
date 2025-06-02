import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const CustomerGroupsTab = ({ customerId }) => {
  const [groups, setGroups] = useState([]);
  const [history, setHistory] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [quarantineInfo, setQuarantineInfo] = useState(null);
  const [showQuarantineModal, setShowQuarantineModal] = useState(false);
  const [quarantineReason, setQuarantineReason] = useState("");
  const [quarantineLoading, setQuarantineLoading] = useState(false);

  // جلب بيانات التاب
  const fetchGroups = async () => {
    setLoading(true);
    const [allGroupsRes, customerGroupsRes, historyRes, quarantineRes] = await Promise.all([
      axios.get('/api/customer-groups'),
      axios.get(`/api/customers/${customerId}/groups`),
      axios.get(`/api/get-customer-history/${customerId}`),
      axios.get(`/api/quarantines/check/${customerId}`)
    ]);
    const all = allGroupsRes.data.customer_groups || [];
    const userGroups = customerGroupsRes.data.groups || [];
    setGroups(userGroups);
    setAllGroups(all);
    setHistory(historyRes.data || []);
    setLoading(false);
    // حساب المجموعات المتاحة للإضافة
    const userGroupIds = userGroups.map(g => g.id);
    setAvailableGroups(all.filter(g => !userGroupIds.includes(g.id)));
    // بيانات الحظر
    if (quarantineRes.data) {
      setQuarantineInfo({
        quarantined: quarantineRes.data.quarantined,
        reason: quarantineRes.data.reason,
        addedBy: quarantineRes.data.added_by,
        createdAt: quarantineRes.data.created_at,
      });
    } else {
      setQuarantineInfo(null);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, [customerId]);

  // حذف زبون من مجموعة
  const handleRemoveFromGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to remove this customer from the group?")) return;
    try {
      await axios.post(`/api/customer-groups/${groupId}/remove-customer`, { customer_id: customerId });
      fetchGroups();
    } catch {
      alert("Error removing customer from group");
    }
  };

  // إضافة زبون لمجموعة
  const handleAddToGroup = async () => {
    if (!selectedGroupId) return;
    await axios.post(`/api/customer-groups/${selectedGroupId}/add-customer`, { customer_id: customerId });
    setShowAddToGroupModal(false);
    setSelectedGroupId("");
    fetchGroups();
  };

  // إضافة الزبون للحجر
  const handleAddToQuarantine = async () => {
    setQuarantineLoading(true);
    try {
      await axios.post('/api/quarantines/bulk', {
        customer_ids: [customerId],
        reason: quarantineReason
      });
      setShowQuarantineModal(false);
      setQuarantineReason("");
      fetchGroups();
    } catch {
      alert("Error sending to quarantine");
    }
    setQuarantineLoading(false);
  };

  // إزالة الزبون من الحجر
  const handleRemoveFromQuarantine = async () => {
    setQuarantineLoading(true);
    try {
      await axios.post('/api/quarantines/bulk-delete', {
        customer_ids: [customerId]
      });
      fetchGroups();
    } catch {
      alert("Error removing from quarantine");
    }
    setQuarantineLoading(false);
  };

  return (
    <div>
      <h5>Current customer groups</h5>
      {quarantineInfo?.quarantined === true && (
        <div className="alert alert-danger">
          Customer blocked by: <b>{quarantineInfo.addedBy || "Unknown"}</b><br />
          Reason: <b>{quarantineInfo.reason || "No reason"}</b><br />
          Ban date: <b>{quarantineInfo.createdAt}</b>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : groups.length === 0 ? (
        <div className="text-muted">There are no groups for this customer.</div>
      ) : (
        <table className="table table-bordered table-sm align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Group Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, idx) => (
              <tr key={group.id}>
                <td>{idx + 1}</td>
                <td>{group.name}</td>
                <td>{group.status}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveFromGroup(group.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="my-3">
        {quarantineInfo?.quarantined ? (
          <Button
            variant="success"
            onClick={handleRemoveFromQuarantine}
            disabled={quarantineLoading}
          >
            {quarantineLoading ? "Removing..." : "Remove Customer from Quarantine"}
          </Button>
        ) : (
          <Button
            variant="danger"
            onClick={() => setShowQuarantineModal(true)}
            disabled={quarantineInfo?.quarantined}
          >
            Add Customer to Quarantine
          </Button>
        )}
        {!quarantineInfo?.quarantined && (
          <div className="my-3">
            <Button
              variant="primary"
              onClick={() => setShowAddToGroupModal(true)}
              disabled={availableGroups.length === 0}
            >
              Add Customer to Group
            </Button>
          </div>
        )}
        {/* مودال إضافة لمجموعة */}
        <Modal show={showAddToGroupModal} onHide={() => setShowAddToGroupModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Customer to Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Select Group</Form.Label>
                <Form.Select
                  value={selectedGroupId}
                  onChange={e => setSelectedGroupId(e.target.value)}
                >
                  <option value="">Select group...</option>
                  {availableGroups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddToGroupModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddToGroup}
              disabled={!selectedGroupId}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <h5 className="mt-4">Customer Groups History</h5>
      {loading ? (
        <div>Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-muted">No group history for this customer.</div>
      ) : (
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Group Name</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.group?.name || "-"}</td>
                <td>{item.status}</td>
                <td>{item.comment}</td>
                <td>{item.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* مودال سبب الحظر */}
      <Modal show={showQuarantineModal} onHide={() => setShowQuarantineModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer to Quarantine</Modal.Title>
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
                placeholder="Enter reason for quarantine"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuarantineModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleAddToQuarantine}
            disabled={quarantineLoading}
          >
            {quarantineLoading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerGroupsTab;