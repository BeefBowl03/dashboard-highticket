'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Copy, Download } from 'lucide-react';

export default function AIColdEmailPage() {
  const router = useRouter();
  const [emailData, setEmailData] = useState({
    recipientName: '',
    companyName: '',
    industry: '',
    painPoint: '',
    solution: '',
    callToAction: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateEmail = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedEmail(`Subject: Quick question about ${emailData.companyName}

Hi ${emailData.recipientName},

I hope this email finds you well. I noticed that ${emailData.companyName} is in the ${emailData.industry} industry, and I wanted to reach out because I believe I can help with ${emailData.painPoint}.

At our company, we've helped similar businesses in your industry solve this exact challenge. Our solution has helped companies like yours ${emailData.solution}.

Would you be open to a brief 15-minute call this week to discuss how this might apply to ${emailData.companyName}?

${emailData.callToAction}

Best regards,
[Your Name]`);
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
  };

  const downloadEmail = () => {
    const blob = new Blob([generatedEmail], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cold-email.txt';
    a.click();
    URL.revokeObjectURL(url);
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
            <Mail className="text-purple-600 mr-3" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Cold Email Generator</h1>
              <p className="text-gray-600">Generate personalized cold emails with AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Email Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={emailData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={emailData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={emailData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="Technology, Healthcare, Finance..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pain Point
                </label>
                <textarea
                  value={emailData.painPoint}
                  onChange={(e) => handleInputChange('painPoint', e.target.value)}
                  placeholder="What challenges does their company face?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Solution
                </label>
                <textarea
                  value={emailData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  placeholder="How your product/service helps solve their problem"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={emailData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  placeholder="Schedule a call, request a demo, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={generateEmail}
              disabled={isLoading}
              className="w-full mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Email'}
            </button>
          </div>

          {/* Generated Email */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Generated Email</h2>
              {generatedEmail && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center"
                  >
                    <Copy size={14} className="mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={downloadEmail}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : generatedEmail ? (
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedEmail}</pre>
              ) : (
                <p className="text-gray-500 text-center">Fill in the details and click generate to see your personalized cold email here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
