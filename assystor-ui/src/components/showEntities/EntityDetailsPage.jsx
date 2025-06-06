import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, DropdownButton } from "react-bootstrap";
import DataTable from "react-data-table-component";

export default function EntityDetailsPage({ entity, customers, onBack }) {
    const [entityValues, setEntityValues] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [search, setSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState({});

    useEffect(() => {
        if (entity) {
            axios.get(`/api/entity-field-values/by-entity?entity_id=${entity.id}`).then(res => {
                setEntityValues(res.data);
            });
        }
    }, [entity]);

    const getUniqueValues = (fieldName) => {
        let values = [];
        entityValues.forEach(row => {
            let val = row[fieldName];
            if (val === undefined || val === null || val === "") return;
            // if the value is jason(array)
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) {
                    values = values.concat(parsed);
                    return;
                }
            } catch { /* not Jason */ }
            values.push(val);
        });
        // Remove duplicates
        return [...new Set(values)];
    };

    const filteredData = entityValues.filter(row => {
        const rowString = Object.values(row).join(" ").toLowerCase();
        if (search && !rowString.includes(search.toLowerCase())) return false;

        for (const key in columnFilters) {
            if (columnFilters[key]?.length > 0) {
                let cellValue = row[key];
                let matched = false;
                // Try to convert the value to an array if it is Jason
                try {
                    const parsed = JSON.parse(cellValue);
                    if (Array.isArray(parsed)) {
                        matched = parsed.some(val => columnFilters[key].includes(val));
                    } else {
                        matched = columnFilters[key].includes(cellValue);
                    }
                } catch {
                    matched = columnFilters[key].includes(cellValue);
                }
                if (!matched) return false;
            }
        }
        return true;
    });
    // Setting up columns
    const baseColumns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            width: "80px",
        },
        {
            name: "Customer",
            selector: row => row.customer_name || row.customer_id,
            sortable: true,
            width: "200px",
        },
        // {
        //     name: "Customer contact number",
        //     selector: row => row.customer_contact_number || row.customer_id,
        //     sortable: true,
        //     width: "200px",
        // },
        ...entity.fields.map(field => ({
            name: field.label,
            selector: row => {
                let value = row[field.name];
                // If the field type is checkbox
                if (field.type === "checkbox") {
                    let arr = [];
                    try {
                        arr = JSON.parse(value);
                    } catch {
                        arr = typeof value === "string" ? [value] : [];
                    }
                    if (Array.isArray(arr) && arr.length > 0) {
                        return (
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {arr.map((v, i) => <li key={i}>{v}</li>)}
                            </ul>
                        );
                    } else {
                        return <span className="text-muted">-</span>;
                    }
                }
                // Other types
                return value || <span className="text-muted">-</span>;
            },
            sortable: true,
            width: "180px",
        }))
    ];

    // Synchronized filter component with columns using CSS Grid
    const FilterRow = () => {
        const [filterSearch, setFilterSearch] = useState({}); // To store the text to be searched within the Dropdown for each column

        return (
            <div
                className="filter-row mb-2"
                style={{
                    display: "grid",
                    gridTemplateColumns: baseColumns.map(col => col.width || "180px").join(" "),
                    gap: "8px",
                    padding: "8px 0"
                }}
            >
                {baseColumns.map((col, idx) => {
                    const fieldName = idx === 0 ? null : idx === 1 ? "customer_name" : entity.fields[idx - 2]?.name;
                    if (!fieldName) return <div key={idx}></div>;

                    const uniqueValues = getUniqueValues(fieldName);
                    const searchValue = filterSearch[fieldName] || "";

                    const isActive = columnFilters[fieldName]?.length > 0;

                    return (
                        <DropdownButton
                            key={idx}
                            id={`dropdown-${fieldName}-filter`}
                            title="Filter"
                            variant={isActive ? "primary" : "outline-secondary"} // Different color when activated
                            size="sm"
                        >
                            <div className="px-2 py-1">
                                <Form.Control
                                    size="sm"
                                    placeholder="Search filter..."
                                    value={searchValue}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setFilterSearch(prev => ({ ...prev, [fieldName]: value }));
                                    }}
                                />
                            </div>
                            <div className="px-2 py-1" style={{ maxHeight: 200, overflowY: "auto" }}>
                                {uniqueValues
                                    .filter(val => val.toLowerCase().includes(searchValue.toLowerCase()))
                                    .map(val => (
                                        <Form.Check
                                            key={val}
                                            type="checkbox"
                                            label={val}
                                            checked={columnFilters[fieldName]?.includes(val) || false}
                                            onChange={e => {
                                                const checked = e.target.checked;
                                                setColumnFilters(prev => {
                                                    const prevArr = prev[fieldName] || [];
                                                    return {
                                                        ...prev,
                                                        [fieldName]: checked
                                                            ? [...prevArr, val]
                                                            : prevArr.filter(v => v !== val)
                                                    };
                                                });
                                            }}
                                        />
                                    ))}
                            </div>
                            {isActive && (
                                <div className="px-2 py-1">
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() =>
                                            setColumnFilters(prev => {
                                                const newFilters = { ...prev };
                                                delete newFilters[fieldName];
                                                return newFilters;
                                            })
                                        }
                                    >
                                        Reset Filter
                                    </Button>
                                </div>
                            )}
                        </DropdownButton>
                    );
                })}
            </div>
        );
    };

    // Modal - Add New Entity Values
    const handleAdd = () => {
        setFieldValues({});
        setSelectedCustomer("");
        setShowAdd(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        await axios.post("/api/field-values/bulk", {
            customer_id: selectedCustomer,
            entity_id: entity.id,
            fields: fieldValues
        });
        setShowAdd(false);
        axios.get(`/api/entity-field-values/by-entity?entity_id=${entity.id}`).then(res => {
            setEntityValues(res.data);
        });
    };

    return (
        <div className="container py-4">
            <Button variant="link" onClick={onBack} className="p-0 mb-3">&larr; Back</Button>
            <h3>{entity.name}</h3>
            <div className="text-muted mb-3">{entity.description}</div>
            <Button onClick={handleAdd} className="mb-3">+ Add Value</Button>

            <div className="mb-3" style={{ maxWidth: 320 }}>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Modal لإضافة قيمة */}
            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Value</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Customer</Form.Label>
                            <Form.Select
                                value={selectedCustomer}
                                onChange={e => setSelectedCustomer(e.target.value)}
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.first_name} {c.last_name} ({c.email})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        {entity.fields.map(field => (
                            <Form.Group className="mb-3" key={field.id}>
                                <Form.Label>{field.label}</Form.Label>
                                {field.type === "select" ? (
                                    <Form.Select
                                        required={field.required}
                                        value={fieldValues[field.id] || ""}
                                        onChange={e => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                                    >
                                        <option value="">Choose</option>
                                        {field.options.map(opt => (
                                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                                        ))}
                                    </Form.Select>
                                ) : field.type === "checkbox" ? (
                                    <div>
                                        {field.options.map(opt => (
                                            <Form.Check
                                                key={opt.id}
                                                type="checkbox"
                                                label={opt.name}
                                                value={opt.name}
                                                checked={Array.isArray(fieldValues[field.id]) && fieldValues[field.id].includes(opt.name)}
                                                onChange={e => {
                                                    const checked = e.target.checked;
                                                    const prev = Array.isArray(fieldValues[field.id]) ? fieldValues[field.id] : [];
                                                    setFieldValues({
                                                        ...fieldValues,
                                                        [field.id]: checked
                                                            ? [...prev, opt.name]
                                                            : prev.filter(v => v !== opt.name)
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Form.Control
                                        type={field.type}
                                        required={field.required}
                                        value={fieldValues[field.id] || ""}
                                        onChange={e => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                                    />
                                )}
                            </Form.Group>
                        ))}
                        <div className="text-end">
                            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" className="ms-2">Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* الجدول */}
            <div className="table-responsive" style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee", padding: 16 }}>
                <FilterRow />
                <DataTable
                    columns={baseColumns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    persistTableHead
                    noHeader
                    noDataComponent={
                        <div className="text-center text-muted py-4">
                            No data found.
                        </div>
                    }
                />
            </div>
        </div>
    );
}
