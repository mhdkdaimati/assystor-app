import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const ProductsTab = ({ customerId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // لإضافة منتج
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productFields, setProductFields] = useState([]);
  const [productFieldValues, setProductFieldValues] = useState({});
  const [addProductLoading, setAddProductLoading] = useState(false);

  // لمعالجة منتج
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processComment, setProcessComment] = useState("");
  const [processingProductId, setProcessingProductId] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState("");
  // جلب المنتجات
  const fetchProducts = () => {
    setLoading(true);
    axios.get(`/api/customer-products/${customerId}`)
      .then(res => setProducts(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [customerId]);

  // فتح مودال إضافة منتج
  const handleOpenAddProductModal = async () => {
    setAddProductLoading(true);
    try {
      const res = await axios.get('/api/products-with-fields');
      setAllProducts(res.data || []);
      setShowAddProductModal(true);
      setSelectedProductId("");
      setProductFields([]);
      setProductFieldValues({});
    } finally {
      setAddProductLoading(false);
    }
  };

  // عند اختيار منتج من القائمة
  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    const product = allProducts.find(p => p.id === Number(productId));
    setProductFields(product ? product.fields : []);
    setProductFieldValues({});
  };

  // عند تعبئة قيمة حقل
  const handleFieldValueChange = (fieldId, value) => {
    setProductFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // عند حفظ المنتج للزبون
  const handleSaveProductForCustomer = async () => {
    if (!selectedProductId) return;
    setAddProductLoading(true);
    try {
      await axios.post('/api/product-field-values/bulk', {
        customer_id: customerId,
        product_id: selectedProductId,
        fields: productFieldValues
      });
      setShowAddProductModal(false);
      fetchProducts();
    } catch (e) {
      alert("Error adding product");
    }
    setAddProductLoading(false);
  };

  // فتح مودال معالجة منتج
  const handleOpenProcessModal = (customerProductId) => {
    setProcessingProductId(customerProductId);
    setProcessComment("");
    setProcessStatus("");

    setShowProcessModal(true);
  };

  // معالجة منتج
  const handleProcessProduct = async () => {
    if (!processingProductId || !processStatus) {
      alert("Please select status!");
      return;
    }
    setProcessLoading(true);
    try {
      await axios.put(`/api/update-customer-product-status/${processingProductId}`, {
        comment: processComment,
        status: processStatus
      });
      setShowProcessModal(false);
      setProcessingProductId(null);
      setProcessComment("");
      setProcessStatus("");
      fetchProducts();
    } catch (e) {
      alert("Error processing product: " + (e?.response?.data?.message || e.message));
    }
    setProcessLoading(false);
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Customer Products</h5>
        <Button variant="primary" onClick={handleOpenAddProductModal}>
          Add Product
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-muted">No products for this customer.</div>
      ) : (
        <table className="table table-bordered table-sm align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Added User</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td>{idx + 1}</td>
                  <td>{product.product_name}</td>
                  <td>{product.comment}</td>
                  <td>{product.status}</td>
                  <td>{product.added_user || "N/A"}</td>
                  <td>{product.created_at}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleOpenProcessModal(product.customer_product_id)}
                      disabled={product.status != "pending"}
                    >
                      Process
                    </Button>
                  </td>
                </tr>
                {product.fields && product.fields.length > 0 && (
                  <tr>
                    <td></td>
                    <td colSpan={6}>
                      <b>Fields:</b>
                      <table className="table table-sm mb-0">
                        <tbody>
                          {product.fields.map((field, fidx) => (
                            <tr key={fidx}>
                              <td style={{ width: 180 }}>{field.field_name}</td>
                              <td>{field.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* مودال المعالجة */}
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={processStatus}
                onChange={e => setProcessStatus(e.target.value)}
                required
              >
                <option value="">Select...</option>
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={processComment}
                onChange={e => setProcessComment(e.target.value)}
                placeholder="Enter comment (optional)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProcessModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleProcessProduct}
            disabled={processLoading || !processStatus}
          >
            {processLoading ? "Processing..." : "Process"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* مودال إضافة منتج */}
      <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Product to Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Product</Form.Label>
              <Form.Select
                value={selectedProductId}
                onChange={e => handleSelectProduct(e.target.value)}
              >
                <option value="">Select product...</option>
                {allProducts.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            {productFields.length > 0 && (
              <div className="mt-3">
                <h6>Product Fields</h6>
                {productFields.map(field => (
                  <Form.Group key={field.id} className="mb-2">
                    <Form.Label>{field.name}</Form.Label>
                    {field.type === "select" ? (
                      <Form.Select
                        value={productFieldValues[field.id] || ""}
                        onChange={e => handleFieldValueChange(field.id, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {field.options.map(opt => (
                          <option key={opt.id} value={opt.name}>{opt.name}</option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type={field.type === "number" ? "number" : "text"}
                        value={productFieldValues[field.id] || ""}
                        onChange={e => handleFieldValueChange(field.id, e.target.value)}
                      />
                    )}
                  </Form.Group>
                ))}
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveProductForCustomer}
            disabled={!selectedProductId || addProductLoading}
          >
            {addProductLoading ? "Saving..." : "Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsTab;