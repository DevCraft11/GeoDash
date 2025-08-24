# Geometry Rush 2D Platformer

## Overview
A 2D platformer game called "Geometry Rush" built with a modern full-stack architecture. The project combines React Three Fiber for 3D graphics capabilities with traditional 2D canvas-based game mechanics. The application features a complete Express.js backend with PostgreSQL database support via Drizzle ORM, though the main focus is on the frontend game implementation.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for game assets
- **Styling**: Tailwind CSS with custom design system
- **3D Graphics**: React Three Fiber ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing)
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: Zustand for game state and audio management
- **Game Engine**: Custom 2D canvas-based game engine with modular components

### Game Architecture
The game follows a modular component-based architecture:
- **Player System**: Physics-based player with gravity, jumping, and collision detection
- **Obstacle Management**: Procedural obstacle generation with increasing difficulty
- **Collision Detection**: AABB collision system with tolerance for forgiving gameplay
- **Particle System**: Visual effects for enhanced gameplay experience
- **Audio Management**: Centralized audio system with mute/unmute functionality
- **Game State**: Phase-based game states (ready, playing, ended)

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: User management system with username/password authentication
- **Storage**: Dual storage implementation (memory-based for development, database for production)
- **Build System**: ESBuild for server bundling
- **Development**: Hot reload with Vite integration

### Data Storage
- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle with schema-first approach
- **Migrations**: Automated migration system with drizzle-kit
- **Local Storage**: Browser localStorage for game scores and preferences

### Authentication & Authorization
- **User Model**: Simple username/password system
- **Schema Validation**: Zod-based validation with Drizzle integration
- **Session Management**: Express session handling (connect-pg-simple for PostgreSQL sessions)

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations

### UI & Styling
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Fontsource**: Inter font family integration
- **Lucide React**: Icon library

### Game Development
- **React Three Fiber**: React renderer for Three.js
- **Three.js Ecosystem**: 3D graphics and post-processing effects
- **Canvas API**: 2D game rendering for platformer mechanics

### Audio
- **Web Audio API**: Browser-native audio playback
- **HTML5 Audio**: Sound effect management

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript bundler for production
- **GLSL**: Shader support for advanced graphics

### Query & State Management
- **TanStack Query**: Server state management and caching
- **Zustand**: Lightweight state management for game state

### Deployment
- **Vercel**: Static site hosting with custom routing configuration
- **Node.js**: Production server runtime