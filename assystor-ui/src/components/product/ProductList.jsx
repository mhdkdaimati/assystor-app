import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

function ProductList({ onEdit }) {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        axios.get("/api/products")
            .then(res => {
                setProducts(res.data);
                setFilteredProducts(res.data); // تعيين البيانات المفلترة
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const result = products.filter(product => {
            return (
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredProducts(result);
    }, [search, products]);

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            axios.delete(`/api/products/${id}`)
                .then(() => {
                    setProducts(products.filter(p => p.id !== id));
                })
                .catch(err => console.error(err));
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        XLSX.writeFile(workbook, "Products.xlsx");
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
                            <h4 className="mb-0 fw-bold text-primary">
                                <i className="bi bi-box-seam me-2"></i> Product List
                            </h4>
                            <div>
                                <button
                                    className="btn btn-success rounded-pill shadow-sm me-2"
                                    onClick={exportToExcel}
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel
                                </button>
                                <Link to="/create-product" className="btn btn-primary rounded-pill shadow-sm">
                                    <i className="bi bi-plus-circle me-1"></i> Create New Product
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="form-control w-25"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="row">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div className="col-md-4 mb-4" key={product.id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body">
                                            <h5 className="card-title text-primary">{product.name}</h5>
                                            <p className="card-text text-muted">{product.description}</p>
                                            <p className="card-text">
                                                <small className="text-muted">
                                                    Created At: {new Date(product.created_at).toLocaleString()}
                                                </small>
                                            </p>
                                            <h6 className="text-secondary">Fields:</h6>
                                            {product.fields.length > 0 ? (
                                                <table className="table table-sm table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {product.fields.map(field => (
                                                            <tr key={field.id}>
                                                                <td>{field.name}</td>
                                                                <td>
                                                                    {field.type}
                                                                    {field.type === 'select' && field.options ? (
                                                                        <div className="text-muted small mt-1">
                                                                            Options: {field.options}
                                                                        </div>
                                                                    ) : null}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-muted">No fields available.</p>
                                            )}
                                            <div className="d-flex justify-content-between mt-3">
                                                <button
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() => onEdit(product.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => deleteProduct(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <p className="text-center text-muted">No products found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;