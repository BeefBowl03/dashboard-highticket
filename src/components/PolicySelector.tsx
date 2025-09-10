import React, { useState } from 'react';
import { PolicyTemplate, PolicyData } from '../types';

interface PolicySelectorProps {
  policyData: PolicyData;
  templates: PolicyTemplate[];
}

const PolicySelector: React.FC<PolicySelectorProps> = ({ policyData, templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [generatedHTML, setGeneratedHTML] = useState<string>('');

  const handleGenerate = (template: PolicyTemplate) => {
    setSelectedTemplate(template);
    const html = template.generatePolicyHTML(policyData);
    setGeneratedHTML(html);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHTML);
      alert('Policy copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Policy Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
            onClick={() => handleGenerate(template)}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{template.icon}</span>
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">{template.description}</p>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated {selectedTemplate.name}
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Copy HTML
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {generatedHTML}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicySelector;
