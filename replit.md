# News Content Management System

## Overview

This is a full-stack news content management system built with React, Express, and PostgreSQL. The application provides a comprehensive admin panel for managing news articles, categories, users, comments, and media. It features a modern UI using Shadcn/UI components and TailwindCSS for styling.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Shadcn/UI with Radix UI primitives
- **Styling**: TailwindCSS with CSS custom properties for theming
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful API endpoints
- **Middleware**: Express middleware for request logging and error handling

### Project Structure
```
├── client/           # React frontend application
├── server/           # Express backend application
├── shared/           # Shared TypeScript types and schemas
├── migrations/       # Database migration files
└── dist/            # Production build output
```

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: User management with roles (admin, editor, writer)
- **Categories**: Hierarchical category structure with parent-child relationships
- **News**: News articles with status management, SEO fields, and scheduling
- **Comments**: User comments on news articles with moderation
- **Media**: File upload and media management system

### Frontend Pages
- **Dashboard**: Overview with statistics and recent activity
- **News Management**: CRUD operations for news articles
- **Categories**: Hierarchical category management
- **Users**: User management with role-based permissions
- **Comments**: Comment moderation system
- **Media Library**: File upload and management
- **SEO Tools**: SEO optimization features
- **Analytics**: Content performance analytics
- **Settings**: System configuration

### API Endpoints
- `/api/stats` - System statistics
- `/api/users` - User management
- `/api/categories` - Category management
- `/api/news` - News article management
- `/api/comments` - Comment management
- `/api/media` - Media file management

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and interact with the database
3. **Database Operations**: Drizzle ORM manages PostgreSQL operations
4. **Response**: Data flows back through the same chain with proper error handling

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, TanStack Query)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL dialect
- Vite for build tooling

### UI and Styling
- Radix UI primitives for accessible components
- TailwindCSS for utility-first styling
- Lucide React for icons
- React Hook Form with Zod validation

### Database and Storage
- @neondatabase/serverless for database connectivity
- Drizzle Kit for database management
- PostgreSQL as the primary database

### Development Tools
- TypeScript for type safety
- ESBuild for server bundling
- Wouter for lightweight routing

## Deployment Strategy

### Development Environment
- Uses Vite dev server for hot module replacement
- Express server runs with tsx for TypeScript execution
- PostgreSQL database via Neon serverless connection

### Production Build
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using ESBuild
3. Static assets served by Express in production
4. Environment variables manage database connections

### Replit Configuration
- Node.js 20 runtime environment
- PostgreSQL 16 module for database
- Auto-scaling deployment target
- Development workflow with hot reload

## Recent Changes

✓ **Video News Support** (June 25, 2025)
- Added video URL and thumbnail fields to news schema
- Enhanced news modal with video content sections
- Support for YouTube and other video platform integration

✓ **Editor Assignment System** (June 25, 2025)
- Added editor selection for news workflow
- Enhanced news with editor approval process
- Separate author and editor roles in content management

✓ **City-Based Categorization** (June 25, 2025)
- Added complete cities database with all 81 Turkish provinces
- City selection in news creation with full provincial coverage
- Location-based news organization nationwide
- Includes proper Turkish character handling and slug generation

✓ **Article Management for Writers** (June 25, 2025)
- Created separate articles system for writer content
- Full CRUD operations for articles
- Added articles page in navigation menu
- Writer-focused content creation workflow

✓ **Enhanced News Modal** (June 25, 2025)
- Added source attribution field
- Video content support
- City and editor selection
- Improved form organization with multiple sections

✓ **Professional Advertisement Module** (June 25, 2025)
- Complete advertisement management system
- Multiple ad positions (header, sidebar, footer, content)
- Various ad sizes (banner, rectangle, square, skyscraper)
- Performance metrics (CTR, impressions, clicks)
- Active/inactive status and priority ordering
- Start/end date scheduling

✓ **Classified Ads System** (June 25, 2025)
- Comprehensive category system (vehicles, real-estate, electronics, etc.)
- Advanced filtering and search capabilities
- Premium and urgent ad options
- Approval workflow (pending/approved/rejected)
- Image gallery support
- Contact information management
- Price and location fields
- View count tracking

✓ **Digital Magazine Module** (June 25, 2025)
- Professional magazine management system
- Cover image and PDF file upload support
- Issue numbering and volume tracking
- Category system (Technology, Culture, Art, etc.)
- Publishing and featured article options
- File upload system (covers and PDFs up to 10MB)
- Mobile responsive design
- Filtering and search capabilities
- Card and list view modes
- Download count tracking

✓ **Magazine Category Management System** (June 25, 2025)
- Dedicated magazine category management interface
- Visual category cards with custom colors and icons
- Hierarchical category structure support
- Category slug generation and management
- Active/inactive status control
- Sort order management
- Integration with digital magazine filtering
- CRUD operations with validation
- Full responsive design optimized for mobile devices
- Touch-friendly interface with proper button sizing
- Mobile-first layout with collapsible elements

✓ **Professional Category Management System** (June 25, 2025)
- Advanced statistics dashboard with real-time metrics
- Professional card and table view modes with smooth transitions
- Comprehensive filtering and sorting capabilities
- Enhanced form design with sectioned layout and validation
- Professional modal interface with improved UX
- Visual hierarchy with icons and color-coded elements
- Mobile-optimized responsive design throughout
- Dropdown menus for space-efficient actions
- Advanced slug generation with URL preview
- Professional loading states and error handling
- Status management (Active/Inactive) with visual indicators
- Manual sort ordering for custom category arrangement
- Advanced filtering by status and sort order
- Enhanced card and table views displaying status and order information

✓ **News Sources Management System** (June 25, 2025)
- Comprehensive news source categorization module
- Source types: Newspaper, TV, Radio, Agency, Online, Magazine, Social Media
- Complete CRUD operations for source management
- Integration with news creation workflow
- Contact information and website management
- Active/inactive status control
- Turkish media sources pre-populated (AA, TRT, Hürriyet, etc.)
- Professional source management interface

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Implemented video news, city categories, editor assignment, and article system
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Interface language: Turkish
Mobile responsiveness: High priority - all components must work properly on mobile devices
```