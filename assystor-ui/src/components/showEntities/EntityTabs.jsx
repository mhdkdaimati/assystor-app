import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner, Table } from "react-bootstrap";
import EntityDetailsPage from "./EntityDetailsPage";

export default function EntityTabs() {
    const [entities, setEntities] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            axios.get("/api/entities"),
            axios.get("/api/all-customers")
        ]).then(([entitiesRes, customersRes]) => {
            if (!mounted) return;
            setEntities(entitiesRes.data);
            setCustomers(customersRes.data.customers || []);
        }).finally(() => {
            if (mounted) setLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    if (loading) return <Spinner animation="border" />;

    if (selectedEntity) {
        return (
            <EntityDetailsPage
                entity={selectedEntity}
                customers={customers}
                onBack={() => setSelectedEntity(null)}
            />
        );
    }

    return (
        <div className="container py-4">
            <h4>Entities</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Entity Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entities.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center text-muted">
                                No entities found.
                            </td>
                        </tr>
                    )}
                    {entities.map((entity, idx) => (
                        <tr key={entity.id}>
                            <td>{idx + 1}</td>
                            <td>{entity.name}</td>
                            <td>
                                <Button
                                    size="sm"
                                    onClick={() => setSelectedEntity(entity)}
                                >
                                    View {entity.name}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}