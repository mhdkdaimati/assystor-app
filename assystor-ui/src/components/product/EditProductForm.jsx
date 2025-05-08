import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProductForm = ({ productId, onUpdate }) => {
    const [product, setProduct] = useState({ name: "", description: "" });
    const [fields, setFields] = useState([]);

    useEffect(() => {
        axios.get(`/api/get-product/${productId}`).then((res) => {
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

    const handleFieldChange = (index, key, value) => {
        const updatedFields = [...fields];
        updatedFields[index][key] = value;
        setFields(updatedFields);
    };

    const handleOptionChange = (fieldIndex, optionIndex, key, value) => {
        const updatedFields = [...fields];
        updatedFields[fieldIndex].options[optionIndex][key] = value;
        setFields(updatedFields);
    };

    const handleAddField = () => {
        setFields([...fields, { name: "", type: "text", options: [] }]);
    };

    const handleRemoveField = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    };

    const handleOptionAdd = (fieldIndex) => {
        const updatedFields = [...fields];
        const newOption = { name: "", description: "", extra_info: "" };
        updatedFields[fieldIndex].options = [...(updatedFields[fieldIndex].options || []), newOption];
        setFields(updatedFields);
    };

    const handleOptionRemove = (fieldIndex, optionIndex) => {
        const updatedFields = [...fields];
        updatedFields[fieldIndex].options.splice(optionIndex, 1);
        setFields(updatedFields);
    };

    const handleUpdate = async () => {
        try {
            const updatedProduct = {
                name: product.name,
                description: product.description,
                fields: fields.map((field) => ({
                    id: field.id || null, // Add `id` if it exists
                    name: field.name,
                    type: field.type,
                    options: field.type === "select" ? field.options : [],
                })),
            };
    
            const response = await axios.put(`/api/update-product/${productId}`, updatedProduct);
    
            swal("Success", "Product updated successfully!", "success");
    
// Call the onUpdate function if it exists
            if (onUpdate) onUpdate(response.data);
        } catch (error) {
            console.error("Error updating product:", error);
    
            swal("Error", "Failed to update product. Please try again.", "error");
        }
    };
    return (
        <div className="container">
            <h4 className="mb-3">Edit Product</h4>

            <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                />
            </div>

            <hr />

            <h5>Fields</h5>
            {fields.map((field, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                    <div className="row mb-2">
                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Field name"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                            />
                        </div>
                        <div className="col-md-5">
                            <select
                                className="form-select"
                                value={field.type}
                                onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="select">Select</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveField(index)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>

                    {field.type === "select" && (
                        <div className="mb-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary mb-2"
                                onClick={() => handleOptionAdd(index)}
                            >
                                + Add Option
                            </button>
                            {(field.options || []).map((option, optionIndex) => (
                                <div key={optionIndex} className="row align-items-end mb-2">
                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Option name"
                                            value={option.name || ""}
                                            onChange={(e) =>
                                                handleOptionChange(index, optionIndex, "name", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Description"
                                            value={option.description || ""}
                                            onChange={(e) =>
                                                handleOptionChange(index, optionIndex, "description", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Extra Info"
                                            value={option.extra_info || ""}
                                            onChange={(e) =>
                                                handleOptionChange(index, optionIndex, "extra_info", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-2 text-end">
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

            <button type="button" className="btn btn-secondary mb-3" onClick={handleAddField}>
                + Add Field
            </button>

            <div className="text-end">
                <button className="btn btn-primary" onClick={handleUpdate}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditProductForm;
