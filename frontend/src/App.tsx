import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import CreateBrief from './pages/customer/CreateBrief';
import EditBrief from './pages/customer/EditBrief';
import MyProperties from './pages/customer/MyProperties';
import ViewQuotes from './pages/customer/ViewQuotes';
import AIComparison from './pages/customer/AIComparison';
import Profile from './pages/customer/Profile';

// Firm pages
import FirmDashboard from './pages/firm/Dashboard';
import ViewBriefs from './pages/firm/ViewBriefs';
import SubmitQuote from './pages/firm/SubmitQuote';
import LeadDetails from './pages/firm/LeadDetails';
import MyQuotes from './pages/firm/MyQuotes';
import FirmAnalytics from './pages/firm/Analytics';
import FirmProfile from './pages/firm/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import FirmVerification from './pages/admin/FirmVerification';
import UserManagement from './pages/admin/UserManagement';
import PropertyModeration from './pages/admin/PropertyModeration';
import QuoteMonitor from './pages/admin/QuoteMonitor';

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-card border-slate-200/50 dark:border-white/10 text-slate-900 dark:text-white',
          style: { background: 'transparent', boxShadow: 'none' }
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="create-brief" element={<CreateBrief />} />
            <Route path="edit-property/:id" element={<EditBrief />} />
            <Route path="my-properties" element={<MyProperties />} />
            <Route path="property/:id" element={<ViewQuotes />} />
            <Route path="property/:id/ai-compare" element={<AIComparison />} />
            <Route path="profile" element={<Profile />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Firm Routes */}
          <Route
            path="/firm"
            element={
              <ProtectedRoute allowedRoles={['FIRM']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<FirmDashboard />} />
            <Route path="briefs" element={<ViewBriefs />} />
            <Route path="brief/:id" element={<LeadDetails />} />
            <Route path="brief/:id/submit" element={<SubmitQuote />} />
            <Route path="my-quotes" element={<MyQuotes />} />
            <Route path="analytics" element={<FirmAnalytics />} />
            <Route path="profile" element={<FirmProfile />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="firms" element={<FirmVerification />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="properties" element={<PropertyModeration />} />
            <Route path="quotes" element={<QuoteMonitor />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
