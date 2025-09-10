import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'businessName',
    text: 'What is your business name?',
    type: 'text',
    required: true
  },
  {
    id: 'businessType',
    text: 'What type of business do you run?',
    type: 'select',
    required: true,
    options: ['E-commerce Store', 'SaaS Platform', 'Mobile App', 'Consulting Service', 'Other']
  },
  {
    id: 'contactEmail',
    text: 'What is your contact email?',
    type: 'text',
    required: true
  },
  {
    id: 'website',
    text: 'What is your website URL?',
    type: 'text',
    required: false
  },
  {
    id: 'address',
    text: 'What is your business address?',
    type: 'textarea',
    required: false
  },
  {
    id: 'phone',
    text: 'What is your phone number?',
    type: 'text',
    required: false
  }
];

export const getDefaultPolicyData = () => ({
  businessName: '',
  businessType: '',
  contactEmail: '',
  website: '',
  address: '',
  phone: '',
  answers: {}
});
