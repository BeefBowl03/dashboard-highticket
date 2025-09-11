import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Store, 
  Globe, 
  Briefcase, 
  MapPin, 
  Tag, 
  Users, 
  DollarSign, 
  FileText, 
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle
} from 'lucide-react';

interface DealerDetails {
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  storeName: string;
  websiteDomain: string;
  legalStructure: string;
  ein: string;
  yearFounded: string;
  businessStreet: string;
  businessCity: string;
  businessState: string;
  businessPostalCode: string;
  businessCountry: string;
  niche: string;
  targetCustomerSegment: string;
  estimatedSales: string;
  employees: string;
  resaleCertificate: string;
  businessLicense: string;
  supplierName: string;
  dealerFormUrl: string;
  dealerFormFields: string;
  outreachMessage: string;
}

const initialDetails: DealerDetails = {
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',
  storeName: '',
  websiteDomain: '',
  legalStructure: 'LLC',
  ein: '',
  yearFounded: '2023',
  businessStreet: '',
  businessCity: '',
  businessState: '',
  businessPostalCode: '',
  businessCountry: 'United States',
  niche: '',
  targetCustomerSegment: '',
  estimatedSales: '$700,000',
  employees: '',
  resaleCertificate: '',
  businessLicense: '',
  supplierName: '',
  dealerFormUrl: '',
  dealerFormFields: '',
  outreachMessage: '',
};

const steps = [
  { title: 'Contact Info', icon: User },
  { title: 'Business Address', icon: MapPin },
  { title: 'Target Customers', icon: Users },
  { title: 'Sales Estimates', icon: DollarSign },
  { title: 'Team Size', icon: Users },
  { title: 'Legal Documents', icon: FileText },
  { title: 'Supplier Info', icon: Store },
  { title: 'Dealer Form', icon: Globe },
  { title: 'Review & Generate', icon: CheckCircle },
];

interface FieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

