'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Palette, Download, Copy } from 'lucide-react';

export default function AILogoGenerator() {
  const router = useRouter();
  const [logoData, setLogoData] = useState({
    companyName: '',
    industry: '',
    style: '',
    colors: '',
    description: ''
  });
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setLogoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateLogos = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedLogos([
        `Logo 1 for ${logoData.companyName} - ${logoData.style} style`,
        `Logo 2 for ${logoData.companyName} - Modern ${logoData.colors} design`,
        `Logo 3 for ${logoData.companyName} - ${logoData.industry} focused`,
        `Logo 4 for ${logoData.companyName} - Minimalist approach`
      ]);
      setIsLoading(false);
    }, 3000);
  };

  const downloadLogo = (logoIndex: number) => {
    // Simulate download
    console.log(`Downloading logo ${logoIndex + 1}`);
  };

  const copyLogoPrompt = (logoIndex: number) => {
    navigator.clipboard.writeText(generatedLogos[logoIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center">
            <Palette className="text-pink-600 mr-3" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Logo Generator</h1>
              <p className="text-gray-600">Create professional logos with AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Logo Requirements</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={logoData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your Company Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  value={logoData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style Preference
                </label>
                <select
                  value={logoData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select Style</option>
                  <option value="modern">Modern</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="classic">Classic</option>
                  <option value="playful">Playful</option>
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Preferences
                </label>
                <input
                  type="text"
                  value={logoData.colors}
                  onChange={(e) => handleInputChange('colors', e.target.value)}
                  placeholder="Blue, Red, Green, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Description
                </label>
                <textarea
                  value={logoData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Any specific elements, symbols, or ideas you'd like included..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={generateLogos}
              disabled={isLoading || !logoData.companyName}
              className="w-full mt-6 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating Logos...' : 'Generate Logos'}
            </button>
          </div>

          {/* Generated Logos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Logos</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              ) : generatedLogos.length > 0 ? (
                generatedLogos.map((logo, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="bg-gray-100 rounded-lg p-8 mb-3 flex items-center justify-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {logoData.companyName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{logo}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadLogo(index)}
                        className="px-3 py-1 bg-pink-600 text-white rounded text-sm hover:bg-pink-700 flex items-center"
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => copyLogoPrompt(index)}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center"
                      >
                        <Copy size={14} className="mr-1" />
                        Copy Prompt
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Fill in the company details and click generate to see your AI-created logos here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
