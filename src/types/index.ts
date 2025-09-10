export interface PolicyData {
  // Business Information
  legalBusinessName: string;
  storeWebsiteName: string;
  primaryWebsiteDomain: string;
  countryOfIncorporation: string;
  fullStreetAddress: string;
  mainContactEmail: string;
  phoneNumber: string;
  customerServiceHours: string;
  lastUpdatedDate: string;
  isoCurrencyCode: string;
  
  // Shipping Information
  domesticFreeShippingThreshold?: string;
  domesticFlatRateShippingFee?: string;
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

export interface Question {
  id: number;
  field: keyof PolicyData;
  question: string;
  guidance: string;
  type: 'text' | 'email' | 'url' | 'number' | 'select' | 'textarea' | 'domain';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  group: string;
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  htmlTemplate: string;
} 