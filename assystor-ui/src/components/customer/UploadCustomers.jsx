import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function UploadCustomers() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            swal("Error", "Please select a file to upload", "error");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("/api/customers/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                swal("Success", "File uploaded successfully", "success");
                setFile(null); // Reset the file input
            }
        } catch (error) {
            swal("Error", "Failed to upload file. Please try again.", "error");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body bg-light rounded-4 d-flex justify-content-between align-items-center px-4 py-3">
                            <h4 className="mb-0 fw-bold text-primary">
                                <i className="bi bi-upload me-2"></i> Upload Customers
                            </h4>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body bg-white rounded-4 p-4">
                            <h5 className="text-secondary mb-4">Upload a CSV or Excel file</h5>
                            <div className="mb-3">
                                <input
                                    type="file"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-success rounded-pill shadow-sm"
                                    onClick={handleUpload}
                                >
                                    <i className="bi bi-cloud-upload me-1"></i> Upload File
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadCustomers;