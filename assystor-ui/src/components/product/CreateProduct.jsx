import React, { useState } from "react";
import axios from "axios";

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
            swal("Product created!");
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                swal(errorMessages);
            }
            
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Product name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />

                <h5>Fields</h5>
                {fields.map((field, index) => (
                    <div className="row mb-2" key={index}>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Field name"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, e)}
                            />
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                name="type"
                                value={field.type}
                                onChange={(e) => handleFieldChange(index, e)}
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                            </select>
                        </div>
                        <div className="col-auto">
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
                <button
                    type="button"
                    className="btn btn-outline-primary mb-3"
                    onClick={addField}
                >
                    + Add Field
                </button>

                <br />
                <button type="submit" className="btn btn-success w-100">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;
