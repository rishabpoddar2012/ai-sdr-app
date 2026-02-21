import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';
import styles from './Billing.module.css';

const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, plansRes] = await Promise.all([
        subscriptionAPI.getSubscription(),
        subscriptionAPI.getPlans()
      ]);
      setSubscription(subRes.data.data);
      setPlans(plansRes.data.data.plans);
    } catch (err) {
      setError('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planKey) => {
    if (planKey === 'free') return;
    
    setUpgrading(true);
    setError('');
    try {
      const response = await subscriptionAPI.createCheckout(planKey, 'monthly');
      
      if (response.data.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start checkout');
      setUpgrading(false);
    }
  };

  const handleManagePayment = async () => {
    try {
      const response = await subscriptionAPI.createPortalSession();
      if (response.data.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (err) {
      setError('Failed to open payment portal');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel? You\'ll keep access until the end of your billing period.')) {
      return;
    }
    
    try {
      await subscriptionAPI.cancelSubscription();
      setSuccessMessage('Subscription cancelled. You\'ll keep access until the end of your billing period.');
      fetchData();
    } catch (err) {
      setError('Failed to cancel subscription');
    }
  };

  const handleReactivate = async () => {
    try {
      await subscriptionAPI.reactivateSubscription();
      setSuccessMessage('Subscription reactivated!');
      fetchData();
    } catch (err) {
      setError('Failed to reactivate subscription');
    }
  };

  const formatPrice = (cents) => {
    if (cents === 0) return 'Free';
    return `$${(cents / 100).toFixed(0)}/mo`;
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return '#dc2626';
    if (percentage >= 75) return '#f59e0b';
    return '#22c55e';
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Billing & Subscription</h1>

      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      {/* Current Plan Card */}
      {subscription && (
        <div className={styles.currentPlan}>
          <div className={styles.planHeader}>
            <div>
              <span className={`${styles.badge} ${styles[subscription.tier]}`}>
                {subscription.tier.toUpperCase()}
              </span>
              <span className={`${styles.status} ${styles[subscription.status]}`}>
                {subscription.status}
              </span>
            </div>
            {subscription.tier !== 'free' && (
              <button 
                className={styles.manageBtn}
                onClick={handleManagePayment}
              >
                Manage Payment
              </button>
            )}
          </div>

          <div className={styles.usageSection}>
            <div className={styles.usageHeader}>
              <span>Lead Usage</span>
              <span className={styles.usageNumbers}>
                {subscription.leadsUsed} / {subscription.leadsLimit} leads
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${Math.min(subscription.usagePercentage, 100)}%`,
                  backgroundColor: getUsageColor(subscription.usagePercentage)
                }}
              />
            </div>
            <p className={styles.usageHint}>
              {subscription.usagePercentage >= 90 
                ? '⚠️ You\'re almost at your limit. Upgrade now to keep receiving leads!'
                : `${subscription.leadsRemaining} leads remaining this period`
              }
            </p>
          </div>

          {subscription.status === 'cancelled' ? (
            <button 
              className={styles.reactivateBtn}
              onClick={handleReactivate}
            >
              Reactivate Subscription
            </button>
          ) : subscription.tier !== 'free' && (
            <button 
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel Subscription
            </button>
          )}
        </div>
      )}

      {/* Pricing Plans */}
      <h2>Choose Your Plan</h2>
      <div className={styles.plansGrid}>
        {plans.map(plan => {
          const isCurrentPlan = subscription?.tier === plan.key;
          const features = plan.features || {};
          
          return (
            <div 
              key={plan.key} 
              className={`${styles.planCard} ${isCurrentPlan ? styles.current : ''} ${plan.key === 'pro' ? styles.popular : ''}`}
            >
              {plan.key === 'pro' && <span className={styles.popularBadge}>Most Popular</span>}
              
              <h3>{plan.name}</h3>
              <p className={styles.description}>{plan.description}</p>
              
              <div className={styles.price}>
                {formatPrice(plan.priceMonthly)}
                {plan.priceYearly && (
                  <span className={styles.yearly}>
                    or ${(plan.priceYearly / 100).toFixed(0)}/year
                  </span>
                )}
              </div>

              <ul className={styles.features}>
                <li>
                  <strong>{plan.leadsLimit === 999999 ? 'Unlimited' : plan.leadsLimit}</strong> leads/month
                </li>
                <li>
                  <strong>{plan.scrapeFrequency}</strong> scraping
                </li>
                {plan.sourcesLimit ? (
                  <li><strong>{plan.sourcesLimit}</strong> source{plan.sourcesLimit > 1 ? 's' : ''}</li>
                ) : (
                  <li><strong>Unlimited</strong> sources</li>
                )}
                {features.api_access && <li>✓ API access</li>}
                {features.webhooks && <li>✓ Webhook notifications</li>}
                <li>✓ {features.support || 'Community'} support</li>
              </ul>

              {isCurrentPlan ? (
                <button className={styles.currentBtn} disabled>
                  Current Plan
                </button>
              ) : (
                <button
                  className={plan.key === 'free' ? styles.freeBtn : styles.upgradeBtn}
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={upgrading}
                >
                  {upgrading && plan.key !== 'free' ? 'Loading...' : 
                   plan.key === 'free' ? 'Downgrade to Free' : 
                   subscription?.tier === 'free' ? 'Upgrade' : 'Switch Plan'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className={styles.faq}>
        <h3>Frequently Asked Questions</h3>
        <div className={styles.faqItem}>
          <h4>How does the free plan work?</h4>
          <p>The free plan includes 10 leads per week, scraped daily from 1 source of your choice. Perfect for testing the platform.</p>
        </div>
        <div className={styles.faqItem}>
          <h4>Can I change plans anytime?</h4>
          <p>Yes! You can upgrade or downgrade at any time. Upgrades take effect immediately, downgrades at the end of your billing period.</p>
        </div>
        <div className={styles.faqItem}>
          <h4>What happens if I hit my lead limit?</h4>
          <p>We'll notify you when you reach 80% and 100% of your limit. At 100%, scraping pauses until your next billing period or until you upgrade.</p>
        </div>
      </div>
    </div>
  );
};

export default Billing;
