import React, { useState } from 'react';
import api from '../services/api';
import styles from './Onboarding.module.css';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    productDescription: '',
    industry: '',
    companySize: '',
    targetMarket: '',
    customerLocations: [],
    scrapeSources: []
  });

  const industries = [
    'SaaS', 'E-commerce', 'Agency', 'Consulting', 'Healthcare',
    'Finance', 'Education', 'Real Estate', 'Manufacturing', 'Other'
  ];

  const companySizes = [
    '1-10', '11-50', '51-200', '201-500', '500+'
  ];

  const locations = [
    'North America', 'Europe', 'Asia Pacific', 'Latin America',
    'Middle East', 'Africa', 'Remote/Global'
  ];

  const sources = [
    { key: 'hackerNews', name: 'Hacker News', icon: '🚀', desc: 'Tech discussions' },
    { key: 'reddit', name: 'Reddit', icon: '📱', desc: 'Subreddit posts' },
    { key: 'upwork', name: 'Upwork', icon: '💼', desc: 'Freelance jobs' },
    { key: 'linkedin', name: 'LinkedIn', icon: '💼', desc: 'Professional network' },
    { key: 'indeed', name: 'Indeed', icon: '📋', desc: 'Job postings' },
    { key: 'productHunt', name: 'Product Hunt', icon: '🎯', desc: 'Product launches' },
    { key: 'twitter', name: 'X/Twitter', icon: '🐦', desc: 'Social mentions' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationToggle = (location) => {
    const updated = formData.customerLocations.includes(location)
      ? formData.customerLocations.filter(l => l !== location)
      : [...formData.customerLocations, location];
    setFormData({ ...formData, customerLocations: updated });
  };

  const handleSourceToggle = (sourceKey) => {
    const updated = formData.scrapeSources.includes(sourceKey)
      ? formData.scrapeSources.filter(s => s !== sourceKey)
      : [...formData.scrapeSources, sourceKey];
    setFormData({ ...formData, scrapeSources: updated });
  };

  const saveStep = async (stepNum) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/onboarding', {
        step: stepNum,
        data: formData
      });
      if (stepNum < 4) {
        setStep(stepNum + 1);
      } else {
        onComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className={styles.step}>
      <h2>🏢 Tell us about your company</h2>
      <p className={styles.subtitle}>This helps us find the most relevant leads for you</p>
      
      <div className={styles.formGroup}>
        <label>Company Name *</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Acme Inc."
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>What does your product/service do? *</label>
        <textarea
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          placeholder="We help B2B SaaS companies automate their sales outreach..."
          rows={4}
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Industry *</label>
          <select name="industry" value={formData.industry} onChange={handleChange} required>
            <option value="">Select...</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Company Size *</label>
          <select name="companySize" value={formData.companySize} onChange={handleChange} required>
            <option value="">Select...</option>
            {companySizes.map(s => <option key={s} value={s}>{s} employees</option>)}
          </select>
        </div>
      </div>

      <button 
        className={styles.btnPrimary}
        onClick={() => saveStep(1)}
        disabled={!formData.companyName || !formData.productDescription || !formData.industry || loading}
      >
        {loading ? 'Saving...' : 'Continue →'}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.step}>
      <h2>🎯 Who are your ideal customers?</h2>
      <p className={styles.subtitle}>We'll target leads that match your criteria</p>

      <div className={styles.formGroup}>
        <label>Target Market / Ideal Customer Profile *</label>
        <textarea
          name="targetMarket"
          value={formData.targetMarket}
          onChange={handleChange}
          placeholder="Marketing agencies with 10-50 employees looking to scale their lead generation..."
          rows={3}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Where do your customers typically live/work? *</label>
        <div className={styles.optionsGrid}>
          {locations.map(loc => (
            <button
              key={loc}
              className={`${styles.optionBtn} ${formData.customerLocations.includes(loc) ? styles.selected : ''}`}
              onClick={() => handleLocationToggle(loc)}
              type="button"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnSecondary} onClick={() => setStep(1)}>
          ← Back
        </button>
        <button 
          className={styles.btnPrimary}
          onClick={() => saveStep(2)}
          disabled={!formData.targetMarket || formData.customerLocations.length === 0 || loading}
        >
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.step}>
      <h2>🔍 Where should we look for leads?</h2>
      <p className={styles.subtitle}>Select the sources you want us to scrape for you</p>

      <div className={styles.sourcesGrid}>
        {sources.map(source => (
          <button
            key={source.key}
            className={`${styles.sourceCard} ${formData.scrapeSources.includes(source.key) ? styles.selected : ''}`}
            onClick={() => handleSourceToggle(source.key)}
            type="button"
          >
            <span className={styles.sourceIcon}>{source.icon}</span>
            <span className={styles.sourceName}>{source.name}</span>
            <span className={styles.sourceDesc}>{source.desc}</span>
          </button>
        ))}
      </div>

      <p className={styles.hint}>💡 Select at least 2-3 sources for best results</p>

      <div className={styles.btnRow}>
        <button className={styles.btnSecondary} onClick={() => setStep(2)}>
          ← Back
        </button>
        <button 
          className={styles.btnPrimary}
          onClick={() => saveStep(3)}
          disabled={formData.scrapeSources.length === 0 || loading}
        >
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.step}>
      <div className={styles.successIcon}>🎉</div>
      <h2>You're all set!</h2>
      <p className={styles.subtitle}>We'll start scraping for leads based on your preferences</p>

      <div className={styles.summary}>
        <h3>Your Configuration:</h3>
        <div className={styles.summaryItem}>
          <strong>Company:</strong> {formData.companyName}
        </div>
        <div className={styles.summaryItem}>
          <strong>Industry:</strong> {formData.industry}
        </div>
        <div className={styles.summaryItem}>
          <strong>Target:</strong> {formData.targetMarket}
        </div>
        <div className={styles.summaryItem}>
          <strong>Locations:</strong> {formData.customerLocations.join(', ')}
        </div>
        <div className={styles.summaryItem}>
          <strong>Sources:</strong> {formData.scrapeSources.length} selected
        </div>
      </div>

      <button 
        className={styles.btnPrimary}
        onClick={() => saveStep(4)}
        disabled={loading}
      >
        {loading ? 'Setting up...' : 'Go to Dashboard →'}
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`${styles.progressStep} ${s <= step ? styles.active : ''}`} />
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default Onboarding;
