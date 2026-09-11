# RONIN Admin Panel - Project Structure

## Directory Tree

```
artexx/
├── app/
│   ├── admin/
│   │   ├── layout.tsx                          # Main admin layout (Sidebar + Header)
│   │   ├── components/
│   │   │   ├── common/                         # Reusable components
│   │   │   │   ├── Button.tsx                  # Button with variants
│   │   │   │   ├── Card.tsx                    # Card container
│   │   │   │   ├── StatCard.tsx                # Animated stat card
│   │   │   │   ├── Badge.tsx                   # Status badges
│   │   │   │   ├── Modal.tsx                   # Modal dialog
│   │   │   │   ├── LoadingState.tsx            # Skeletons & loaders
│   │   │   │   ├── EmptyState.tsx              # Empty state UI
│   │   │   │   ├── Toast.tsx                   # Notifications
│   │   │   │   └── index.ts                    # Exports
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │   │   │   ├── Header.tsx                  # Top header with search
│   │   │   │   └── index.ts                    # Exports
│   │   ├── (pages)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                    # Dashboard with stats & charts
│   │   │   ├── computers/
│   │   │   │   └── page.tsx                    # Computer management
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx                    # Booking list
│   │   │   ├── users/
│   │   │   │   └── page.tsx                    # User management
│   │   │   ├── tariffs/
│   │   │   │   └── page.tsx                    # Pricing plans
│   │   │   ├── payments/
│   │   │   │   └── page.tsx                    # Payment tracking
│   │   │   ├── promotions/
│   │   │   │   └── page.tsx                    # Promotions management
│   │   │   ├── equipment/
│   │   │   │   └── page.tsx                    # Equipment tracking
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx                    # Review management
│   │   │   ├── statistics/
│   │   │   │   └── page.tsx                    # Analytics & charts
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx                    # System notifications
│   │   │   ├── administrators/
│   │   │   │   └── page.tsx                    # Admin management
│   │   │   └── settings/
│   │   │       └── page.tsx                    # Club settings
│   ├── globals.css                            # Global styles & animations
│   ├── layout.tsx                             # Root layout
│   ├── page.tsx                               # Redirect to /admin
│   └── favicon.ico
├── lib/
│   ├── admin/
│   │   ├── types/
│   │   │   └── index.ts                       # TypeScript types
│   │   ├── mock-data/
│   │   │   └── index.ts                       # All mock data
│   │   └── utils/
│   │       └── index.ts                       # Utility functions
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   └── vercel.svg
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── RONIN_DB_Schema.md
├── RONIN_TZ.md
├── RESPONSIVE_DESIGN_GUIDE.md                # Responsive design docs
├── ADMIN_PANEL_GUIDE.md                      # Admin panel usage guide
└── PROJECT_STRUCTURE.md                      # This file
```

## File Descriptions

### Core Pages (`app/admin/(pages)/*/page.tsx`)

Each page is a server component with `'use client'` directive:

```tsx
'use client'
// Page implementation
```

| Page | Purpose | Features |
|------|---------|----------|
| dashboard | Main overview | Stats, charts, bookings |
| computers | PC management | Grid view, search, filter, CRUD |
| bookings | Booking tracking | Table view, status management |
| users | User directory | User list, activity, statistics |
| tariffs | Pricing plans | Tariff cards, zone-based pricing |
| payments | Transaction tracking | Payment history, status, methods |
| promotions | Marketing codes | Create, manage, expire promos |
| equipment | Hardware tracking | Equipment list, condition, warranty |
| reviews | Customer feedback | Reviews, ratings, publish/hide |
| statistics | Analytics dashboard | Charts, trends, KPIs |
| notifications | System alerts | Message list, status, actions |
| administrators | Admin team | Admins list, roles, activity |
| settings | Configuration | Club info, hours, preferences |

### Components Structure

#### Common Components (`app/admin/components/common/`)

Reusable UI building blocks:

- **Button.tsx**: Primary component for all buttons
  - Variants: primary, secondary, danger, ghost, outline
  - Sizes: sm, md, lg
  - States: loading, disabled
  - Framer Motion: scale on hover/tap

- **Card.tsx**: Container for content
  - Optional hover animation
  - Responsive padding
  - Dark theme styling

- **StatCard.tsx**: Data visualization cards
  - Animated number counters
  - Color variants with gradients
  - Change percentage display
  - Icon support

- **Badge.tsx**: Status indicators
  - 12 status variants (available, playing, reserved, etc.)
  - Animated pulse for active states
  - Size options

- **Modal.tsx**: Dialog overlay
  - Centered positioning
  - Backdrop click to close
  - Framer Motion animations

- **LoadingState.tsx**: Loading indicators
  - Spinner animation
  - Skeleton cards with shimmer
  - Grid of skeletons

- **EmptyState.tsx**: No data UI
  - Icon with float animation
  - Custom messages
  - Action button support

- **Toast.tsx**: Notifications
  - Types: success, error, warning, info
  - Auto-dismiss with timer
  - Toast container for multiple

