import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

import Receipt from './components/Receipt';
import History from './components/History';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
