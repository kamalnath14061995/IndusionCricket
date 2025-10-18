import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Coaching from './pages/Coaching';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminPrograms from './pages/AdminPrograms';
import CoachPrograms from './pages/CoachPrograms';
import AdminCoaches from './pages/AdminCoaches';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import CareerRegistration from './pages/CareerRegistration';
import { AuthProvider } from './contexts/AuthContext';
import PaymentPage from './pages/PaymentPage';
import TransactionStatusPage from './pages/TransactionStatusPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            aria-label="Notification messages"
          />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/overview" element={<Admin />} />
            <Route path="/admin/grounds" element={<Admin />} />
            <Route path="/admin/grounds/create" element={<Admin />} />
            <Route path="/admin/grounds/edit/:id" element={<Admin />} />
            <Route path="/admin/grounds/delete/:id" element={<Admin />} />
            <Route path="/admin/nets" element={<Admin />} />
            <Route path="/admin/nets/create" element={<Admin />} />
            <Route path="/admin/nets/edit/:id" element={<Admin />} />
            <Route path="/admin/nets/delete/:id" element={<Admin />} />
            <Route path="/admin/users" element={<Admin />} />
            <Route path="/admin/users/create" element={<Admin />} />
            <Route path="/admin/users/edit/:id" element={<Admin />} />
            <Route path="/admin/users/delete/:id" element={<Admin />} />
            <Route path="/admin/coaches" element={<Admin />} />
            <Route path="/admin/coaches/create" element={<Admin />} />
            <Route path="/admin/coaches/edit/:id" element={<Admin />} />
            <Route path="/admin/coaches/delete/:id" element={<Admin />} />
            <Route path="/admin/programs" element={<Admin />} />
            <Route path="/admin/programs/create" element={<Admin />} />
            <Route path="/admin/programs/edit/:id" element={<Admin />} />
            <Route path="/admin/programs/delete/:id" element={<Admin />} />
            <Route path="/admin/starplayers" element={<Admin />} />
            <Route path="/admin/starplayers/create" element={<Admin />} />
            <Route path="/admin/starplayers/edit/:id" element={<Admin />} />
            <Route path="/admin/starplayers/delete/:id" element={<Admin />} />
            <Route path="/admin/facilities" element={<Admin />} />
            <Route path="/admin/facilities/create" element={<Admin />} />
            <Route path="/admin/facilities/edit/:id" element={<Admin />} />
            <Route path="/admin/facilities/delete/:id" element={<Admin />} />
            <Route path="/admin/contactinfo" element={<Admin />} />
            <Route path="/admin/contactinfo/edit" element={<Admin />} />
            <Route path="/admin/payments" element={<Admin />} />
            <Route path="/admin/payments/create" element={<Admin />} />
            <Route path="/admin/payments/edit/:id" element={<Admin />} />
            <Route path="/admin/payments/delete/:id" element={<Admin />} />
            <Route path="/admin/settings" element={<Admin />} />
            <Route path="/admin/careerEnquiry" element={<Admin />} />
            <Route path="/coach/programs" element={<CoachPrograms />} />
            <Route path="/career" element={<CareerRegistration />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-status" element={<TransactionStatusPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;