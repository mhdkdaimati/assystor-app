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

    const handleOptionAdd = (index, optionValue) => {
        const updatedFields = [...fields];
        if (optionValue.trim() !== "") {
            updatedFields[index].options = [...updatedFields[index].options, optionValue.trim()];
            setFields(updatedFields);
        }
    };

    const handleOptionRemove = (index, optionIndex) => {
        const updatedFields = [...fields];
        updatedFields[index].options = updatedFields[index].options.filter((_, i) => i !== optionIndex);
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
            const res = await axios.post("/api/products", {
                ...product,
                fields: fields.map(field => ({
                    ...field,
                    options: field.options.join(", "), // تحويل الخيارات إلى نص مفصول بفاصلة
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
                            const input = e.target.previousSibling;
                            handleOptionAdd(index, input.value);
                            input.value = "";
                        }}
                    >
                        Add
                    </button>
                </div>
                <ul className="mt-2">
                    {field.options.map((option, optionIndex) => (
                        <li key={optionIndex} className="d-flex align-items-center">
                            {option}
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

                <button type="submit" className="btn btn-success w-100">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;