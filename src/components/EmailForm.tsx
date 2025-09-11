import React, { useState } from 'react';
import { EmailFormData } from '../types/email';
import { User, Building, Target, Mail, Briefcase, GraduationCap, Heart } from 'lucide-react';

interface EmailFormProps {
  onSubmit: (data: EmailFormData) => void;
  isLoading?: boolean;
  initialData?: EmailFormData;   
}

export default function EmailForm({ onSubmit, isLoading, initialData }: EmailFormProps) {
  const [formData, setFormData] = useState<EmailFormData>(
    initialData || {
      storeName: '',
      niche: '',
      targetDemographic: '',
      contactFirstName: '',
      marketingExperience: '',
      nicheExperience: '',
      whyNicheImportant: '',
      supplierName: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof EmailFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const isFormValid =
    formData.storeName && formData.niche && formData.targetDemographic && formData.contactFirstName;

  const inputClasses =
    "w-full rounded-lg border border-[#333333] bg-transparent text-white placeholder-[#888] " +
    "focus:border-[#c19d44] focus:ring-2 focus:ring-[#c19d44] px-3 py-2 transition";

  return (
    <div className="rounded-2xl p-8 max-w-2xl mx-auto bg-transparent text-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#c19d44] mb-2">AI Cold Email Generator</h2>
        <p className="text-[#ffffff80]">Fill in the details to generate your cold email copy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[#ffffff80]">
              <Building className="w-4 h-4 mr-2 text-[#c19d44]" />
              Store Name *
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={handleChange('storeName')}
              placeholder="e.g., Sauna Haven USA"
              className={inputClasses}
              required
            />
            {!formData.storeName && <p className="text-xs text-red-400">Required</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[#ffffff80]">
              <Target className="w-4 h-4 mr-2 text-[#c19d44]" />
              Niche *
            </label>
            <input
              type="text"
              value={formData.niche}
              onChange={handleChange('niche')}
              placeholder="e.g., fitness, beauty, tech"
              className={inputClasses}
              required
            />
            {!formData.niche && <p className="text-xs text-red-400">Required</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[#ffffff80]">
              <User className="w-4 h-4 mr-2 text-[#c19d44]" />
              Target Demographic *
            </label>
            <input
              type="text"
              value={formData.targetDemographic}
              onChange={handleChange('targetDemographic')}
              placeholder="e.g., busy professionals, families"
              className={inputClasses}
              required
            />
            {!formData.targetDemographic && <p className="text-xs text-red-400">Required</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[#ffffff80]">
              <Mail className="w-4 h-4 mr-2 text-[#c19d44]" />
              Your First Name *
            </label>
            <input
              type="text"
              value={formData.contactFirstName}
              onChange={handleChange('contactFirstName')}
              placeholder="e.g., John"
              className={inputClasses}
              required
            />
            {!formData.contactFirstName && <p className="text-xs text-red-400">Required</p>}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="pt-6 border-t border-[#333333]">
          <h3 className="text-lg font-semibold text-white mb-4">
            Optional Details (Enhances Credibility)
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-[#ffffff80]">
                <Briefcase className="w-4 h-4 mr-2 text-[#c19d44]" />
                Marketing Experience (if any)
              </label>
              <input
                type="text"
                value={formData.marketingExperience}
                onChange={handleChange('marketingExperience')}
                placeholder="e.g., email marketing, SEO, organic content creation"
                className={inputClasses}
              />
              <p className="text-xs text-gray-400">What marketing channels do you specialize in?</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-[#ffffff80]">
                <GraduationCap className="w-4 h-4 mr-2 text-[#c19d44]" />
                Niche Experience (if any)
              </label>
              <input
                type="text"
                value={formData.nicheExperience}
                onChange={handleChange('nicheExperience')}
                placeholder="e.g., I'm a medical professional"
                className={inputClasses}
              />
              <p className="text-xs text-gray-400">Any relevant background in this niche?</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-[#ffffff80]">
                <Heart className="w-4 h-4 mr-2 text-[#c19d44]" />
                Why This Niche Matters to You
              </label>
              <textarea
                value={formData.whyNicheImportant}
                onChange={handleChange('whyNicheImportant')}
                placeholder="e.g., As an athlete, I've found that sauna use has been a game-changer for my recovery process"
                className={`${inputClasses} resize-none h-20`}
                rows={3}
              />
              <p className="text-xs text-gray-400">Adds authenticity and personal touch</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-[#ffffff80]">
                <Building className="w-4 h-4 mr-2 text-[#c19d44]" />
                Supplier Name (if targeting specific supplier)
              </label>
              <input
                type="text"
                value={formData.supplierName}
                onChange={handleChange('supplierName')}
                placeholder="Name of the supplier you're reaching out to"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-[#c19d44] text-[#080808] font-semibold py-3 rounded-lg 
                       hover:bg-[#a88a3b] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#080808] mr-2"></div>
                Generating Email...
              </div>
            ) : (
              'Generate Cold Email Copy'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
