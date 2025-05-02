import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function EditProductForm({ productId, onUpdated }) {
    const [product, setProduct] = useState({
        name: "",
        description: "",
    });
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
        const updatedFields = [...fields];
        updatedFields[index][e.target.name] = e.target.value;
        setFields(updatedFields);
    };

    const addField = () => {
        setFields([...fields, { name: "", type: "text" }]);
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
            await axios.put(`/api/products/${productId}`, {
                ...product,
                fields,
            });
            swal("Product updated!", "Your product has been successfully updated.", "success");
            onUpdated(); // إعادة تحميل القائمة
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                swal("Error", errorMessages, "error");
            }
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Edit Product</h2>
                <Link to="/product-page" className="btn btn-secondary">
                    <i className="bi bi-arrow-left me-1"></i> Back
                </Link>
            </div>

            <form onSubmit={handleUpdate} className="shadow p-4 rounded bg-light">
                <div className="mb-4">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        id="productName"
                        className="form-control"
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="productDescription" className="form-label">Description</label>
                    <textarea
                        id="productDescription"
                        className="form-control"
                        name="description"
                        placeholder="Enter product description"
                        value={product.description}
                        onChange={handleChange}
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

                <button type="submit" className="btn btn-success w-100">Save Changes</button>
            </form>
        </div>
    );
}

export default EditProductForm;