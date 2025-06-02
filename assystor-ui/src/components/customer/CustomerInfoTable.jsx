import React from 'react';
import { Table } from 'react-bootstrap';

const CustomerInfoTable = ({ customer }) => {
    if (!customer) return null;

    return (
        <Table className="table table-bordered">
            <tbody>
                {customer.id && (
                    <tr>
                        <th>ID</th>
                        <td>{customer.id}</td>
                    </tr>
                )}
                {customer.first_name && (
                    <tr>
                        <th>First Name</th>
                        <td>{customer.first_name}</td>
                    </tr>
                )}
                {customer.last_name && (
                    <tr>
                        <th>Last Name</th>
                        <td>{customer.last_name}</td>
                    </tr>
                )}
                {customer.email && (
                    <tr>
                        <th>Email</th>
                        <td>{customer.email}</td>
                    </tr>
                )}
                {customer.contact_number && (
                    <tr>
                        <th>Contact Number</th>
                        <td>{customer.contact_number}</td>
                    </tr>
                )}
                {customer.company_id && (
                    <tr>
                        <th>Company ID</th>
                        <td>{customer.company_id}</td>
                    </tr>
                )}
                {customer.gender && (
                    <tr>
                        <th>Gender</th>
                        <td>{customer.gender}</td>
                    </tr>
                )}
                {customer.birth_day && (
                    <tr>
                        <th>Birth Day</th>
                        <td>{customer.birth_day}</td>
                    </tr>
                )}
                {customer.street && (
                    <tr>
                        <th>Street</th>
                        <td>{customer.street}</td>
                    </tr>
                )}
                {customer.zip_code && (
                    <tr>
                        <th>Zip Code</th>
                        <td>{customer.zip_code}</td>
                    </tr>
                )}
                {customer.place && (
                    <tr>
                        <th>Place</th>
                        <td>{customer.place}</td>
                    </tr>
                )}
                {customer.iban && (
                    <tr>
                        <th>IBAN</th>
                        <td>{customer.iban}</td>
                    </tr>
                )}
                {customer.pkk && (
                    <tr>
                        <th>PKK</th>
                        <td>{customer.pkk}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default CustomerInfoTable;