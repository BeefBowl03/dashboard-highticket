import React, { useState } from 'react';
import { questions, getDefaultPolicyData } from '../data/questions';
import { policyTemplates } from '../data/policyTemplates';
import QuestionForm from './QuestionForm';
import ReviewForm from './ReviewForm';
import PolicySelector from './PolicySelector';

const PolicyGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [policyData, setPolicyData] = useState(getDefaultPolicyData());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  const totalSteps = 3;

  const handleAnswer = (questionId: string, answer: string) => {
    setPolicyData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
    setAnsweredQuestions(prev => new Set([...Array.from(prev), questionId]));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuestionForm
            questions={questions}
            onAnswer={handleAnswer}
            policyData={policyData}
            answeredQuestions={answeredQuestions}
          />
        );
      case 2:
        return <ReviewForm policyData={policyData} />;
      case 3:
        return <PolicySelector policyData={policyData} templates={policyTemplates} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === totalSteps}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default PolicyGenerator;
