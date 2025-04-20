import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import Dashboard from './components/Dashboard';
import AddCategory from './components/category/AddCategory';
import Login from './components/Login';
import Register from './components/Register';
// import Home from './components/Home'; // إن وجدت

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout يحتوي على Navbar, Sidebar, Footer */}
        <Route path="/admin" element={<MasterLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-category" element={<AddCategory />} />
        </Route>

        {/* صفحات خارج التخطيط */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* تحويل من "/" إلى "/admin/dashboard" */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
