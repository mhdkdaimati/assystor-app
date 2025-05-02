import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
    });

    const [fields, setFields] = useState([
        { name: "", type: "text" }
    ]);

    const handleFieldChange = (index, e) => {
        const newFields = [...fields];
        newFields[index][e.target.name] = e.target.value;
        setFields(newFields);
    };

    const addField = () => {
        setFields([...fields, { name: "", type: "text" }]);
    };

    const handleRemoveField = (index) => {
        if (fields.length > 1) {
            const newFields = fields.filter((_, i) => i !== index);
            setFields(newFields);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/products", {
                ...product,
                fields: fields
            });
            swal("Product created!", "Your product has been successfully created.", "success");
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                swal("Error", errorMessages, "error");
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
                    <div className="row mb-3 align-items-center" key={index}>
                        <div className="col-md-5">
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
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                name="type"
                                value={field.type}
                                onChange={(e) => handleFieldChange(index, e)}
                                required
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                            </select>
                        </div>
                        <div className="col-md-3 text-end">
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveField(index)}
                                >
                                    Remove
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