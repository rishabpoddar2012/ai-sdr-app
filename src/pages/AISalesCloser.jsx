import React, { useState, useEffect, useContext } from 'react';
import { DemoAuthContext } from '../App';
import { 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock,
  TrendingUp,
  Shield,
  AlertTriangle,
  ThumbsUp,
  RefreshCw,
  ChevronDown,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import './AISalesCloser.css';

const AISalesCloser = () => {
  const { user } = useContext(DemoAuthContext);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [generatedPitch, setGeneratedPitch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('pitch');
  const [recentPitches, setRecentPitches] = useState([]);

  useEffect(() => {
    fetchLeads();
    fetchRecentPitches();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intent-radar/api/intent-signals`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        // Filter to hot and warm leads
        const qualifiedLeads = (data.signals || []).filter(
          s => s.signal_category === 'hot' || s.signal_category === 'warm'
        );
        setLeads(qualifiedLeads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchRecentPitches = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-closer/api/ai-closer/pitches`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        setRecentPitches(data.pitches || []);
      }
    } catch (error) {
      console.error('Error fetching pitches:', error);
    }
  };

  const generatePitch = async (lead) => {
    setLoading(true);
    setSelectedLead(lead);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-closer/api/ai-closer/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            lead_id: lead.id,
            signal_id: lead.id,
            use_ai: true
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        setGeneratedPitch(data.pitch);
      }
    } catch (error) {
      console.error('Error generating pitch:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getSignalBadge = (category) => {
    switch (category) {
      case 'hot':
        return <span className="signal-badge hot"><Zap size={12} /> HOT</span>;
      case 'warm':
        return <span className="signal-badge warm"><TrendingUp size={12} /> WARM</span>;
      default:
        return <span className="signal-badge cold">COLD</span>;
    }
  };

  return (
    <div className="ai-sales-closer">
      {/* Header */}
      <div className="closer-header">
        <div className="closer-title">
          <Sparkles className="closer-icon" size={32} />
          <div>
            <h1>AI Sales Closer</h1>
            <p>Know exactly what to say to close every lead</p>
          </div>
        </div>
        <div className="closer-stats">
          <div className="stat-item">
            <span className="stat-value">{recentPitches.length}</span>
            <span className="stat-label">Pitches Generated</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {recentPitches.filter(p => p.outcome === 'meeting_booked').length}
            </span>
            <span className="stat-label">Meetings Booked</span>
          </div>
        </div>
      </div>

      <div className="closer-content">
        {/* Leads Sidebar */}
        <div className="leads-sidebar">
          <div className="sidebar-header">
            <h3><Target size={16} /> Qualified Leads</h3>
            <span className="lead-count">{leads.length} ready to pitch</span>
          </div>
          
          <div className="leads-list">
            {leads.length === 0 ? (
              <div className="empty-leads">
                <AlertTriangle size={24} />
                <p>No qualified leads yet</p>
                <small>Generate intent signals first in Intent Radar</small>
              </div>
            ) : (
              leads.map(lead => (
                <div 
                  key={lead.id}
                  className={`lead-card ${selectedLead?.id === lead.id ? 'selected' : ''}`}
                  onClick={() => generatePitch(lead)}
                >
                  <div className="lead-header">
                    <span className="lead-name">
                      {lead.tracked_companies?.name || 'Unknown Company'}
                    </span>
                    {getSignalBadge(lead.signal_category)}
                  </div>
                  <p className="lead-signal">{lead.title}</p>
                  <div className="lead-meta">
                    <span className="signal-type">{lead.signal_type}</span>
                    <span className="confidence">{lead.confidence_score}% confidence</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="pitch-workspace">
          {!generatedPitch && !loading && (
            <div className="empty-workspace">
              <Sparkles size={48} className="empty-icon" />
              <h3>Select a lead to generate your pitch</h3>
              <p>Click on any qualified lead from the sidebar to generate a personalized sales pitch with talking points, objection handlers, and timing recommendations.</p>
            </div>
          )}

          {loading && (
            <div className="generating-state">
              <div className="ai-thinking">
                <div className="ai-pulse"></div>
                <div className="ai-pulse"></div>
                <div className="ai-pulse"></div>
              </div>
              <h3>AI is crafting your perfect pitch...</h3>
              <p>Analyzing {selectedLead?.tracked_companies?.name}'s context, intent signals, and optimal approach</p>
            </div>
          )}

          {generatedPitch && !loading && (
            <div className="generated-pitch">
              {/* Pitch Header */}
              <div className="pitch-header">
                <div className="pitch-title">
                  <h2>
                    <Sparkles size={20} />
                    Personalized Pitch for {selectedLead?.tracked_companies?.name}
                  </h2>
                  <div className="pitch-meta">
                    <span className="ai-badge">
                      <Zap size={14} />
                      {generatedPitch.ai_model === 'gpt-4' ? 'GPT-4 Generated' : 'AI Optimized'}
                    </span>
                    <span className="confidence-badge">
                      <BarChart3 size={14} />
                      {generatedPitch.confidence_score}% confidence
                    </span>
                  </div>
                </div>
                <div className="pitch-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => generatePitch(selectedLead)}
                  >
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="pitch-tabs">
                <button 
                  className={activeTab === 'pitch' ? 'active' : ''}
                  onClick={() => setActiveTab('pitch')}
                >
                  <MessageSquare size={16} />
                  Pitch
                </button>
                <button 
                  className={activeTab === 'talking-points' ? 'active' : ''}
                  onClick={() => setActiveTab('talking-points')}
                >
                  <ThumbsUp size={16} />
                  Talking Points
                </button>
                <button 
                  className={activeTab === 'objections' ? 'active' : ''}
                  onClick={() => setActiveTab('objections')}
                >
                  <Shield size={16} />
                  Objections
                </button>
                <button 
                  className={activeTab === 'timing' ? 'active' : ''}
                  onClick={() => setActiveTab('timing')}
                >
                  <Clock size={16} />
                  Timing
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'pitch' && (
                  <div className="pitch-section">
                    {generatedPitch.email_subject && (
                      <div className="content-block">
                        <div className="block-header">
                          <h4><Mail size={16} /> Email Subject</h4>
                          <button 
                            className="btn-icon"
                            onClick={() => copyToClipboard(generatedPitch.email_subject, 'subject')}
                          >
                            {copiedSection === 'subject' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <div className="subject-line">
                          {generatedPitch.email_subject}
                        </div>
                      </div>
                    )}

                    <div className="content-block pitch-text">
                      <div className="block-header">
                        <h4><MessageSquare size={16} /> Opening Pitch</h4>
                        <button 
                          className="btn-icon"
                          onClick={() => copyToClipboard(generatedPitch.pitch_text, 'pitch')}
                        >
                          {copiedSection === 'pitch' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="pitch-body">
                        {generatedPitch.pitch_text?.split('\n\n').map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'talking-points' && (
                  <div className="pitch-section">
                    <div className="content-block">
                      <div className="block-header">
                        <h4><ThumbsUp size={16} /> Mention These</h4>
                      </div>
                      <ul className="points-list positive">
                        {generatedPitch.talking_points?.map((point, i) => (
                          <li key={i}>
                            <CheckCircle2 size={16} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {generatedPitch.points_to_avoid && (
                      <div className="content-block">
                        <div className="block-header">
                          <h4><AlertTriangle size={16} /> Avoid These</h4>
                        </div>
                        <ul className="points-list negative">
                          {generatedPitch.points_to_avoid?.map((point, i) => (
                            <li key={i}>
                              <AlertTriangle size={16} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'objections' && (
                  <div className="pitch-section">
                    <h4 className="section-subtitle">Common Objections & Responses</h4>
                    {generatedPitch.objection_handlers && Object.entries(generatedPitch.objection_handlers).map(([objection, response], i) => (
                      <div key={i} className="objection-card">
                        <div className="objection-header">
                          <Shield size={16} />
                          <span>"{objection}"</span>
                        </div>
                        <div className="objection-response">
                          <p>{response}</p>
                        </div>
                        <button 
                          className="btn-copy-response"
                          onClick={() => copyToClipboard(response, `objection-${i}`)}
                        >
                          {copiedSection === `objection-${i}` ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          Copy Response
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'timing' && (
                  <div className="pitch-section">
                    <div className="timing-grid">
                      <div className="timing-card">
                        <div className="timing-icon call">
                          <Phone size={24} />
                        </div>
                        <h4>Best Time to Call</h4>
                        <p className="timing-value">
                          {generatedPitch.recommended_time || 'Tomorrow 11:00 AM'}
                        </p>
                        <small>After their morning standup, before lunch</small>
                      </div>

                      <div className="timing-card">
                        <div className="timing-icon email">
                          <Mail size={24} />
                        </div>
                        <h4>Email Channel</h4>
                        <p className="timing-value">
                          {generatedPitch.recommended_channel === 'email' ? 'Recommended' : 'Secondary'}
                        </p>
                        <small>Send Tue-Thu, 8-10 AM their timezone</small>
                      </div>

                      <div className="timing-card">
                        <div className="timing-icon urgency">
                          <Clock size={24} />
                        </div>
                        <h4>Urgency Level</h4>
                        <p className="timing-value">
                          {selectedLead?.signal_category === 'hot' ? 'HIGH - Contact Today' : 'Medium - This Week'}
                        </p>
                        <small>Strike while the iron is hot</small>
                      </div>
                    </div>

                    <div className="content-block follow-up">
                      <h4><Clock size={16} /> Follow-Up Sequence</h4>
                      <div className="follow-up-steps">
                        <div className="step">
                          <span className="step-number">1</span>
                          <div>
                            <strong>Day 1:</strong> Initial outreach (call + email)
                          </div>
                        </div>
                        <div className="step">
                          <span className="step-number">2</span>
                          <div>
                            <strong>Day 3:</strong> LinkedIn connection + value-add message
                          </div>
                        </div>
                        <div className="step">
                          <span className="step-number">3</span>
                          <div>
                            <strong>Day 7:</strong> Case study email
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pitch-footer">
                <button className="btn btn-primary btn-lg">
                  <Phone size={18} />
                  Log Call
                </button>
                <button className="btn btn-secondary btn-lg">
                  <Mail size={18} />
                  Send Email
                </button>
                <button className="btn btn-success btn-lg">
                  <CheckCircle2 size={18} />
                  Mark as Won
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISalesCloser;
