# AI SDR - React Frontend

A modern React frontend for the AI SDR lead generation platform.

## Features

- **Authentication**: Login/Signup with JWT
- **Dashboard**: View and filter leads with statistics
- **Lead Management**: Detailed lead view with editing
- **Profile Settings**: Manage keywords and sources
- **Billing**: Subscription management with Stripe integration
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- CSS Modules

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:4000/api
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.jsx
│   ├── LeadCard.jsx
│   ├── FiltersSidebar.jsx
│   └── ProtectedRoute.jsx
├── context/         # React context
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── LeadDetail.jsx
│   ├── Profile.jsx
│   └── Billing.jsx
├── services/        # API services
│   └── api.js
└── App.jsx          # Main app component
```

## Pages

- `/login` - Login form
- `/signup` - Signup form
- `/dashboard` - Leads list with filters
- `/leads/:id` - Lead detail view
- `/profile` - User settings
- `/billing` - Subscription management

## License

MIT
