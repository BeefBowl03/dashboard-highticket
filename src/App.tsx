import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import PolicyGeneratorPage from './components/PolicyGeneratorPage';
import DomainGeneratorPage from './components/DomainGeneratorPage';
import AIColdEmailPage from './components/AIColdEmailPage';
import AILogoPage from './components/AILogoPage';
import DealerApplication from './components/DealerApplication';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/policy-generator" element={<PolicyGeneratorPage />} />
          <Route path="/domain-generator" element={<DomainGeneratorPage />} />
          <Route path="/ai-cold-email" element={<AIColdEmailPage />} />
          <Route path="/ai-logo-generator" element={<AILogoPage />} />
          <Route path="/dealer-application" element={<DealerApplication />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
