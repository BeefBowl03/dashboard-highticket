import React, { useState } from 'react';
import { PolicyData } from '../types';
import { policyTemplates, generatePolicyHTML } from '../data/policyTemplates';

interface PolicySelectorProps {
  policyData: PolicyData;
  onBack: () => void;
}

const PolicySelector: React.FC<PolicySelectorProps> = ({ policyData, onBack }) => {
  const [copiedPolicy, setCopiedPolicy] = useState<string | null>(null);

  const handleCopyPolicy = async (policyId: string) => {
    const template = policyTemplates.find(t => t.id === policyId);
    if (!template) return;

    const generatedHTML = generatePolicyHTML(template.htmlTemplate, policyData);
    
    try {
      await navigator.clipboard.writeText(generatedHTML);
      setCopiedPolicy(policyId);
      setTimeout(() => setCopiedPolicy(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy policy:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Final Instructions */}
      <div className="mb-6 sm:mb-7 md:mb-8 lg:mb-10 bg-gradient-to-br from-info-light/20 to-info-light/10 border border-info-dark/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-8 backdrop-blur-sm shadow-premium">
        <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary-500 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">🎉 All Set!</h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-500">Here's what to do next:</p>
        </div>
      
        <div className="max-w-3xl mx-auto">
          <ol className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-6 text-left">
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-primary-500 to-primary-400 text-black rounded-full flex items-center justify-center text-xs sm:text-xs md:text-sm lg:text-lg font-bold shadow-lg">1</span>
              <div>
                <span className="font-medium text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg">In Shopify admin, go to</span>
                <span className="text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg"> <strong>Online Store → Pages</strong>.</span>
              </div>
            </li>
          
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-primary-500 to-primary-400 text-black rounded-full flex items-center justify-center text-xs sm:text-xs md:text-sm lg:text-lg font-bold shadow-lg">2</span>
              <div>
                <span className="font-medium text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg">Click</span>
                <span className="text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg"> <strong>Add page</strong>, name it after the policy (e.g. "Shipping Policy").</span>
              </div>
            </li>
            
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-primary-500 to-primary-400 text-black rounded-full flex items-center justify-center text-xs sm:text-xs md:text-sm lg:text-lg font-bold shadow-lg">3</span>
              <div>
                <span className="font-medium text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg">Click the</span>
                <span className="text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg"> <strong>&lt;&gt;</strong> (Show HTML) icon in the top‑right of the editor.</span>
              </div>
            </li>
            
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-primary-500 to-primary-400 text-black rounded-full flex items-center justify-center text-xs sm:text-xs md:text-sm lg:text-lg font-bold shadow-lg">4</span>
              <div>
                <span className="font-medium text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg">Paste the generated HTML code into the HTML view.</span>
              </div>
            </li>
            
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-primary-500 to-primary-400 text-black rounded-full flex items-center justify-center text-xs sm:text-xs md:text-sm lg:text-lg font-bold shadow-lg">5</span>
              <div>
                <span className="font-medium text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg">Click</span>
                <span className="text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg"> <strong>&lt;&gt;</strong> again to return to normal view and confirm rendering.</span>
              </div>
            </li>
            
            <li className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-primary-500 to-primary-400 text-black rounded-full flex items-center justify-center text-xs sm:text-xs md:text-sm lg:text-lg font-bold shadow-lg">6</span>
              <div>
                <span className="font-medium text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg">Click</span>
                <span className="text-primary-500 text-xs sm:text-xs md:text-sm lg:text-lg"> <strong>Save</strong>.</span>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-center">
          <p className="text-primary-500 text-xs sm:text-xs md:text-sm lg:text-base lg:whitespace-nowrap">
            💡 <strong>Tip:</strong> Copy the HTML below to add your policy to Shopify.
          </p>
        </div>
      </div>

      <div className="mb-6 sm:mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3 sm:mb-4 md:mb-6">Your Generated Policies</h2>
        <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed">Review and copy the HTML code for each policy below.</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {policyTemplates.map((template) => {
          const generatedHTML = generatePolicyHTML(template.htmlTemplate, policyData);
          
          return (
            <div key={template.id} className="premium-card overflow-hidden">
              {/* Policy Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black">{template.name}</h3>
                <p className="text-black/80 mt-1 font-medium text-xs sm:text-sm md:text-base">{template.description}</p>
              </div>
              
              {/* Policy Content */}
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-background-elevated rounded-lg flex items-center justify-center border border-border-subtle">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-text-muted uppercase tracking-wide">HTML Code</span>
                  </div>
                  <button
                    onClick={() => handleCopyPolicy(template.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 ${
                      copiedPolicy === template.id
                        ? 'bg-success-light/20 text-success-dark border border-success-dark/30'
                        : 'bg-background-elevated text-primary-500 hover:bg-primary-500/20 hover:border-primary-400 border border-primary-500 shadow-lg hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {copiedPolicy === template.id ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        <span className="hidden sm:inline">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* HTML Code Display */}
                <div className="bg-background-elevated border border-border-subtle rounded-lg p-2 sm:p-3 md:p-4 max-h-48 sm:max-h-64 md:max-h-96 overflow-y-auto">
                  <pre className="text-xs sm:text-sm text-text-primary whitespace-pre-wrap break-words">
                    <code className="text-text-primary">{generatedHTML}</code>
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 md:mt-8 text-center">
        <button
          onClick={onBack}
          className="bg-background-elevated text-text-primary px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-background-accent hover:border-primary-500 border border-border-elevated transition-all duration-200 font-medium w-full sm:w-auto"
        >
          ← Back to Review
        </button>
      </div>
    </div>
  );
};

export default PolicySelector;