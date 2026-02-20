import React, { useState, useEffect, useContext } from 'react';
import { DemoAuthContext } from '../App';
import api from '../services/api';
import './Billing.css';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    leads: 50,
    features: ['50 leads/month', 'Basic filtering', 'Email notifications', 'Standard support']
  },
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 49, yearly: 470 },
    leads: 200,
    features: ['200 leads/month', 'Advanced filtering', 'Priority email', 'CSV export', 'API access']
  },
  {
    id: 'growth',
    name: 'Growth',
    price: { monthly: 149, yearly: 1430 },
    leads: 1000,
    features: ['1000 leads/month', 'AI scoring', 'Slack integration', 'Webhook API', 'Priority support']
  },
  {
    id: 'agency',
    name: 'Agency',
    price: { monthly: 399, yearly: 3830 },
    leads: 5000,
    features: ['5000 leads/month', 'White-label', 'Team collaboration', 'CRM integrations', 'Dedicated support']
  }
];

const Billing = () => {
  const { user } = useContext(DemoAuthContext);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/subscription');
      setSubscription(response.data.data);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    }
  };

  const handleUpgrade = async (planId) => {
    if (planId === 'free') return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await api.post('/subscription/checkout', {
        plan: planId,
        billingPeriod
      });
      
      if (response.data.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to start checkout'
      });
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const response = await api.post('/subscription/portal');
      if (response.data.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to open billing portal'
      });
    }
    setLoading(false);
  };

  const currentPlan = user?.plan || 'free';

  return (
    <div className="billing-page">
      <div className="billing-header">
        <h1>Billing & Plans</h1>
        <p>Choose the plan that works best for your business</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {subscription && currentPlan !== 'free' && (
        <div className="current-subscription card">
          <h3>Current Subscription</h3>
          <div className="subscription-details">
            <div className="sub-item">
              <span className="sub-label">Plan</span>
              <span className="sub-value capitalize">{subscription.plan}</span>
            </div>
            <div className="sub-item">
              <span className="sub-label">Status</span>
              <span className={`sub-value status-${subscription.status}`}>
                {subscription.status}
              </span>
            </div>
            {subscription.currentPeriodEnd && (
              <div className="sub-item">
                <span className="sub-label">Renews on</span>
                <span className="sub-value">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          <button 
            className="btn btn-outline"
            onClick={handleManageBilling}
            disabled={loading}
          >
            Manage Billing
          </button>
        </div>
      )}

      <div className="billing-toggle">
        <button
          className={`toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingPeriod('monthly')}
        >
          Monthly
        </button>
        <button
          className={`toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingPeriod('yearly')}
        >
          Yearly
          <span className="save-badge">Save 20%</span>
        </button>
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const price = plan.price[billingPeriod];
          
          return (
            <div 
              key={plan.id} 
              className={`pricing-card ${isCurrentPlan ? 'current' : ''} ${plan.id === 'growth' ? 'featured' : ''}`}
            >
              {plan.id === 'growth' && <span className="popular-badge">Popular</span>}
              
              <div className="pricing-header">
                <h3>{plan.name}</h3>
                <div className="pricing-price">
                  <span className="currency">$</span>
                  <span className="amount">{price}</span>
                  <span className="period">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="pricing-leads">{plan.leads} leads/month</p>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`btn btn-block ${isCurrentPlan ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPlan || loading}
              >
                {isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="billing-faq">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-list">
          <div className="faq-item">
            <h4>Can I change plans anytime?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="faq-item">
            <h4>What happens if I exceed my lead limit?</h4>
            <p>We'll notify you when you're close to your limit. You can upgrade anytime to get more leads.</p>
          </div>
          <div className="faq-item">
            <h4>Can I cancel my subscription?</h4>
            <p>Yes, you can cancel anytime from your billing portal. You'll continue to have access until the end of your billing period.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
