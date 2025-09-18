import React, { useState, useEffect, useCallback } from 'react';
import { PolicyData } from '../types';

import { getDefaultPolicyData, questions } from '../data/questions';
import ReviewForm from './ReviewForm';
import PolicySelector from './PolicySelector';

import { 
  Building2, 
  Truck, 
  RotateCcw, 
  Info, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle
} from 'lucide-react';

interface PolicyGeneratorProps {
  setPolicyData: (data: PolicyData | null) => void;
}

type Step = 'questions' | 'review' | 'policies';


// Field component for consistent form inputs
const Field = React.memo<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  required?: boolean;
  type?: string;
  rows?: number;
  options?: string[];
  showError?: boolean;
}>(({ label, placeholder, value, onChange, icon, required = false, type = 'text', rows = 1, options = [], showError = false }) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDomain = (domain: string): boolean => {
    const clean = domain
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/.*$/, '');

    // Require at least one dot and a TLD (2+ chars)
    const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[A-Za-z]{2,}$/;
    return domainRegex.test(clean);
  };

  const validateUrl = (url: string): boolean => {
    try {
      let normalizedUrl = url.trim();
      if (!normalizedUrl.match(/^https?:\/\//i)) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      const urlObj = new URL(normalizedUrl);
      return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && 
             urlObj.hostname.length > 0;
    } catch {
      return false;
    }
  };

  const getValidationError = (): string | null => {
    if (!showError) return null;
    
    if (!value || value === '') {
      if (required) {
        return `${label} is required`;
      }
      return null;
    }
    
    switch (type) {
      case 'email':
        if (!validateEmail(value)) {
          return 'Please enter a valid email address (e.g., user@domain.com)';
        }
        break;
      case 'domain':
        if (!validateDomain(value)) {
          return 'Please enter a valid domain with extension (e.g., example.com)';
        }
        break;
      case 'url':
        if (!validateUrl(value)) {
          return 'Please enter a valid URL (e.g., example.com, https://example.com)';
        }
        break;
    }
    return null;
  };

  const validationError = getValidationError();
  const hasError = validationError !== null;

  const renderInput = () => {
    const baseClasses = `w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
      hasError 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-[#333333] focus:ring-[#c19d44]'
    }`;
    switch (type) {
      case 'textarea':
        return (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            rows={rows}
            autoComplete="on"
            className={baseClasses}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={handleChange}
            className={baseClasses}
          >
            <option value="" className="bg-[#1a1a1a] text-white">Select an option...</option>
            {options.map((option, index) => (
              <option key={index} value={option} className="bg-[#1a1a1a] text-white">
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            autoComplete="on"
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-[#c19d44]">*</span>}
      </label>
      {renderInput()}
      {validationError && (
        <div className="text-sm text-red-400 mt-1">
          {validationError}
        </div>
      )}
    </div>
  );
});

const PolicyGenerator: React.FC<PolicyGeneratorProps> = ({ setPolicyData }) => {
  const [currentStep, setCurrentStep] = useState<Step>('questions');
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [formData, setFormData] = useState<Partial<PolicyData>>(getDefaultPolicyData());
  const [showValidation, setShowValidation] = useState(false);


  const steps = [
    { id: 'business', title: 'Business Information', icon: Building2 },
    { id: 'shipping', title: 'Shipping Information', icon: Truck },
    { id: 'returns', title: 'Returns & Policies', icon: RotateCcw },
    { id: 'additional', title: 'Additional Information', icon: Info }
  ];

  // Handle special logic and auto-fill URLs
  useEffect(() => {
    if (formData.shipToCountries && !formData.sellingRegions) {
      setFormData(prev => ({ ...prev, sellingRegions: formData.shipToCountries }));
    }
    
    // Auto-fill URLs when domain is provided and valid
    if (!formData.primaryWebsiteDomain) return;

    const cleanDomain = formData.primaryWebsiteDomain
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/.*$/, '');

    if (!validateDomain(cleanDomain)) return; // 🚨 don't auto-fill if invalid

      const baseUrl = `https://${cleanDomain}`;
      
    setFormData(prev => ({
      ...prev,
      faqPageURL: `${baseUrl}/faq`,
      returnPolicyURL: `${baseUrl}/return-and-refund-policy`,
      termsOfServicePageURL: `${baseUrl}/terms-of-service`,
      contactPageURL: `${baseUrl}/contact`,
    }));
  }, [formData.shipToCountries, formData.primaryWebsiteDomain, formData.contactPageURL, formData.faqPageURL, formData.returnPolicyURL, formData.sellingRegions, formData.termsOfServicePageURL]);


  const updateField = useCallback((field: keyof PolicyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDomain = (domain: string): boolean => {
    const clean = domain
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/.*$/, '');

    // Require at least one dot and a TLD (2+ chars)
    const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[A-Za-z]{2,}$/;
    return domainRegex.test(clean);
  };

  const validateUrl = (url: string): boolean => {
    try {
      let normalizedUrl = url.trim();
      if (!normalizedUrl.match(/^https?:\/\//i)) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      const urlObj = new URL(normalizedUrl);
      return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && 
             urlObj.hostname.length > 0;
    } catch {
      return false;
    }
  };

  const isCurrentStepValid = (): boolean => {
    switch (currentFormStep) {
      case 0: // Business Information
        return !!(
          formData.legalBusinessName?.trim() &&
          formData.storeWebsiteName?.trim() &&
          formData.primaryWebsiteDomain?.trim() && validateDomain(formData.primaryWebsiteDomain) &&
          formData.countryOfIncorporation?.trim() &&
          formData.fullStreetAddress?.trim() &&
          formData.mainContactEmail?.trim() && validateEmail(formData.mainContactEmail) &&
          formData.phoneNumber?.trim() &&
          formData.customerServiceHours?.trim() &&
          formData.isoCurrencyCode?.trim()
        );
      case 1: // Shipping Information
        return !!(
          formData.internationalFlatRateShippingFee?.trim() &&
          formData.orderProcessingTime?.trim() &&
          formData.dailyOrderCutoff?.trim() &&
          formData.domesticDeliveryEstimateStandard?.trim() &&
          formData.domesticDeliveryEstimateExpedited?.trim() &&
          formData.internationalDeliveryEstimate?.trim()
        );
      case 2: // Returns & Policies
        return !!(
          formData.returnWindowDays?.trim() &&
          formData.shipToCountries?.trim() &&
          formData.domesticCarriers?.trim() &&
          formData.internationalCarriers?.trim() &&
          formData.acceptedPayments?.trim() &&
          formData.exemptProductCategories?.trim()
        );
      case 3: // Additional Information
        return !!(
          formData.cookieList?.trim() &&
          formData.affiliateProgramName?.trim() &&
          formData.governingLawState?.trim() &&
          formData.trackOrderURL?.trim() &&
          formData.faqPageURL?.trim() && validateUrl(formData.faqPageURL) &&
          formData.returnPolicyURL?.trim() && validateUrl(formData.returnPolicyURL) &&
          formData.termsOfServicePageURL?.trim() && validateUrl(formData.termsOfServicePageURL) &&
          formData.contactPageURL?.trim() && validateUrl(formData.contactPageURL)
        );
      case 4: // Review & Generate
        return true; // No validation needed for review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    setShowValidation(true);
    if (!isCurrentStepValid()) return;

    setShowValidation(false);

    // if we're on the last questions step, go straight to ReviewForm
    if (currentFormStep === steps.length - 1) {
      handleCompleteQuestions();              // sets currentStep('review')
    } else {
      setCurrentFormStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentFormStep > 0) {
      setCurrentFormStep(currentFormStep - 1);
    }
  };

  const handleCompleteQuestions = () => {
    setShowValidation(true);
    if (isCurrentStepValid()) {
    setPolicyData(formData as PolicyData);
    setCurrentStep('review');
    }
  };

  const handleReviewComplete = () => {
    setCurrentStep('policies');
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToQuestions = () => {
    setCurrentStep('questions');
  };

  const handleEditQuestion = (questionId: number, newValue: string) => {
    // Find the question to get the field name
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setFormData(prev => ({
        ...prev,
        [question.field]: newValue
      }));
    }
  };


  const renderStep = () => {
    switch (currentFormStep) {
      case 0: // Business Information
        return (
          <div className="grid gap-4">
            <Field
              label="Legal Business Name"
              placeholder="e.g., Sauna Haven USA LLC"
              required
              value={formData.legalBusinessName || ''}
              onChange={(v) => updateField('legalBusinessName', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="Store / Website Name"
              placeholder="e.g., Sauna Haven USA"
              required
              value={formData.storeWebsiteName || ''}
              onChange={(v) => updateField('storeWebsiteName', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="Primary Website Domain"
              placeholder="e.g., SaunaHavenUSA.com"
              required
              type="domain"
              value={formData.primaryWebsiteDomain || ''}
              onChange={(v) => updateField('primaryWebsiteDomain', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="Country of Incorporation"
              placeholder="e.g., United States"
              required
              value={formData.countryOfIncorporation || ''}
              onChange={(v) => updateField('countryOfIncorporation', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="Full Street Address"
              placeholder="e.g., 123 Elm St, Springfield, IL 62704, USA"
              required
              type="textarea"
              rows={3}
              value={formData.fullStreetAddress || ''}
              onChange={(v) => updateField('fullStreetAddress', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="Main Contact Email"
              placeholder="e.g., info@saunahavenusa.com"
              required
              type="email"
              value={formData.mainContactEmail || ''}
              onChange={(v) => updateField('mainContactEmail', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="Phone Number"
              placeholder="e.g., +1 555-123-4567"
              required
              value={formData.phoneNumber || ''}
              onChange={(v) => updateField('phoneNumber', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="Customer Service Hours"
              placeholder="e.g., Mon–Fri 9 AM–5 PM EST"
              required
              value={formData.customerServiceHours || 'Mon–Fri 9 AM–5 PM EST'}
              onChange={(v) => updateField('customerServiceHours', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
            <Field
              label="ISO Currency Code"
              placeholder="e.g., USD"
              required
              value={formData.isoCurrencyCode || 'USD'}
              onChange={(v) => updateField('isoCurrencyCode', v)}
              icon={<Building2 size={16} />}
              showError={showValidation}
            />
          </div>
        );

      case 1: // Shipping Information
        return (
          <div className="grid gap-4">
            <Field
              label="Domestic Free Shipping Threshold"
              placeholder="e.g., 50 (leave blank for no threshold)"
              value={formData.domesticFreeShippingThreshold || ''}
              onChange={(v) => updateField('domesticFreeShippingThreshold', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
            <Field
              label="Domestic Flat Rate Shipping Fee"
              placeholder="e.g., 5.99 (leave blank for no flat rate)"
              value={formData.domesticFlatRateShippingFee || ''}
              onChange={(v) => updateField('domesticFlatRateShippingFee', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
            <Field
              label="International Flat Rate Shipping Fee"
              placeholder="e.g., Custom (calculated at checkout)"
              required
              value={formData.internationalFlatRateShippingFee || 'Custom (calculated at checkout)'}
              onChange={(v) => updateField('internationalFlatRateShippingFee', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
            <Field
              label="Order Processing Time"
              placeholder="e.g., 1–2 days"
              required
              value={formData.orderProcessingTime || '1–2 days'}
              onChange={(v) => updateField('orderProcessingTime', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
            <Field
              label="Daily Order Cutoff"
              placeholder="e.g., 17:00 EST"
              required
              value={formData.dailyOrderCutoff || '17:00 EST'}
              onChange={(v) => updateField('dailyOrderCutoff', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
            <Field
              label="Standard Domestic Delivery Estimate"
              placeholder="e.g., 5–7 business days"
              required
              value={formData.domesticDeliveryEstimateStandard || '5–7 business days'}
              onChange={(v) => updateField('domesticDeliveryEstimateStandard', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
            <Field
              label="Expedited Domestic Delivery Estimate"
              placeholder="e.g., 2–3 business days"
              required
              value={formData.domesticDeliveryEstimateExpedited || '2–3 business days'}
              onChange={(v) => updateField('domesticDeliveryEstimateExpedited', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
            <Field
              label="International Delivery Estimate"
              placeholder="e.g., 7–14 business days"
              required
              value={formData.internationalDeliveryEstimate || '7–14 business days'}
              onChange={(v) => updateField('internationalDeliveryEstimate', v)}
              icon={<Truck size={16} />}
              showError={showValidation}
            />
          </div>
        );

      case 2: // Returns & Policies
        return (
          <div className="grid gap-4">
            <Field
              label="Return Window (Days)"
              placeholder="e.g., 30"
              required
              value={formData.returnWindowDays || '30'}
              onChange={(v) => updateField('returnWindowDays', v)}
              icon={<RotateCcw size={16} />}
              showError={showValidation}
            />
            <Field
              label="Countries/Regions You Ship To"
              placeholder="e.g., United States (excluding Puerto Rico)"
              required
              type="textarea"
              rows={3}
              value={formData.shipToCountries || 'United States (excluding Puerto Rico)'}
              onChange={(v) => updateField('shipToCountries', v)}
              icon={<RotateCcw size={16} />}
              showError={showValidation}
            />
            <Field
              label="Domestic Carriers"
              placeholder="e.g., varies by product – contact us to inquire"
              required
              type="textarea"
              rows={2}
              value={formData.domesticCarriers || 'varies by product – contact us to inquire'}
              onChange={(v) => updateField('domesticCarriers', v)}
              icon={<RotateCcw size={16} />}
              showError={showValidation}
            />
            <Field
              label="International Carriers"
              placeholder="e.g., varies by product – contact us to inquire"
              required
              type="textarea"
              rows={2}
              value={formData.internationalCarriers || 'varies by product – contact us to inquire'}
              onChange={(v) => updateField('internationalCarriers', v)}
              icon={<RotateCcw size={16} />}
              showError={showValidation}
            />
            <Field
              label="Accepted Payment Methods"
              placeholder="e.g., Visa, Mastercard, AmEx, PayPal, etc."
              required
              type="textarea"
              rows={2}
              value={formData.acceptedPayments || 'Visa, Mastercard, AmEx, PayPal, etc.'}
              onChange={(v) => updateField('acceptedPayments', v)}
              icon={<RotateCcw size={16} />}
              showError={showValidation}
            />
            <Field
              label="Selling Regions"
              placeholder="Leave blank to reuse shipping countries"
              type="textarea"
              rows={2}
              value={formData.sellingRegions || ''}
              onChange={(v) => updateField('sellingRegions', v)}
              icon={<RotateCcw size={16} />}
              showError={showValidation}
            />
            <Field
              label="Non-Returnable Product Categories"
              placeholder="e.g., custom, perishable (or leave blank for 'None')"
              required
              type="textarea"
              rows={2}
              value={formData.exemptProductCategories || 'None'}
              onChange={(v) => updateField('exemptProductCategories', v)}
              icon={<RotateCcw size={16} />}
              showError={showValidation}
            />
          </div>
        );

      case 3: // Additional Information
        return (
          <div className="grid gap-4">
            <Field
              label="Cookie List"
              placeholder="Paste your cookie table or leave blank for standard essential + analytics"
              required
              type="textarea"
              rows={4}
              value={formData.cookieList || 'standard essential + analytics'}
              onChange={(v) => updateField('cookieList', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
            <Field
              label="Affiliate Program"
              placeholder="Provide program name and website(s) or leave blank for 'N/A'"
              required
              type="textarea"
              rows={2}
              value={formData.affiliateProgramName || 'N/A'}
              onChange={(v) => updateField('affiliateProgramName', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
            <Field
              label="Governing Law State"
              placeholder="e.g., Delaware or DE"
              required
              value={formData.governingLawState || ''}
              onChange={(v) => updateField('governingLawState', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
            <Field
              label="Order Tracking"
              placeholder="e.g., tracking link will be sent via email"
              required
              value={formData.trackOrderURL || 'tracking link will be sent via email'}
              onChange={(v) => updateField('trackOrderURL', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
            <Field
              label="FAQ Page URL"
              placeholder="Auto-filled with your domain"
              required
              type="url"
              value={formData.faqPageURL || ''}
              onChange={(v) => updateField('faqPageURL', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
            <Field
              label="Return Policy URL"
              placeholder="Auto-filled with your domain + /return-and-refund-policy"
              required
              type="url"
              value={formData.returnPolicyURL || ''}
              onChange={(v) => updateField('returnPolicyURL', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
            <Field
              label="Terms of Service URL"
              placeholder="Auto-filled with your domain + /terms-of-service"
              required
              type="url"
              value={formData.termsOfServicePageURL || ''}
              onChange={(v) => updateField('termsOfServicePageURL', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
            <Field
              label="Contact Page URL"
              placeholder="Auto-filled with your domain + /contact"
              required
              type="url"
              value={formData.contactPageURL || ''}
              onChange={(v) => updateField('contactPageURL', v)}
              icon={<Info size={16} />}
              showError={showValidation}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="tool-content-wrapper">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentFormStep;
          const isCurrent = index === currentFormStep;

          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-[#c19d44] border-[#c19d44] text-[#080808]' 
                  : isCurrent 
                  ? 'border-[#c19d44] text-[#c19d44]' 
                  : 'border-[#333333] text-[#888]'
              }`}>
                {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  isCompleted ? 'bg-[#c19d44]' : 'bg-[#333333]'
                }`} />
          )}
        </div>

          );
        })}
      </div>

      {/* Step Content - Only show when on questions step */}
      {currentStep === 'questions' && (
        <div className="policy-form-card mb-8">
          <div className="tool-header mb-6">
            <div className="tool-icon">
              {React.createElement(steps[currentFormStep].icon, { size: 32 })}
                </div>

            <div className="tool-status ready">
              Step {currentFormStep + 1} of {steps.length}
              </div>
        </div>


          <div className="policy-form-content">
            <h3 className="tool-title mb-6">{steps[currentFormStep].title}</h3>
            {renderStep()}
              </div>
        </div>
      )}


      {/* Navigation - Only show when on questions step */}
      {currentStep === 'questions' && (
        <div className="flex justify-between items-center w-full">
          <button
            onClick={prevStep}
            disabled={currentFormStep === 0}
            className="tool-button secondary nav-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={20} />
            Previous
          </button>
          
          <button
            onClick={nextStep}
            className="tool-button primary nav-button flex items-center gap-2"
          >
            {currentFormStep === steps.length - 1 ? 'Review' : 'Next'}
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* Review and Policy Steps */}
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

