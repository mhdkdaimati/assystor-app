import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerInfoTable from './CustomerInfoTable';
import CustomerTabs from './CustomerTabs';

const CustomerDetails = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("customerGroups");

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/get-customer/${id}`).then(res => {
            if (res.data.status === 200) {
                setCustomer(res.data.customer);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!customer) return <div className="alert alert-danger">Customer not found.</div>;

    return (
        <div className="container py-4">
            <button
                className="btn btn-secondary mb-3"
                onClick={() => navigate('/view-customer')}
            >
                Back
            </button>

            <CustomerInfoTable customer={customer} />

            <CustomerTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                customerId={id}
            />
        </div>
    );
};

export default CustomerDetails;