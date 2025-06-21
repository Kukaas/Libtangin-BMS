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
import Dashboard from './pages/private/Dashboard';
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
          <Route path="/verify-email" element={
            <PrivateRoute>
              <VerifyEmail />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
        <Toaster position='top-right' richColors closeButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
