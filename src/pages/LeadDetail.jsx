import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LeadDetail.css';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/leads/${id}`);
      setLead(response.data.data.lead);
      setNotes(response.data.data.lead.notes || '');
      setStatus(response.data.data.lead.status);
    } catch (err) {
      setError('Failed to load lead details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/leads/${id}`, { notes, status });
      setLead({ ...lead, notes, status });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleFavorite = async () => {
    try {
      await api.post(`/leads/${id}/favorite`);
      setLead({ ...lead, isFavorite: !lead.isFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const getScoreBadgeClass = (score) => {
    switch (score) {
      case 'hot': return 'badge-hot';
      case 'warm': return 'badge-warm';
      case 'cold': return 'badge-cold';
      default: return 'badge-cold';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="lead-detail-error">
        <h2>{error || 'Lead not found'}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="lead-detail">
      <div className="lead-detail-header">
        <button className="btn btn-outline back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <div className="lead-actions">
          <button 
            className="btn btn-outline"
            onClick={handleFavorite}
          >
            {lead.isFavorite ? '⭐ Unfavorite' : '☆ Favorite'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Lead'}
          </button>
        </div>
      </div>

      <div className="lead-detail-content">
        <div className="lead-main">
          <div className="lead-header">
            <h1>{lead.companyName || 'Unknown Company'}</h1>
            <div className="lead-badges">
              <span className={`badge ${getScoreBadgeClass(lead.score)}`}>
                {lead.score}
              </span>
              <span className="badge badge-new">{lead.status}</span>
              <span className="badge badge-source">{lead.source}</span>
            </div>
          </div>

          {lead.intent && (
            <div className="lead-section">
              <h3>Intent</h3>
              <p className="lead-intent">{lead.intent}</p>
            </div>
          )}

          {lead.description && (
            <div className="lead-section">
              <h3>Description</h3>
              <p>{lead.description}</p>
            </div>
          )}

          {lead.signals && lead.signals.length > 0 && (
            <div className="lead-section">
              <h3>Signals</h3>
              <div className="lead-signals">
                {lead.signals.map((signal, idx) => (
                  <span key={idx} className="signal-tag">{signal}</span>
                ))}
              </div>
            </div>
          )}

          <div className="lead-section">
            <h3>Notes</h3>
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="notes-textarea"
                placeholder="Add notes about this lead..."
                rows={5}
              />
            ) : (
              <p className="lead-notes">{lead.notes || 'No notes added yet.'}</p>
            )}
          </div>

          {lead.aiAnalysis && (
            <div className="lead-section ai-analysis">
              <h3>AI Analysis</h3>
              <pre>{JSON.stringify(lead.aiAnalysis, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="lead-sidebar">
          <div className="sidebar-section">
            <h4>Status</h4>
            {isEditing ? (
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="status-select"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            ) : (
              <span className={`status-value status-${lead.status}`}>{lead.status}</span>
            )}
          </div>

          {lead.contactName && (
            <div className="sidebar-section">
              <h4>Contact</h4>
              <p className="contact-name">{lead.contactName}</p>
              {lead.contactTitle && <p className="contact-title">{lead.contactTitle}</p>}
            </div>
          )}

          {lead.contactEmail && (
            <div className="sidebar-section">
              <h4>Email</h4>
              <a href={`mailto:${lead.contactEmail}`} className="contact-link">
                {lead.contactEmail}
              </a>
            </div>
          )}

          {lead.contactLinkedIn && (
            <div className="sidebar-section">
              <h4>LinkedIn</h4>
              <a href={lead.contactLinkedIn} target="_blank" rel="noopener noreferrer" className="contact-link">
                View Profile
              </a>
            </div>
          )}

          {lead.companyWebsite && (
            <div className="sidebar-section">
              <h4>Website</h4>
              <a href={lead.companyWebsite} target="_blank" rel="noopener noreferrer" className="contact-link">
                {lead.companyWebsite}
              </a>
            </div>
          )}

          {lead.sourceUrl && (
            <div className="sidebar-section">
              <h4>Source</h4>
              <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                View Original
              </a>
            </div>
          )}

          <div className="sidebar-section">
            <h4>Created</h4>
            <p>{new Date(lead.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
