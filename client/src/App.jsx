import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CertificateDesigner from './components/CertificateDesigner';
import LandingPage from './components/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/designer" element={<CertificateDesigner />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

