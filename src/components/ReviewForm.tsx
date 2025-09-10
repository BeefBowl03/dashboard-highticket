import React from 'react';
import { PolicyData } from '../types';

interface ReviewFormProps {
  policyData: PolicyData;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ policyData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Information</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Business Details</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Business Name:</strong> {policyData.answers.businessName || 'Not provided'}</p>
            <p><strong>Business Type:</strong> {policyData.answers.businessType || 'Not provided'}</p>
            <p><strong>Contact Email:</strong> {policyData.answers.contactEmail || 'Not provided'}</p>
            <p><strong>Website:</strong> {policyData.answers.website || 'Not provided'}</p>
            <p><strong>Address:</strong> {policyData.answers.address || 'Not provided'}</p>
            <p><strong>Phone:</strong> {policyData.answers.phone || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
