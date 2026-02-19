import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, 
  Thermometer, 
  Snowflake, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bell,
  Filter,
  Search,
  Plus,
  BarChart3,
  Target
} from 'lucide-react';
import './IntentRadar.css';

const IntentRadar = () => {
  const { user } = useAuth();
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState({
    hot_signals: 0,
    warm_signals: 0,
    total_companies: 0,
    unread_signals: 0
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddCompany, setShowAddCompany] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intent-radar/api/intent-dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Fetch signals
      const signalsRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intent-radar/api/intent-signals`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (signalsRes.ok) {
        const signalsData = await signalsRes.json();
        setSignals(signalsData.signals || []);
      }

      // Fetch companies
      const companiesRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intent-radar/api/tracked-companies`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        setCompanies(companiesData.companies || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSignalIcon = (type) => {
    switch (type) {
      case 'funding': return <DollarSign size={20} />;
      case 'hiring': return <Users size={20} />;
      case 'expansion': return <TrendingUp size={20} />;
      case 'tech_change': return <Building2 size={20} />;
      case 'complaint': return <AlertCircle size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getSignalColor = (category) => {
    switch (category) {
      case 'hot': return 'hot';
      case 'warm': return 'warm';
      case 'cold': return 'cold';
      default: return 'neutral';
    }
  };

  const filteredSignals = signals.filter(signal => {
    if (activeFilter === 'all') return true;
    return signal.signal_category === activeFilter;
  });

  const unreadSignals = signals.filter(s => !s.is_read);

  if (loading) {
    return (
      <div className="intent-radar-loading">
        <div className="loading-spinner"></div>
        <p>Loading Intent Radar...</p>
      </div>
    );
  }

  return (
    <div className="intent-radar">
      {/* Header */}
      <div className="intent-header">
        <div className="intent-title">
          <Target className="intent-icon" size={32} />
          <div>
            <h1>Intent Radar</h1>
            <p>Know who to call before your competitors</p>
          </div>
        </div>
        <div className="intent-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAddCompany(true)}
          >
            <Plus size={18} />
            Track Company
          </button>
          <button className="btn btn-primary">
            <Bell size={18} />
            {stats.unread_signals > 0 && (
              <span className="badge">{stats.unread_signals}</span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card hot">
          <div className="stat-icon">
            <Flame size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.hot_signals}</h3>
            <p>Hot Signals</p>
            <span className="stat-trend">Call today</span>
          </div>
        </div>

        <div className="stat-card warm">
          <div className="stat-icon">
            <Thermometer size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.warm_signals}</h3>
            <p>Warm Signals</p>
            <span className="stat-trend">Follow up this week</span>
          </div>
        </div>

        <div className="stat-card companies">
          <div className="stat-icon">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.total_companies}</h3>
            <p>Companies Tracked</p>
            <span className="stat-trend">Active monitoring</span>
          </div>
        </div>

        <div className="stat-card unread">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.unread_signals}</h3>
            <p>Unread Signals</p>
            <span className="stat-trend">Need attention</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="intent-content">
        {/* Signals Feed */}
        <div className="signals-section">
          <div className="section-header">
            <h2>
              <BarChart3 size={20} />
              Intent Signals
            </h2>
            <div className="filter-tabs">
              <button 
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={activeFilter === 'hot' ? 'active' : ''}
                onClick={() => setActiveFilter('hot')}
              >
                <Flame size={14} /> Hot
              </button>
              <button 
                className={activeFilter === 'warm' ? 'active' : ''}
                onClick={() => setActiveFilter('warm')}
              >
                <Thermometer size={14} /> Warm
              </button>
            </div>
          </div>

          <div className="signals-list">
            {filteredSignals.length === 0 ? (
              <div className="empty-state">
                <Target size={48} className="empty-icon" />
                <h3>No signals yet</h3>
                <p>Add companies to track and we'll start detecting buying intent</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddCompany(true)}
                >
                  <Plus size={18} />
                  Track Your First Company
                </button>
              </div>
            ) : (
              filteredSignals.map(signal => (
                <div 
                  key={signal.id} 
                  className={`signal-card ${getSignalColor(signal.signal_category)} ${!signal.is_read ? 'unread' : ''}`}
                >
                  <div className="signal-badge">
                    {signal.signal_category === 'hot' && <Flame size={14} />}
                    {signal.signal_category === 'warm' && <Thermometer size={14} />}
                    {signal.signal_category === 'cold' && <Snowflake size={14} />}
                    <span>{signal.signal_category.toUpperCase()}</span>
                  </div>
                  
                  <div className="signal-icon">
                    {getSignalIcon(signal.signal_type)}
                  </div>
                  
                  <div className="signal-content">
                    <div className="signal-header">
                      <h4>{signal.tracked_companies?.name || 'Unknown Company'}</h4>
                      <span className="signal-time">
                        <Clock size={12} />
                        {new Date(signal.detected_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h5>{signal.title}</h5>
                    <p>{signal.description}</p>
                    
                    <div className="signal-meta">
                      <span className="signal-type">{signal.signal_type}</span>
                      <span className="signal-source">{signal.source}</span>
                      <span className="confidence">
                        {signal.confidence_score}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <div className="signal-actions">
                    {!signal.is_read && (
                      <button className="btn-icon" title="Mark as read">
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    {signal.source_url && (
                      <a 
                        href={signal.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-icon"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button className="btn btn-sm btn-primary">
                      Take Action
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="intent-sidebar">
          {/* Tracked Companies */}
          <div className="sidebar-section">
            <h3>
              <Building2 size={16} />
              Tracked Companies
            </h3>
            <div className="companies-list">
              {companies.map(company => (
                <div key={company.id} className="company-item">
                  <div className="company-info">
                    <span className="company-name">{company.name}</span>
                    <span className="company-domain">{company.domain}</span>
                  </div>
                  {company.last_signal_at && (
                    <span className="company-signal-indicator" />
                  )}
                </div>
              ))}
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAddCompany(true)}
              >
                <Plus size={14} />
                Add Company
              </button>
            </div>
          </div>

          {/* Hot Leads This Week */}
          <div className="sidebar-section">
            <h3>
              <Flame size={16} />
              Hot Leads This Week
            </h3>
            <div className="hot-leads-list">
              <p className="empty-text">No hot leads detected yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddCompany && (
        <AddCompanyModal 
          onClose={() => setShowAddCompany(false)}
          onAdd={fetchDashboardData}
        />
      )}
    </div>
  );
};

// Add Company Modal Component
const AddCompanyModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    linkedin_url: '',
    industry: '',
    employee_count: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intent-radar/api/tracked-companies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...formData,
            employee_count: parseInt(formData.employee_count) || null
          })
        }
      );

      if (res.ok) {
        onAdd();
        onClose();
      }
    } catch (error) {
      console.error('Error adding company:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Track New Company</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Acme Inc"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Website Domain</label>
            <input
              type="text"
              value={formData.domain}
              onChange={e => setFormData({...formData, domain: e.target.value})}
              placeholder="acme.com"
            />
          </div>
          
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={e => setFormData({...formData, linkedin_url: e.target.value})}
              placeholder="https://linkedin.com/company/acme"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
                placeholder="SaaS"
              />
            </div>
            
            <div className="form-group">
              <label>Employee Count</label>
              <input
                type="number"
                value={formData.employee_count}
                onChange={e => setFormData({...formData, employee_count: e.target.value})}
                placeholder="50"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Start Tracking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntentRadar;
