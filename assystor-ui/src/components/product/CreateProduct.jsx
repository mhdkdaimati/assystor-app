import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate, Link } from "react-router-dom";

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
    });

    const [fields, setFields] = useState([
        { name: "", type: "text", options: [] }
    ]);

    const handleFieldChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFields = [...fields];
        updatedFields[index][name] = value;
        setFields(updatedFields);
    };

    const handleOptionChange = (fieldIndex, optionIndex, e) => {
        const { name, value } = e.target;
        const updatedFields = [...fields];
        updatedFields[fieldIndex].options[optionIndex][name] = value;
        setFields(updatedFields);
    };

    const handleOptionAdd = (index) => {
        const updatedFields = [...fields];
        updatedFields[index].options.push({ name: "", description: "", extra_info: "" });
        setFields(updatedFields);
    };

    const handleOptionRemove = (fieldIndex, optionIndex) => {
        const updatedFields = [...fields];
        updatedFields[fieldIndex].options = updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
        setFields(updatedFields);
    };

    const addField = () => {
        setFields([...fields, { name: "", type: "text", options: [] }]);
    };

    const handleRemoveField = (index) => {
        if (fields.length > 1) {
            setFields(fields.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/store-product`, {
                ...product,
                fields: fields.map(field => ({
                    ...field,
                    options: field.type === "select" ? field.options : null,  // Only include options if the field type is 'select'
                })),
            });

            swal("Product created!", "Your product has been successfully created.", "success");
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                swal("Error", errorMessages, "error");
            } else {
                swal("Error", "Something went wrong.", "error");
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Create New Product</h2>
                <Link to="/product-page" className="btn btn-secondary">
                    <i className="bi bi-arrow-left me-1"></i> Back
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-4">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        id="productName"
                        className="form-control"
                        type="text"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="productDescription" className="form-label">Description</label>
                    <textarea
                        id="productDescription"
                        className="form-control"
                        placeholder="Enter product description"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        rows="4"
                        required
                    />
                </div>

                <h5 className="text-secondary mb-3">Fields</h5>

                {fields.map((field, index) => (
                    <div className="border p-3 mb-4 rounded" key={index}>
                        <div className="row mb-2">
                            <div className="col-md-4">
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

                            <div className="col-md-3">
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

                            <div className="col-md-2">
                                {index > 0 && (
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

                        {field.type === "select" && (
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
                                                onChange={(e) => handleOptionChange(index, optionIndex, e)}
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
                                                onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="extra_info"
                                                placeholder="Extra Info"
                                                value={option.extra_info}
                                                onChange={(e) => handleOptionChange(index, optionIndex, e)}
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

                <button type="submit" className="btn btn-success w-100">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;
