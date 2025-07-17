# Ultimate Focus App 🎯

A comprehensive Pomodoro timer and productivity app built with Next.js, TypeScript, and Supabase. Features user authentication, cloud data sync, and advanced productivity tracking.

## ✨ Features

### 🔐 Authentication & Data Sync
- **User Authentication** with email/password
- **Cloud Data Sync** across all devices
- **Secure Data Storage** with Supabase
- **Password Reset** functionality
- **Automatic Session Management**

### ⏰ Advanced Timer
- **Pomodoro Technique** with customizable durations
- **Break Management** (short & long breaks)
- **Auto-start Options** for sessions and breaks
- **Sound Notifications** with toggle
- **Pause/Resume/Stop** controls
- **Keyboard Shortcuts** support

### 📊 Analytics & Tracking
- **Session History** with detailed statistics
- **Daily Goal Tracking** with progress indicators
- **Streak Monitoring** for consistency
- **Category-based Analytics** for different work types
- **Focus Time Calculations** and insights

### 📝 Task Management
- **Task Queue** with priority levels
- **Category Organization** (Work, Personal, Learning, etc.)
- **Quick Task Input** with keyboard shortcuts
- **Task-to-Session** integration
- **Priority-based Sorting**

### 🎨 User Experience
- **Dark/Light Mode** with system preference detection
- **Responsive Design** for all screen sizes
- **Beautiful Animations** and transitions
- **Accessibility Features** built-in
- **Export/Import** functionality for data backup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Supabase account and project

### 1. Clone and Install
```bash
git clone https://github.com/your-username/ultimate-focus-app.git
cd ultimate-focus-app
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Set Up Database
1. Create a new Supabase project
2. Run the migration files in order:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_add_projects.sql`
3. See `database/README.md` for detailed instructions

### 4. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start focusing! 🎯

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run build:analyze` - Analyze bundle size
- `npm run validate` - Run all checks (type, lint, test)

### Code Quality

This project follows strict coding standards:

- **TypeScript** with strict mode enabled
- **ESLint** with Next.js and TypeScript rules
- **Jest** for testing with React Testing Library
- **Accessibility** features built-in
- **Error Boundaries** for graceful error handling
- **Performance** optimizations and monitoring

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Supabase (PostgreSQL with auth, real-time)
- **Styling**: Tailwind CSS 4.x
- **Testing**: Jest, React Testing Library
- **Icons**: Lucide React

### Key Principles
- **SOLID** principles implementation
- **Clean Code** architecture
- **Separation of Concerns**
- **Type Safety** throughout
- **Error Handling** at all levels
- **Performance** optimizations
- **Accessibility** compliance

### Project Structure
```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── __tests__/      # Component tests
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core utilities
│   │   ├── database.ts     # Database operations
│   │   ├── errors.ts       # Error handling
│   │   ├── env.ts          # Environment validation
│   │   └── supabase.ts     # Supabase client
│   ├── types/              # TypeScript types
│   └── utils/              # Helper functions
├── database/
│   ├── migrations/         # Database migrations
│   └── README.md          # Database documentation
└── public/                 # Static assets
```

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Test Coverage
- ✅ **Component Tests** - All UI components
- ✅ **Hook Tests** - Custom React hooks
- ✅ **Integration Tests** - User workflows
- ✅ **Utility Tests** - Helper functions

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on every push

### Build Command
```bash
npm run build
```

### Environment Variables
Set these in your deployment platform:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📱 Performance

- **Bundle Size**: Optimized with dynamic imports
- **Image Optimization**: Next.js built-in optimization
- **Caching**: Efficient caching strategies
- **Performance Monitoring**: Built-in performance tracking
- **Accessibility**: WCAG 2.1 AA compliant

## 🔐 Security

- **Row-Level Security** (RLS) enabled
- **User data isolation** - Users can only access their own data
- **Secure authentication** with Supabase Auth
- **HTTPS encryption** for all data transmission
- **Security headers** implemented
- **Input validation** and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run `npm run validate` to ensure code quality
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Pomodoro Technique** by Francesco Cirillo
- **Supabase** for the excellent backend-as-a-service
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon library

---

**Start your productivity journey today!** 🚀✨