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

  const updateField = (field: keyof DealerDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
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

  const Field: React.FC<{
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
    required?: boolean;
    type?: string;
  }> = ({ label, placeholder, value, onChange, icon, required = false, type = 'text' }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent"
      />
    </div>
  );

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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Briefcase size={16} />
                Legal Structure
              </label>
              <select
                value={details.legalStructure}
                onChange={(e) => updateField('legalStructure', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent"
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FileText size={16} />
                Dealer Form Fields (Optional)
              </label>
              <textarea
                placeholder="Paste any specific form fields or requirements here..."
                value={details.dealerFormFields}
                onChange={(e) => updateField('dealerFormFields', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 6: // Review & Generate
        return (
          <div className="space-y-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#FACC15] mb-4">Review Your Information</h3>
              <div className="grid gap-3 text-sm">
                <div><strong>Name:</strong> {details.contactFirstName} {details.contactLastName}</div>
                <div><strong>Email:</strong> {details.contactEmail}</div>
                <div><strong>Phone:</strong> {details.contactPhone}</div>
                <div><strong>Business:</strong> {details.storeName}</div>
                <div><strong>Niche:</strong> {details.niche}</div>
                <div><strong>Supplier:</strong> {details.supplierName}</div>
              </div>
            </div>
            
            <button
              onClick={generateTemplate}
              disabled={isGenerating}
              className="w-full px-6 py-4 bg-[#FACC15] text-black font-semibold rounded-lg hover:bg-[#e6b812] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#FACC15] mb-4">Generated Template</h3>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-black/20 p-4 rounded-lg overflow-x-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Dealer Application</h1>
          <p className="text-gray-300">Automatically generate dealer application forms</p>
        </div>

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
                    ? 'bg-[#FACC15] border-[#FACC15] text-black' 
                    : isCurrent 
                    ? 'border-[#FACC15] text-[#FACC15]' 
                    : 'border-gray-600 text-gray-600'
                }`}>
                  {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    isCompleted ? 'bg-[#FACC15]' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {steps[currentStep].title}
          </h2>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Previous
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-[#FACC15] text-black rounded-lg hover:bg-[#e6b812] transition flex items-center gap-2"
            >
              Next
              <ArrowRight size={20} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DealerApplication;