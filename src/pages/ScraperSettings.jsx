import React, { useState, useEffect } from 'react';
import { scraperAPI } from '../services/api';
import styles from './ScraperSettings.module.css';

const ScraperSettings = () => {
  const [config, setConfig] = useState(null);
  const [leadTypes, setLeadTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testResults, setTestResults] = useState(null);

  const frequencies = [
    { key: 'realtime', name: 'Real-time', description: 'Every few minutes', tier: 'enterprise' },
    { key: 'hourly', name: 'Hourly', description: 'Every hour', tier: 'pro' },
    { key: 'daily', name: 'Daily', description: 'Once per day', tier: 'free' },
    { key: 'weekly', name: 'Weekly', description: 'Once per week', tier: 'enterprise' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [configRes, typesRes] = await Promise.all([
        scraperAPI.getConfig(),
        scraperAPI.getLeadTypes()
      ]);
      setConfig(configRes.data.data);
      setLeadTypes(typesRes.data.data.leadTypes);
      // Sources are now included in config response
      setSources([
        { key: 'hackerNews', name: 'Hacker News', description: 'Tech discussions and job postings', icon: '📰' },
        { key: 'reddit', name: 'Reddit', description: 'Community discussions and leads', icon: '🤖' },
        { key: 'upwork', name: 'Upwork', description: 'Freelance job postings', icon: '💼' },
        { key: 'linkedin', name: 'LinkedIn', description: 'Professional network posts', icon: '💼' }
      ]);
    } catch (err) {
      setError('Failed to load scraper settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await scraperAPI.updateConfig({
        scrapeFrequency: config.scrapeFrequency,
        leadTypes: config.leadTypes,
        keywords: config.keywords,
        scrapeSources: config.scrapeSources
      });
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setError('');
    setTestResults(null);
    try {
      const response = await scraperAPI.testScraper();
      setTestResults(response.data.data);
    } catch (err) {
      setError('Test failed');
    } finally {
      setTesting(false);
    }
  };

  const toggleLeadType = (typeKey) => {
    const updated = config.leadTypes.includes(typeKey)
      ? config.leadTypes.filter(t => t !== typeKey)
      : [...config.leadTypes, typeKey];
    setConfig({ ...config, leadTypes: updated });
  };

  const toggleSource = (sourceKey) => {
    const updated = config.scrapeSources.includes(sourceKey)
      ? config.scrapeSources.filter(s => s !== sourceKey)
      : [...config.scrapeSources, sourceKey];
    setConfig({ ...config, scrapeSources: updated });
  };

  const updateKeywords = (value) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    setConfig({ ...config, keywords });
  };

  const canUseFrequency = (freqTier) => {
    const tiers = { free: 0, pro: 1, enterprise: 2 };
    return tiers[config.subscriptionTier] >= tiers[freqTier];
  };

  const canUseSource = () => {
    if (config.subscriptionTier !== 'free') return true;
    return config.scrapeSources.length < 1;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!config) return null;

  return (
    <div className={styles.container}>
      <h1>Scraper Settings</h1>
      <p className={styles.subtitle}>
        Configure how and where we find leads for you
      </p>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* Scraping Frequency */}
      <div className={styles.section}>
        <h2>Scraping Frequency</h2>
        <p className={styles.description}>
          How often should we check for new leads?
        </p>
        <div className={styles.frequencyGrid}>
          {frequencies.map(freq => {
            const canUse = canUseFrequency(freq.tier);
            const isSelected = config.scrapeFrequency === freq.key;
            
            return (
              <button
                key={freq.key}
                className={`${styles.freqCard} ${isSelected ? styles.selected : ''} ${!canUse ? styles.disabled : ''}`}
                onClick={() => canUse && setConfig({ ...config, scrapeFrequency: freq.key })}
                disabled={!canUse}
              >
                <span className={styles.freqName}>{freq.name}</span>
                <span className={styles.freqDesc}>{freq.description}</span>
                {!canUse && (
                  <span className={styles.upgradeBadge}>
                    {freq.tier === 'pro' ? 'Pro' : 'Enterprise'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lead Types */}
      <div className={styles.section}>
        <h2>Lead Types</h2>
        <p className={styles.description}>
          What types of opportunities should we look for?
        </p>
        <div className={styles.leadTypesGrid}>
          {leadTypes.map(type => (
            <label
              key={type.key}
              className={`${styles.leadTypeCard} ${config.leadTypes.includes(type.key) ? styles.selected : ''}`}
            >
              <input
                type="checkbox"
                checked={config.leadTypes.includes(type.key)}
                onChange={() => toggleLeadType(type.key)}
              />
              <span className={styles.checkmark}></span>
              <span className={styles.leadTypeName}>{type.name}</span>
              <span className={styles.leadTypeDesc}>{type.description}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className={styles.section}>
        <h2>Keywords</h2>
        <p className={styles.description}>
          Enter keywords that describe what you're looking for (comma-separated)
        </p>
        <textarea
          className={styles.keywordsInput}
          value={config.keywords.join(', ')}
          onChange={(e) => updateKeywords(e.target.value)}
          placeholder="marketing agency, growth hacker, lead generation, B2B sales..."
          rows={3}
        />
        <p className={styles.hint}>
          {config.keywords.length}/20 keywords used
        </p>
      </div>

      {/* Sources */}
      <div className={styles.section}>
        <h2>Scrape Sources</h2>
        <p className={styles.description}>
          Select where we should look for leads
          {config.subscriptionTier === 'free' && (
            <span className={styles.limitHint}> (Free tier: 1 source)</span>
          )}
        </p>
        <div className={styles.sourcesGrid}>
          {sources.map(source => {
            const isSelected = config.scrapeSources.includes(source.key);
            const canSelect = !isSelected && config.subscriptionTier === 'free' && config.scrapeSources.length >= 1;
            
            return (
              <label
                key={source.key}
                className={`${styles.sourceCard} ${isSelected ? styles.selected : ''} ${canSelect ? styles.disabled : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !canSelect && toggleSource(source.key)}
                  disabled={canSelect}
                />
                <span className={styles.checkmark}></span>
                <span className={styles.sourceIcon}>{source.icon}</span>
                <span className={styles.sourceName}>{source.name}</span>
                <span className={styles.sourceDesc}>{source.description}</span>
              </label>
            );
          })}
        </div>
        {config.subscriptionTier === 'free' && config.scrapeSources.length >= 1 && (
          <p className={styles.upgradeHint}>
            💡 <a href="/billing">Upgrade to Pro</a> for unlimited sources
          </p>
        )}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className={styles.section}>
          <h2>Test Results</h2>
          <div className={styles.testResults}>
            <p className={styles.testSummary}>
              Found <strong>{testResults.simulatedMatches.length}</strong> simulated matches
              across <strong>{testResults.sources.length}</strong> sources
            </p>
            {testResults.simulatedMatches.map((match, i) => (
              <div key={i} className={styles.testMatch}>
                <span className={`${styles.scoreBadge} ${styles[match.score]}`}>
                  {match.score}
                </span>
                <div className={styles.matchContent}>
                  <strong>{match.title}</strong>
                  <span>Source: {match.source}</span>
                  <small>{match.reason}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={styles.testBtn}
          onClick={handleTest}
          disabled={testing}
        >
          {testing ? 'Testing...' : '🧪 Test Configuration'}
        </button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default ScraperSettings;
