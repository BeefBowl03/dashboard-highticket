'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Copy, Download } from 'lucide-react';

export default function PolicyGenerator() {
  const router = useRouter();
  const [selectedPolicy, setSelectedPolicy] = useState<string>('');
  const [generatedPolicy, setGeneratedPolicy] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const policyTypes = [
    { id: 'privacy', name: 'Privacy Policy', description: 'Protect user data and comply with regulations' },
    { id: 'terms', name: 'Terms of Service', description: 'Define rules and conditions for your service' },
    { id: 'refund', name: 'Refund Policy', description: 'Clear guidelines for returns and refunds' },
    { id: 'shipping', name: 'Shipping Policy', description: 'Delivery times and shipping information' },
    { id: 'disclaimer', name: 'Disclaimer', description: 'Legal disclaimers and limitations' }
  ];

  const generatePolicy = async () => {
    if (!selectedPolicy) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedPolicy(`Generated ${policyTypes.find(p => p.id === selectedPolicy)?.name} content...`);
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPolicy);
  };

  const downloadPolicy = () => {
    const blob = new Blob([generatedPolicy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPolicy}-policy.txt`;
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
            <FileText className="text-blue-600 mr-3" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Policy Generator</h1>
              <p className="text-gray-600">Generate comprehensive legal policies for your store</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Policy Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Select Policy Type</h2>
            <div className="space-y-3">
              {policyTypes.map((policy) => (
                <div
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPolicy === policy.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{policy.name}</h3>
                  <p className="text-sm text-gray-600">{policy.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={generatePolicy}
              disabled={!selectedPolicy || isLoading}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Policy'}
            </button>
          </div>

          {/* Generated Policy */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Generated Policy</h2>
              {generatedPolicy && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center"
                  >
                    <Copy size={14} className="mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={downloadPolicy}
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : generatedPolicy ? (
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedPolicy}</pre>
              ) : (
                <p className="text-gray-500 text-center">Select a policy type and click generate to see the content here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
