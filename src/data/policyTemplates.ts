import { PolicyTemplate, PolicyData } from '../types';

export const generatePolicyHTML = (data: PolicyData, templateType: string): string => {
  const { businessName, contactEmail } = data;
  
  switch (templateType) {
    case 'privacy':
      return `
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>${businessName} ("we," "our," or "us") collects information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services.</p>
        
        <h2>3. Contact Information</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at ${contactEmail}.</p>
      `;
    
    case 'terms':
      return `
        <h1>Terms of Service</h1>
        <p><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using ${businessName}'s services, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of ${businessName}'s materials for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. Contact Information</h2>
        <p>If you have any questions about these Terms of Service, please contact us at ${contactEmail}.</p>
      `;
    
    default:
      return `<h1>Policy</h1><p>This is a sample policy for ${businessName}.</p>`;
  }
};

export const policyTemplates: PolicyTemplate[] = [
  {
    id: 'privacy',
    name: 'Privacy Policy',
    description: 'Protect your users\' privacy with a comprehensive privacy policy.',
    icon: '🔒',
    generatePolicyHTML: (data) => generatePolicyHTML(data, 'privacy')
  },
  {
    id: 'terms',
    name: 'Terms of Service',
    description: 'Define the terms and conditions for using your service.',
    icon: '📋',
    generatePolicyHTML: (data) => generatePolicyHTML(data, 'terms')
  }
];
