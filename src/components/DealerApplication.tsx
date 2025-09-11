import React, { useState, useCallback } from 'react';
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
  CheckCircle
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

// Field component moved outside to prevent re-creation on every render
const Field = React.memo<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  required?: boolean;
  type?: string;
}>(({ label, placeholder, value, onChange, icon, required = false, type = 'text' }) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="space-y-2 mb-4">
      <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-[#c19d44]">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoComplete="on"
        className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent"
      />
    </div>
  );
});

const DealerApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [details, setDetails] = useState<DealerDetails>({
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
    outreachMessage: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState('');

  const steps = [
    { id: 'contact', title: 'Contact Information', icon: User },
    { id: 'business', title: 'Business Details', icon: Store },
    { id: 'address', title: 'Business Address', icon: MapPin },
    { id: 'marketing', title: 'Marketing & Sales', icon: Tag },
    { id: 'legal', title: 'Legal & Compliance', icon: FileText },
    { id: 'supplier', title: 'Supplier Information', icon: Briefcase },
    { id: 'review', title: 'Review & Generate', icon: CheckCircle }
  ];

  const updateField = useCallback((field: keyof DealerDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  }, []);

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
      case 0: // Contact Information
        return (
          <div className="grid gap-4">
            <Field
              label="First Name"
              placeholder="e.g., John"
              required
              value={details.contactFirstName}
              onChange={(v) => updateField('contactFirstName', v)}
              icon={<User size={16} />}
            />
            <Field
              label="Last Name"
              placeholder="e.g., Doe"
              required
              value={details.contactLastName}
              onChange={(v) => updateField('contactLastName', v)}
              icon={<User size={16} />}
            />
            <Field
              label="Business Email"
              placeholder="e.g., john@myshop.com"
              required
              type="email"
              value={details.contactEmail}
              onChange={(v) => updateField('contactEmail', v)}
              icon={<Mail size={16} />}
            />
            <Field
              label="Phone Number"
              placeholder="e.g., +1 555 123 4567"
              value={details.contactPhone}
              onChange={(v) => updateField('contactPhone', v)}
              icon={<Phone size={16} />}
            />
          </div>
        );

      case 1: // Business Details
        return (
          <div className="grid gap-4">
            <Field
              label="Store/Business Name"
              placeholder="e.g., My Awesome Store"
              required
              value={details.storeName}
              onChange={(v) => updateField('storeName', v)}
              icon={<Store size={16} />}
            />
            <Field
              label="Website Domain"
              placeholder="e.g., myawesomestore.com"
              value={details.websiteDomain}
              onChange={(v) => updateField('websiteDomain', v)}
              icon={<Globe size={16} />}
            />
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
                <Briefcase size={16} />
                Legal Structure
              </label>
              <select
                value={details.legalStructure}
                onChange={(e) => updateField('legalStructure', e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
              >
                <option value="LLC">LLC</option>
                <option value="Corporation">Corporation</option>
                <option value="Partnership">Partnership</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </select>
            </div>
            <Field
              label="EIN (Tax ID)"
              placeholder="e.g., 12-3456789"
              value={details.ein}
              onChange={(v) => updateField('ein', v)}
              icon={<FileText size={16} />}
            />
            <Field
              label="Year Founded"
              placeholder="e.g., 2023"
              value={details.yearFounded}
              onChange={(v) => updateField('yearFounded', v)}
              icon={<FileText size={16} />}
            />
          </div>
        );

      case 2: // Business Address
        return (
          <div className="grid gap-4">
            <Field
              label="Street Address"
              placeholder="e.g., 123 Main Street"
              required
              value={details.businessStreet}
              onChange={(v) => updateField('businessStreet', v)}
              icon={<MapPin size={16} />}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="City"
                placeholder="e.g., New York"
                required
                value={details.businessCity}
                onChange={(v) => updateField('businessCity', v)}
                icon={<MapPin size={16} />}
              />
              <Field
                label="State"
                placeholder="e.g., NY"
                required
                value={details.businessState}
                onChange={(v) => updateField('businessState', v)}
                icon={<MapPin size={16} />}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Postal Code"
                placeholder="e.g., 10001"
                required
                value={details.businessPostalCode}
                onChange={(v) => updateField('businessPostalCode', v)}
                icon={<MapPin size={16} />}
              />
              <Field
                label="Country"
                placeholder="e.g., United States"
                required
                value={details.businessCountry}
                onChange={(v) => updateField('businessCountry', v)}
                icon={<MapPin size={16} />}
              />
            </div>
          </div>
        );

      case 3: // Marketing & Sales
        return (
          <div className="grid gap-4">
            <Field
              label="Niche/Industry"
              placeholder="e.g., Home Decor, Electronics, Fashion"
              required
              value={details.niche}
              onChange={(v) => updateField('niche', v)}
              icon={<Tag size={16} />}
            />
            <Field
              label="Target Customer Segment"
              placeholder="e.g., Young professionals, Families, Seniors"
              value={details.targetCustomerSegment}
              onChange={(v) => updateField('targetCustomerSegment', v)}
              icon={<Users size={16} />}
            />
            <Field
              label="Estimated Annual Sales"
              placeholder="e.g., $700,000"
              value={details.estimatedSales}
              onChange={(v) => updateField('estimatedSales', v)}
              icon={<DollarSign size={16} />}
            />
            <Field
              label="Number of Employees"
              placeholder="e.g., 5-10"
              value={details.employees}
              onChange={(v) => updateField('employees', v)}
              icon={<Users size={16} />}
            />
          </div>
        );

      case 4: // Legal & Compliance
        return (
          <div className="grid gap-4">
            <Field
              label="Resale Certificate Number"
              placeholder="e.g., RC-123456"
              value={details.resaleCertificate}
              onChange={(v) => updateField('resaleCertificate', v)}
              icon={<FileText size={16} />}
            />
            <Field
              label="Business License Number"
              placeholder="e.g., BL-789012"
              value={details.businessLicense}
              onChange={(v) => updateField('businessLicense', v)}
              icon={<FileText size={16} />}
            />
          </div>
        );

      case 5: // Supplier Information
        return (
          <div className="grid gap-4">
            <Field
              label="Supplier/Brand Name"
              placeholder="e.g., ABC Manufacturing"
              required
              value={details.supplierName}
              onChange={(v) => updateField('supplierName', v)}
              icon={<Briefcase size={16} />}
            />
            <Field
              label="Dealer Application Form URL"
              placeholder="e.g., https://supplier.com/dealer-application"
              value={details.dealerFormUrl}
              onChange={(v) => updateField('dealerFormUrl', v)}
              icon={<Globe size={16} />}
            />
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
                <FileText size={16} />
                Dealer Form Fields (Optional)
              </label>
              <textarea
                placeholder="Paste any specific form fields or requirements here..."
                value={details.dealerFormFields}
                onChange={(e) => updateField('dealerFormFields', e.target.value)}
                rows={4}
                autoComplete="on"
                className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
              />
            </div>
          </div>
        );

      case 6: // Review & Generate
        return (
          <div className="space-y-6">
            <div className="border border-[#333333] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#c19d44] mb-4">Review Your Information</h3>
              <div className="grid gap-3 text-sm text-[#ffffff80]">
                <div><strong className="text-white">Name:</strong> {details.contactFirstName} {details.contactLastName}</div>
                <div><strong className="text-white">Email:</strong> {details.contactEmail}</div>
                <div><strong className="text-white">Phone:</strong> {details.contactPhone}</div>
                <div><strong className="text-white">Business:</strong> {details.storeName}</div>
                <div><strong className="text-white">Niche:</strong> {details.niche}</div>
                <div><strong className="text-white">Supplier:</strong> {details.supplierName}</div>
              </div>
            </div>
            
            <button
              onClick={generateTemplate}
              disabled={isGenerating}
              className="tool-button primary w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Template...
                </>
              ) : (
                'Generate Dealer Application Template'
              )}
            </button>

            {generatedTemplate && (
              <div className="border border-[#333333] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#c19d44] mb-4">Generated Template</h3>
                <pre className="text-sm text-[#ffffff80] whitespace-pre-wrap bg-transparent p-4 rounded-lg overflow-x-auto">
                  {generatedTemplate}
                </pre>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <button
            onClick={() => window.history.back()}
            className="back-button"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="main-logo">
            <img 
              src="https://cdn.prod.website-files.com/67692e83aa3faae2c7985fcc/679934bc5b34b807e6cac177_highticket-logo-full-white.svg" 
              alt="HighTicket.io" 
              className="logo-svg"
            />
          </div>
        </div>

        <div className="tools-section">
          <h2>AI Dealer Application Assistant</h2>
          <p className="text-[#ffffff80] mb-8">Automatically generate dealer application forms and outreach messages for supplier partnerships</p>
        </div>

        <div className="tool-content-wrapper">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
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
          <div className="tool-card mb-8">
            <div className="tool-header mb-6">
              <div className="tool-icon">
                {React.createElement(steps[currentStep].icon, { size: 32 })}
              </div>
              <div className="tool-status ready">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            <div className="tool-content">
              <h3 className="tool-title mb-6">{steps[currentStep].title}</h3>
              {renderStep()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="tool-button secondary nav-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />
              Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
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
        </div>
      </div>
    </div>
  );
};

export default DealerApplication;