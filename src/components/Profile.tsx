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
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEdit}>
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-button" onClick={handleCancel}>
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button className="save-button" onClick={handleSave}>
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <h1 className="profile-name">{formData.name}</h1>
            <p className="profile-role">Business Owner</p>
          </div>

          <div className="profile-info">
            <h2>Profile Information</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <User size={16} />
                  <span>Full Name</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{formData.name}</span>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <Mail size={16} />
                  <span>Email Address</span>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{formData.email}</span>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <Phone size={16} />
                  <span>Phone Number</span>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{formData.phone || 'Not provided'}</span>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <MapPin size={16} />
                  <span>Location</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{formData.location || 'Not provided'}</span>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <Calendar size={16} />
                  <span>Member Since</span>
                </div>
                <span className="info-value">January 15, 2024</span>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <h2>Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">6</div>
                <div className="stat-label">Active Tools</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">8</div>
                <div className="stat-label">Total Conversations</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">3</div>
                <div className="stat-label">Projects Created</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
