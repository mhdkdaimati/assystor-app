import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Modal, Button, Form } from "react-bootstrap";

const AllCustomerProducts = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch data from API
  const fetchData = () => {
    axios
      .get(`api/get-all-customer-products`)
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
      name: "Comment",
      selector: (row) => row.comment || "N/A",
    },
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 fw-bold text-primary">
                <i className="bi bi-box-seam me-2"></i> Customers Products
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

    </div>
  );
};

export default AllCustomerProducts;