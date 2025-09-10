import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import DomainGenerator from './DomainGenerator';

const DomainGeneratorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center">
              <Globe size={24} className="text-blue-500 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Domain Generator</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
            Generate Premium Domains
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find the perfect domain name for your business with AI-powered suggestions.
          </p>
        </div>

        <DomainGenerator />
      </div>
    </div>
  );
};

export default DomainGeneratorPage;
