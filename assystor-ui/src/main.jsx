import { AuthProvider } from './context/AuthContext';
import AdminRoute from './routes/AdminRoute';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';  // تأكد من أن المسار صحيح
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';




ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
