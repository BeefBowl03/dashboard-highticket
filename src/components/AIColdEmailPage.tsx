import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmailForm from './EmailForm';
import EmailTemplate from './EmailTemplate';
import LoadingSpinner from './LoadingSpinner';
import { EmailFormData, EmailTemplate as EmailTemplateType } from '../types/email';

const AIColdEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<EmailTemplateType | null>(null);
  const [formData, setFormData] = useState<EmailFormData | null>(null);

  const handleFormSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setFormData(data);

    try {
      // For now, we'll create a mock response since we don't have the OpenAI API integrated
      // In a real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const mockEmailTemplate: EmailTemplateType = {
        subjectLine: {
          text: "partnership request",
          type: "partnership"
        },
        coreEmail: `Hi there,

I'm ${data.contactFirstName}, founder of ${data.storeName}, an online retailer specializing in demand generation${data.marketingExperience ? ` through ${data.marketingExperience}` : ''} for ${data.niche} products, with a focus on ${data.targetDemographic}.

At present, I'm partnering up with a select group of leading suppliers in ${data.niche}, and I believe your products would be an excellent fit for upcoming campaigns.${data.nicheExperience || data.whyNicheImportant ? ` ${data.nicheExperience || data.whyNicheImportant}.` : ''}

I'm interested in becoming an authorized dealer and would love to strengthen the presence of ${data.supplierName || "your brand"} among ${data.targetDemographic}, driving both visibility and growth.

Best regards,
${data.contactFirstName}`,
        firstFollowUp: "Just following up to see if you had a chance to review my earlier note?",
        secondFollowUp: "👀",
        reasoning: {
          subjectLine: [
            "Authenticity: All-lowercase subject lines feel more human and less 'marketing-y'",
            "Short: One or two words are easy to scan in a crowded inbox",
            "Sparks Curiosity: Open enough to make the recipient wonder about the opportunity",
            "Direct: Gets straight to the point about wanting to partner"
          ],
          coreEmail: [
            "Concise and professional tone - suppliers appreciate brevity",
            "Clear intent - explicitly states the goal of becoming an authorized dealer",
            "Expertise and credibility - establishes authority in the niche",
            "Value proposition - highlights how you'll strengthen their presence",
            "Target audience alignment - shows understanding of end customers",
            "Personalized framing - makes the email feel tailored, not generic"
          ],
          followUps: {
            first: [
              "First follow-up uses polite persistence without being demanding",
              "This maintains human, authentic feel while encouraging response"
            ],
            second: [
              "Second follow-up uses emoji to interrupt usual flow and grab attention"
            ]
          }
        }
      };

      setGeneratedEmail(mockEmailTemplate);

      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) resultsElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setGeneratedEmail(null);
    setFormData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go back to form but keep the old inputs
  const handleChangeDetails = () => {
    setGeneratedEmail(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900">
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
                AI Cold Email Generator
              </h1>
              <p className="mt-2 text-base sm:text-lg text-gray-300">
                Generate professional cold emails for supplier partnerships
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!isLoading && !generatedEmail && (
          <div className="animate-fade-in">
            <EmailForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              initialData={formData || undefined}   
            />
          </div>
        )}

        {isLoading && (
          <div className="animate-slide-up">
            <LoadingSpinner />
          </div>
        )}

        {generatedEmail && formData && (
          <div id="results" className="animate-slide-up">
            <EmailTemplate
              template={generatedEmail}
              formData={formData}
              onReset={handleReset}
              onChangeDetails={handleChangeDetails}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default AIColdEmailPage;
