import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

interface QuestionFormProps {
  question: Question;
  value: any;
  onAnswer: (questionId: number, answer: any) => void;
  onBack: () => void;
  onSkip: () => void;
  canGoBack: boolean;
  canSkip: boolean;
  isLastQuestion: boolean;
  onComplete: () => void;
  domain?: string; // For dynamic URL placeholders
  isEditing?: boolean; // Whether this is editing mode from review page
  onFinishEditing?: () => void; // Callback when editing is finished
  showSkipButton?: boolean; // Whether to show the skip button
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  value,
  onAnswer,
  onBack,
  onSkip,
  canGoBack,
  canSkip,
  isLastQuestion,
  onComplete,
  domain,
  isEditing = false,
  onFinishEditing,
  showSkipButton = true
}) => {
  const [inputValue, setInputValue] = useState<any>(value || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    // Set input value when question changes
    if (question.id) {
      setInputValue(value || '');
    }
  }, [question.id, value]);

  // Auto-focus the input field when question changes
  useEffect(() => {
    if (inputRef.current && question.type !== 'select') {
      // Small delay to ensure the component has rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [question.id, question.type]);

  // Generate dynamic placeholder for URL fields
  const getPlaceholder = (): string => {
    if (question.type === 'url' && domain) {
      // Add https:// if not present
      const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
      return `${baseUrl}/...`;
    }
    
    // Default placeholders
    switch (question.type) {
      case 'textarea':
        return 'Enter your answer...';
      case 'domain':
        return 'Enter domain (e.g., example.com)...';
      case 'email':
        return 'Enter email address...';
      case 'url':
        return 'Enter URL...';
      case 'number':
        return 'Enter number...';
      default:
        return 'Enter your answer...';
    }
  };



  // Validation functions
  const validateDomain = (domain: string): boolean => {
    // Clean the domain: remove protocol, www., and trailing slashes
    let cleanDomain = domain.trim().replace(/^https?:\/\//i, '').replace(/^www\./, '').replace(/\/.*$/, '');
    
    // Basic domain validation - must have at least one dot and valid characters
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]{0,253}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(cleanDomain) && cleanDomain.length > 0;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    try {
      // Normalize the URL by adding https:// if no protocol is present
      let normalizedUrl = url.trim();
      if (!normalizedUrl.match(/^https?:\/\//i)) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      
      const urlObj = new URL(normalizedUrl);
      // Check if it's a valid HTTP/HTTPS URL with a proper domain
      return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && 
             urlObj.hostname.includes('.') &&
             urlObj.hostname.length > 0;
    } catch {
      return false;
    }
  };

  // Normalize URLs and domains before saving
  const normalizeValue = (value: string): string => {
    if (!value) return value;
    
    const trimmedValue = value.trim();
    
    if (question.type === 'url') {
      // For URL fields, ensure they have a protocol
      if (!trimmedValue.match(/^https?:\/\//i)) {
        return 'https://' + trimmedValue;
      }
      return trimmedValue;
    }
    
    if (question.type === 'domain') {
      // For domain fields, remove protocol and www if present, then add www back if it was there
      let cleanDomain = trimmedValue.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
      return cleanDomain;
    }
    
    return trimmedValue;
  };

  const getValidationError = (): string | null => {
    if (!inputValue || inputValue === '') return null;
    
    switch (question.type) {
      case 'domain':
        if (!validateDomain(inputValue)) {
          return 'Please enter a valid domain with extension (e.g., example.com, www.mydomain.net)';
        }
        break;
      case 'email':
        if (!validateEmail(inputValue)) {
          return 'Please enter a valid email address (e.g., user@domain.com)';
        }
        break;
      case 'url':
        if (!validateUrl(inputValue)) {
          return 'Please enter a valid URL (e.g., example.com, www.example.com, https://example.com)';
        }
        break;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = getValidationError();
    if (validationError) {
      return; // Don't submit if validation fails
    }
    
    // Allow submission if the field is not required OR if it has a value
    if (!question.required || (inputValue !== undefined && inputValue !== '' && inputValue !== null)) {
      const normalizedValue = normalizeValue(inputValue || '');
      onAnswer(question.id, normalizedValue);
      // Clear the input after submitting
      setInputValue('');
      
      // If editing, go back to review page
      if (isEditing && onFinishEditing) {
        onFinishEditing();
      } else if (isLastQuestion) {
        // If this is the last question, complete the form
        onComplete();
      }
    }
  };

  const handleSkip = () => {
    if (canSkip) {
      onSkip();
    }
  };

  const handleComplete = () => {
    const validationError = getValidationError();
    if (validationError) {
      return; // Don't complete if validation fails
    }
    
    // Allow completion if the field is not required OR if it has a value
    if (!question.required || (inputValue !== undefined && inputValue !== '' && inputValue !== null)) {
      const normalizedValue = normalizeValue(inputValue || '');
      onAnswer(question.id, normalizedValue);
      // Clear the input after completing
      setInputValue('');
      onComplete();
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case 'textarea':
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
            placeholder={getPlaceholder()}
            required={question.required}
            rows={4}
          />
        );
      
      case 'domain':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
            placeholder={getPlaceholder()}
            required={question.required}
          />
        );
      
      case 'email':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
            placeholder={getPlaceholder()}
            required={question.required}
          />
        );
      
      case 'url':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
            placeholder={getPlaceholder()}
            required={question.required}
          />
        );
      
      case 'number':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
            placeholder={getPlaceholder()}
            required={question.required}
          />
        );
      
      case 'select':
        return (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
            required={question.required}
          >
            <option value="" className="bg-[#1a1a1a] text-white">Select an option...</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option} className="bg-[#1a1a1a] text-white">
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
            placeholder={getPlaceholder()}
            required={question.required}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        {renderInput()}
        {getValidationError() && (
          <div className="mt-3 text-sm text-error-dark bg-error-light/10 border border-error-dark/30 rounded-lg px-4 py-3 backdrop-blur-sm">
            {getValidationError()}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              className="tool-button secondary nav-button"
            >
              {isEditing ? 'Cancel Edit' : 'Back'}
            </button>
          )}
          
          {canSkip && !isLastQuestion && showSkipButton && (
            <button
              type="button"
              onClick={handleSkip}
              className="tool-button secondary nav-button"
            >
              Skip
            </button>
          )}
        </div>

        <div className="flex w-full sm:w-auto">
          {isLastQuestion ? (
            <button
              type="submit"
              onClick={handleComplete}
              disabled={question.required && (inputValue === '' || inputValue === null || inputValue === undefined)}
              className="tool-button primary nav-button"
            >
              Complete
            </button>
          ) : (
            <button
              type="submit"
              disabled={question.required && (inputValue === '' || inputValue === null || inputValue === undefined)}
              className="tool-button primary nav-button"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;