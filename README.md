# Nyalian Tourism Village Website

A modern, production-ready tourism website for Nyalian Tourism Village in Bali, Indonesia. Built as a Jamstack-inspired, JSON-driven application with no backend, database, or authentication in Version 1. The website showcases the village's destinations, tour packages, articles, cultural experiences, and provides visitors with comprehensive information about this authentic Balinese tourism destination.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Carousel:** Embla Carousel
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner
- **Markdown:** react-markdown


## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the application for production:

```bash
npm run build
```

### Production

Run the production build:

```bash
npm start
```

## Project Structure

```
nyalian-tourism-village/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── layout/            # Layout components (Navbar, Footer, etc.)
│   ├── ui/                # shadcn/ui components
│   └── ...                # Feature-specific components
├── data/                  # JSON data files (content-driven)
├── docs/                  # Project documentation
├── lib/                   # Utility functions
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## Content Management

This website is **JSON-driven** with no CMS or backend. All content (destinations, packages, articles, reviews, FAQs, and settings) is managed through JSON files in the `/data` directory. Detailed documentation about the data structure and content management is available in the `/docs` directory.

## Design System

The website follows a comprehensive design system with:
- **Primary Color:** Forest Green (#2F855A)
- **Secondary Color:** Emerald Green (#48BB78)
- **Accent Color:** Warm Orange (#F59E0B)
- **Typography:** Playfair Display (headings) & Inter (body)
- **Responsive Design:** Mobile-first approach

## License

Copyright © 2026 Nyalian Tourism Village. All rights reserved.
