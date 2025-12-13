# AltSEO

AltSEO is a micro-SaaS platform that automatically generates SEO-friendly, accessible alt text for images using AI. Perfect for bloggers, content creators, e-commerce stores, and agencies who need accurate image descriptions quickly.

## Features

- 🤖 **AI-Powered Generation** - Automatically generate accurate alt text using advanced AI vision
- ⚡ **Fast Processing** - Get results in 3-5 seconds
- 🎯 **SEO Optimized** - Generate descriptions optimized for search engines
- 📝 **Editable Output** - Review and customize generated text before use
- 💾 **Download Results** - Export as TXT or JSON formats
- 📊 **History Tracking** - Access previously generated alt text
- 🔌 **API Access** - Integrate with your workflow (Pro plan)
- ♿ **Accessibility Focused** - Create truly accessible image descriptions

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Database & Auth:** Supabase
- **AI:** Groq AI SDK
- **Form Handling:** React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd altseo
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
altseo/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   └── lib/          # Utility functions and configurations
├── supabase/         # Supabase configuration
└── public/           # Static assets
```

## Plans

### Free Plan
- 10 images per day
- Single image upload
- Basic alt text generation

### Pro Plan
- Unlimited images
- API access
- Full history
- Priority processing

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## API Usage (Pro Users)

Generate alt text programmatically:

```bash
curl -X POST https://your-domain.com/api/generate-alt-text \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

---

Built with ❤️ using Next.js and AI