function Field({ label, placeholder, value, onChange, type = 'text', required, icon }: FieldProps) {
  const showRequired = required && !value.trim();

  return (
    <div className="grid gap-1">
      <label className="flex items-center gap-2 text-sm font-medium text-white">
        {icon && <span className="text-[#FACC15]">{icon}</span>}
        {label} {required && <span className="text-[#FACC15]">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-md border px-3 py-2 text-sm transition-colors ${
          showRequired
            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 bg-white text-gray-900 focus:border-[#FACC15] focus:ring-[#FACC15]'
        } focus:outline-none focus:ring-1`}
      />
    </div>
  );
}

export default function DealerApplication() {
  const [currentStep, setCurrentStep] = useState(0);
  const [details, setDetails] = useState<DealerDetails>(initialDetails);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState('');

  const updateField = (key: keyof DealerDetails, value: string) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateTemplate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/dealer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      setGeneratedTemplate(data.template);
    } catch (error) {
      console.error('Error generating template:', error);
      alert('Failed to generate template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Contact Info
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="First Name"
                value={details.contactFirstName}
                onChange={(v) => updateField('contactFirstName', v)}
                required
                icon={<User className="w-4 h-4" />}
              />
              <Field
                label="Last Name"
                value={details.contactLastName}
                onChange={(v) => updateField('contactLastName', v)}
                required
                icon={<User className="w-4 h-4" />}
              />
            </div>
            <Field
              label="Email"
              type="email"
              value={details.contactEmail}
              onChange={(v) => updateField('contactEmail', v)}
              required
              icon={<Mail className="w-4 h-4" />}
            />
            <Field
              label="Phone"
              type="tel"
              value={details.contactPhone}
              onChange={(v) => updateField('contactPhone', v)}
              required
              icon={<Phone className="w-4 h-4" />}
            />
          </div>
        );

      case 1: // Business Address
        return (
          <div className="space-y-4">
            <Field
              label="Street Address"
              value={details.businessStreet}
              onChange={(v) => updateField('businessStreet', v)}
              required
              icon={<MapPin className="w-4 h-4" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="City"
                value={details.businessCity}
                onChange={(v) => updateField('businessCity', v)}
                required
              />
              <Field
                label="State"
                value={details.businessState}
                onChange={(v) => updateField('businessState', v)}
                required
              />
              <Field
                label="Postal Code"
                value={details.businessPostalCode}
                onChange={(v) => updateField('businessPostalCode', v)}
                required
              />
            </div>
            <Field
              label="Country"
              value={details.businessCountry}
              onChange={(v) => updateField('businessCountry', v)}
              required
            />
          </div>
        );

      case 2: // Target Customers
        return (
          <div className="space-y-4">
            <Field
              label="Business Niche"
              placeholder="e.g., Outdoor Equipment, Electronics, Home Decor"
              value={details.niche}
              onChange={(v) => updateField('niche', v)}
              required
              icon={<Tag className="w-4 h-4" />}
            />
            <Field
              label="Target Customer Segment"
              placeholder="e.g., Outdoor enthusiasts, Tech professionals, Homeowners"
              value={details.targetCustomerSegment}
              onChange={(v) => updateField('targetCustomerSegment', v)}
              required
              icon={<Users className="w-4 h-4" />}
            />
          </div>
        );

      case 3: // Sales Estimates
        return (
          <div className="space-y-4">
            <Field
              label="Estimated Annual Sales"
              value={details.estimatedSales}
              onChange={(v) => updateField('estimatedSales', v)}
              required
              icon={<DollarSign className="w-4 h-4" />}
            />
          </div>
        );

      case 4: // Team Size
        return (
          <div className="space-y-4">
            <Field
              label="Number of Employees"
              value={details.employees}
              onChange={(v) => updateField('employees', v)}
              required
              icon={<Users className="w-4 h-4" />}
            />
          </div>
        );

      case 5: // Legal Documents
        return (
          <div className="space-y-4">
            <Field
              label="Resale Certificate Number"
              value={details.resaleCertificate}
              onChange={(v) => updateField('resaleCertificate', v)}
              icon={<FileText className="w-4 h-4" />}
            />
            <Field
              label="Business License Number"
              value={details.businessLicense}
              onChange={(v) => updateField('businessLicense', v)}
              icon={<FileText className="w-4 h-4" />}
            />
          </div>
        );

      case 6: // Supplier Info
        return (
          <div className="space-y-4">
            <Field
              label="Supplier Name"
              placeholder="e.g., Brand Name you want to become a dealer for"
              value={details.supplierName}
              onChange={(v) => updateField('supplierName', v)}
              required
              icon={<Store className="w-4 h-4" />}
            />
          </div>
        );

      case 7: // Dealer Form
        return (
          <div className="space-y-4">
            <Field
              label="Dealer Application Form URL"
              placeholder="https://supplier.com/dealer-application"
              value={details.dealerFormUrl}
              onChange={(v) => updateField('dealerFormUrl', v)}
              required
              icon={<Globe className="w-4 h-4" />}
            />
          </div>
        );

      case 8: // Review & Generate
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Review Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span> {details.contactFirstName} {details.contactLastName}
                </div>
                <div>
                  <span className="text-gray-400">Email:</span> {details.contactEmail}
                </div>
                <div>
                  <span className="text-gray-400">Phone:</span> {details.contactPhone}
                </div>
                <div>
                  <span className="text-gray-400">Business:</span> {details.storeName}
                </div>
                <div>
                  <span className="text-gray-400">Niche:</span> {details.niche}
                </div>
                <div>
                  <span className="text-gray-400">Supplier:</span> {details.supplierName}
                </div>
              </div>
            </div>

            <button
              onClick={generateTemplate}
              disabled={isGenerating}
              className="w-full bg-[#FACC15] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Template...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Dealer Application Template
                </>
              )}
            </button>

            {generatedTemplate && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Generated Template</h3>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                  {generatedTemplate}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedTemplate)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Dealer Application Assistant
          </h1>
          <p className="text-gray-400">
            Automatically generate dealer application forms and outreach messages
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-[#FACC15] bg-[#FACC15] text-black' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-600 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {steps[currentStep].title}
          </h2>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-[#FACC15] text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="text-sm text-gray-400">
              Complete all steps to generate your template
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
