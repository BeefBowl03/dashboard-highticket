import React, { useState, useEffect } from 'react';
import { PolicyData } from '../types';
import { questions } from '../data/questions';
import { X } from 'lucide-react';

interface EditAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
  currentValue: string;
  onSave: (questionId: number, newValue: string) => void;
}

const EditAnswerModal: React.FC<EditAnswerModalProps> = ({
  isOpen,
  onClose,
  questionId,
  currentValue,
  onSave
}) => {
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue, isOpen]);

  const question = questions.find(q => q.id === questionId);
  if (!question) return null;

  const handleSave = () => {
    onSave(questionId, value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 w-full max-w-md"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Edit Answer</h3>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Question */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-[#c19d44] mb-2">{question.question}</h4>
          {question.guidance && (
            <p className="text-xs text-[#888] mb-3">{question.guidance}</p>
          )}
        </div>

        {/* Input Field */}
        <div className="mb-6">
          {question.type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your answer here..."
              rows={4}
              className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent resize-none"
            />
          ) : question.type === 'select' && question.options ? (
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent"
            >
              <option value="" className="bg-[#1a1a1a] text-white">Select an option...</option>
              {question.options.map((option, index) => (
                <option key={index} value={option} className="bg-[#1a1a1a] text-white">
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={question.type || 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your answer here..."
              className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-[#888] bg-transparent border border-[#333333] rounded-lg hover:text-white hover:border-[#555] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-[#c19d44] to-[#d5b356] border border-transparent rounded-lg hover:from-[#d5b356] hover:to-[#c19d44] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAnswerModal;
