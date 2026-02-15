import React from 'react';
import { Link } from 'react-router-dom';
import './LeadCard.css';

const LeadCard = ({ lead }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'hacker_news': return '💻';
      case 'reddit': return '📱';
      case 'upwork': return '💼';
      case 'linkedin': return '💼';
      case 'twitter': return '🐦';
      default: return '📌';
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new': return 'badge-new';
      case 'contacted': return 'badge-contacted';
      case 'qualified': return 'badge-qualified';
      case 'closed': return 'badge-closed';
      default: return 'badge-new';
    }
  };

  return (
    <Link to={`/leads/${lead.id}`} className="lead-card">
      <div className="lead-card-header">
        <div className="lead-source">
          <span className="source-icon">{getSourceIcon(lead.source)}</span>
          <span className="source-name">{lead.source.replace('_', ' ')}</span>
        </div>
        <div className="lead-badges">
          <span className={`badge ${getScoreBadgeClass(lead.score)}`}>
            {lead.score}
          </span>
          <span className={`badge ${getStatusBadgeClass(lead.status)}`}>
            {lead.status}
          </span>
        </div>
      </div>

      <div className="lead-card-body">
        <h3 className="lead-company">{lead.companyName || 'Unknown Company'}</h3>
        {lead.contactName && (
          <p className="lead-contact">{lead.contactName}</p>
        )}
        {lead.intent && (
          <p className="lead-intent">{lead.intent.substring(0, 120)}...</p>
        )}
        
        {lead.signals && lead.signals.length > 0 && (
          <div className="lead-signals">
            {lead.signals.slice(0, 3).map((signal, idx) => (
              <span key={idx} className="signal-tag">{signal}</span>
            ))}
          </div>
        )}
      </div>

      <div className="lead-card-footer">
        <span className="lead-date">{formatDate(lead.createdAt)}</span>
        {lead.isFavorite && <span className="favorite-star">⭐</span>}
      </div>
    </Link>
  );
};

export default LeadCard;
