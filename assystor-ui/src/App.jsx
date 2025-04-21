import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import Dashboard from './components/Dashboard';
import AddCategory from './components/category/AddCategory';
import Login from './components/Login';
import AddUser from './components/user/AddUser';
import axios from 'axios';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;

function App() {
  return (
    
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute> <MasterLayout /> </PrivateRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="add-user" element={<AddUser />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
