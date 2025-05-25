import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MasterLayout from './layout/MasterLayout';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';
import AddUser from './components/user/AddUser';

import EditUser from './components/user/EditUser';
import ViewUser from './components/user/ViewUser';

import AddCompany from './components/company/AddCompany';
import ViewCompany from './components/company/ViewCompany';
import EditCompany from './components/company/EditCompany';

import UploadCustomers from './components/customer/UploadCustomers';
import AddCustomer from './components/customer/AddCustomer';
import ViewCustomer from './components/customer/ViewCustomer';
import EditCustomer from './components/customer/EditCustomer';
import AddCustomerGroup from './components/customerGroup/AddCustomerGroup';
import ViewCustomerGroup from './components/customerGroup/ViewCustomerGroup';
import EditCustomerGroup from './components/customerGroup/EditCustomerGroup';
import CustomerGroupsPage from './components/customerGroupManagment/CustomerGroupsPage';

import IncompletedCustomerGroups from './components/handleCustomerGroups/IncompletedCustomerGroups';
import ProcessCustomerGroup from './components/handleCustomerGroups/ProcessCustomerGroupe';
import ProductPage from './components/product/ProductPage';
import PendingCustomerProducts from './components/customerProduct/PendingCustomerProducts';

import AllCustomerProducts from './components/customerProduct/AllCustomerProducts';
import EntityTabs from './components/showEntities/EntityTabs';


// EntityPage
import EntityPage from './components/entity/EntityPage';

import { useState, useEffect } from 'react';


axios.defaults.withCredentials = true;
//axios.defaults.baseURL = "http://192.168.176.245:8000/";
 axios.defaults.baseURL = "http://127.0.0.1:8000/";
// 
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


function App() {

  const [auth, setAuth] = useState({
    token: localStorage.getItem('auth_token'),
    role: localStorage.getItem('auth_role'),
  });
  useEffect(() => {
    const handleAuthChange = () => {
      setAuth({
        token: localStorage.getItem('auth_token'),
        role: localStorage.getItem('auth_role'),
      });
    };

    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);


  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Pages */}
        <Route path="/" element={<ProtectedRoute> <MasterLayout /> </ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="add-user" element={auth.role === 'admin' ? <AddUser /> : <Navigate to="/" />} />
          <Route path="view-user" element={auth.role === 'admin' ? <ViewUser /> : <Navigate to="/" />} />
          <Route path="edit-user/:id" element={auth.role === 'admin' ? <EditUser /> : <Navigate to="/" />} />


          <Route path="add-company" element={auth.role === 'admin' ? <AddCompany /> : <Navigate to="/" />} />
          <Route path="view-company" element={auth.role === 'admin' ? <ViewCompany /> : <Navigate to="/" />} />
          <Route path="edit-company/:id" element={auth.role === 'admin' ? <EditCompany /> : <Navigate to="/" />} />

          <Route path="add-customer" element={auth.role === 'admin' ? <AddCustomer /> : <Navigate to="/" />} />
          <Route path="view-customer" element={auth.role === 'admin' ? <ViewCustomer /> : <Navigate to="/" />} />
          <Route path="edit-customer/:id" element={auth.role === 'admin' ? <EditCustomer /> : <Navigate to="/" />} />
          <Route path="upload-customers" element={auth.role === 'admin' ? <UploadCustomers /> : <Navigate to="/" />} />

          <Route path="add-customer-group" element={auth.role === 'admin' ? <AddCustomerGroup /> : <Navigate to="/" />} />
          <Route path="view-customer-group" element={auth.role === 'admin' ? <ViewCustomerGroup /> : <Navigate to="/" />} />
          <Route path="edit-customer-group/:id" element={auth.role === 'admin' ? <EditCustomerGroup /> : <Navigate to="/" />} />

          <Route path="customer-group-page" element={auth.role === 'admin' ? <CustomerGroupsPage /> : <Navigate to="/" />} />
          <Route path="incompleted-customer-groups" element={auth.role === 'admin' ? <IncompletedCustomerGroups /> : <Navigate to="/" />} />
          <Route path="process-customer-group/:id" element={auth.role === 'admin' ? <ProcessCustomerGroup /> : <Navigate to="/" />} />

          {/* ProductList */}


          <Route path="product-page" element={auth.role === 'admin' ? <ProductPage /> : <Navigate to="/" />} />

          <Route path="pending-customer-products" element={auth.role === 'admin' ? <PendingCustomerProducts /> : <Navigate to="/" />} />

          <Route path="all-customer-products" element={auth.role === 'admin' ? <AllCustomerProducts /> : <Navigate to="/" />} />
          <Route path="entity-page" element={auth.role === 'admin' ? <EntityPage /> : <Navigate to="/" />} />
          {/* EntityTabs */}
          <Route path="entity-tabs" element={auth.role === 'admin' ? <EntityTabs /> : <Navigate to="/" />} />

          {/* Add more protected routes here */}
          {/* Example: <Route path="settings" element={<Settings />} /> */}
          {/* Example: <Route path="profile" element={<Profile />} /> */}

          {/* Add more pages here as needed */}
          {/* Example: <Route path="about" element={<About />} /> */}
          {/* Add more pages here as needed */}

        </Route>
        {/* Redirect all other paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;