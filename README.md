# OptiBio - Premium Ashwagandha KSM-66 E-Commerce Store

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11-blue)](https://trpc.io/)

A modern, open-source e-commerce platform for premium supplement sales, built with transparency and quality at its core. OptiBio specializes in clinically-proven Ashwagandha KSM-66 supplements backed by 20+ peer-reviewed studies.

## 🌟 Features

### E-Commerce Core
- **Product Management** - Multiple variants (30/60/90 day supplies), subscription plans, and inventory tracking
- **Shopping Cart** - Real-time updates, discount code validation, and persistent cart storage
- **Checkout Flow** - Multi-step checkout with address validation and order summary
- **User Authentication** - Secure OAuth-based authentication with role-based access control
- **Order Management** - Complete order tracking, fulfillment status, and customer history

### Business Features
- **Subscription System** - Recurring billing with 15-25% savings, flexible management
- **Discount Codes** - Percentage and fixed-amount discounts with usage limits
- **Admin Dashboard** - Product management, order fulfillment, customer analytics
- **Email Notifications** - Order confirmations, shipping updates, and marketing campaigns

### Technical Excellence
- **Type-Safe API** - End-to-end type safety with tRPC
- **Modern Stack** - React 19, TypeScript, Tailwind CSS 4, Express
- **Database** - MySQL/TiDB with Drizzle ORM
- **Authentication** - Manus OAuth integration
- **Responsive Design** - Mobile-first, fully responsive UI
- **SEO Optimized** - Comprehensive meta tags, schema markup, sitemap

## 🚀 Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- Wouter for routing
- shadcn/ui component library
- tRPC React Query for data fetching

**Backend:**
- Node.js with Express 4
- tRPC 11 for type-safe APIs
- Drizzle ORM for database
- MySQL/TiDB database
- S3 for file storage

**Development:**
- Vite for fast development
- TypeScript for type safety
- ESLint for code quality
- pnpm for package management

## 📦 Installation

### Prerequisites
- Node.js 22+
- pnpm 9+
- MySQL or TiDB database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/optibiosupplements/optibio-ecommerce.git
cd optibio-ecommerce
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# Application
VITE_APP_TITLE=OptiBio - Premium Ashwagandha KSM-66
VITE_APP_LOGO=/optibio-logo.png
VITE_APP_ID=your-app-id

# Owner (for admin access)
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

4. **Initialize the database**
```bash
pnpm db:push
```

5. **Seed the database with sample products**
```bash
node seed-products.mjs
```

6. **Start the development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🗂️ Project Structure

```
optibio-ecommerce/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and tRPC client
│   │   └── _core/         # Core functionality (auth, hooks)
│   └── index.html         # HTML entry point
├── server/                # Backend Express application
│   ├── _core/             # Core server functionality
│   ├── db.ts              # Database query helpers
│   └── routers.ts         # tRPC API routes
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Database table definitions
├── shared/                # Shared types and constants
└── storage/               # S3 storage helpers
```

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

### Database Schema

The application uses the following main tables:

- `users` - User accounts and authentication
- `products` - Product catalog
- `productVariants` - Product size/price variations
- `subscriptionPlans` - Recurring billing plans
- `cartItems` - Shopping cart storage
- `orders` - Order records
- `orderItems` - Individual order line items
- `discountCodes` - Promotional codes

### Adding New Features

1. **Define database schema** in `drizzle/schema.ts`
2. **Create query helpers** in `server/db.ts`
3. **Add tRPC procedures** in `server/routers.ts`
4. **Build UI components** in `client/src/pages/` or `client/src/components/`
5. **Connect with tRPC hooks** using `trpc.*.useQuery()` or `trpc.*.useMutation()`

## 🎨 Design System

OptiBio uses a premium design system with:

**Brand Colors:**
- Navy Blue: `#1e3a8a` (Primary)
- Gold: `#d4af37` (Secondary)
- Dark Navy: `#0f172a` (Backgrounds)
- Cream: `#fefce8` (Accents)

**Typography:**
- Font Family: Inter (Google Fonts)
- Weights: 300-900

**Components:**
- Built with shadcn/ui
- Customized with Tailwind CSS 4
- Responsive and accessible

## 📈 SEO & Marketing

### Built-in SEO Features
- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card support
- JSON-LD structured data
- XML sitemap (planned)
- robots.txt for search engine crawling

### Organic Marketing Strategy
The project includes a comprehensive zero-cost marketing strategy:
- Content marketing with blog system (planned)
- SEO-optimized product pages
- Social media integration
- Email capture and nurture sequences
- Affiliate program support

See `OptiBio_Organic_Marketing_Strategy.md` for the complete strategy.

## 🔒 Security

- Environment variables for sensitive data
- JWT-based authentication
- Role-based access control (admin/user)
- Input validation on all forms
- SQL injection prevention with Drizzle ORM
- XSS protection with React

## 🤝 Contributing

We welcome contributions! This is an open-source project built with transparency as a core value.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Website:** [optibio.com](https://optibio.com) (coming soon)
- **GitHub:** [github.com/optibiosupplements/optibio-ecommerce](https://github.com/optibiosupplements/optibio-ecommerce)
- **Documentation:** See `docs/` folder for detailed guides

## 💬 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Email: support@optibio.com
- Twitter: [@optibio](https://twitter.com/optibio)

## 🙏 Acknowledgments

- Built with [Manus Platform](https://manus.im)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by modern e-commerce best practices

## 📊 Project Status

**Current Version:** 1.0.0  
**Status:** Active Development  
**Last Updated:** November 2025

### Roadmap

- [x] Core e-commerce functionality
- [x] Shopping cart and checkout
- [x] User authentication
- [x] Admin dashboard
- [x] SEO optimization
- [ ] Blog system for content marketing
- [ ] Payment gateway integration (Stripe)
- [ ] Customer account dashboard
- [ ] Product reviews and ratings
- [ ] Email marketing automation
- [ ] Analytics dashboard
- [ ] Mobile app (future)

---

**Built with ❤️ by the OptiBio team**

*Transparency. Quality. Science.*
