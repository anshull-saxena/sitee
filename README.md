# LinkFlow · Curated Link Vault & Synchronizer

A tactile, aesthetic link directory and showcase site built with Next.js, Tailwind CSS v4, and Phosphor Icons following the **Claude design language** and the **taste-skill anti-slop guidelines**.

Includes an interactive **animated terminal CLI** (`cli.mjs`) to add any number of links with automatic OpenGraph metadata scraping, custom or local file thumbnails, and instant deployment to **Vercel**.

---

## Features

- **Claude / Taste-Skill Aesthetic**: Warm obsidian dark canvas (`#121110`), tactile borders, Claude coral accent (`#d97757`), Geist typography, and micro-interactions.
- **Animated Terminal CLI**:
  - Interactive prompts powered by `@clack/prompts`, `ora` spinners, and `gradient-string`.
  - Automatic OpenGraph metadata scraping (fetches page title, description, and preview image).
  - Takes link URL and thumbnail (supports web image URLs, suggested OG image, or **local image files** that get automatically copied to `public/thumbnails/`).
  - Supports adding **N number of links** sequentially in an interactive loop.
  - Automatically updates `src/data/links.json`.
  - One-click deployment options: commit and push to Git, or deploy directly via `vercel --prod`.
- **Site Capabilities**:
  - Instant live search across titles, descriptions, URLs, and tags.
  - Category and tag filtering.
  - Grid view and Compact List view switcher.
  - Detailed preview modal with click tracking, formatted timestamps, and one-click URL copying.
  - Responsive layout with container queries.
  - Zero em-dashes and strict a11y contrast compliance.

---

## Quick Start

### 1. Run the Site Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your directory.

### 2. Add Links via the Animated CLI

You can run the animated CLI tool anytime:

```bash
node cli.mjs
# or
npm run add
```

The CLI will:
1. Prompt for the website URL.
2. Auto-fetch OpenGraph title, description, and image with an animated spinner.
3. Prompt for the **thumbnail** (press Enter to accept suggested, paste an image URL, or provide a local file path like `~/Desktop/screenshot.png`).
4. Allow tweaking title, description, and comma-separated tags.
5. Display a terminal card summary.
6. Ask if you want to add another link (allowing you to add as many as you want in one session).
7. Offer to commit and push to Git or deploy directly to **Vercel**.

### 3. Direct / Scriptable CLI Mode

You can also pass arguments directly without entering the interactive prompt:

```bash
# Add with custom thumbnail URL
node cli.mjs -u "https://linear.app" -t "https://example.com/thumb.jpg" --title "Linear" -d "Streamlined issue tracker." --tags "tools,design"

# Add with a local image file (automatically copied into public/thumbnails/)
node cli.mjs -u "https://figma.com" -t "./screenshots/figma.png" --tags "design,collab"

# View CLI options
node cli.mjs --help
```

---

## Deploying to Vercel

### Method 1: Git Integration (Recommended)
1. Initialize or connect your remote GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
2. Import the repository in [vercel.com](https://vercel.com).
3. Every time you add links via `node cli.mjs` and choose Git push, Vercel will automatically build and deploy your updated site in seconds!

### Method 2: Direct Vercel CLI
1. Log in to Vercel once from your terminal:
   ```bash
   vercel login
   ```
2. Deploy to production:
   ```bash
   vercel --prod
   ```
The CLI provides an option to run this automatically after adding links.
