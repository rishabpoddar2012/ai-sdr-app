import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './ApiSettings.module.css';

const ApiSettings = () => {
  const [apiData, setApiData] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const response = await api.get('/settings/api-credentials');
      setApiData(response.data.data);
      setWebhookUrl(response.data.data.webhookUrl || '');
    } catch (err) {
      if (err.response?.status === 403) {
        setError('API access is not enabled for your plan. Upgrade to Pro to access the API.');
      } else {
        setError('Failed to load API credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateApiKey = async () => {
    if (!window.confirm('Are you sure? This will invalidate your current API key immediately.')) {
      return;
    }
    
    setRegenerating(true);
    setError('');
    try {
      const response = await api.post('/settings/api-key/regenerate');
      setApiData({ ...apiData, apiKey: response.data.data.apiKey });
      setSuccess('API key regenerated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to regenerate API key');
    } finally {
      setRegenerating(false);
    }
  };

  const updateWebhook = async () => {
    try {
      await api.put('/settings/webhook', { webhookUrl });
      setSuccess('Webhook URL updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update webhook');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  if (error && error.includes('Upgrade to Pro')) {
    return (
      <div className={styles.container}>
        <h1>API Settings</h1>
        <div className={styles.upgradeCard}>
          <div className={styles.lockIcon}>🔒</div>
          <h2>API Access Required</h2>
          <p>Upgrade to the Pro plan to unlock API access and integrate with n8n, Make, and Zapier.</p>
          <ul className={styles.features}>
            <li>✓ Access leads via REST API</li>
            <li>✓ Real-time webhooks</li>
            <li>✓ n8n/Make.com integration</li>
            <li>✓ 500 leads per month</li>
          </ul>
          <button 
            className={styles.upgradeBtn}
            onClick={() => window.location.href = '/billing'}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>API Settings</h1>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {apiData && (
        <>
          {/* API Key Section */}
          <div className={styles.section}>
            <h2>Your API Key</h2>
            <p className={styles.description}>
              Use this key to authenticate API requests. Keep it secure!
            </p>
            
            <div className={styles.apiKeyBox}>
              <code className={styles.apiKey}>{apiData.apiKey}</code>
              <button 
                className={styles.copyBtn}
                onClick={() => copyToClipboard(apiData.apiKey)}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            <button 
              className={styles.regenerateBtn}
              onClick={regenerateApiKey}
              disabled={regenerating}
            >
              {regenerating ? 'Regenerating...' : '🔄 Regenerate API Key'}
            </button>
          </div>

          {/* API Endpoint */}
          <div className={styles.section}>
            <h2>API Endpoint</h2>
            <p className={styles.description}>
              Base URL for all API requests
            </p>
            <div className={styles.endpointBox}>
              <code>{apiData.apiEndpoint}</code>
              <button 
                className={styles.copyBtn}
                onClick={() => copyToClipboard(apiData.apiEndpoint)}
              >
                📋 Copy
              </button>
            </div>
          </div>

          {/* Usage Stats */}
          <div className={styles.section}>
            <h2>Usage</h2>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{apiData.rateLimit}</span>
                <span className={styles.statLabel}>requests/hour</span>
              </div>
            </div>
          </div>

          {/* Webhook Configuration */}
          <div className={styles.section}>
            <h2>Webhook URL</h2>
            <p className={styles.description}>
              We'll send POST requests to this URL when new leads are found
            </p>
            <div className={styles.webhookForm}>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhook"
                className={styles.webhookInput}
              />
              <button 
                className={styles.saveBtn}
                onClick={updateWebhook}
              >
                Save
              </button>
            </div>
          </div>

          {/* Code Examples */}
          <div className={styles.section}>
            <h2>Code Examples</h2>
            
            <div className={styles.codeExample}>
              <h3>cURL</h3>
              <pre><code>{`curl -X GET \\
  '${apiData.apiEndpoint}/leads' \\
  -H 'Authorization: Bearer ${apiData.apiKey}'`}</code></pre>
              <button 
                className={styles.copyCodeBtn}
                onClick={() => copyToClipboard(`curl -X GET '${apiData.apiEndpoint}/leads' -H 'Authorization: Bearer ${apiData.apiKey}'`)}
              >
                Copy
              </button>
            </div>

            <div className={styles.codeExample}>
              <h3>JavaScript (Fetch)</h3>
              <pre><code>{`const response = await fetch('${apiData.apiEndpoint}/leads', {
  headers: {
    'Authorization': 'Bearer ${apiData.apiKey}'
  }
});
const data = await response.json();`}</code></pre>
              <button 
                className={styles.copyCodeBtn}
                onClick={() => copyToClipboard(`const response = await fetch('${apiData.apiEndpoint}/leads', {
  headers: {
    'Authorization': 'Bearer ${apiData.apiKey}'
  }
});
const data = await response.json();`)}
              >
                Copy
              </button>
            </div>

            <div className={styles.codeExample}>
              <h3>Python (Requests)</h3>
              <pre><code>{`import requests

response = requests.get(
    '${apiData.apiEndpoint}/leads',
    headers={'Authorization': 'Bearer ${apiData.apiKey}'}
)
leads = response.json()`}</code></pre>
              <button 
                className={styles.copyCodeBtn}
                onClick={() => copyToClipboard(`import requests

response = requests.get(
    '${apiData.apiEndpoint}/leads',
    headers={'Authorization': 'Bearer ${apiData.apiKey}'}
)
leads = response.json()`)}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Documentation Link */}
          <div className={styles.docsLink}>
            <a href={apiData.documentation} target="_blank" rel="noopener noreferrer">
              📚 View Full API Documentation →
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiSettings;
