# Safari Svannah - Interactive Learning Platform

An engaging educational platform for toddlers (2-4 years) to learn about African wildlife and life lessons through interactive stories, puzzles, and games.

## Features

- 🦁 Interactive Animal Selection
- 📚 Engaging Story Generation
- 🎮 Age-appropriate Puzzles
- 📊 Progress Tracking
- 🌍 Multi-language Support (English, Swahili, French)
- 👨‍👩‍👧‍👦 Parent Dashboard

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, CrewAI, SQLAlchemy
- Authentication: Clerk
- Analytics: Mixpanel
- Database: PostgreSQL

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Development

- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.