export interface PolicyData {
  businessName: string;
  businessType: string;
  contactEmail: string;
  website: string;
  address: string;
  phone: string;
  answers: Record<string, string>;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  generatePolicyHTML: (data: PolicyData) => string;
}
