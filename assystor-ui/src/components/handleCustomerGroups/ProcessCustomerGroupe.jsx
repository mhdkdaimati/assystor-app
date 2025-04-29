import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const ProcessCustomerGroup = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // استخدام useParams للحصول على المعرف
    const [loading, setLoading] = useState(true);
    const [customerList, setCustomerList] = useState([]);

    useEffect(() => {
        axios.get(`/api/customer-groups/${id}/customers/incomplete`).then(res => {
            if (res.status === 200) {
                setCustomerList(res.data); // تعيين البيانات بشكل صحيح
            }
            setLoading(false);
        }).catch(error => {
            console.error("There was an error fetching data:", error);
            setLoading(false); // تأكد من إيقاف التحميل في حال حدوث خطأ
        });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // عرض رسالة التحميل أثناء انتظار البيانات
    }

    return (
        <div className="container">
            <h3>Group ID: {id}</h3>
            <div className="accordion accordion-flush" id="accordionFlushExample">
                {customerList.length > 0 ? customerList.map((customer, index) => (
                    <div className="accordion-item" key={customer.id}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#flush-collapse${customer.id}`}
                                aria-expanded="false"
                                aria-controls={`flush-collapse${customer.id}`}
                            >
                                {customer.first_name} {customer.last_name} {/* اسم العميل */}
                            </button>
                        </h2>
                        <div
                            id={`flush-collapse${customer.id}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li><strong>Email:</strong> {customer.email}</li>
                                    <li><strong>Gender:</strong> {customer.gender || 'Not provided'}</li>
                                    <li><strong>Birthdate:</strong> {customer.birth_day}</li>
                                    <li><strong>Street:</strong> {customer.street}</li>
                                    <li><strong>Zip Code:</strong> {customer.zip_code}</li>
                                    <li><strong>Place:</strong> {customer.place}</li>
                                    <li><strong>IBAN:</strong> {customer.iban}</li>
                                    <li><strong>Contact Number:</strong> {customer.contact_number}</li>
                                    <li><strong>Status:</strong> {customer.pivot.status}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="accordion-item">
                        <div className="accordion-header">
                            <button className="accordion-button" type="button" disabled>
                                No Customers Found
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProcessCustomerGroup;
