import React, { useState, useEffect } from 'react';
import { DemoAuthContext } from '../App';
import { MOCK_LEADS, MOCK_STATS } from '../utils/mockData';
import LeadCard from '../components/LeadCard';
import FiltersSidebar from '../components/FiltersSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isDemoMode } = React.useContext(DemoAuthContext);
  
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    score: '',
    source: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
    hasMore: false
  });

  useEffect(() => {
    if (isDemoMode) {
      // Use mock data in demo mode
      setLeads(MOCK_LEADS);
      setStats(MOCK_STATS);
      setLoading(false);
    } else {
      fetchLeads();
      fetchStats();
    }
  }, [isDemoMode, filters, pagination.offset]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.score) params.append('score', filters.score);
      if (filters.source) params.append('source', filters.source);
      if (filters.search) params.append('search', filters.search);
      params.append('limit', pagination.limit);
      params.append('offset', pagination.offset);

      const response = await api.get(`/leads?${params.toString()}`);
      setLeads(response.data.data.leads);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/leads/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, offset: 0 });
  };

  const handleLoadMore = () => {
    setPagination({ ...pagination, offset: pagination.offset + pagination.limit });
  };

  const getScoreColor = (score) => {
    switch (score) {
      case 'hot': return '#dc2626';
      case 'warm': return '#d97706';
      case 'cold': return '#0369a1';
      default: return '#6b7280';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Leads Dashboard</h1>
        {stats && (
          <div className="stats-cards">
            <div className="stat-card">
              <span className="stat-value">{stats.overview.total}</span>
              <span className="stat-label">Total Leads</span>
            </div>
            <div className="stat-card hot">
              <span className="stat-value" style={{ color: '#dc2626' }}>
                {stats.overview.hot}
              </span>
              <span className="stat-label">Hot Leads</span>
            </div>
            <div className="stat-card warm">
              <span className="stat-value" style={{ color: '#d97706' }}>
                {stats.overview.warm}
              </span>
              <span className="stat-label">Warm Leads</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.overview.thisWeek}</span>
              <span className="stat-label">This Week</span>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-content">
        <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="leads-section">
          {error && <div className="alert alert-error">{error}</div>}
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No leads found</h3>
              <p>Try adjusting your filters or check back later for new leads.</p>
            </div>
          ) : (
            <>
              <div className="leads-grid">
                {leads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
              
              {pagination.hasMore && (
                <div className="load-more">
                  <button 
                    className="btn btn-outline"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
