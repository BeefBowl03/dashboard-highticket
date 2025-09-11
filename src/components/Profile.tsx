import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '',
    location: '',
    joinDate: '2024-01-15'
  });

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '',
      location: '',
      joinDate: '2024-01-15'
    });
  };

  const handleSave = () => {
    // TODO: Implement profile update with backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <button
            onClick={handleBack}
            className="back-button"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button className="tool-button secondary flex items-center gap-2" onClick={handleEdit}>
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button className="tool-button secondary flex items-center gap-2" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
                <button className="tool-button primary flex items-center gap-2" onClick={handleSave}>
                  <Save size={16} />
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="main-logo">
          <img 
            src="https://cdn.prod.website-files.com/67692e83aa3faae2c7985fcc/679934bc5b34b807e6cac177_highticket-logo-full-white.svg" 
            alt="HighTicket.io" 
            className="logo-svg"
          />
        </div>

        <div className="tools-section">
          <h2>Profile</h2>
          <p className="text-[#ffffff80] mb-8">Manage your account information and preferences.</p>
        </div>

        <div className="tool-content-wrapper">
          <div className="tool-card">
            <div className="tool-header mb-6">
              <div className="tool-icon">
                <User size={32} />
              </div>
              <div className="tool-status ready">
                Account Settings
              </div>
            </div>
            
            <div className="tool-content">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#2d2d2d] rounded-full flex items-center justify-center">
                  <User size={32} className="text-[#888]" />
                </div>
                <div>
                  <h3 className="tool-title mb-1">{formData.name}</h3>
                  <p className="text-[#ffffff80]">Business Owner</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
                    <User size={16} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white">
                      {formData.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white">
                      {formData.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white">
                      {formData.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter your location"
                      className="w-full px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#c19d44] focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white">
                      {formData.location || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ffffff80] flex items-center gap-2">
                    <Calendar size={16} />
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-transparent border border-[#333333] rounded-lg text-white">
                    January 15, 2024
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#333333]">
                <h3 className="tool-title mb-4">Account Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-transparent border border-[#333333] rounded-lg">
                    <div className="text-2xl font-bold text-[#c19d44] mb-1">6</div>
                    <div className="text-sm text-[#ffffff80]">Active Tools</div>
                  </div>
                  <div className="text-center p-4 bg-transparent border border-[#333333] rounded-lg">
                    <div className="text-2xl font-bold text-[#c19d44] mb-1">8</div>
                    <div className="text-sm text-[#ffffff80]">Total Conversations</div>
                  </div>
                  <div className="text-center p-4 bg-transparent border border-[#333333] rounded-lg">
                    <div className="text-2xl font-bold text-[#c19d44] mb-1">3</div>
                    <div className="text-sm text-[#ffffff80]">Projects Created</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
