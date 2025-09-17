import React, { useState, useEffect, useCallback } from 'react';
import { PolicyData } from '../types';
import { questions, getDefaultPolicyData } from '../data/questions';
import ReviewForm from './ReviewForm';
import PolicySelector from './PolicySelector';
import { 
  Building2, 
  Truck, 
  RotateCcw, 
  Info, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Loader2
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
}>(({ label, placeholder, value, onChange, icon, required = false, type = 'text', rows = 1, options = [] }) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            rows={rows}
            autoComplete="on"
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent"
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent"
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
            className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent"
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
    </div>
  );
});

const PolicyGenerator: React.FC<PolicyGeneratorProps> = ({ setPolicyData }) => {
  const [currentStep, setCurrentStep] = useState<Step>('questions');
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [formData, setFormData] = useState<Partial<PolicyData>>(getDefaultPolicyData());
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 'business', title: 'Business Information', icon: Building2 },
    { id: 'shipping', title: 'Shipping Information', icon: Truck },
    { id: 'returns', title: 'Returns & Policies', icon: RotateCcw },
    { id: 'additional', title: 'Additional Information', icon: Info },
    { id: 'review', title: 'Review & Generate', icon: CheckCircle }
  ];

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

  const updateField = useCallback((field: keyof PolicyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = () => {
    if (currentFormStep < steps.length - 1) {
      setCurrentFormStep(currentFormStep + 1);
    }
  };

  const prevStep = () => {
    if (currentFormStep > 0) {
      setCurrentFormStep(currentFormStep - 1);
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
            />
            <Field
              label="Store / Website Name"
              placeholder="e.g., Sauna Haven USA"
              required
              value={formData.storeWebsiteName || ''}
              onChange={(v) => updateField('storeWebsiteName', v)}
              icon={<Building2 size={16} />}
            />
            <Field
              label="Primary Website Domain"
              placeholder="e.g., SaunaHavenUSA.com"
              required
              value={formData.primaryWebsiteDomain || ''}
              onChange={(v) => updateField('primaryWebsiteDomain', v)}
              icon={<Building2 size={16} />}
            />
            <Field
              label="Country of Incorporation"
              placeholder="e.g., United States"
              required
              value={formData.countryOfIncorporation || ''}
              onChange={(v) => updateField('countryOfIncorporation', v)}
              icon={<Building2 size={16} />}
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
            />
            <Field
              label="Main Contact Email"
              placeholder="e.g., info@saunahavenusa.com"
              required
              type="email"
              value={formData.mainContactEmail || ''}
              onChange={(v) => updateField('mainContactEmail', v)}
              icon={<Building2 size={16} />}
            />
            <Field
              label="Phone Number"
              placeholder="e.g., +1 555-123-4567"
              required
              value={formData.phoneNumber || ''}
              onChange={(v) => updateField('phoneNumber', v)}
              icon={<Building2 size={16} />}
            />
            <Field
              label="Customer Service Hours"
              placeholder="e.g., Mon–Fri 9 AM–5 PM EST"
              required
              value={formData.customerServiceHours || 'Mon–Fri 9 AM–5 PM EST'}
              onChange={(v) => updateField('customerServiceHours', v)}
              icon={<Building2 size={16} />}
            />
            <Field
              label="ISO Currency Code"
              placeholder="e.g., USD"
              required
              value={formData.isoCurrencyCode || 'USD'}
              onChange={(v) => updateField('isoCurrencyCode', v)}
              icon={<Building2 size={16} />}
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
            />
            <Field
              label="Domestic Flat Rate Shipping Fee"
              placeholder="e.g., 5.99 (leave blank for no flat rate)"
              value={formData.domesticFlatRateShippingFee || ''}
              onChange={(v) => updateField('domesticFlatRateShippingFee', v)}
              icon={<Truck size={16} />}
            />
            <Field
              label="International Flat Rate Shipping Fee"
              placeholder="e.g., Custom (calculated at checkout)"
              required
              value={formData.internationalFlatRateShippingFee || 'Custom (calculated at checkout)'}
              onChange={(v) => updateField('internationalFlatRateShippingFee', v)}
              icon={<Truck size={16} />}
            />
            <Field
              label="Order Processing Time"
              placeholder="e.g., 1–2 days"
              required
              value={formData.orderProcessingTime || '1–2 days'}
              onChange={(v) => updateField('orderProcessingTime', v)}
              icon={<Truck size={16} />}
            />
            <Field
              label="Daily Order Cutoff"
              placeholder="e.g., 17:00 EST"
              required
              value={formData.dailyOrderCutoff || '17:00 EST'}
              onChange={(v) => updateField('dailyOrderCutoff', v)}
              icon={<Truck size={16} />}
            />
            <Field
              label="Standard Domestic Delivery Estimate"
              placeholder="e.g., 5–7 business days"
              required
              value={formData.domesticDeliveryEstimateStandard || '5–7 business days'}
              onChange={(v) => updateField('domesticDeliveryEstimateStandard', v)}
              icon={<Truck size={16} />}
            />
            <Field
              label="Expedited Domestic Delivery Estimate"
              placeholder="e.g., 2–3 business days"
              required
              value={formData.domesticDeliveryEstimateExpedited || '2–3 business days'}
              onChange={(v) => updateField('domesticDeliveryEstimateExpedited', v)}
              icon={<Truck size={16} />}
            />
            <Field
              label="International Delivery Estimate"
              placeholder="e.g., 7–14 business days"
              required
              value={formData.internationalDeliveryEstimate || '7–14 business days'}
              onChange={(v) => updateField('internationalDeliveryEstimate', v)}
              icon={<Truck size={16} />}
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
            />
            <Field
              label="Selling Regions"
              placeholder="Leave blank to reuse shipping countries"
              type="textarea"
              rows={2}
              value={formData.sellingRegions || ''}
              onChange={(v) => updateField('sellingRegions', v)}
              icon={<RotateCcw size={16} />}
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
            />
            <Field
              label="Governing Law State"
              placeholder="e.g., Delaware or DE"
              required
              value={formData.governingLawState || ''}
              onChange={(v) => updateField('governingLawState', v)}
              icon={<Info size={16} />}
            />
            <Field
              label="Order Tracking"
              placeholder="e.g., tracking link will be sent via email"
              required
              value={formData.trackOrderURL || 'tracking link will be sent via email'}
              onChange={(v) => updateField('trackOrderURL', v)}
              icon={<Info size={16} />}
            />
            <Field
              label="FAQ Page URL"
              placeholder="Auto-filled with your domain"
              required
              type="url"
              value={formData.faqPageURL || ''}
              onChange={(v) => updateField('faqPageURL', v)}
              icon={<Info size={16} />}
            />
            <Field
              label="Return Policy URL"
              placeholder="Auto-filled with your domain + /return-and-refund-policy"
              required
              type="url"
              value={formData.returnPolicyURL || ''}
              onChange={(v) => updateField('returnPolicyURL', v)}
              icon={<Info size={16} />}
            />
            <Field
              label="Terms of Service URL"
              placeholder="Auto-filled with your domain + /terms-of-service"
              required
              type="url"
              value={formData.termsOfServicePageURL || ''}
              onChange={(v) => updateField('termsOfServicePageURL', v)}
              icon={<Info size={16} />}
            />
            <Field
              label="Contact Page URL"
              placeholder="Auto-filled with your domain + /contact"
              required
              type="url"
              value={formData.contactPageURL || ''}
              onChange={(v) => updateField('contactPageURL', v)}
              icon={<Info size={16} />}
            />
          </div>
        );

      case 4: // Review & Generate
        return (
          <div className="space-y-6">
            <div className="border border-[#333333] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#c19d44] mb-4">Review Your Information</h3>
              <div className="grid gap-3 text-sm text-[#ffffff80]">
                <div><strong className="text-white">Business:</strong> {formData.legalBusinessName}</div>
                <div><strong className="text-white">Store:</strong> {formData.storeWebsiteName}</div>
                <div><strong className="text-white">Domain:</strong> {formData.primaryWebsiteDomain}</div>
                <div><strong className="text-white">Email:</strong> {formData.mainContactEmail}</div>
                <div><strong className="text-white">Phone:</strong> {formData.phoneNumber}</div>
                <div><strong className="text-white">Country:</strong> {formData.countryOfIncorporation}</div>
              </div>
            </div>
            
            <button
              onClick={handleCompleteQuestions}
              disabled={isGenerating}
              className="tool-button primary w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Policies...
                </>
              ) : (
                'Generate Store Policies'
              )}
            </button>
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

      {/* Step Content */}
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

      {/* Navigation */}
      <div className="flex justify-between items-center w-full">
        <button
          onClick={prevStep}
          disabled={currentFormStep === 0}
          className="tool-button secondary nav-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        
        {currentFormStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="tool-button primary nav-button flex items-center gap-2"
          >
            Next
            <ArrowRight size={20} />
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Review and Policy Steps */}
      {currentStep === 'review' && (
        <ReviewForm
          formData={formData}
          onBack={handleBackToQuestions}
          onComplete={handleReviewComplete}
          onEditQuestion={() => {}} // Not used in stacked layout
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
