import { useState, useEffect } from 'react';
import { PolicyData } from '../types';
import { questions, getDefaultPolicyData } from '../data/questions';
import QuestionForm from './QuestionForm';
import ReviewForm from './ReviewForm';
import PolicySelector from './PolicySelector';

interface PolicyGeneratorProps {
  setPolicyData: (data: PolicyData | null) => void;
}

type Step = 'questions' | 'review' | 'policies';

const PolicyGenerator: React.FC<PolicyGeneratorProps> = ({ setPolicyData }) => {
  const [currentStep, setCurrentStep] = useState<Step>('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<PolicyData>>(getDefaultPolicyData());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  // Handle special logic and auto-fill URLs
  useEffect(() => {
    if (formData.shipToCountries && !formData.sellingRegions) {
      setFormData(prev => ({ ...prev, sellingRegions: formData.shipToCountries }));
    }
    
    // Auto-fill URLs when domain is provided
    if (formData.primaryWebsiteDomain) {
      // Normalize domain to create proper base URL
      let cleanDomain = formData.primaryWebsiteDomain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
      const baseUrl = `https://${cleanDomain}`;
      
      if (!formData.faqPageURL || formData.faqPageURL === '') {
        setFormData(prev => ({ ...prev, faqPageURL: baseUrl }));
      }
      if (!formData.returnPolicyURL || formData.returnPolicyURL === '') {
        setFormData(prev => ({ ...prev, returnPolicyURL: `${baseUrl}/return-and-refund-policy` }));
      }
      if (!formData.termsOfServicePageURL || formData.termsOfServicePageURL === '') {
        setFormData(prev => ({ ...prev, termsOfServicePageURL: `${baseUrl}/terms-of-service` }));
      }
      if (!formData.contactPageURL || formData.contactPageURL === '') {
        setFormData(prev => ({ ...prev, contactPageURL: `${baseUrl}/contact` }));
      }
    }
  }, [formData.shipToCountries, formData.primaryWebsiteDomain, formData.contactPageURL, formData.faqPageURL, formData.returnPolicyURL, formData.sellingRegions, formData.termsOfServicePageURL]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleAnswer = (questionId: number, answer: any) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Use default value if answer is empty and question has a default
    let finalAnswer = answer;
    if ((answer === '' || answer === undefined || answer === null) && question.defaultValue !== undefined) {
      if (question.defaultValue === 'AUTO_FILL') {
        finalAnswer = ''; // Keep empty for auto-fill fields
      } else {
        finalAnswer = question.defaultValue;
      }
    }

    setFormData(prev => ({ ...prev, [question.field]: finalAnswer }));
    setAnsweredQuestions(prev => new Set(Array.from(prev).concat(questionId)));

    // Auto-advance to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleQuestionBack = () => {
    if (editingQuestionId !== null) {
      // If editing, go back to review page
      setEditingQuestionId(null);
      setCurrentStep('review');
    } else if (currentQuestionIndex > 0) {
      // Normal navigation
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleCompleteQuestions = () => {
    setPolicyData(formData as PolicyData);
    setCurrentStep('review');
  };

  const handleReviewComplete = () => {
    setCurrentStep('policies');
  };

  const handleBackToQuestions = () => {
    setCurrentStep('questions');
  };

  const handleEditQuestion = (questionId: number) => {
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
      setEditingQuestionId(questionId);
      setCurrentStep('questions');
    }
  };

  const handleFinishEditing = () => {
    setEditingQuestionId(null);
    setCurrentStep('review');
  };

  const getProgressPercentage = () => {
    return Math.round((answeredQuestions.size / questions.length) * 100);
  };

  const getCurrentGroup = () => {
    return questions[currentQuestionIndex]?.group || '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress Bar */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
          <span className="text-base sm:text-lg font-medium text-gray-300">
            Step {currentStep === 'questions' ? 1 : currentStep === 'review' ? 2 : 3} of 3
          </span>
          {currentStep === 'questions' && (
            <span className="text-sm sm:text-lg text-gray-400">
              {answeredQuestions.size} of {questions.length} questions answered
          </span>
          )}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 sm:h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ 
              width: currentStep === 'questions' 
                ? `${getProgressPercentage()}%` 
                : currentStep === 'review' 
                  ? '66%' 
                  : '100%' 
            }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'questions' && (
        <div>
          <div className="mb-6 sm:mb-8">
            {editingQuestionId && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-100/10 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-sm sm:text-base text-yellow-400">
                  <strong>Editing mode:</strong> You're editing question {editingQuestionId}. 
                  After saving, you'll return to the review page.
                </p>
              </div>
            )}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-3 sm:mb-4">
              {questions[currentQuestionIndex]?.question}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              {questions[currentQuestionIndex]?.guidance}
            </p>
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg">
              {getCurrentGroup()}
            </div>
      </div>

          <QuestionForm
            key={questions[currentQuestionIndex]?.id} // Force re-render when question changes
            question={questions[currentQuestionIndex]}
            value={formData[questions[currentQuestionIndex]?.field]}
            onAnswer={handleAnswer}
            onBack={handleQuestionBack}
            onSkip={handleQuestionSkip}
            canGoBack={currentQuestionIndex > 0}
            canSkip={currentQuestionIndex < questions.length - 1}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
            onComplete={handleCompleteQuestions}
            domain={formData.primaryWebsiteDomain}
            isEditing={editingQuestionId !== null}
            onFinishEditing={handleFinishEditing}
            showSkipButton={![1, 2, 3, 4, 5, 6, 7, 27].includes(questions[currentQuestionIndex]?.id || 0)}
          />
      </div>
      )}

      {currentStep === 'review' && (
        <ReviewForm
          formData={formData}
          onBack={handleBackToQuestions}
          onComplete={handleReviewComplete}
          onEditQuestion={handleEditQuestion}
        />
      )}

      {currentStep === 'policies' && (
        <PolicySelector
          policyData={formData as PolicyData}
          onBack={() => setCurrentStep('review')}
        />
      )}
    </div>
  );
};

export default PolicyGenerator;
