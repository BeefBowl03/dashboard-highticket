import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PolicyGenerator from './PolicyGenerator';
import { PolicyData } from '../types';

const PolicyGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [, setPolicyData] = useState<PolicyData | null>(null);

  return (
    <div className="min-h-screen premium-gradient">
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
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Legal Policy Generator
              </h1>
              <p className="mt-2 text-base sm:text-lg text-gray-300">
                Generate professional legal policies for your business
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <PolicyGenerator 
          setPolicyData={setPolicyData}
        />
      </main>
    </div>
  );
};

export default PolicyGeneratorPage;