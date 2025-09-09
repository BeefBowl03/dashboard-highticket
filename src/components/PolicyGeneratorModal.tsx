import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, FileText, Download, CheckCircle } from 'lucide-react';
import './PolicyGeneratorModal.css';

interface PolicyData {
  businessName: string;
  businessType: string;
  websiteUrl: string;
  contactEmail: string;
  businessAddress: string;
  country: string;
  phoneNumber: string;
  businessDescription: string;
  shippingMethods: string;
  deliveryTime: string;
  returnPolicy: string;
  paymentMethods: string;
  cookiesUsed: string;
  dataCollection: string;
  userRights: string;
  securityMeasures: string;
  governingLaw: string;
}

interface Question {
  id: number;
  field: keyof PolicyData;
  question: string;
  guidance: string;
  type: 'text' | 'email' | 'url' | 'select' | 'textarea';
  required: boolean;
  defaultValue: string;
  options?: string[];
  group: string;
}

interface PolicyGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyGeneratorModal: React.FC<PolicyGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: questions, 1: review, 2: policy selection, 3: results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [policyData, setPolicyData] = useState<PolicyData>({} as PolicyData);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [generatedPolicies, setGeneratedPolicies] = useState<{[key: string]: string}>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Comprehensive questions based on the Legal Policy Generator repository
  const questions: Question[] = [
    {
      id: 1,
      field: 'businessName',
      question: 'What is your business name?',
      guidance: 'Enter the legal name of your business as it appears in official documents.',
      type: 'text',
      required: true,
      defaultValue: '',
      group: 'Basic Information'
    },
    {
      id: 2,
      field: 'businessType',
      question: 'What type of business do you operate?',
      guidance: 'Select the category that best describes your business model.',
      type: 'select',
      required: true,
      defaultValue: '',
      options: ['E-commerce Store', 'SaaS Platform', 'Service Business', 'Blog/Content Site', 'Marketplace', 'Consulting', 'Manufacturing', 'Retail', 'Digital Products', 'Subscription Service'],
      group: 'Basic Information'
    },
    {
      id: 3,
      field: 'websiteUrl',
      question: 'What is your website URL?',
      guidance: 'Enter the main website URL where these policies will be displayed.',
      type: 'url',
      required: true,
      defaultValue: '',
      group: 'Basic Information'
    },
    {
      id: 4,
      field: 'contactEmail',
      question: 'What is your primary contact email?',
      guidance: 'This email will be used for policy-related inquiries and customer support.',
      type: 'email',
      required: true,
      defaultValue: '',
      group: 'Contact Information'
    },
    {
      id: 5,
      field: 'businessAddress',
      question: 'What is your complete business address?',
      guidance: 'Include street address, city, state/province, postal code, and country.',
      type: 'textarea',
      required: true,
      defaultValue: '',
      group: 'Contact Information'
    },
    {
      id: 6,
      field: 'country',
      question: 'In which country is your business primarily located?',
      guidance: 'This helps determine applicable laws and regulations for your policies.',
      type: 'select',
      required: true,
      defaultValue: '',
      options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Netherlands', 'Other'],
      group: 'Location & Legal'
    },
    {
      id: 7,
      field: 'phoneNumber',
      question: 'What is your business phone number?',
      guidance: 'Include country code if serving international customers.',
      type: 'text',
      required: false,
      defaultValue: '',
      group: 'Contact Information'
    },
    {
      id: 8,
      field: 'businessDescription',
      question: 'Describe what your business does',
      guidance: 'Provide a clear, concise description of your products or services.',
      type: 'textarea',
      required: true,
      defaultValue: '',
      group: 'Business Details'
    },
    {
      id: 9,
      field: 'shippingMethods',
      question: 'What shipping methods do you offer?',
      guidance: 'List all shipping options available to customers (leave blank if digital only).',
      type: 'textarea',
      required: false,
      defaultValue: 'Standard shipping (5-7 business days), Express shipping (2-3 business days), Overnight shipping (1 business day)',
      group: 'Shipping & Delivery'
    },
    {
      id: 10,
      field: 'deliveryTime',
      question: 'What are your typical delivery timeframes?',
      guidance: 'Specify delivery times for different shipping methods.',
      type: 'textarea',
      required: false,
      defaultValue: 'Orders are processed within 1-2 business days. Standard delivery takes 5-7 business days.',
      group: 'Shipping & Delivery'
    },
    {
      id: 11,
      field: 'returnPolicy',
      question: 'What is your return and refund policy?',
      guidance: 'Describe conditions for returns, exchanges, and refunds.',
      type: 'textarea',
      required: true,
      defaultValue: '30-day return policy for unused items in original packaging. Customer pays return shipping costs.',
      group: 'Returns & Refunds'
    },
    {
      id: 12,
      field: 'paymentMethods',
      question: 'What payment methods do you accept?',
      guidance: 'List all accepted payment options.',
      type: 'textarea',
      required: true,
      defaultValue: 'Credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay',
      group: 'Payment & Billing'
    },
    {
      id: 13,
      field: 'cookiesUsed',
      question: 'What types of cookies does your website use?',
      guidance: 'Describe the cookies and tracking technologies used on your website.',
      type: 'textarea',
      required: true,
      defaultValue: 'Essential cookies for website functionality, Analytics cookies for website performance, Marketing cookies for advertising',
      group: 'Privacy & Data'
    },
    {
      id: 14,
      field: 'dataCollection',
      question: 'What personal data do you collect from users?',
      guidance: 'List all types of personal information you collect.',
      type: 'textarea',
      required: true,
      defaultValue: 'Name, email address, shipping address, payment information, browsing behavior',
      group: 'Privacy & Data'
    },
    {
      id: 15,
      field: 'userRights',
      question: 'What rights do users have regarding their data?',
      guidance: 'Describe user rights like access, deletion, portability, etc.',
      type: 'textarea',
      required: true,
      defaultValue: 'Right to access, correct, delete, and port personal data. Right to opt-out of marketing communications.',
      group: 'Privacy & Data'
    },
    {
      id: 16,
      field: 'securityMeasures',
      question: 'What security measures do you use to protect data?',
      guidance: 'Describe how you protect customer information.',
      type: 'textarea',
      required: true,
      defaultValue: 'SSL encryption, secure payment processing, regular security audits, access controls',
      group: 'Security'
    },
    {
      id: 17,
      field: 'governingLaw',
      question: 'Which laws govern your business operations?',
      guidance: 'Specify the jurisdiction and laws that apply to your business.',
      type: 'text',
      required: true,
      defaultValue: 'Laws of [Your State/Province] and [Your Country]',
      group: 'Location & Legal'
    }
  ];

  const policyTypes = [
    { 
      id: 'privacy', 
      name: 'Privacy Policy', 
      description: 'How you collect, use, and protect customer data',
      icon: '🔒'
    },
    { 
      id: 'terms', 
      name: 'Terms of Service', 
      description: 'Rules and guidelines for using your service',
      icon: '📋'
    },
    { 
      id: 'shipping', 
      name: 'Shipping Policy', 
      description: 'Shipping methods, costs, and delivery information',
      icon: '📦'
    },
    { 
      id: 'return', 
      name: 'Return & Refund Policy', 
      description: 'Return process and refund conditions',
      icon: '↩️'
    },
    { 
      id: 'cookie', 
      name: 'Cookie Policy', 
      description: 'Information about cookies used on your website',
      icon: '🍪'
    },
    { 
      id: 'disclaimer', 
      name: 'Disclaimer', 
      description: 'Legal disclaimers and limitations of liability',
      icon: '⚠️'
    }
  ];

  const handleInputChange = (field: keyof PolicyData, value: string) => {
    setPolicyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep(1); // Move to review step
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const generatePolicies = async () => {
    setIsGenerating(true);
    setCurrentStep(3); // Move to results step
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const policies: {[key: string]: string} = {};
    
    selectedPolicies.forEach(policyType => {
      policies[policyType] = generatePolicyContent(policyType, policyData);
    });
    
    setGeneratedPolicies(policies);
    setIsGenerating(false);
  };

  const generatePolicyContent = (policyType: string, data: PolicyData): string => {
    const currentDate = new Date().toLocaleDateString();
    
    const baseStyles = `
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px 20px;
          color: #333;
          background: #fff;
        }
        h1 { 
          color: #2c3e50; 
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        h2 { 
          color: #34495e; 
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .effective-date { 
          font-style: italic; 
          color: #7f8c8d; 
          margin-bottom: 30px;
          padding: 15px;
          background: #ecf0f1;
          border-left: 4px solid #3498db;
        }
        .contact-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
        }
        ul { margin: 15px 0; padding-left: 25px; }
        li { margin: 8px 0; }
      </style>
    `;
    
    switch (policyType) {
      case 'privacy':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - ${data.businessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Privacy Policy</h1>
    <div class="effective-date">
        <strong>Effective Date:</strong> ${currentDate}<br>
        <strong>Last Updated:</strong> ${currentDate}
    </div>
    
    <h2>1. Information We Collect</h2>
    <p>At ${data.businessName}, we collect the following types of information:</p>
    <p><strong>Personal Information:</strong> ${data.dataCollection}</p>
    <p><strong>Business Description:</strong> ${data.businessDescription}</p>
    
    <h2>2. How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul>
        <li>Process and fulfill your orders</li>
        <li>Provide customer service and support</li>
        <li>Send you important updates about your account</li>
        <li>Improve our products and services</li>
        <li>Comply with legal obligations</li>
    </ul>
    
    <h2>3. Cookies and Tracking Technologies</h2>
    <p>Our website uses the following cookies and tracking technologies:</p>
    <p>${data.cookiesUsed}</p>
    
    <h2>4. Your Rights</h2>
    <p>You have the following rights regarding your personal information:</p>
    <p>${data.userRights}</p>
    
    <h2>5. Data Security</h2>
    <p>We implement the following security measures to protect your information:</p>
    <p>${data.securityMeasures}</p>
    
    <h2>6. Information Sharing</h2>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
    
    <div class="contact-info">
        <h2>7. Contact Information</h2>
        <p>If you have questions about this Privacy Policy, please contact us at:</p>
        <p><strong>${data.businessName}</strong><br>
        Email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a><br>
        Website: <a href="${data.websiteUrl}">${data.websiteUrl}</a><br>
        ${data.phoneNumber ? `Phone: ${data.phoneNumber}<br>` : ''}
        Address: ${data.businessAddress}</p>
    </div>
    
    <p><em>This policy is governed by the ${data.governingLaw}.</em></p>
</body>
</html>`;

      case 'terms':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - ${data.businessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Terms of Service</h1>
    <div class="effective-date">
        <strong>Effective Date:</strong> ${currentDate}
    </div>
    
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using ${data.websiteUrl}, you accept and agree to be bound by the terms and provision of this agreement.</p>
    
    <h2>2. Description of Service</h2>
    <p>${data.businessName} provides the following services: ${data.businessDescription}</p>
    
    <h2>3. User Obligations</h2>
    <p>You agree to:</p>
    <ul>
        <li>Provide accurate and complete information</li>
        <li>Use our services in compliance with applicable laws</li>
        <li>Respect intellectual property rights</li>
        <li>Not engage in prohibited activities</li>
        <li>Maintain the confidentiality of your account</li>
    </ul>
    
    <h2>4. Payment Terms</h2>
    <p>We accept the following payment methods: ${data.paymentMethods}</p>
    <p>All prices are subject to change without notice. Payment is required at the time of purchase unless otherwise specified.</p>
    
    <h2>5. Shipping and Delivery</h2>
    ${data.shippingMethods ? `<p><strong>Shipping Methods:</strong> ${data.shippingMethods}</p>` : ''}
    ${data.deliveryTime ? `<p><strong>Delivery Times:</strong> ${data.deliveryTime}</p>` : ''}
    
    <h2>6. Returns and Refunds</h2>
    <p>${data.returnPolicy}</p>
    
    <h2>7. Limitation of Liability</h2>
    <p>${data.businessName} shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
    
    <h2>8. Governing Law</h2>
    <p>These terms are governed by ${data.governingLaw}.</p>
    
    <div class="contact-info">
        <h2>9. Contact Information</h2>
        <p>For questions about these Terms of Service:</p>
        <p><strong>${data.businessName}</strong><br>
        Email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a><br>
        Website: <a href="${data.websiteUrl}">${data.websiteUrl}</a></p>
    </div>
</body>
</html>`;

      case 'shipping':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shipping Policy - ${data.businessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Shipping Policy</h1>
    <div class="effective-date">
        <strong>Effective Date:</strong> ${currentDate}
    </div>
    
    <h2>1. Shipping Methods</h2>
    <p>${data.shippingMethods || 'We offer various shipping options to meet your needs.'}</p>
    
    <h2>2. Processing Time</h2>
    <p>Orders are typically processed within 1-2 business days. You will receive a confirmation email once your order has been shipped.</p>
    
    <h2>3. Delivery Times</h2>
    <p>${data.deliveryTime || 'Delivery times vary based on your location and selected shipping method.'}</p>
    
    <h2>4. Shipping Costs</h2>
    <p>Shipping costs are calculated at checkout based on your location and selected shipping method.</p>
    
    <h2>5. International Shipping</h2>
    <p>We currently ship to ${data.country}. International shipping may be available upon request.</p>
    
    <div class="contact-info">
        <h2>6. Contact Information</h2>
        <p>For shipping inquiries:</p>
        <p><strong>${data.businessName}</strong><br>
        Email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></p>
    </div>
</body>
</html>`;

      case 'return':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return & Refund Policy - ${data.businessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Return & Refund Policy</h1>
    <div class="effective-date">
        <strong>Effective Date:</strong> ${currentDate}
    </div>
    
    <h2>1. Return Policy</h2>
    <p>${data.returnPolicy}</p>
    
    <h2>2. How to Return Items</h2>
    <ol>
        <li>Contact us at ${data.contactEmail} to initiate a return</li>
        <li>Provide your order number and reason for return</li>
        <li>We'll provide return instructions and shipping label if applicable</li>
        <li>Package items securely in original packaging</li>
        <li>Ship the items back to us using provided instructions</li>
    </ol>
    
    <h2>3. Refund Process</h2>
    <p>Once we receive and inspect your returned items, we'll process your refund within 5-10 business days to your original payment method.</p>
    
    <h2>4. Non-Returnable Items</h2>
    <ul>
        <li>Digital products after download</li>
        <li>Personalized or customized items</li>
        <li>Items damaged due to misuse</li>
        <li>Items returned after the return period</li>
    </ul>
    
    <div class="contact-info">
        <h2>5. Contact Us</h2>
        <p>Questions about returns or refunds?</p>
        <p><strong>${data.businessName}</strong><br>
        Email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a><br>
        Website: <a href="${data.websiteUrl}">${data.websiteUrl}</a></p>
    </div>
</body>
</html>`;

      case 'cookie':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cookie Policy - ${data.businessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Cookie Policy</h1>
    <div class="effective-date">
        <strong>Effective Date:</strong> ${currentDate}
    </div>
    
    <h2>1. What Are Cookies</h2>
    <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience.</p>
    
    <h2>2. Types of Cookies We Use</h2>
    <p>${data.cookiesUsed}</p>
    
    <h2>3. How We Use Cookies</h2>
    <ul>
        <li>To remember your preferences and settings</li>
        <li>To analyze website traffic and usage patterns</li>
        <li>To provide personalized content and advertisements</li>
        <li>To ensure website security and functionality</li>
    </ul>
    
    <h2>4. Managing Cookies</h2>
    <p>You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.</p>
    
    <h2>5. Third-Party Cookies</h2>
    <p>We may use third-party services that set their own cookies. Please refer to their respective privacy policies for more information.</p>
    
    <div class="contact-info">
        <h2>6. Contact Information</h2>
        <p>If you have questions about our use of cookies:</p>
        <p><strong>${data.businessName}</strong><br>
        Email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></p>
    </div>
</body>
</html>`;

      case 'disclaimer':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Disclaimer - ${data.businessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Disclaimer</h1>
    <div class="effective-date">
        <strong>Effective Date:</strong> ${currentDate}
    </div>
    
    <h2>1. General Information</h2>
    <p>The information provided by ${data.businessName} is for general informational purposes only. We make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of our services.</p>
    
    <h2>2. Professional Advice</h2>
    <p>The information provided should not be considered as professional advice. Always seek the advice of qualified professionals for specific situations.</p>
    
    <h2>3. Limitation of Liability</h2>
    <p>In no event shall ${data.businessName} be liable for any special, direct, indirect, consequential, or incidental damages arising from the use of our services.</p>
    
    <h2>4. External Links</h2>
    <p>Our website may contain links to external sites. We are not responsible for the content or practices of these external sites.</p>
    
    <h2>5. Changes to Services</h2>
    <p>We reserve the right to modify or discontinue our services at any time without prior notice.</p>
    
    <div class="contact-info">
        <h2>6. Contact Information</h2>
        <p><strong>${data.businessName}</strong><br>
        Email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a><br>
        Website: <a href="${data.websiteUrl}">${data.websiteUrl}</a></p>
    </div>
    
    <p><em>This disclaimer is governed by ${data.governingLaw}.</em></p>
</body>
</html>`;

      default:
        return `Policy content for ${policyType}`;
    }
  };

  const downloadPolicy = (policyType: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${policyData.businessName}_${policyType}_policy.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetModal = () => {
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setPolicyData({} as PolicyData);
    setSelectedPolicies([]);
    setGeneratedPolicies({});
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={24} />
            <h2>Legal Policy Generator</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {currentStep === 0 && (
            <div className="question-step">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-text">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>

              <div className="question-content">
                <div className="question-group">{currentQuestion.group}</div>
                <h3 className="question-title">{currentQuestion.question}</h3>
                <p className="question-guidance">{currentQuestion.guidance}</p>

                <div className="question-input">
                  {currentQuestion.type === 'select' ? (
                    <select
                      value={policyData[currentQuestion.field] || ''}
                      onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select an option</option>
                      {currentQuestion.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : currentQuestion.type === 'textarea' ? (
                    <textarea
                      value={policyData[currentQuestion.field] || currentQuestion.defaultValue}
                      onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                      placeholder={currentQuestion.defaultValue}
                      className="form-textarea"
                      rows={4}
                    />
                  ) : (
                    <input
                      type={currentQuestion.type}
                      value={policyData[currentQuestion.field] || ''}
                      onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                      placeholder={currentQuestion.defaultValue}
                      className="form-input"
                    />
                  )}
                </div>
              </div>

              <div className="question-navigation">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="nav-button secondary"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestion.required && !policyData[currentQuestion.field]}
                  className="nav-button primary"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Review Answers' : 'Next'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="review-step">
              <h3>Review Your Information</h3>
              <div className="review-content">
                {questions.map(question => {
                  const value = policyData[question.field];
                  if (!value) return null;
                  return (
                    <div key={question.id} className="review-item">
                      <label>{question.question}</label>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="review-navigation">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="nav-button secondary"
                >
                  <ArrowLeft size={16} />
                  Back to Questions
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="nav-button primary"
                >
                  Select Policies
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="policy-selection-step">
              <h3>Select Policies to Generate</h3>
              <p className="selection-guidance">Choose which legal policies you need for your business. You can generate multiple policies at once.</p>
              
              <div className="policy-types">
                {policyTypes.map(policy => (
                  <div key={policy.id} className="policy-type-card">
                    <label className="policy-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedPolicies.includes(policy.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPolicies(prev => [...prev, policy.id]);
                          } else {
                            setSelectedPolicies(prev => prev.filter(id => id !== policy.id));
                          }
                        }}
                      />
                      <div className="policy-info">
                        <div className="policy-header">
                          <span className="policy-icon">{policy.icon}</span>
                          <h4>{policy.name}</h4>
                        </div>
                        <p>{policy.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="policy-navigation">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="nav-button secondary"
                >
                  <ArrowLeft size={16} />
                  Back to Review
                </button>
                <button
                  onClick={generatePolicies}
                  disabled={selectedPolicies.length === 0}
                  className="nav-button primary"
                >
                  Generate {selectedPolicies.length} {selectedPolicies.length === 1 ? 'Policy' : 'Policies'}
                  <FileText size={16} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="results-step">
              {isGenerating ? (
                <div className="generating-state">
                  <div className="generating-animation">
                    <div className="spinner"></div>
                  </div>
                  <h3>Generating Your Policies...</h3>
                  <p>Please wait while we create your professional legal documents.</p>
                </div>
              ) : (
                <>
                  <div className="success-header">
                    <CheckCircle size={48} className="success-icon" />
                    <h3>Policies Generated Successfully!</h3>
                    <p>Your professional legal documents are ready for download.</p>
                  </div>
                  
                  <div className="generated-policies">
                    {Object.entries(generatedPolicies).map(([policyType, content]) => {
                      const policyInfo = policyTypes.find(p => p.id === policyType);
                      return (
                        <div key={policyType} className="generated-policy">
                          <div className="policy-header">
                            <div className="policy-title">
                              <span className="policy-icon">{policyInfo?.icon}</span>
                              <h4>{policyInfo?.name}</h4>
                            </div>
                            <div className="policy-actions">
                              <button
                                onClick={() => downloadPolicy(policyType, content)}
                                className="action-button primary"
                              >
                                <Download size={16} />
                                Download HTML
                              </button>
                            </div>
                          </div>
                          <div className="policy-preview">
                            <iframe
                              srcDoc={content}
                              style={{ 
                                width: '100%', 
                                height: '200px', 
                                border: '1px solid #333',
                                borderRadius: '8px'
                              }}
                              title={`${policyInfo?.name} Preview`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="results-navigation">
                    <button
                      onClick={resetModal}
                      className="nav-button primary"
                    >
                      Generate New Policies
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyGeneratorModal;
