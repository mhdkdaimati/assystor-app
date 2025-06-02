import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Modal, Button, Form } from "react-bootstrap";

const PendingCustomerProducts = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  // Fetch data from API
  const fetchData = () => {
    axios
      .get(`api/get-pending-customer-products`)
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on search input
  useEffect(() => {
    const result = data.filter((item) =>
      item.product_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(result);
  }, [search, data]);

  // Handle modal open
  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setComment("");
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  // Handle comment submission
  const handleSubmitComment = () => {
    if (!selectedRow) return;

    axios
      .put(`api/update-customer-product-status/${selectedRow.customer_product_id}`, {
        comment,
        status, 
      })
      .then((response) => {
        console.log("Comment submitted:", response.data);

        // Reload the data to get the latest updates
        fetchData();

        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
      });
  };

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.product_name,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_details.customer_name,
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <Button variant="primary" onClick={() => handleOpenModal(row)}>
          Process
        </Button>
      ),
    },
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 fw-bold text-primary">
                <i className="bi bi-box-seam me-2"></i> Pending Customer Products
              </h4>
              <input
                type="text"
                placeholder="Search..."
                className="form-control w-25"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive shadow-sm rounded-4 bg-white p-3">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              responsive
            />
          </div>
        </div>
      </div>

      {/* Modal for adding comment */}
      <Modal show={openModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="comment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={e => setStatus(e.target.value)} required>
                <option value="">Select...</option>
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitComment}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingCustomerProducts;