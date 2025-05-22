// ...existing imports...
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Card, Modal, ListGroup } from "react-bootstrap";

function EntityPage() {
  const [entities, setEntities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEntity, setEditEntity] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [fields, setFields] = useState([{ name: "", label: "", type: "text", required: false, options: [] }]);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = () => {
    axios.get("/api/entities").then(res => setEntities(res.data));
  };

  // فتح المودال للإضافة أو التعديل
  const openModal = (entity = null) => {
    setEditEntity(entity);
    if (entity) {
      setForm({ name: entity.name, description: entity.description || "" });
      // جلب الحقول من الـ API إذا أردت التعديل
      axios.get(`/api/entities/${entity.id}`).then(res => {
        setFields(
          (res.data.fields || []).map(f => ({
            ...f,
            options: f.options || []
          }))
        );
      });
    } else {
      setForm({ name: "", description: "" });
      setFields([{ name: "", label: "", type: "text", required: false, options: [] }]);
    }
    setShowModal(true);
  };

  // تغيير بيانات الحقل
  const handleFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFields = [...fields];
    updatedFields[index][name] = type === "checkbox" ? checked : value;
    setFields(updatedFields);
  };

  // تغيير بيانات خيار الحقل
  const handleOptionChange = (fieldIndex, optionIndex, e) => {
    const { name, value } = e.target;
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex][name] = value;
    setFields(updatedFields);
  };

  // إضافة خيار جديد لحقل
  const handleOptionAdd = (fieldIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.push({ name: "", description: "", extra_info: "" });
    setFields(updatedFields);
  };

  // حذف خيار من حقل
  const handleOptionRemove = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options = updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setFields(updatedFields);
  };

  // إضافة حقل جديد
  const addField = () => {
    setFields([...fields, { name: "", label: "", type: "text", required: false, options: [] }]);
  };

  // حذف حقل
  const handleRemoveField = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  // حفظ (إضافة أو تعديل)
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      fields: fields.map(field => ({
        ...field,
        options: (field.type === "select" || field.type === "radio") ? field.options : []
      }))
    };
    if (editEntity) {
      await axios.put(`/api/entities/${editEntity.id}`, payload);
    } else {
      await axios.post("/api/entities", payload);
    }
    setShowModal(false);
    fetchEntities();
  };

  // حذف كيان
  const handleDelete = (id) => {
    if (window.confirm("Delete this entity?")) {
      axios.delete(`/api/entities/${id}`).then(fetchEntities);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Entities</h4>
            <Button onClick={() => openModal()}>Add Entity</Button>
          </div>
          <ListGroup>
            {entities.map(entity => (
              <ListGroup.Item key={entity.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{entity.name}</strong>
                  {entity.description && <span className="text-muted ms-2">{entity.description}</span>}
                </div>
                <div>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openModal(entity)}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(entity.id)}>Delete</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Modal لإضافة/تعديل كيان مع الحقول وخياراتها */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editEntity ? "Edit Entity" : "Add Entity"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>

            <h5 className="text-secondary mb-3">Fields</h5>
            {fields.map((field, index) => (
              <div className="border p-3 mb-4 rounded" key={index}>
                <div className="row mb-2">
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Field name"
                      value={field.name}
                      onChange={e => handleFieldChange(index, e)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      name="label"
                      placeholder="Field label"
                      value={field.label}
                      onChange={e => handleFieldChange(index, e)}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select"
                      name="type"
                      value={field.type}
                      onChange={e => handleFieldChange(index, e)}
                      required
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                      <option value="radio">Radio</option>
                    </select>
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      label="Required"
                      name="required"
                      checked={field.required}
                      onChange={e => handleFieldChange(index, e)}
                    />
                  </div>
                  <div className="col-md-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemoveField(index)}
                      >
                        Remove Field
                      </button>
                    )}
                  </div>
                </div>
                {(field.type === "select" || field.type === "radio") && (
                  <div>
                    <div className="mb-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleOptionAdd(index)}
                      >
                        + Add Option
                      </button>
                    </div>
                    {field.options.map((option, optionIndex) => (
                      <div className="row mb-2" key={optionIndex}>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Option Name"
                            value={option.name}
                            onChange={e => handleOptionChange(index, optionIndex, e)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            placeholder="Option Description"
                            value={option.description}
                            onChange={e => handleOptionChange(index, optionIndex, e)}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            name="extra_info"
                            placeholder="Extra Info"
                            value={option.extra_info}
                            onChange={e => handleOptionChange(index, optionIndex, e)}
                          />
                        </div>
                        <div className="col-md-1 d-flex align-items-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleOptionRemove(index, optionIndex)}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mb-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addField}
              >
                + Add Field
              </button>
            </div>
            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editEntity ? "Save Changes" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EntityPage;