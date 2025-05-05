import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

function EditProductForm({ productId, onUpdated, onCancel }) {
    const [product, setProduct] = useState({ name: "", description: "" });
    const [fields, setFields] = useState([]);

    useEffect(() => {
        axios.get(`/api/products/${productId}`).then((res) => {
            setProduct({
                name: res.data.name,
                description: res.data.description,
            });
            setFields(res.data.fields || []);
        });
    }, [productId]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFieldChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFields = [...fields];
        updatedFields[index][name] = value;

        if (name === "type" && value !== "select") {
            updatedFields[index].options = [];
        }

        setFields(updatedFields);
    };

    const handleOptionAdd = (index, optionValue) => {
        if (optionValue.trim() === "") return;
        const updatedFields = [...fields];
        const currentOptions = Array.isArray(updatedFields[index].options)
            ? updatedFields[index].options
            : (updatedFields[index].options || "").split(",").map(opt => opt.trim());

        updatedFields[index].options = [...currentOptions, optionValue.trim()];
        setFields(updatedFields);
    };

    const handleOptionRemove = (index, optionIndex) => {
        const updatedFields = [...fields];
        let currentOptions = updatedFields[index].options;

        if (!Array.isArray(currentOptions)) {
            currentOptions = typeof currentOptions === "string"
                ? currentOptions.split(",").map(opt => opt.trim())
                : [];
        }

        updatedFields[index].options = currentOptions.filter((_, i) => i !== optionIndex);
        setFields(updatedFields);
    };

    const addField = () => {
        setFields([...fields, { name: "", type: "text", options: [] }]);
    };

    const handleRemoveField = (index) => {
        if (fields.length > 1) {
            const updatedFields = fields.filter((_, i) => i !== index);
            setFields(updatedFields);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...product,
                fields: fields.map(field => ({
                    name: field.name,
                    type: field.type,
                    options: field.type === "select" && Array.isArray(field.options)
                        ? field.options.join(", ")
                        : "",
                })),
            };

            await axios.put(`/api/products/${productId}`, payload);
            swal("Success", "Product updated successfully!", "success");
            if (onUpdated) onUpdated();
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                swal("Validation Error", errorMessages, "error");
            } else {
                swal("Error", "Something went wrong while updating the product.", "error");
            }
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Edit Product</h2>
                <button
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    <i className="bi bi-arrow-left me-1"></i> Cancel
                </button>
            </div>

            <form onSubmit={handleUpdate} className="shadow p-4 rounded bg-light">
                <div className="mb-4">
                    <label className="form-label">Product Name</label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                <h5 className="text-secondary mb-3">Fields</h5>
                {fields.map((field, index) => (
                    <div className="row mb-3 align-items-start" key={index}>
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Field name"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, e)}
                                required
                            />
                        </div>

                        <div className="col-md-3 mb-2">
                            <select
                                className="form-select"
                                name="type"
                                value={field.type}
                                onChange={(e) => handleFieldChange(index, e)}
                                required
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="select">Select</option>
                            </select>
                        </div>

                        {field.type === "select" && (
                            <div className="col-md-5 mb-2">
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Add option"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleOptionAdd(index, e.target.value);
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={(e) => {
                                            const input = e.target.closest('.d-flex').querySelector("input");
                                            handleOptionAdd(index, input.value);
                                            input.value = "";
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <ul className="mt-2 list-unstyled">
                                    {(Array.isArray(field.options) ? field.options : field.options?.split(",") || []).map((option, optionIndex) => (
                                        <li key={optionIndex} className="d-flex align-items-center">
                                            <span>{option.trim()}</span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger ms-2"
                                                onClick={() => handleOptionRemove(index, optionIndex)}
                                            >
                                                &times;
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="col-md-1 text-end">
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveField(index)}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
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

                <button type="submit" className="btn btn-success w-100">Save Changes</button>
            </form>
        </div>
    );
}

export default EditProductForm;