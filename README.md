# Singularity Monorepo

A modern monorepo containing a desktop Electron application, landing page, and web SaaS platform built with TypeScript, React, and Next.js.

## 🏗️ Project Structure

This monorepo contains three main applications:

```
apps/
├── desktop/     # Electron desktop application
├── landing/     # Marketing landing page (Next.js)
└── web/         # Main SaaS web application (Next.js)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Bun** >= 1.2.14 (recommended package manager)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd singularity-desktop
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Copy the example environment files and configure them:
   ```bash
   # For web app
   cp apps/web/.env.example apps/web/.env.local
   
   # For landing page
   cp apps/landing/.env.example apps/landing/.env.local
   ```

   Configure the following environment variables:
   - `CLERK_SECRET_KEY`
   - `MONGODB_URI`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`

## 🛠️ Development

### Run All Applications

Start all applications in development mode:

```bash
bun run dev
```

This will start:
- **Desktop app**: Electron application with hot reload
- **Landing page**: Next.js dev server on `http://localhost:3000`
- **Web app**: Next.js dev server on `http://localhost:3001`

### Run Individual Applications

#### Desktop Application (Electron)

```bash
cd apps/desktop
bun run dev
```

**Available scripts:**
- `bun run dev` - Start development with file watching
- `bun run dev:nowatch` - Start development without file watching
- `bun run build` - Build the application
- `bun run build:win` - Build for Windows
- `bun run build:mac` - Build for macOS
- `bun run build:linux` - Build for Linux

#### Landing Page

```bash
cd apps/landing
bun run dev
```

**Available scripts:**
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run preview` - Preview with OpenNext Cloudflare
- `bun run deploy` - Deploy to Cloudflare

#### Web Application

```bash
cd apps/web
bun run dev
```

**Available scripts:**
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run test` - Run tests
- `bun run test:e2e` - Run end-to-end tests
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open database studio

## 🏗️ Building

### Build All Applications

```bash
bun run build
```

### Build Individual Applications

```bash
# Desktop app
cd apps/desktop && bun run build

# Landing page
cd apps/landing && bun run build

# Web app
cd apps/web && bun run build
```

## 🧪 Testing

### Run All Tests

```bash
bun run test
```

### Web Application Tests

```bash
cd apps/web
bun run test          # Unit tests
bun run test:e2e      # End-to-end tests
```

## 📝 Code Quality

### Linting

```bash
bun run lint         # Lint all applications
bun run lint:fix     # Fix linting issues
```

### Type Checking

```bash
bun run check-types  # Check TypeScript types
```

### Formatting

```bash
bun run format       # Format code with Prettier
```

## 📦 Technology Stack

### Desktop Application
- **Electron** - Cross-platform desktop app framework
- **Electron Vite** - Build tooling
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components

### Landing Page
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lottie** - Interactive animations
- **OpenNext Cloudflare** - Deployment platform

### Web Application
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Clerk** - Authentication
- **Drizzle ORM** - Database ORM
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework
- **Playwright** - E2E testing
- **Storybook** - Component documentation

## 🚀 Deployment

### Landing Page (Cloudflare)

```bash
cd apps/landing
bun run deploy
```

### Desktop Application

Build platform-specific distributables:

```bash
cd apps/desktop
bun run build:win    # Windows
bun run build:mac    # macOS
bun run build:linux # Linux
```

### Web Application

Build and deploy to your preferred hosting platform:

```bash
cd apps/web
bun run build
```

## 🔧 Development Tools

- **Turbo** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Git hooks
- **Commitizen** - Conventional commits

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
