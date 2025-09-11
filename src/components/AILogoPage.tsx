import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import LogoGenerator from './LogoGenerator';

const AILogoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <button
            onClick={() => navigate('/dashboard')}
            className="back-button"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="main-logo">
            <img 
              src="https://cdn.prod.website-files.com/67692e83aa3faae2c7985fcc/679934bc5b34b807e6cac177_highticket-logo-full-white.svg" 
              alt="HighTicket.io" 
              className="logo-svg"
            />
          </div>
        </div>

        <div className="tools-section">
          <h2>AI Logo Generator</h2>
          <p className="text-[#ffffff80] mb-8">Create professional logos powered by AI with transparent backgrounds and modern designs.</p>
        </div>

        <div className="tool-content-wrapper">
          <LogoGenerator />
        </div>
      </div>
    </div>
  );
};

export default AILogoPage;
