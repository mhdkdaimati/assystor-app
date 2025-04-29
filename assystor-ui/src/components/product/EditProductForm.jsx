import React, { useEffect, useState } from "react";
import axios from "axios";

function EditProductForm({ productId, onUpdated }) {
    const [product, setProduct] = useState(null);
    const [fields, setFields] = useState([]);

    useEffect(() => {
        axios.get(`/api/products/${productId}`).then(res => {
            setProduct(res.data);
            setFields(res.data.fields || []);
                    });
    }, [productId]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFieldChange = (index, e) => {
        const updated = [...fields];
        updated[index][e.target.name] = e.target.value;
        setFields(updated);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`/api/products/${productId}`, {
            ...product,
            fields
        })
            .then(() => {
                alert("Product updated!");
                onUpdated(); // إعادة تحميل القائمة
            })
            .catch(err => console.error(err));
    };

    if (!product) return <p>Loading...</p>;

    return (
        <form onSubmit={handleUpdate} className="space-y-4">
            <input
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Product Name"
                required
            />
            <textarea
                name="description"
                value={product.description || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Description"
            />
            <h4 className="font-bold mt-4">Fields</h4>
            {fields.map((field, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                    <input
                        name="name"
                        value={field.name}
                        onChange={(e) => handleFieldChange(idx, e)}
                        className="border p-2 rounded w-full"
                        placeholder="Field Name"
                        required
                    />
                    <select
                        name="type"
                        value={field.type}
                        onChange={(e) => handleFieldChange(idx, e)}
                        className="border p-2 rounded"
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                    </select>
                </div>
            ))}
            <button type="submit">
                Save Changes
            </button>
        </form>
    );
}

export default EditProductForm;
