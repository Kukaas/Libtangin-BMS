import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './components/routes';
import VerifyEmail from './pages/VerifyEmail';
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/private/Dashboard';
import Residents from './pages/private/secretary/residents-page/Residents';
import ResidentsEdit from './pages/private/secretary/residents-page/ResidentsEdit';
import ResidentView from './pages/private/secretary/residents-page/ResidentView';
import ResidentsCreate from './pages/private/secretary/residents-page/ResidentsCreate';
import { Toaster } from 'sonner';
import "./App.css"
import { Users } from './pages/private/secretary';
import UserView from './pages/private/secretary/users/UserView';
import { OfficialsAccounts, OfficialsCreate, OfficialsEdit, OfficialView } from './pages/admin/officials-accounts';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Public routes - only for non-authenticated users */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          {/* Private routes - only for authenticated users */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Secretary routes */}
          <Route path="/secretary/residents" element={
            <PrivateRoute>
              <Residents />
            </PrivateRoute>
          } />
          <Route path="/secretary/residents/create" element={
            <PrivateRoute>
              <ResidentsCreate />
            </PrivateRoute>
          } />
          <Route path="/secretary/residents/:id/edit" element={
            <PrivateRoute>
              <ResidentsEdit />
            </PrivateRoute>
          } />
          <Route path="/secretary/residents/:id/view" element={
            <PrivateRoute>
              <ResidentView />
            </PrivateRoute>
          } />
          <Route path="/secretary/users" element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          } />
          {/* Optionally, add a user view page for details in the future */}
          <Route path="/secretary/users/:id/view" element={
            <PrivateRoute>
              <UserView />
            </PrivateRoute>
          } />

          {/* Admin routes for officials accounts */}
          <Route path="/admin/officials-accounts" element={
            <PrivateRoute>
              <OfficialsAccounts />
            </PrivateRoute>
          } />
          <Route path="/admin/officials-accounts/create" element={
            <PrivateRoute>
              <OfficialsCreate />
            </PrivateRoute>
          } />
          <Route path="/admin/officials-accounts/:id/edit" element={
            <PrivateRoute>
              <OfficialsEdit />
            </PrivateRoute>
          } />
          <Route path="/admin/officials-accounts/:id/view" element={
            <PrivateRoute>
              <OfficialView />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position='top-right' richColors closeButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
