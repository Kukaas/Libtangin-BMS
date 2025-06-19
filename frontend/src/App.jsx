import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerifyEmail from './pages/VerifyEmail';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      <Toaster position='top-right' richColors closeButton />
    </Router>
  );
}

export default App;
