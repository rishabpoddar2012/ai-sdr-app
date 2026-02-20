// Mock data for demo mode
export const MOCK_LEADS = [
  {
    id: '1',
    company_name: 'Acme Corporation',
    contact_name: 'John Smith',
    email: 'john@acme.com',
    phone: '+1-555-0123',
    source: 'IndiaMART',
    score: 'hot',
    ai_score: 94,
    status: 'new',
    message: 'Looking for comprehensive business insurance coverage for our manufacturing unit. Budget approved - $50k annually. Need quotes ASAP.',
    industry: 'Manufacturing',
    location: 'Mumbai, India',
    employees: '200-500',
    created_at: '2026-02-20T08:30:00Z',
    signals: ['High budget', 'Urgent timeline', 'Decision maker']
  },
  {
    id: '2',
    company_name: 'TechStart Inc',
    contact_name: 'Sarah Chen',
    email: 'sarah@techstart.io',
    phone: '+1-555-0456',
    source: 'Hacker News',
    score: 'warm',
    ai_score: 76,
    status: 'contacted',
    message: 'Series A startup looking for digital marketing agency to help with SaaS launch. Interested in SEO and paid acquisition.',
    industry: 'SaaS',
    location: 'Bangalore, India',
    employees: '20-50',
    created_at: '2026-02-20T05:15:00Z',
    signals: ['Growth mode', 'Recent funding', 'Hiring']
  },
  {
    id: '3',
    company_name: 'Green Manufacturing Ltd',
    contact_name: 'Raj Patel',
    email: 'raj@greenmfg.com',
    phone: '+91-98765-43210',
    source: 'TradeIndia',
    score: 'hot',
    ai_score: 91,
    status: 'qualified',
    message: 'Need industrial safety equipment and PPE for factory expansion. Immediate procurement required. Budget: ₹25L.',
    industry: 'Manufacturing',
    location: 'Pune, India',
    employees: '500-1000',
    created_at: '2026-02-19T14:20:00Z',
    signals: ['Expansion', 'Immediate need', 'Large budget']
  },
  {
    id: '4',
    company_name: 'CloudNine Solutions',
    contact_name: 'Priya Sharma',
    email: 'priya@cloudnine.tech',
    source: 'LinkedIn',
    score: 'warm',
    ai_score: 72,
    status: 'new',
    message: 'Looking for recruitment agency to help scale our engineering team. Need 15 developers in next 3 months.',
    industry: 'Technology',
    location: 'Hyderabad, India',
    employees: '100-200',
    created_at: '2026-02-19T11:45:00Z',
    signals: ['Hiring aggressively', 'Team expansion']
  },
  {
    id: '5',
    company_name: 'Metro Logistics',
    contact_name: 'Amit Kumar',
    email: 'amit@metrolog.com',
    source: 'JustDial',
    score: 'cold',
    ai_score: 58,
    status: 'new',
    message: 'Exploring options for fleet insurance. 50+ vehicles. Just started research phase.',
    industry: 'Logistics',
    location: 'Delhi, India',
    employees: '100-200',
    created_at: '2026-02-19T09:30:00Z',
    signals: ['Early research', 'Multiple vehicles']
  },
  {
    id: '6',
    company_name: 'FinEdge Capital',
    contact_name: 'Vikram Mehta',
    email: 'vikram@finedge.com',
    source: 'Reddit',
    score: 'hot',
    ai_score: 88,
    status: 'new',
    message: 'Need CA services for tax filing and compliance. Urgent - deadline approaching. Budget flexible.',
    industry: 'Finance',
    location: 'Mumbai, India',
    employees: '50-100',
    created_at: '2026-02-18T16:00:00Z',
    signals: ['Urgent', 'Flexible budget', 'Compliance need']
  }
];

export const MOCK_STATS = {
  overview: {
    total: 1247,
    hot: 48,
    warm: 156,
    cold: 1043,
    thisWeek: 89
  },
  by_source: {
    'IndiaMART': 523,
    'Hacker News': 187,
    'LinkedIn': 312,
    'Reddit': 145,
    'TradeIndia': 80
  },
  conversion: {
    new: 892,
    contacted: 234,
    qualified: 89,
    converted: 32
  }
};

export const MOCK_SIGNALS = [
  {
    id: 's1',
    company_name: 'Acme Corporation',
    signal_category: 'hot',
    signal_type: 'Buying Intent',
    description: 'Posted requirement for business insurance on IndiaMART',
    confidence: 94,
    source: 'IndiaMART',
    url: 'https://www.indiamart.com/proddetail/...',
    detected_at: '2026-02-20T08:30:00Z',
    keywords_matched: ['insurance', 'budget approved', 'ASAP'],
    company_size: '200-500',
    location: 'Mumbai'
  },
  {
    id: 's2',
    company_name: 'TechStart Inc',
    signal_category: 'warm',
    signal_type: 'Hiring Signal',
    description: 'Posted "Who is hiring" on Hacker News - Series A funded',
    confidence: 76,
    source: 'Hacker News',
    url: 'https://news.ycombinator.com/item?id=...',
    detected_at: '2026-02-20T05:15:00Z',
    keywords_matched: ['hiring', 'series A', 'growth'],
    company_size: '20-50',
    location: 'Bangalore'
  },
  {
    id: 's3',
    company_name: 'Green Manufacturing',
    signal_category: 'hot',
    signal_type: 'Expansion',
    description: 'Posted bulk procurement for safety equipment',
    confidence: 91,
    source: 'TradeIndia',
    url: 'https://www.tradeindia.com/...',
    detected_at: '2026-02-19T14:20:00Z',
    keywords_matched: ['bulk order', 'immediate', 'procurement'],
    company_size: '500-1000',
    location: 'Pune'
  }
];

export const MOCK_PITCHES = [
  {
    id: 'p1',
    lead_id: '1',
    company: 'Acme Corporation',
    subject: 'Custom Insurance Solution for Acme Corp - $50K Budget Optimized',
    email_body: `Hi John,

I noticed Acme Corporation is looking for comprehensive business insurance coverage. With 200-500 employees in manufacturing, you need specialized coverage that typical policies miss.

**Why we fit:**
✓ Manufacturing-specific liability coverage
✓ Equipment protection for your scale
✓ Workers comp optimized for industrial operations
✓ Within your $50K budget

**Next step:** 15-min call this week to review your specific risks?

Best,
AI SDR Team`,
    linkedin_dm: `Hi John, saw Acme Corp is expanding manufacturing operations. We specialize in industrial business insurance and have helped similar companies save 20-30% while improving coverage. Worth a quick chat?`,
    call_script: `Opening: "Hi John, this is [Name] from AI SDR. I saw your IndiaMART post about needing business insurance..."

Key points:
1. Acknowledge $50K budget - we're competitive
2. Manufacturing expertise - not generic coverage
3. Mumbai presence - local support
4. Close: Schedule site assessment`,
    created_at: '2026-02-20T09:00:00Z'
  }
];
