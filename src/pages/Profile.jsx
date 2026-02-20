import React, { useState, useContext } from 'react';
import { DemoAuthContext } from '../App';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(DemoAuthContext);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    companyName: user?.companyName || '',
    keywords: user?.keywords?.join(', ') || '',
    sourcesConfig: user?.sourcesConfig || {
      hackerNews: true,
      reddit: true,
      upwork: true,
      linkedin: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSourceToggle = (source) => {
    setFormData({
      ...formData,
      sourcesConfig: {
        ...formData.sourcesConfig,
        [source]: !formData.sourcesConfig[source]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const keywordsArray = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

    // Demo mode - mock success
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessage({ type: 'success', text: 'Profile updated successfully! (Demo)' });

    setIsSaving(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and lead preferences</p>
      </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          {message && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="form-input"
              />
              <span className="form-hint">Email cannot be changed</span>
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Lead Preferences</h3>
            
            <div className="form-group">
              <label className="form-label">Keywords</label>
              <textarea
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="form-input"
                rows={3}
                placeholder="marketing agency, growth, performance marketing"
              />
              <span className="form-hint">
                Enter keywords separated by commas. We'll match leads based on these keywords.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Lead Sources</label>
              <div className="sources-list">
                <label className="source-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.sourcesConfig.hackerNews}
                    onChange={() => handleSourceToggle('hackerNews')}
                  />
                  <span>Hacker News</span>
                </label>
                
                <label className="source-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.sourcesConfig.reddit}
                    onChange={() => handleSourceToggle('reddit')}
                  />
                  <span>Reddit</span>
                </label>
                
                <label className="source-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.sourcesConfig.upwork}
                    onChange={() => handleSourceToggle('upwork')}
                  />
                  <span>Upwork</span>
                </label>
                
                <label className="source-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.sourcesConfig.linkedin}
                    onChange={() => handleSourceToggle('linkedin')}
                  />
                  <span>LinkedIn (requires setup)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="profile-sidebar">
          <div className="usage-card">
            <h4>Usage</h4>
            <div className="usage-stat">
              <span className="usage-value">{user?.leadsUsedThisMonth || 0}</span>
              <span className="usage-label">Leads this month</span>
            </div>
            <div className="usage-stat">
              <span className="usage-value">{user?.leadsLimit || 50}</span>
              <span className="usage-label">Monthly limit</span>
            </div>
            <div className="usage-bar">
              <div 
                className="usage-progress"
                style={{ 
                  width: `${Math.min(((user?.leadsUsedThisMonth || 0) / (user?.leadsLimit || 50)) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="usage-hint">
              {user?.plan === 'free' ? (
                <>
                  Upgrade to get more leads.{' '}
                  <a href="/billing">View plans</a>
                </>
              ) : (
                'Your plan renews monthly.'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
