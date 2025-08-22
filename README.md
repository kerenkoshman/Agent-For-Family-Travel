# Family Trip Agent 🏖️

A SmolAgent that helps users plan family trips by suggesting destinations, creating itineraries, and organizing accommodations and activities.

## 🎯 Features

- **Smart Trip Planning**: AI-powered destination and activity suggestions
- **Family-Focused**: Tailored recommendations for all family members
- **Comprehensive Itineraries**: Daily schedules with timing and locations
- **Booking Integration**: Flights and accommodation search
- **Export & Sharing**: PDF itineraries and shareable links
- **Real-time Updates**: Live trip modifications and notifications

## 🏗️ Architecture

### Agent System
- **Planner Agent**: Suggests destinations & activities based on user input
- **Booking Agent**: Finds accommodations and flights
- **Scheduler Agent**: Builds daily itinerary with timing and location
- **UI Agent**: Prepares dashboard-ready output

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Google OAuth
- **APIs**: TripAdvisor, Google Places, Skyscanner, Booking.com
- **Testing**: Jest + Playwright
- **Deployment**: Vercel + GitHub

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Family-Trip-Agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

4. **Set up database**
   ```bash
   cd backend
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:frontend
   npm run dev:backend
   ```

## 📁 Project Structure

```
Family-Trip-Agent/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── store/          # State management (Zustand)
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models (Drizzle)
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic and agents
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
└── docs/                   # Documentation
```

## 🤖 Agent Workflow

1. **User Authentication**: Google OAuth login
2. **Family Profile Setup**: Collect family preferences and constraints
3. **Destination Planning**: Planner Agent suggests destinations
4. **Booking Search**: Booking Agent finds flights and accommodations
5. **Itinerary Creation**: Scheduler Agent builds daily schedules
6. **Dashboard Display**: UI Agent prepares user-friendly output
7. **Export & Share**: Generate PDFs and shareable links

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# Run E2E tests
npm run test:e2e
```

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both frontend and backend
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run format` - Format all code with Prettier

### Backend
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run test:backend` - Run backend tests
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate new migration files

### Frontend
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests
- `npm run preview` - Preview production build

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/family_trip_agent

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret

# External APIs
TRIPADVISOR_API_KEY=your_tripadvisor_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
SKYSCANNER_API_KEY=your_skyscanner_api_key
BOOKING_API_KEY=your_booking_api_key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## 🚀 Deployment

### Backend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Frontend (Vercel)
1. Build the frontend: `npm run build:frontend`
2. Deploy the `dist` folder to Vercel
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an issue for bugs or feature requests
- Check the [documentation](docs/) for detailed guides
- Join our community discussions

---

**Built with ❤️ for families who love to travel**
