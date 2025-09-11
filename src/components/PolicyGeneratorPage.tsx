import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PolicyGenerator from './PolicyGenerator';
import { PolicyData } from '../types';

const PolicyGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [, setPolicyData] = useState<PolicyData | null>(null);

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
          <h2>Store Policy Generator</h2>
          <p className="text-[#ffffff80] mb-8">Generate legal policies for your store including Privacy Policy, Terms of Service, and more.</p>
        </div>
        
        <div className="tool-content-wrapper">
          <PolicyGenerator 
            setPolicyData={setPolicyData}
          />
        </div>
      </div>
    </div>
  );
};

export default PolicyGeneratorPage;