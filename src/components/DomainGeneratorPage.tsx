import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import DomainGenerator from './DomainGenerator';

const DomainGeneratorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 sm:py-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-100 hover:text-yellow-400 transition-colors group mr-6"
              >
                <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Globe className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  Domain Generator
                </h1>
                <p className="mt-2 text-base sm:text-lg text-gray-300">
                  Find the perfect domain for your high-ticket dropshipping store
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <DomainGenerator />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/80 border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-400 text-sm">
            Generate premium domain names and analyze competitor branding using AI
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <button className="text-gray-500 hover:text-yellow-400 text-sm bg-transparent border-none cursor-pointer">
              Privacy Policy
            </button>
            <button className="text-gray-500 hover:text-yellow-400 text-sm bg-transparent border-none cursor-pointer">
              Terms of Service
            </button>
            <button className="text-gray-500 hover:text-yellow-400 text-sm bg-transparent border-none cursor-pointer">
              Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DomainGeneratorPage;