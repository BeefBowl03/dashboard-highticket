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
      const policyType = policyTypes.find(p => p.id === selectedPolicy);
      let content = '';
      
      switch (selectedPolicy) {
        case 'privacy':
          content = `PRIVACY POLICY

Last updated: ${new Date().toLocaleDateString()}

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

2. HOW WE USE YOUR INFORMATION
We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

3. INFORMATION SHARING
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. CONTACT US
If you have any questions about this Privacy Policy, please contact us at privacy@yourcompany.com.`;
          break;
        case 'terms':
          content = `TERMS OF SERVICE

Last updated: ${new Date().toLocaleDateString()}

1. ACCEPTANCE OF TERMS
By accessing and using our service, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.

3. DISCLAIMER
The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.

4. LIMITATIONS
In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.

5. REVISIONS
We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms.`;
          break;
        case 'refund':
          content = `REFUND POLICY

Last updated: ${new Date().toLocaleDateString()}

1. REFUND ELIGIBILITY
We offer refunds for products returned within 30 days of purchase, provided they are in original condition.

2. REFUND PROCESS
To request a refund, please contact our customer service team with your order number and reason for return.

3. REFUND TIMING
Refunds will be processed within 5-10 business days after we receive and inspect the returned item.

4. NON-REFUNDABLE ITEMS
Custom orders, digital products, and items marked as final sale are not eligible for refunds.

5. RETURN SHIPPING
Customers are responsible for return shipping costs unless the return is due to our error.`;
          break;
        case 'shipping':
          content = `SHIPPING POLICY

Last updated: ${new Date().toLocaleDateString()}

1. SHIPPING METHODS
We offer standard shipping (5-7 business days) and express shipping (2-3 business days).

2. SHIPPING COSTS
Shipping costs are calculated at checkout based on destination and package weight.

3. PROCESSING TIME
Orders are processed within 1-2 business days. Processing time does not include weekends or holidays.

4. INTERNATIONAL SHIPPING
We ship to most countries worldwide. International orders may be subject to customs duties and taxes.

5. TRACKING
Once your order ships, you will receive a tracking number via email to monitor your package's progress.`;
          break;
        case 'disclaimer':
          content = `DISCLAIMER

Last updated: ${new Date().toLocaleDateString()}

1. GENERAL DISCLAIMER
The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions.

2. NO WARRANTIES
We make no representations or warranties in relation to this website or the information and materials provided on this website.

3. LIMITATION OF LIABILITY
We will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website.

4. EXCEPTIONS
Nothing in this disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit.

5. REASONABLENESS
By using this website, you agree that the exclusions and limitations of liability set out in this website disclaimer are reasonable.`;
          break;
        default:
          content = `Generated ${policyType?.name} content...`;
      }
      
      setGeneratedPolicy(content);
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
