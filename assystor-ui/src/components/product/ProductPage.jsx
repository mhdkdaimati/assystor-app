import React, { useState } from "react";
import ProductList from "./ProductList";
import EditProductForm from "./EditProductForm";
import { Link } from "react-router-dom";

function ProductPage() {
    const [editingId, setEditingId] = useState(null);
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="container mx-auto p-4">
            
            {editingId ? (
                <EditProductForm
                    productId={editingId}
                    onUpdated={() => {
                        setEditingId(null);
                        setRefresh(!refresh);
                    }}
                />
            ) : (
                <ProductList
                    key={refresh}
                    onEdit={(id) => setEditingId(id)}
                />
            )}
        </div>
    );
}

export default ProductPage;
