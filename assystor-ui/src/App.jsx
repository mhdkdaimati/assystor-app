import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MasterLayout from './layout/MasterLayout';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';
import AddUser from './components/user/AddUser';
import AddCompany from './components/company/AddCompany';
import ViewCompany from './components/company/ViewCompany';
import EditCompany from './components/company/EditCompany';
import AddCustomer from './components/customer/AddCustomer';
import ViewCustomer from './components/customer/ViewCustomer';
import EditCustomer from './components/customer/EditCustomer';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;

function App() {
  const authRole = localStorage.getItem('auth_role'); // الحصول على دور المستخدم
  // console.log(authRole);

  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* الصفحات المحمية */}
        <Route path="/" element={ <ProtectedRoute> <MasterLayout /> </ProtectedRoute> }>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="add-user" element={authRole === 'admin' ? <AddUser /> : <Navigate to="/" />}/>

          <Route path="add-company" element={authRole === 'admin' ? <AddCompany /> : <Navigate to="/" />}/>
          <Route path="view-company" element={authRole === 'admin' ? <ViewCompany /> : <Navigate to="/" />}/>
          <Route path="edit-company/:id" element={authRole === 'admin' ? <EditCompany /> : <Navigate to="/" />}/>

          <Route path="add-customer" element={authRole === 'admin' ? <AddCustomer /> : <Navigate to="/" />}/>
          <Route path="view-customer" element={authRole === 'admin' ? <ViewCustomer /> : <Navigate to="/" />}/>
          <Route path="edit-customer/:id" element={authRole === 'admin' ? <EditCustomer /> : <Navigate to="/" />}/>

        </Route>
        {/* إعادة توجيه جميع المسارات الأخرى */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;