import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import Dashboard from './components/Dashboard';
import AddCategory from './components/category/AddCategory';
import Login from './components/Login';
import axios from 'axios';
import AddUser from './components/user/AddUser';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';


function App() {
  return (
    <Router>
      <Routes>
        {/* Layout يحتوي على Navbar, Sidebar, Footer */}
        <Route path="admin" element={<MasterLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-user" element={<AddUser />} />
        </Route>

        {/* صفحات خارج التخطيط */}
        <Route path="login" element={<Login />} />

        {/* تحويل من "/" إلى "/admin/dashboard" */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