#### Layout Components (`app/admin/components/layout/`)

- **Sidebar.tsx**: Navigation menu
  - 13 menu items
  - Active state highlighting
  - Mobile drawer with backdrop
  - Admin info display

- **Header.tsx**: Top navigation
  - Search box
  - Notifications dropdown
  - Profile dropdown
  - Sticky positioning

### Types (`lib/admin/types/index.ts`)

TypeScript interfaces for all data models:

```typescript
interface Computer { ... }
interface User { ... }
interface Booking { ... }
interface Payment { ... }
interface Tariff { ... }
interface Equipment { ... }
interface Review { ... }
interface Administrator { ... }
interface Notification { ... }
interface DashboardStats { ... }
```

### Mock Data (`lib/admin/mock-data/index.ts`)

Pre-generated data arrays:
- `mockComputers` (30 items)
- `mockUsers` (50 items)
- `mockBookings` (100+ items)
- `mockPayments` (50+ items)
- `mockTariffs` (10 items)
- `mockEquipment` (20+ items)
- `mockReviews` (15+ items)
- `mockAdministrators` (5 items)
- `mockNotifications` (20+ items)
- `mockDashboardStats` (1 object)
- `mockRevenueData` (7 days)
- `mockOccupancyData` (7 days)
- `mockTariffsData` (pie chart data)

### Global Styles (`app/globals.css`)

CSS variables and animations:
- Color scheme definitions
- Tailwind overrides
- Custom keyframe animations:
  - `fadeIn`, `slideIn*`, `pulse`, `glow`
  - `shimmer`, `float`, `breathe`, `gradientShift`
  - `countUp`
- Scrollbar styling
- Form input styling
- Selection styling

## Component Hierarchy

```
RootLayout
└── app/admin/layout.tsx (AdminLayout)
    ├── Sidebar
    │   ├── Logo
    │   ├── Navigation Items (13 links)
    │   ├── Admin Info
    │   └── Logout Button
    ├── Header
    │   ├── Search Box
    │   ├── Notifications Dropdown
    │   └── Profile Dropdown
    └── Main Content
        └── Pages (13 different pages)
            ├── StatCard (Dashboard)
            ├── Chart Components (Recharts)
            ├── Card Containers
            ├── Tables
            ├── Grids
            └── Various Specific Components
```

## Data Flow

```
Mock Data (lib/admin/mock-data)
    ↓
Page Component
    ↓
Common Components (Card, Button, Badge, etc.)
    ↓
Rendered UI with Framer Motion Animations
```

## Styling Approach

### Tailwind CSS Classes

- **Responsive**: `md:`, `lg:` prefixes
- **Colors**: `red-600`, `zinc-900`, `green-400`, etc.
- **Spacing**: `p-4`, `gap-6`, `mt-2`, etc.
- **Transitions**: `transition-all`, `duration-300`

### CSS-in-JS (Framer Motion)

- `whileHover={{ scale: 1.05 }}`
- `whileTap={{ scale: 0.95 }}`
- `animate={{ opacity: 1 }}`
- `transition={{ duration: 0.3 }}`

### Dark Theme

All components use dark color palette:
- Background: `bg-zinc-950` (#0f0f0f)
- Cards: `bg-zinc-900` (#1a1a1a)
- Text: `text-white` or `text-zinc-400`
- Accent: `red-600` (#dc2626)

## Performance Considerations

### Code Splitting
- Each page in `(pages)` folder is code-split
- Components lazy-loaded on route change

### Image Optimization
- User avatars as external URLs
- No local image imports (demo)

### Bundle Size
- Framer Motion: ~50KB (gzipped)
- Recharts: ~100KB (gzipped)
- Lucide React: ~15KB (gzipped)
- Total: ~165KB additional (acceptable for admin)

### Animations
- GPU-accelerated (transform, opacity)
- No layout thrashing
- Prefers-reduced-motion respected

## Development Tips

### Adding a New Page

1. Create file: `app/admin/(pages)/[name]/page.tsx`
2. Add to Sidebar menu items
3. Create components in `app/admin/components/[section]/`
4. Use common components (Button, Card, Badge)
5. Import mock data from `lib/admin/mock-data`

### Adding a Component

1. Create in `app/admin/components/common/` or appropriate section
2. Export in corresponding `index.ts`
3. Use Framer Motion for animations
4. Accept TypeScript interfaces
5. Handle responsive design

### Adding Mock Data

1. Edit `lib/admin/mock-data/index.ts`
2. Update types in `lib/admin/types/index.ts`
3. Import and use in page components

## Browser Compatibility

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile: ✅ iOS Safari 14+, Chrome Android 90+

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Building & Deployment

```bash
npm run build    # Production build
npm run start    # Start server
npm run dev      # Development server
npm run lint     # ESLint
```

Deploy to:
- Vercel (recommended for Next.js)
- AWS Amplify
- Netlify
- Self-hosted Node.js server

---

**Last Updated**: September 2024
**Version**: 1.0.0
