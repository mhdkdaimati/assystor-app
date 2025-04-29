import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductList({ onEdit }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("/api/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            axios.delete(`/api/products/${id}`)
                .then(() => {
                    setProducts(products.filter(p => p.id !== id));
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="space-y-4">
            {products.map(product => (
                <div key={product.id} className="p-4 border rounded shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => onEdit(product.id)}
                            >Edit
                            </button>
                            <br />
                            <br />
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteProduct(product.id)}
                            >Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
