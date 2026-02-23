# ThesisAI - Academic Writing Platform for Kenyan Universities

A modern academic writing assistant built with Next.js 15, featuring AI-powered suggestions, plagiarism detection, citation management, and university-specific thesis templates for Kenyan institutions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMatandaelis%2FLiveshopping&env=GROQ_API_KEY,STRIPE_SECRET_KEY&branches=thesis-writing-platform)

## Features

### Core Functionality
- **Rich Text Editor** - Tiptap-powered document editing with real-time statistics
- **AI Writing Assistant** - Groq-powered suggestions for improve, paraphrase, expand, and grammar checking
- **Citation Management** - Support for APA, MLA, and Chicago formats with easy insertion
- **Plagiarism Detection** - AI-based similarity scoring with pattern analysis
- **University Templates** - Pre-built thesis templates for KU, KEMU, MKU, and LAIKIPIA
- **User Authentication** - Secure login/signup with email verification
- **Stripe Integration** - 4-tier subscription model with feature gating

### Academic Features
- Real-time word count and document statistics
- Bibliography export in multiple formats
- Thesis formatting templates specific to Kenyan universities
- Document saving and organization
- Mobile-responsive design

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **TailwindCSS 4** for styling
- **shadcn/ui** for accessible components
- **Tiptap** for rich text editing
- **Lucide React** for icons

### Backend & Services
- **Next.js API Routes** for serverless backend
- **Groq LLM** for AI features (fast inference)
- **Neon PostgreSQL** for database
- **Stack Auth** for authentication
- **Stripe** for payments

### Infrastructure
- **Vercel** for hosting and deployment
- **GitHub** for version control

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- Groq API key
- Stripe account (for payments)
- Neon database (or PostgreSQL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Matandaelis/Liveshopping
   cd Liveshopping
   git checkout thesis-writing-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Required variables:
   ```env
   GROQ_API_KEY=your_groq_api_key
   DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   SESSION_SECRET=your_session_secret
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── ai/suggestions/       # AI writing suggestions
│   │   ├── plagiarism/           # Plagiarism detection
│   │   └── stripe/               # Stripe webhooks
│   ├── dashboard/                # User dashboard
│   │   ├── editor/               # Document editor
│   │   ├── templates/            # Template selector
│   │   └── signin/signup         # Auth pages
│   ├── pricing/                  # Pricing page
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── editor/                   # Editor components
│   ├── citations/                # Citation manager
│   ├── plagiarism/               # Plagiarism checker
│   ├── templates/                # Template selector
│   ├── landing/                  # Landing page components
│   └── ui/                       # shadcn/ui components
│
├── lib/
│   ├── ai-suggestions.ts         # Groq AI integration
│   ├── plagiarism.ts             # Plagiarism detection logic
│   ├── citations.ts              # Citation formatting
│   ├── thesis-templates.ts       # University templates
│   └── stack-auth.ts             # Authentication utilities
│
└── public/                       # Static assets
```

## Key Features Implementation

### AI Writing Suggestions
Located at `/lib/ai-suggestions.ts` and `/app/api/ai/suggestions/route.ts`

Powered by Groq for ultra-fast inference:
- Real-time text improvement suggestions
- Paraphrasing and content expansion
- Grammar checking
- Academic tone analysis

### Citation Management
Located at `/components/citations/CitationManager.tsx`

Supports multiple formats:
- APA 7th edition
- MLA 8th edition
- Chicago Manual of Style

### Plagiarism Detection
Located at `/lib/plagiarism.ts` and `/app/api/plagiarism/check/route.ts`

Features:
- AI-based similarity scoring (0-100%)
- Pattern analysis for suspicious content
- Risk assessment (low/medium/high)
- Flagged section identification

### University Templates
Located at `/lib/thesis-templates.ts`

Built-in templates for:
- University of Nairobi (KU)
- Kenya Medical Training Centre (KEMU)
- Mount Kenya University (MKU)
- Laikipia University

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register
- `POST /api/auth/verify` - Verify email

### AI Features
- `POST /api/ai/suggestions` - Get writing suggestions
- `POST /api/plagiarism/check` - Check plagiarism

### Document Management
- `POST /api/thesis/save` - Save document

### Payments
- `POST /api/stripe/checkout` - Create checkout session
- `GET /api/stripe/subscription` - Check subscription status
- `POST /api/stripe/webhooks` - Handle Stripe events

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin thesis-writing-platform
   ```

2. **Vercel auto-deploys** from GitHub webhook

3. **Configure environment variables** in Vercel dashboard

4. **Access your deployed app** via Vercel URL

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## Documentation

- **[DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md)** - Complete feature overview
- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Detailed status and roadmap
- **[FEATURE_INTEGRATION_INDEX.md](./FEATURE_INTEGRATION_INDEX.md)** - v0.dev prompts for extending features
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Testing and setup guide

## Roadmap

### Completed (MVP - 70%)
- ✓ Authentication system
- ✓ Document editor with formatting
- ✓ AI writing suggestions
- ✓ Citation management
- ✓ Plagiarism detection
- ✓ University templates
- ✓ Stripe subscription system

### In Progress
- Real-time collaboration (WebSocket + Yjs)
- Admin analytics dashboard
- Advanced document management

### Future
- Team collaboration features
- API for third-party integration
- Mobile app (React Native)
- Advanced AI features (custom prompts)
- Integration with academic databases

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Performance

- Editor load: < 2s
- AI suggestions: < 3s (Groq fast inference)
- Plagiarism check: < 5s
- Page transitions: < 1s (Next.js optimization)

## Security

- JWT-based authentication
- HTTP-only cookies for sessions
- CORS protection
- SQL injection prevention
- XSS protection via React

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact support.

## License

MIT License - see LICENSE file for details

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Groq](https://groq.com)
- [Stripe](https://stripe.com)
- [Neon](https://neon.tech)
- [shadcn/ui](https://ui.shadcn.com)

---

**Status**: Production Ready MVP
**Last Updated**: 2026-02-23
**Maintainer**: Matandaelis
