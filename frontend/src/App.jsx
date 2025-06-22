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
import Residents from './pages/private/secretary/Residents';
import ResidentsEdit from './pages/private/secretary/ResidentsEdit';
import ResidentView from './pages/private/secretary/ResidentView';
import ResidentsCreate from './pages/private/secretary/ResidentsCreate';
import { Toaster } from 'sonner';
import "./App.css"

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
        </Routes>
        <Toaster position='top-right' richColors closeButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
