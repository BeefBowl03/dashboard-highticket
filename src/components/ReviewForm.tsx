import React from 'react';
import { PolicyData } from '../types';
import { questions } from '../data/questions';

interface ReviewFormProps {
  formData: Partial<PolicyData>;
  onBack: () => void;
  onComplete: () => void;
  onEditQuestion: (questionId: number) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ formData, onBack, onComplete, onEditQuestion }) => {
  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.group]) {
      acc[question.group] = [];
    }
    acc[question.group].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  const getDisplayValue = (field: keyof PolicyData, value: any): string => {
    if (value === undefined || value === null || value === '') {
      return 'Not provided';
    }
    
    // Handle special cases
    if (field === 'sellingRegions' && value === formData.shipToCountries) {
      return `${value} (same as shipping countries)`;
    }
    
    return String(value);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">
          Review Your Information
        </h2>
        <p className="text-base sm:text-lg text-text-secondary mb-4">
          Please review all your answers before proceeding to generate policies.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {Object.entries(groupedQuestions).map(([groupName, groupQuestions]) => (
          <div key={groupName} className="premium-card">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border-subtle">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary">{groupName}</h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {groupQuestions.map((question) => (
                <div key={question.id} className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-text-primary mb-1">
                        {question.question}
                      </h4>
                      <p className="text-sm text-text-secondary mb-2">
                        {question.guidance}
                      </p>
                      <div className="text-sm sm:text-base text-text-primary">
                        <span className="font-semibold text-base sm:text-lg text-primary-500">Edit your Answer: </span>
                        <button
                          onClick={() => onEditQuestion(question.id)}
                          className={`${
                            formData[question.field] ? 'text-success-dark hover:text-success-dark' : 'text-error-dark hover:text-error-dark'
                          } underline cursor-pointer hover:bg-background-accent hover:border hover:border-primary-500 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-base sm:text-lg font-medium transform hover:scale-105 hover:shadow-subtle`}
                          title="Click to edit this answer"
                        >
                          {getDisplayValue(question.field, formData[question.field])}
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:ml-4">
                      {question.required && !formData[question.field] && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-error-light/20 text-error-dark border border-error-dark/30">
                          Required
                        </span>
                      )}
                      {formData[question.field] && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-light/20 text-success-dark border border-success-dark/30">
                          ✓ Answered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-base font-medium text-text-primary bg-background-elevated border border-border-elevated rounded-lg hover:bg-background-accent hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background-primary transition-all duration-200 w-full sm:w-auto"
        >
          ← Back to Questions
        </button>

        <button
          type="button"
          onClick={onComplete}
          className="px-8 py-3 text-base font-medium text-black bg-gradient-to-r from-primary-500 to-primary-400 border border-transparent rounded-lg hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background-primary shadow-elevated hover:shadow-premium transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
        >
          Continue to Policies →
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;