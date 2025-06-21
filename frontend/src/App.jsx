import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerifyEmail from './pages/VerifyEmail';
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import { Toaster } from 'sonner';
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      <Toaster position='top-right' richColors closeButton />
    </Router>
  );
}

export default App;
