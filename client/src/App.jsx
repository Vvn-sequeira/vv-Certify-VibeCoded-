import CertificateDesigner from './components/CertificateDesigner';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <CertificateDesigner />
    </ErrorBoundary>
  );
}

export default App;

