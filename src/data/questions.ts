import { Question, PolicyData } from '../types';

export const questions: Question[] = [
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

export const getDefaultPolicyData = (): Partial<PolicyData> => {
  const defaults: Partial<PolicyData> = {};
  
  // Set today's date for all policies
  defaults.lastUpdatedDate = new Date().toISOString().split('T')[0];
  
  questions.forEach(question => {
    if (question.defaultValue !== undefined) {
      if (question.defaultValue === 'AUTO_FILL') {
        // These will be filled when the domain is provided
        defaults[question.field] = '';
      } else {
        defaults[question.field] = question.defaultValue;
      }
    }
  });
  
  return defaults;
}; 