import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  User, 
  Bot, 
  FileText
} from 'lucide-react';
import './PolicyGeneratorChat.css';

interface PolicyData {
  // Business Information
  legalBusinessName: string;
  storeWebsiteName: string;
  primaryWebsiteDomain: string;
  countryOfIncorporation: string;
  fullStreetAddress: string;
  mainContactEmail: string;
  phoneNumber: string;
  customerServiceHours: string;
  isoCurrencyCode: string;
  
  // Shipping Information
  domesticFreeShippingThreshold: string;
  domesticFlatRateShippingFee: string;
  internationalFlatRateShippingFee: string;
  orderProcessingTime: string;
  dailyOrderCutoff: string;
  domesticDeliveryEstimateStandard: string;
  domesticDeliveryEstimateExpedited: string;
  internationalDeliveryEstimate: string;
  
  // Returns and Policies
  returnWindowDays: string;
  shipToCountries: string;
  domesticCarriers: string;
  internationalCarriers: string;
  acceptedPayments: string;
  sellingRegions: string;
  exemptProductCategories: string;
  
  // Additional Information
  cookieList: string;
  affiliateProgramName: string;
  governingLawState: string;
  trackOrderURL: string;
  faqPageURL: string;
  returnPolicyURL: string;
  termsOfServicePageURL: string;
  contactPageURL: string;
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isQuestion?: boolean;
  questionField?: keyof PolicyData;
  options?: string[];
  inputType?: 'text' | 'email' | 'url' | 'domain' | 'select' | 'textarea';
  defaultValue?: string;
  isReview?: boolean;
  isEditing?: boolean;
  isEditedReview?: boolean;
  isPolicyDisplay?: boolean;
  generatedPolicies?: {[key: string]: string};
  policyIds?: string[];
}

interface Question {
  id: number;
  field: keyof PolicyData;
  question: string;
  guidance: string;
  type: 'text' | 'email' | 'url' | 'domain' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  group: string;
}

const PolicyGeneratorChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [policyData, setPolicyData] = useState<PolicyData>({} as PolicyData);
  const [chatPhase, setChatPhase] = useState<'intro' | 'questions' | 'review' | 'complete'>('intro');
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);
  const [generatedPolicies, setGeneratedPolicies] = useState<{[key: string]: string}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions: Question[] = [
    // Business Information Group
    {
      id: 1,
      field: 'legalBusinessName',
      question: 'What is your legal business name?',
      guidance: 'Please enter the exact name shown on your formation documents (for example, Sauna Haven USA LLC).',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 2,
      field: 'storeWebsiteName',
      question: 'What is your store / website name?',
      guidance: 'Type the public-facing brand name exactly as you want it displayed (for example, Sauna Haven USA).',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 3,
      field: 'primaryWebsiteDomain',
      question: 'What is your primary website domain?',
      guidance: 'Type just the domain, such as SaunaHavenUSA.com. Must include a valid domain extension (e.g., .com, .net, .org).',
      type: 'domain',
      required: true,
      group: 'Business Information'
    },
    {
      id: 4,
      field: 'countryOfIncorporation',
      question: 'In which country is the business incorporated?',
      guidance: 'For example, "United States".',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 5,
      field: 'fullStreetAddress',
      question: 'What is your company\'s full street address?',
      guidance: 'Provide Street, City, State/Province, ZIP/Postal Code, and Country (e.g. 123 Elm St, Springfield, IL 62704, USA).',
      type: 'textarea',
      required: true,
      group: 'Business Information'
    },
    {
      id: 6,
      field: 'mainContactEmail',
      question: 'What is your main contact e-mail address?',
      guidance: 'For example, info@saunahavenusa.com. Must be a valid email format.',
      type: 'email',
      required: true,
      group: 'Business Information'
    },
    {
      id: 7,
      field: 'phoneNumber',
      question: 'What phone number should appear in all policies?',
      guidance: 'Include country code, for example +1 555-123-4567.',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 8,
      field: 'customerServiceHours',
      question: 'What are your customer-service days and hours?',
      guidance: 'For example, "Mon–Fri 9 AM–5 PM EST".',
      type: 'text',
      required: true,
      defaultValue: 'Mon–Fri 9 AM–5 PM EST',
      group: 'Business Information'
    },
    {
      id: 9,
      field: 'isoCurrencyCode',
      question: 'Which ISO currency code will you use?',
      guidance: 'Type the three-letter code, for example USD.',
      type: 'text',
      required: true,
      defaultValue: 'USD',
      group: 'Business Information'
    },

    // Shipping Information Group
    {
      id: 10,
      field: 'domesticFreeShippingThreshold',
      question: 'What is your domestic free-shipping threshold?',
      guidance: 'Enter the amount in dollars (e.g. 50 means free shipping on orders over $50). Leave blank or enter 0 for no free shipping threshold.',
      type: 'text',
      required: false,
      defaultValue: '',
      group: 'Shipping Information'
    },
    {
      id: 11,
      field: 'domesticFlatRateShippingFee',
      question: 'What is your domestic flat-rate shipping fee?',
      guidance: 'Enter the fee amount in dollars. Leave blank or enter 0 for no flat rate fee.',
      type: 'text',
      required: false,
      defaultValue: '',
      group: 'Shipping Information'
    },
    {
      id: 12,
      field: 'internationalFlatRateShippingFee',
      question: 'What is your international flat-rate shipping fee?',
      guidance: 'Enter the fee amount in dollars, or leave blank to use "Custom (calculated at checkout)".',
      type: 'text',
      required: true,
      defaultValue: 'Custom (calculated at checkout)',
      group: 'Shipping Information'
    },
    {
      id: 13,
      field: 'orderProcessingTime',
      question: 'How many business days do you need to process an order?',
      guidance: 'Provide a range such as "1–2 days".',
      type: 'text',
      required: true,
      defaultValue: '1–2 days',
      group: 'Shipping Information'
    },
    {
      id: 14,
      field: 'dailyOrderCutoff',
      question: 'At what daily time and time-zone do orders stop processing?',
      guidance: 'For example "17:00 EST".',
      type: 'text',
      required: true,
      defaultValue: '17:00 EST',
      group: 'Shipping Information'
    },
    {
      id: 15,
      field: 'domesticDeliveryEstimateStandard',
      question: 'What is the delivery estimate for standard domestic shipping?',
      guidance: 'Provide a range such as "5–7 business days".',
      type: 'text',
      required: true,
      defaultValue: '5–7 business days',
      group: 'Shipping Information'
    },
    {
      id: 16,
      field: 'domesticDeliveryEstimateExpedited',
      question: 'What is the delivery estimate for expedited domestic shipping?',
      guidance: 'Provide a range such as "2–3 business days".',
      type: 'text',
      required: true,
      defaultValue: '2–3 business days',
      group: 'Shipping Information'
    },
    {
      id: 17,
      field: 'internationalDeliveryEstimate',
      question: 'What is the delivery estimate for international shipping?',
      guidance: 'Provide a range such as "7–14 business days".',
      type: 'text',
      required: true,
      defaultValue: '7–14 business days',
      group: 'Shipping Information'
    },

    // Returns and Policies Group
    {
      id: 18,
      field: 'returnWindowDays',
      question: 'How many days does a customer have to request a return?',
      guidance: 'Type a number of days.',
      type: 'text',
      required: true,
      defaultValue: '30',
      group: 'Returns and Policies'
    },
    {
      id: 19,
      field: 'shipToCountries',
      question: 'Which countries or regions do you ship to?',
      guidance: 'Enter a comma-separated list.',
      type: 'textarea',
      required: true,
      defaultValue: 'United States (excluding Puerto Rico)',
      group: 'Returns and Policies'
    },
    {
      id: 20,
      field: 'domesticCarriers',
      question: 'Which carriers handle your domestic shipments?',
      guidance: 'List the carrier names.',
      type: 'textarea',
      required: true,
      defaultValue: 'varies by product – contact us to inquire',
      group: 'Returns and Policies'
    },
    {
      id: 21,
      field: 'internationalCarriers',
      question: 'Which carriers handle your international shipments?',
      guidance: 'List the carrier names.',
      type: 'textarea',
      required: true,
      defaultValue: 'varies by product – contact us to inquire',
      group: 'Returns and Policies'
    },
    {
      id: 22,
      field: 'acceptedPayments',
      question: 'Which payment methods do you accept?',
      guidance: 'List the methods.',
      type: 'textarea',
      required: true,
      defaultValue: 'Visa, Mastercard, AmEx, PayPal, etc.',
      group: 'Returns and Policies'
    },
    {
      id: 23,
      field: 'sellingRegions',
      question: 'In which countries or regions are your products legally offered for sale?',
      guidance: 'Enter a list, or leave blank to reuse your shipping countries.',
      type: 'textarea',
      required: false,
      group: 'Returns and Policies'
    },
    {
      id: 24,
      field: 'exemptProductCategories',
      question: 'Which product categories are non-returnable?',
      guidance: 'List the categories (e.g. custom, perishable), or leave blank for "None".',
      type: 'textarea',
      required: true,
      defaultValue: 'None',
      group: 'Returns and Policies'
    },

    // Additional Information Group
    {
      id: 25,
      field: 'cookieList',
      question: 'Do you have a cookie list you would like to supply?',
      guidance: 'Paste your cookie table (name, purpose, type, expiration), or leave blank to use a standard essential + analytics set.',
      type: 'textarea',
      required: true,
      defaultValue: 'standard essential + analytics',
      group: 'Additional Information'
    },
    {
      id: 26,
      field: 'affiliateProgramName',
      question: 'Do you participate in an affiliate programme?',
      guidance: 'Provide the programme name and website(s), or leave blank for "N/A".',
      type: 'textarea',
      required: true,
      defaultValue: 'N/A',
      group: 'Additional Information'
    },
    {
      id: 27,
      field: 'governingLawState',
      question: 'Which state\'s law governs your contract if the company is US-based?',
      guidance: 'Enter the full state name or the two-letter code (e.g. Delaware or DE).',
      type: 'text',
      required: true,
      group: 'Additional Information'
    },
    {
      id: 28,
      field: 'trackOrderURL',
      question: 'How can customers track their orders?',
      guidance: 'Paste a tracking URL, or leave blank for "tracking link will be sent via email".',
      type: 'text',
      required: true,
      defaultValue: 'tracking link will be sent via email',
      group: 'Additional Information'
    },
    {
      id: 29,
      field: 'faqPageURL',
      question: 'What is the full URL of your FAQ page?',
      guidance: 'This will be auto-filled with your domain. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    },
    {
      id: 30,
      field: 'returnPolicyURL',
      question: 'What is the full URL of your Return and Refund Policy?',
      guidance: 'This will be auto-filled with your domain + /return-and-refund-policy. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    },
    {
      id: 31,
      field: 'termsOfServicePageURL',
      question: 'What is the full URL of your Terms of Service page?',
      guidance: 'This will be auto-filled with your domain. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    },
    {
      id: 32,
      field: 'contactPageURL',
      question: 'What is the full URL of your Contact-us page?',
      guidance: 'This will be auto-filled with your domain. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    }
  ];

  // Policy HTML Templates
  const privacyPolicyTemplate = `<style>
.sp--fullbleed {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.privacy-policy {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #fff;
}

.privacy-policy h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 3px solid #3182ce;
  padding-bottom: 1rem;
}

.privacy-policy h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2rem 0 1rem 0;
  padding: 0.5rem 0;
  border-left: 4px solid #3182ce;
  padding-left: 1rem;
}

.privacy-policy h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #4a5568;
  margin: 1.5rem 0 0.5rem 0;
}

.privacy-policy p {
  margin-bottom: 1rem;
  text-align: justify;
}

.privacy-policy ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

.privacy-policy li {
  margin-bottom: 0.5rem;
}

.privacy-policy strong {
  color: #2d3748;
  font-weight: 600;
}

.privacy-policy .highlight-box {
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.privacy-policy .info-box {
  background: #f0fff4;
  border: 1px solid #c6f6d5;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.privacy-policy .warning-box {
  background: #fffaf0;
  border: 1px solid #fbd38d;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.privacy-policy .contact-info {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: center;
}

.privacy-policy .contact-info h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.privacy-policy .contact-info p {
  margin: 0.5rem 0;
  text-align: center;
}

.privacy-policy .contact-info a {
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.privacy-policy .contact-info a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-policy {
    padding: 20px 15px;
  }
  
  .privacy-policy h1 {
    font-size: 2rem;
  }
  
  .privacy-policy h2 {
    font-size: 1.5rem;
  }
  
  .privacy-policy h3 {
    font-size: 1.2rem;
  }
}
</style>

<div class="privacy-policy sp--fullbleed">
  <h1>Privacy Policy</h1>
  
  <div class="highlight-box">
    <p><strong>Effective Date:</strong> [Insert Effective Date]</p>
    <p><strong>Last Updated:</strong> [Insert Effective Date]</p>
  </div>

  <h2>1. Introduction</h2>
  <p>[Your Company Name] ("we", "our", or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [Your Website URL] or use our services.</p>
  
  <p>By accessing or using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.</p>

  <h2>2. Information We Collect</h2>
  <h3>2.1 Personal Information</h3>
  <p>We may collect the following types of personal information:</p>
  <ul>
    <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
    <li><strong>Account Information:</strong> Username, password, and account preferences</li>
    <li><strong>Payment Information:</strong> Credit card details, billing address, and payment history</li>
    <li><strong>Order Information:</strong> Purchase history, shipping details, and product preferences</li>
    <li><strong>Communication Data:</strong> Correspondence with our customer service team</li>
  </ul>

  <h2>3. Contact Information</h2>
  <div class="contact-info">
    <h3>Questions About This Privacy Policy?</h3>
    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
    
    <p><strong>Email:</strong> <a href="mailto:[Your Contact Email]">[Your Contact Email]</a></p>
    <p><strong>Phone:</strong> <a href="tel:[Your Contact Phone Number]">[Your Contact Phone Number]</a></p>
    <p><strong>Address:</strong> [Your Company Address]</p>
  </div>
</div>`;

  const termsOfServiceTemplate = `<style>
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .tos { font-family: Arial, sans-serif; line-height: 1.6; }
  .tos * { box-sizing: border-box; }

  .tos h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .tos h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .tos h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }

  .tos p  { font-size: 16px; margin: 0 0 1rem 0; }
  .tos ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .tos li { margin: 0.25rem 0; }

  .tos section { margin: 0 0 2rem 0; padding: 0; }

  .tos,
  .tos section,
  .tos h1,
  .tos h2,
  .tos h3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="tos sp--fullbleed">
  <h1>Terms of Service</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>Welcome to [Your Company Name] ("Company", "we", "our", "us"). These Terms of Service ("Terms") govern your access to and use of our website located at [Your Website URL] ("Website") and any related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.</p>
  </section>

  <section>
    <h2>2. Orders and Payment</h2>
    <h3>2.1 Payment Terms</h3>
    <ul>
      <li><strong>Accepted Payment Methods:</strong> [List accepted payment methods, e.g., Visa, MasterCard, PayPal, etc.]</li>
      <li><strong>Currency:</strong> [Currency]</li>
    </ul>
  </section>

  <section>
    <h2>3. Contact Information</h2>
    <p>If you have any questions about these Terms, please contact us:</p>
    <ul>
      <li><strong>Company Name:</strong> [Your Company Name]</li>
      <li><strong>Address:</strong> [Your Company Address]</li>
      <li><strong>Email:</strong> [Your Contact Email]</li>
      <li><strong>Phone:</strong> [Your Contact Phone Number]</li>
    </ul>
  </section>
</div>`;

  const returnRefundPolicyTemplate = `<style>
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .return-refund { font-family: Arial, sans-serif; line-height: 1.6; }
  .return-refund * { box-sizing: border-box; }

  .return-refund h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .return-refund h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .return-refund h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }

  .return-refund p  { font-size: 16px; margin: 0 0 1rem 0; }
  .return-refund ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .return-refund li { margin: 0.25rem 0; }

  .return-refund section { margin: 0 0 2rem 0; padding: 0; }

  .return-refund,
  .return-refund section,
  .return-refund h1,
  .return-refund h2,
  .return-refund h3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="return-refund sp--fullbleed">
  <h1>Return and Refund Policy</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Contact Information</h2>
    <p>For questions about returns and refunds, please contact our Customer Service team:</p>
    <ul>
      <li><strong>Email:</strong> [Email]</li>
      <li><strong>Phone:</strong> [Phone]</li>
      <li><strong>Address:</strong> [Your Company Address]</li>
    </ul>
  </section>

  <section>
    <h2>2. Return Eligibility</h2>
    <p>Customers have the right to cancel their purchase and return the product within [Number of Days] of receipt without providing any reason.</p>
  </section>

  <section>
    <h2>3. Refunds</h2>
    <p>Refunds are processed to the original payment method within [Number of Days, e.g., 14 days] after receiving the returned item.</p>
  </section>
</div>`;

  const cookiePolicyTemplate = `<style>
        .sp--fullbleed {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          padding-left: 20px;
          padding-right: 20px;
          box-sizing: border-box;
        }
        
        .cookie-policy {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .cookie-policy h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1.5rem;
          text-align: center;
          border-bottom: 3px solid #e2e8f0;
          padding-bottom: 1rem;
        }
        
        .cookie-policy h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          border-left: 4px solid #4299e1;
          padding-left: 1rem;
        }
        
        .cookie-policy p {
          margin-bottom: 1.25rem;
          text-align: justify;
        }
        
        .cookie-policy ul {
          margin-bottom: 1.25rem;
          padding-left: 2rem;
        }
        
        .cookie-policy li {
          margin-bottom: 0.5rem;
        }
      </style>
      
      <div class="cookie-policy sp--fullbleed">
        <h1>Cookie Policy</h1>
        
        <p><strong>Last Updated:</strong> [Insert Effective Date]</p>
        <p><strong>Effective Date:</strong> [Insert Effective Date]</p>
        
        <p>This Cookie Policy explains how <strong>[Your Company Name]</strong> uses cookies and similar tracking technologies when you visit our website at <strong>[Your Website URL]</strong>.</p>
        
        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files that are stored on your device when you visit a website.</p>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about this Cookie Policy, please contact us:</p>
        <p><strong>[Your Company Name]</strong><br>
        <strong>Email:</strong> [Your Contact Email]<br>
        <strong>Phone:</strong> [Your Contact Phone Number]<br>
        <strong>Address:</strong> [Your Company Address]</p>
      </div>`;

  const shippingPolicyTemplate = `<style>
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .shipping-policy { font-family: Arial, sans-serif; line-height: 1.6; }
  .shipping-policy * { box-sizing: border-box; }

  .shipping-policy h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .shipping-policy h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .shipping-policy h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }
  .shipping-policy h4 { font-size: 18px; margin: 1rem 0 0.5rem 0; }

  .shipping-policy p { font-size: 16px; margin: 0 0 1rem 0; }
  .shipping-policy ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .shipping-policy li { margin: 0.25rem 0; }

  .shipping-policy section { margin: 0 0 2rem 0; padding: 0; }

  .shipping-policy,
  .shipping-policy section,
  .shipping-policy h1,
  .shipping-policy h2,
  .shipping-policy h3,
  .shipping-policy h4 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="shipping-policy sp--fullbleed">
  <h1>Shipping Policy</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>At [Your Company Name] ("we," "us," or "our"), we aim to provide a seamless and transparent shipping experience for our customers. This Shipping Policy outlines the terms and conditions related to the delivery of products purchased from our website, [Your Website URL].</p>
  </section>

  <section>
    <h2>2. Shipping Destinations</h2>
    <h3>Countries We Ship To:</h3>
    <ul>
      <li>[List of Countries/Regions]</li>
    </ul>
  </section>

  <section>
    <h2>3. Shipping Costs</h2>
    <h3>Domestic Shipping ([Your Country]):</h3>
    <ul>
      <li>Standard Shipping: [e.g., Free shipping on all orders over $50.]</li>
      <li>Flat Rate Shipping: [e.g., $5 flat rate for orders under $50.]</li>
    </ul>
    <h3>International Shipping:</h3>
    <ul>
      <li>Standard International Shipping: [e.g., $15 flat rate.]</li>
    </ul>
  </section>

  <section>
    <h2>4. Order Processing Time</h2>
    <p>Orders are processed within [Number of Business Days, e.g., 1-2 business days] (Monday to Friday, excluding holidays).</p>
    <p>Orders placed before [Cut-Off Time, e.g., 5:00 PM EST] will begin processing the same day.</p>
  </section>

  <section>
    <h2>5. Estimated Delivery Time</h2>
    <h3>Domestic Shipping:</h3>
    <ul>
      <li>Standard Shipping: [e.g., 3-5 business days]</li>
      <li>Expedited Shipping: [e.g., 1-2 business days]</li>
    </ul>
    <h3>International Shipping:</h3>
    <ul>
      <li>Standard International Shipping: [e.g., 7-14 business days]</li>
    </ul>
  </section>

  <section>
    <h2>6. Shipping Methods and Carriers</h2>
    <h3>Domestic Carriers:</h3>
    <ul>
      <li>[e.g., USPS, UPS, FedEx]</li>
    </ul>
    <h3>International Carriers:</h3>
    <ul>
      <li>[e.g., DHL, FedEx International]</li>
    </ul>
  </section>

  <section>
    <h2>7. Contact Information</h2>
    <p>If you have any questions or concerns regarding your shipment, please contact us:</p>
    <ul>
      <li><strong>Customer Service Email:</strong> [Customer Service Email]</li>
      <li><strong>Customer Service Phone:</strong> [Customer Service Phone Number]</li>
      <li><strong>Company Address:</strong>
        <ul>
          <li>[Your Company Name]</li>
          <li>[Street Address]</li>
          <li>[City, State/Province, ZIP/Postal Code]</li>
          <li>[Country]</li>
        </ul>
      </li>
    </ul>
    <p>Our customer service team is available [Days and Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM EST].</p>
  </section>
</div>`;

  const billingTermsTemplate = `<style>
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .billing-terms { font-family: Arial, sans-serif; line-height: 1.6; }
  .billing-terms * { box-sizing: border-box; }

  .billing-terms h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .billing-terms h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .billing-terms h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }

  .billing-terms p  { font-size: 16px; margin: 0 0 1rem 0; }
  .billing-terms ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .billing-terms li { margin: 0.25rem 0; }

  .billing-terms section { margin: 0 0 2rem 0; padding: 0; }

  .billing-terms,
  .billing-terms section,
  .billing-terms h1,
  .billing-terms h2,
  .billing-terms h3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="billing-terms sp--fullbleed">
  <h1>Billing Terms and Conditions</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>These Billing Terms and Conditions ("Terms") govern the payment obligations and processes between [Your Company Name] ("Company", "we", "us", or "our") and the customer ("Customer", "you", or "your").</p>
  </section>

  <section>
    <h2>2. Payment Terms</h2>
    <h3>2.1 Pricing</h3>
    <ul>
      <li><strong>Prices:</strong> All prices for products and services are listed in [Currency] and are subject to change without prior notice.</li>
      <li><strong>Taxes and Fees:</strong> Prices are exclusive of applicable taxes, duties, or charges unless otherwise specified.</li>
    </ul>

    <h3>2.2 Payment Methods</h3>
    <p>We accept the following payment methods:</p>
    <ul>
      <li>Credit/Debit Cards: Visa, MasterCard, American Express, etc.</li>
      <li>Electronic Funds Transfer (EFT)/ACH Payments</li>
      <li>PayPal</li>
      <li>[List accepted payment methods, e.g., Visa, MasterCard, PayPal, etc.]</li>
    </ul>
  </section>

  <section>
    <h2>3. Contact Information</h2>
    <p>For any questions or concerns regarding billing, please contact us:</p>
    <ul>
      <li><strong>Company Name:</strong> [Your Company Name]</li>
      <li><strong>Address:</strong> [Your Company Address]</li>
      <li><strong>Email:</strong> [Your Contact Email]</li>
      <li><strong>Phone:</strong> [Your Contact Phone Number]</li>
    </ul>
  </section>
</div>`;

  const disclaimerTemplate = `<style>
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .disclaimer { font-family: Arial, sans-serif; line-height: 1.6; }
  .disclaimer * { box-sizing: border-box; }

  .disclaimer h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .disclaimer h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .disclaimer h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }

  .disclaimer p  { font-size: 16px; margin: 0 0 1rem 0; }
  .disclaimer ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .disclaimer li { margin: 0.25rem 0; }

  .disclaimer section { margin: 0 0 2rem 0; padding: 0; }

  .disclaimer,
  .disclaimer section,
  .disclaimer h1,
  .disclaimer h2,
  .disclaimer h3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="disclaimer sp--fullbleed">
  <h1>Disclaimer</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>The information provided by [Your Company Name] ("we," "us," or "our") on [Your Website URL] (the "Site") is for general informational purposes only. All information on the Site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
  </section>

  <section>
    <h2>2. No Professional Advice</h2>
    <h3>2.1 No Legal Advice</h3>
    <p>The Site may contain general information related to legal matters. The information is not advice and should not be treated as such.</p>
    <h3>2.2 No Financial Advice</h3>
    <p>Similarly, any financial information provided is for general informational purposes and is not intended as financial advice.</p>
  </section>

  <section>
    <h2>3. External Links Disclaimer</h2>
    <p>The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy by us.</p>
  </section>

  <section>
    <h2>4. Affiliate Disclaimer</h2>
    <p>The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.</p>
    <p>We are a participant in the [Affiliate Program Name], an affiliate advertising program designed to provide a means for us to earn advertising fees.</p>
  </section>

  <section>
    <h2>5. Contact Us</h2>
    <p>If you have any questions about this Disclaimer, you can contact us:</p>
    <ul>
      <li><strong>By email:</strong> [Your Contact Email]</li>
      <li><strong>By phone number:</strong> [Your Contact Phone Number]</li>
      <li><strong>By mail:</strong> [Your Company Address]</li>
    </ul>
  </section>
</div>`;

  const paymentPolicyTemplate = `<style>
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .payment-options { font-family: Arial, sans-serif; line-height: 1.6; }
  .payment-options * { box-sizing: border-box; }

  .payment-options h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .payment-options h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .payment-options h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }

  .payment-options p  { font-size: 16px; margin: 0 0 1rem 0; }
  .payment-options ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .payment-options li { margin: 0.25rem 0; }

  .payment-options section { margin: 0 0 2rem 0; padding: 0; }

  .payment-options,
  .payment-options section,
  .payment-options h1,
  .payment-options h2,
  .payment-options h3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="payment-options sp--fullbleed">
  <h1>Payment Options</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>At [WEBSITE NAME], we highly value your safety and convenience. We offer a variety of secure and easy-to-use payment methods.</p>
  </section>

  <section>
    <h2>2. Accepted Payment Methods</h2>
    <h3>2.1 Credit and Debit Cards</h3>
    <p><strong>We accept all major credit and debit cards:</strong><br>Visa, Mastercard, American Express</p>

    <h3>2.2 PayPal</h3>
    <p><strong>Secure Online Payments Worldwide</strong><br>Pay quickly and securely using your PayPal account.</p>

    <h3>2.3 Other Payment Methods</h3>
    <p>We also accept: [List accepted payment methods, e.g., Visa, MasterCard, PayPal, etc.]</p>
  </section>

  <section>
    <h2>3. Security and Data Protection</h2>
    <p>Your security is our highest priority. All transactions are encrypted and processed through secure payment gateways that comply with industry standards.</p>
    <ul>
      <li><strong>SSL Encryption:</strong> Our website uses Secure Socket Layer (SSL) encryption to protect your personal and financial information during transmission.</li>
      <li><strong>PCI Compliance:</strong> Our payment processors are Payment Card Industry Data Security Standard (PCI DSS) compliant.</li>
    </ul>
  </section>

  <section>
    <h2>4. Currency</h2>
    <p>All transactions are processed in [Currency]. If your bank account is in a different currency, your bank may apply currency conversion rates and fees.</p>
  </section>

  <section>
    <h2>5. Customer Support</h2>
    <p>If you encounter any issues or have questions about your payment, please do not hesitate to contact our customer service team.</p>
    <ul>
      <li><strong>Email:</strong> [Your Contact Email]</li>
      <li><strong>Phone:</strong> [Your Contact Phone Number]</li>
      <li><strong>Address:</strong> [Your Company Address]</li>
    </ul>
  </section>
</div>`;

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
      id: 'shipping', 
      name: 'Shipping Policy', 
      description: 'Comprehensive shipping policy template for e-commerce businesses',
      icon: '🚚'
    },
    { 
      id: 'billing', 
      name: 'Billing Terms and Conditions', 
      description: 'Complete billing terms with payment methods, late fees, and subscription details',
      icon: '💳'
    },
    { 
      id: 'disclaimer', 
      name: 'Disclaimer', 
      description: 'Comprehensive legal disclaimers and limitations of liability',
      icon: '⚠️'
    },
    { 
      id: 'payment', 
      name: 'Payment Policy', 
      description: 'Complete payment methods, security measures, and transaction procedures',
      icon: '💰'
    }
  ];

  useEffect(() => {
    // Initial greeting message
    const initialMessage: Message = {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your Legal Policy assistant. I'll help you create professional legal documents for your business with AI-powered guidance. Ready to get started?",
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    
    // Reset state to ensure clean start
    setCurrentQuestionIndex(0);
    setChatPhase('intro');
    setPolicyData({} as PolicyData);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, type: 'bot' | 'user', options?: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDomain = (domain: string): boolean => {
    // Clean the domain: remove protocol, www., and trailing slashes
    let cleanDomain = domain.trim().replace(/^https?:\/\//i, '').replace(/^www\./, '').replace(/\/.*$/, '');
    
    // Basic domain validation - must have at least one dot and valid characters
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]{0,253}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(cleanDomain) && cleanDomain.length > 0;
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

  const handleSendMessage = () => {
    // For intro phase, require some input
    if (chatPhase === 'intro' && !currentInput.trim()) return;

    // For questions phase, validate based on question type and requirements
    if (chatPhase === 'questions') {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        const inputValue = currentInput.trim();
        
        // If field is required and empty, don't allow submission
        if (currentQuestion.required && !inputValue) {
          return;
        }
        
        // Validate specific field types if they have content
        if (inputValue) {
          if (currentQuestion.type === 'email' && !validateEmail(inputValue)) {
            setTimeout(() => {
              addMessage("Please enter a valid email address (e.g., user@domain.com)", 'bot');
            }, 500);
            setCurrentInput('');
            return;
          }
          
          if (currentQuestion.type === 'domain' && !validateDomain(inputValue)) {
            setTimeout(() => {
              addMessage("Please enter a valid domain with extension (e.g., example.com, www.mydomain.net)", 'bot');
            }, 500);
            setCurrentInput('');
            return;
          }
          
          if (currentQuestion.type === 'url' && !validateUrl(inputValue)) {
            setTimeout(() => {
              addMessage("Please enter a valid URL (e.g., example.com, www.example.com, https://example.com)", 'bot');
            }, 500);
            setCurrentInput('');
            return;
          }
        }
      }
    }

    // For other phases, require input
    if (chatPhase === 'review' && !currentInput.trim()) return;

    // Add user message
    addMessage(currentInput, 'user');

    if (chatPhase === 'intro') {
      // Start the questions phase
      setChatPhase('questions');
      setCurrentQuestionIndex(0);
      setTimeout(() => {
        askNextQuestion();
      }, 1000);
    } else if (chatPhase === 'questions') {
      // Process answer and ask next question
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        const value = currentInput.trim() || currentQuestion.defaultValue || '';
        const updatedData = {
          ...policyData,
          [currentQuestion.field]: value
        };

        // Auto-fill URLs when domain is provided
        if (currentQuestion.field === 'primaryWebsiteDomain' && value) {
          const domain = value.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
          updatedData.faqPageURL = `https://${domain}/faq`;
          updatedData.returnPolicyURL = `https://${domain}/return-and-refund-policy`;
          updatedData.termsOfServicePageURL = `https://${domain}/terms-of-service`;
          updatedData.contactPageURL = `https://${domain}/contact`;
        }

        // Check if we're in editing mode
        if (editingQuestionId !== null) {
          // Prevent duplicate processing
          if (isProcessingEdit) {
            return;
          }
          setIsProcessingEdit(true);
          
          // We're editing a specific question, go back to review
          const editedQuestion = questions.find(q => q.id === editingQuestionId);
          
          // Clear editing state immediately to prevent duplicate calls
          setEditingQuestionId(null);
          
          // Clear the input field immediately
          setCurrentInput('');
          
          // Create the updated data object
          const newData = { ...policyData, ...updatedData };
          
          // Update policy data
          setPolicyData(newData);
          
          // Show the updated review after a short delay
          setTimeout(() => {
            // Remove the last review message if it exists
            setMessages(prevMessages => {
              const filteredMessages = prevMessages.filter(msg => !msg.isReview);
              return filteredMessages;
            });
            
            // Create review content with the guaranteed updated data
            let reviewContent = `✅ Updated "${editedQuestion?.question}" with your new answer.\n\nGreat! Let me review the updated information:\n\n`;
            
            questions.forEach(question => {
              const value = newData[question.field];
              if (value) {
                reviewContent += `**${question.question}**\n${value}\n\n`;
              }
            });

            reviewContent += "Does this information look correct? Type 'yes' to proceed to policy selection, or click on any answer above to edit it.";
            
            // Add the new review message after removing the old one
            setTimeout(() => {
              addMessage(reviewContent, 'bot', {
                isReview: true,
                isEditedReview: true
              });
            }, 100);
            
            // Set chat phase to review and reset processing flag
            setChatPhase('review');
            setIsProcessingEdit(false);
          }, 300);
          
          return; // Exit early to prevent normal flow
        } else {
          // Normal flow - update data first
          setPolicyData(updatedData);
          
          if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            
            setTimeout(() => {
              // Use the nextIndex directly instead of relying on state
              const nextQuestion = questions[nextIndex];
              if (nextQuestion) {
                let content = `**${nextQuestion.group}**\n\n${nextQuestion.question}`;
                if (nextQuestion.guidance) {
                  content += `\n\n*${nextQuestion.guidance}*`;
                }
                
                if (nextQuestion.defaultValue && nextQuestion.defaultValue !== 'AUTO_FILL') {
                  content += `\n\n*Default: ${nextQuestion.defaultValue}*`;
                }
                
                if (nextQuestion.type === 'select' && nextQuestion.options) {
                  content += '\n\nOptions:\n' + nextQuestion.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');
                }

                addMessage(content, 'bot', {
                  isQuestion: true,
                  questionField: nextQuestion.field,
                  options: nextQuestion.options,
                  inputType: nextQuestion.type,
                  defaultValue: nextQuestion.defaultValue
                });

                // Auto-fill default values in the input field for the next question
                setTimeout(() => {
                  if (nextQuestion.defaultValue && nextQuestion.defaultValue !== 'AUTO_FILL') {
                    setCurrentInput(nextQuestion.defaultValue || '');
                  } else if (nextQuestion.defaultValue === 'AUTO_FILL' && nextQuestion.type === 'url') {
                    // Auto-fill URLs based on domain
                    const domain = updatedData.primaryWebsiteDomain;
                    if (domain) {
                      let autoFilledUrl = '';
                      const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
                      
                      switch (nextQuestion.field) {
                        case 'faqPageURL':
                          autoFilledUrl = `https://${cleanDomain}/faq`;
                          break;
                        case 'returnPolicyURL':
                          autoFilledUrl = `https://${cleanDomain}/return-and-refund-policy`;
                          break;
                        case 'termsOfServicePageURL':
                          autoFilledUrl = `https://${cleanDomain}/terms-of-service`;
                          break;
                        case 'contactPageURL':
                          autoFilledUrl = `https://${cleanDomain}/contact`;
                          break;
                      }
                      
                      if (autoFilledUrl) {
                        setCurrentInput(autoFilledUrl);
                      }
                    }
                  } else {
                    // Clear input for new questions without defaults
                    setCurrentInput('');
                  }
                }, 100);
              }
            }, 800);
          } else {
            // All questions answered, move to review
            setChatPhase('review');
            setTimeout(() => {
              showReview();
            }, 1000);
          }
        }
      }
    } else if (chatPhase === 'review') {
      // Check if user confirmed with "yes"
      if (currentInput.toLowerCase() === 'yes') {
        // Generate all policies automatically
        setChatPhase('complete');
        const allPolicyIds = policyTypes.map(policy => policy.id);
        setTimeout(() => {
          generateAndShowPolicies(allPolicyIds);
        }, 1000);
      } else {
        addMessage("No problem! Click on any answer above to edit it, or type 'yes' when you're ready to proceed.", 'bot');
      }
    }

    setCurrentInput('');
  };

  const askNextQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (question) {
      let content = `**${question.group}**\n\n${question.question}`;
      if (question.guidance) {
        content += `\n\n*${question.guidance}*`;
      }
      
      if (question.defaultValue && question.defaultValue !== 'AUTO_FILL') {
        content += `\n\n*Default: ${question.defaultValue}*`;
      }
      
      if (question.type === 'select' && question.options) {
        content += '\n\nOptions:\n' + question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');
      }

      addMessage(content, 'bot', {
        isQuestion: true,
        questionField: question.field,
        options: question.options,
        inputType: question.type,
        defaultValue: question.defaultValue
      });

      // Auto-fill default values in the input field
      if (question.defaultValue && question.defaultValue !== 'AUTO_FILL') {
        setTimeout(() => {
          setCurrentInput(question.defaultValue || '');
        }, 100);
      } else if (question.defaultValue === 'AUTO_FILL' && question.type === 'url') {
        // Auto-fill URLs based on domain
        const domain = policyData.primaryWebsiteDomain;
        if (domain) {
          let autoFilledUrl = '';
          const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
          
          switch (question.field) {
            case 'faqPageURL':
              autoFilledUrl = `https://${cleanDomain}/faq`;
              break;
            case 'returnPolicyURL':
              autoFilledUrl = `https://${cleanDomain}/return-and-refund-policy`;
              break;
            case 'termsOfServicePageURL':
              autoFilledUrl = `https://${cleanDomain}/terms-of-service`;
              break;
            case 'contactPageURL':
              autoFilledUrl = `https://${cleanDomain}/contact`;
              break;
          }
          
          if (autoFilledUrl) {
            setTimeout(() => {
              setCurrentInput(autoFilledUrl);
            }, 100);
          }
        }
      } else {
        // Clear input for new questions without defaults
        setCurrentInput('');
      }
    }
  };

  const showReview = () => {
    let reviewContent = "Great! Let me review the information you've provided:\n\n";
    
    questions.forEach(question => {
      const value = policyData[question.field];
      if (value) {
        reviewContent += `**${question.question}**\n${value}\n\n`;
      }
    });

    reviewContent += "Does this information look correct? Type 'yes' to proceed to policy selection, or click on any answer above to edit it.";
    
    // Force a re-render by creating a new message each time
    addMessage(reviewContent, 'bot', {
      isReview: true
    });
  };

  const handleEditQuestion = (questionId: number) => {
    // Prevent multiple rapid clicks or if already editing
    if (editingQuestionId !== null) {
      return;
    }
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setEditingQuestionId(questionId);
      setChatPhase('questions');
      setCurrentQuestionIndex(questionId - 1); // Questions are 1-indexed, array is 0-indexed
      
      // Ask the specific question for editing
      setTimeout(() => {
        let content = `**Editing: ${question.group}**\n\n${question.question}`;
        if (question.guidance) {
          content += `\n\n*${question.guidance}*`;
        }
        
        const currentValue = policyData[question.field];
        if (currentValue) {
          content += `\n\n*Current answer: ${currentValue}*`;
        }
        
        if (question.defaultValue && question.defaultValue !== 'AUTO_FILL') {
          content += `\n\n*Default: ${question.defaultValue}*`;
        }
        
        if (question.type === 'select' && question.options) {
          content += '\n\nOptions:\n' + question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');
        }

        addMessage(content, 'bot', {
          isQuestion: true,
          questionField: question.field,
          options: question.options,
          inputType: question.type,
          defaultValue: question.defaultValue,
          isEditing: true
        });

        // Pre-fill with current value or default
        const valueToFill = currentValue || question.defaultValue || '';
        if (valueToFill && valueToFill !== 'AUTO_FILL') {
          setTimeout(() => {
            setCurrentInput(valueToFill);
          }, 100);
        } else if (question.defaultValue === 'AUTO_FILL' && question.type === 'url') {
          // Auto-fill URLs based on domain
          const domain = policyData.primaryWebsiteDomain;
          if (domain) {
            let autoFilledUrl = '';
            const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
            
            switch (question.field) {
              case 'faqPageURL':
                autoFilledUrl = `https://${cleanDomain}/faq`;
                break;
              case 'returnPolicyURL':
                autoFilledUrl = `https://${cleanDomain}/return-and-refund-policy`;
                break;
              case 'termsOfServicePageURL':
                autoFilledUrl = `https://${cleanDomain}/terms-of-service`;
                break;
              case 'contactPageURL':
                autoFilledUrl = `https://${cleanDomain}/contact`;
                break;
            }
            
            if (autoFilledUrl) {
              setTimeout(() => {
                setCurrentInput(autoFilledUrl);
              }, 100);
            }
          }
        }
      }, 500);
    }
  };


  const generateAndShowPolicies = async (policyIds: string[]) => {
    addMessage("Excellent! I'm now generating your professional legal documents. This will take just a moment...", 'bot');

    // Simulate generation time
    setTimeout(() => {
      const policies: {[key: string]: string} = {};
      
      policyIds.forEach(policyId => {
        policies[policyId] = generatePolicyContent(policyId, policyData);
      });
      
      setGeneratedPolicies(policies);

      let completionContent = `🎉 **Policies Generated Successfully!**\n\nYour ${policyIds.length} professional legal document${policyIds.length > 1 ? 's are' : ' is'} ready. Each policy is displayed below with its HTML code:`;

      addMessage(completionContent, 'bot', {
        isPolicyDisplay: true,
        generatedPolicies: policies,
        policyIds: policyIds
      });
    }, 3000);
  };

  // Function to replace placeholders in HTML templates with actual form data
  const generatePolicyHTML = (template: string, policyData: PolicyData): string => {
    let html = template;
    
    // Replace all placeholders with actual data
    const replacements: { [key: string]: string } = {
      '[Insert Effective Date]': new Date().toLocaleDateString(),
      '[Your Company Name]': policyData.legalBusinessName,
      '[Your Website URL]': policyData.primaryWebsiteDomain,
      '[List of Countries/Regions]': policyData.shipToCountries,
      '[Your Country]': policyData.countryOfIncorporation,
      '[e.g., Free shipping on all orders over $50.]': policyData.domesticFreeShippingThreshold 
        ? `Free shipping on all orders over $${policyData.domesticFreeShippingThreshold}.` 
        : 'No free shipping threshold.',
      '[e.g., $5 flat rate for orders under $50.]': policyData.domesticFlatRateShippingFee 
        ? `$${policyData.domesticFlatRateShippingFee} flat rate for orders under the free shipping threshold.`
        : 'Custom (calculated at checkout).',
      '[e.g., $15 flat rate.]': policyData.internationalFlatRateShippingFee,
      '[Number of Business Days, e.g., 1-2 business days]': policyData.orderProcessingTime,
      '[Cut-Off Time, e.g., 5:00 PM EST]': policyData.dailyOrderCutoff,
      '[e.g., 3-5 business days]': policyData.domesticDeliveryEstimateStandard,
      '[e.g., 1-2 business days]': policyData.domesticDeliveryEstimateExpedited,
      '[e.g., 7-14 business days]': policyData.internationalDeliveryEstimate,
      '[e.g., USPS, UPS, FedEx]': policyData.domesticCarriers,
      '[e.g., DHL, FedEx International]': policyData.internationalCarriers,
      '[Your Website URL]/track-order': `${policyData.primaryWebsiteDomain}/track-order`,
      '[Customer Service Email]': policyData.mainContactEmail,
      '[Customer Service Phone Number]': policyData.phoneNumber,
      '[Number of Days, e.g., 7 days]': '7 days',
      '[Number of Days, e.g., 30 days]': '30 days',
      '[Number of Days, e.g., 14 days]': '14 days',
      '[Street Address]': policyData.fullStreetAddress,
      '[City, State/Province, ZIP/Postal Code]': (() => {
        if (!policyData.fullStreetAddress) return 'N/A';
        const parts = policyData.fullStreetAddress.split(',');
        if (parts.length > 1) {
          if (parts.length >= 3) {
            return parts.slice(1, -1).join(',').trim();
          }
          return parts.slice(1).join(',').trim();
        }
        return policyData.fullStreetAddress;
      })(),
      '[Days and Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM EST]': policyData.customerServiceHours || 'Monday to Friday, 9 AM to 5 PM EST',
      '[Country]': policyData.countryOfIncorporation || 'United States',
      '[Currency]': policyData.isoCurrencyCode || 'USD',
      '[List accepted payment methods, e.g., Visa, MasterCard, PayPal, etc.]': policyData.acceptedPayments || 'Visa, MasterCard, PayPal, etc.',
      '[Your Contact Email]': policyData.mainContactEmail || 'contact@company.com',
      '[Your Contact Phone Number]': policyData.phoneNumber || 'Phone Number',
      '[Your Company Address]': policyData.fullStreetAddress || 'Company Address',
      '[Selling Countries/Regions]': policyData.shipToCountries || 'the countries we serve',
      '[Email]': policyData.mainContactEmail || 'contact@company.com',
      '[Phone]': policyData.phoneNumber || 'Phone Number',
      '[Insert FAQ Link]': policyData.faqPageURL || '#',
      '[Affiliate Program Name]': policyData.affiliateProgramName || 'affiliate advertising program',
      '[Your Jurisdiction]': policyData.governingLawState || policyData.countryOfIncorporation || 'United States',
      '[Insert Age, e.g., 13 or 16]': '18',
      '[WEBSITE NAME]': policyData.storeWebsiteName || 'Our Website',
      '[Number of Days]': policyData.returnWindowDays || '14 days',
      '[SELLING COUNTRIES]': policyData.sellingRegions || 'the countries we serve',
      '[CUSTOMER SERVICE EMAIL]': policyData.mainContactEmail || 'customer service email',
      '[CUSTOMER SERVICE PHONE]': policyData.phoneNumber || 'customer service phone',
      '[COMPANY ADDRESS]': policyData.fullStreetAddress || 'company address',
      '[Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM CET]': policyData.customerServiceHours || 'Monday to Friday, 9 AM to 5 PM CET',
      '[Time Frame, e.g., 1 hour]': '1 hour',
      '[Currency, e.g., Euros (€)]': (() => {
        const currency = policyData.isoCurrencyCode || 'USD';
        const currencySymbols: { [key: string]: string } = {
          'USD': 'US Dollars ($)',
          'EUR': 'Euros (€)',
          'GBP': 'British Pounds (£)',
          'CAD': 'Canadian Dollars (C$)',
          'AUD': 'Australian Dollars (A$)'
        };
        return currencySymbols[currency] || `${currency} (${currency})`;
      })(),
      '[WEBSITE URL]': policyData.primaryWebsiteDomain || 'website URL',
      '[TODAY\'S DATE, e.g., 12 November 2023]': new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      '[Contact Us Page URL]': policyData.contactPageURL || '#',
      '[Billing Contact Email]': policyData.mainContactEmail || 'billing@company.com',
      '[Billing Contact Phone Number]': policyData.phoneNumber || 'Phone Number',
      '[Insert Link to Terms of Service]': policyData.termsOfServicePageURL || '#',
      '[Insert Link to Privacy Policy]': policyData.contactPageURL || '#',
      '[Insert Link to Cancellation Policy]': policyData.returnPolicyURL || '#',
      '[Insert Link to Refund Policy]': policyData.returnPolicyURL || '#'
    };

    // Apply all replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value || 'N/A');
    });

    // Convert email addresses, URLs, and phone numbers to clickable links
    html = convertToClickableLinks(html);

    return html;
  };

  // Function to convert email addresses, URLs, and phone numbers to clickable links
  const convertToClickableLinks = (html: string): string => {
    // Convert email addresses to mailto: links
    html = html.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1" style="color: #2a4d7c; text-decoration: underline;">$1</a>'
    );

    // Convert phone numbers to tel: links (basic pattern matching)
    html = html.replace(
      /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g,
      '<a href="tel:$1" style="color: #2a4d7c; text-decoration: underline;">$1</a>'
    );

    // Convert URLs to clickable links (but avoid converting URLs that are already in href attributes)
    html = html.replace(
      /(?<!href=["'])(https?:\/\/[^\s<>"']+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #2a4d7c; text-decoration: underline;">$1</a>'
    );

    return html;
  };

  const generatePolicyContent = (policyType: string, data: PolicyData): string => {
    let template = '';
    
    switch (policyType) {
      case 'privacy':
        template = privacyPolicyTemplate;
        break;
      case 'terms':
        template = termsOfServiceTemplate;
        break;
      case 'return':
        template = returnRefundPolicyTemplate;
        break;
      case 'cookie':
        template = cookiePolicyTemplate;
        break;
      case 'shipping':
        template = shippingPolicyTemplate;
        break;
      case 'billing':
        template = billingTermsTemplate;
        break;
      case 'disclaimer':
        template = disclaimerTemplate;
        break;
      case 'payment':
        template = paymentPolicyTemplate;
        break;
      default:
        return `<html><body><h1>${policyType} Policy - ${data.storeWebsiteName || data.legalBusinessName}</h1><p>Generated on ${new Date().toLocaleDateString()}</p></body></html>`;
    }
    
    return generatePolicyHTML(template, data);
  };


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const copyToClipboard = async (content: string, policyName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Show a temporary success message
      addMessage(`✅ ${policyName} HTML code copied to clipboard!`, 'bot');
    } catch (err) {
      console.error('Failed to copy: ', err);
      addMessage(`❌ Failed to copy ${policyName} to clipboard. Please try again.`, 'bot');
    }
  };


  return (
    <div className="chat-container">
      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="chat-info">
            <div className="chat-icon">
              <FileText size={24} />
            </div>
            <div className="chat-details">
              <h1>Store Policy Generator</h1>
              <p>Session: New Policy Creation Chat</p>
            </div>
          </div>
          <button className="new-chat-btn" onClick={() => window.location.reload()}>
            New Chat
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
               <div className="message-content">
                 <div className="message-text">
                   {message.isPolicyDisplay ? (
                     // Special rendering for policy display with HTML code sections
                     <div>
                       <div className="policy-display-header">
                         {message.content.split('\n').map((line, idx) => {
                           if (line.startsWith('**') && line.endsWith('**')) {
                             return <strong key={idx}>{line.slice(2, -2)}</strong>;
                           }
                           if (line.startsWith('*') && line.endsWith('*')) {
                             return <em key={idx}>{line.slice(1, -1)}</em>;
                           }
                           return <div key={idx}>{line}</div>;
                         })}
                       </div>
                       
                       {/* Policy Sections */}
                       <div className="policy-sections">
                         {message.policyIds?.map((policyId, idx) => {
                           const policyInfo = policyTypes.find(p => p.id === policyId);
                           const policyContent = message.generatedPolicies?.[policyId];
                           
                           if (!policyInfo || !policyContent) return null;
                           
                           return (
                             <div key={policyId} className="policy-section">
                               <div className="policy-section-header">
                                 <h3>{policyInfo.icon} {policyInfo.name}</h3>
                                 <button 
                                   className="copy-button"
                                   onClick={() => copyToClipboard(policyContent, policyInfo.name)}
                                 >
                                   📋 Copy
                                 </button>
                               </div>
                               <div className="policy-code-container">
                                 <pre className="policy-code">
                                   <code>{policyContent}</code>
                                 </pre>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   ) : message.isReview ? (
                     // Special rendering for review messages with clickable answers
                     <div>
                       {message.content.split('\n').map((line, idx) => {
                         if (line.startsWith('**') && line.endsWith('**')) {
                           // This is a question line - NOT clickable, just bold
                           const questionText = line.slice(2, -2);
                           return (
                             <div key={idx} className="review-question-text">
                               <strong>{questionText}</strong>
                             </div>
                           );
                         }
                         if (line.startsWith('*') && line.endsWith('*')) {
                           return <em key={idx}>{line.slice(1, -1)}</em>;
                         }
                         // Check if this line is an answer (comes after a question)
                         const prevLine = message.content.split('\n')[idx - 1];
                         if (prevLine && prevLine.startsWith('**') && prevLine.endsWith('**') && line.trim() && !line.startsWith('Does this information')) {
                           const questionText = prevLine.slice(2, -2);
                           const question = questions.find(q => q.question === questionText);
                           return (
                             <div key={idx} className="review-answer" onClick={() => question && handleEditQuestion(question.id)}>
                               {line}
                             </div>
                           );
                         }
                         return <div key={idx}>{line}</div>;
                       })}
                     </div>
                   ) : (
                     // Normal rendering for non-review messages
                     message.content.split('\n').map((line, idx) => {
                       if (line.startsWith('**') && line.endsWith('**')) {
                         return <strong key={idx}>{line.slice(2, -2)}</strong>;
                       }
                       if (line.startsWith('*') && line.endsWith('*')) {
                         return <em key={idx}>{line.slice(1, -1)}</em>;
                       }
                       return <div key={idx}>{line}</div>;
                     })
                   )}
                 </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}


          <div ref={messagesEndRef} />
        </div>

         <div className="chat-input-area">
           <div className="input-container">
             <input
               type="text"
               value={currentInput}
               onChange={(e) => setCurrentInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
               placeholder={
                 chatPhase === 'intro' 
                   ? "Type anything to get started..." 
                   : chatPhase === 'questions' && questions[currentQuestionIndex] && !questions[currentQuestionIndex].required
                   ? "Type your answer or press Enter to skip..."
                   : chatPhase === 'review'
                   ? "Type 'yes' to proceed or click an answer to edit..."
                   : "Type your answer..."
               }
               className="chat-input"
             />
             <button 
               onClick={handleSendMessage}
               className="send-button"
               disabled={!currentInput.trim()}
             >
               Send <Send size={16} />
             </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default PolicyGeneratorChat;
