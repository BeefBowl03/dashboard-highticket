import React from 'react';
import { Question, PolicyData } from '../types';

interface QuestionFormProps {
  questions: Question[];
  onAnswer: (questionId: string, answer: string) => void;
  policyData: PolicyData;
  answeredQuestions: Set<string>;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  questions,
  onAnswer,
  policyData,
  answeredQuestions
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.type === 'text' && (
              <input
                type="text"
                value={policyData.answers[question.id] || ''}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {question.type === 'select' && (
              <select
                value={policyData.answers[question.id] || ''}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                {question.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            
            {question.type === 'textarea' && (
              <textarea
                value={policyData.answers[question.id] || ''}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionForm;
