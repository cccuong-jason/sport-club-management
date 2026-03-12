# Sport Club Management - UI/UX Design Guidelines

## 1. Style Identity
**Hybrid Approach:** 
- **Public/Landing Pages (Goalz Aesthetic):** High-energy, athletic, and dynamic. Dark-themed with bold, high-contrast typography and vibrant lime/green accents to evoke a premium sports academy feel.
- **Internal Dashboard (Flexfollio Aesthetic):** Professional, organized SaaS dashboard. Clean, card-based layouts with neutral backgrounds, prioritizing data density, usability, and functional components (tables, metric cards, sidebars).

## 2. Color Palette (Enforced)
### Global / Brand
- **Primary (Brand/Lime Green)**: `#84cc16` (Lime-500) or `#22c55e` (Emerald-500) — Used for primary actions, active states, and high-energy highlights.
- **Destructive/Alerts**: `#ef4444` (Red-500)

### Public Pages (Dark Theme Preferred)
- **Background**: `#09090b` (Zinc-950) or `#0f172a` (Slate-900)
- **Surface/Cards**: `#18181b` (Zinc-900)
- **Text Primary**: `#ffffff`
- **Text Muted**: `#a1a1aa` (Zinc-400)

### Internal Dashboard (Light Theme Preferred)
- **Background**: `#f8fafc` (Slate-50)
- **Surface/Cards**: `#ffffff` 
- **Borders**: `#e2e8f0` (Slate-200)
- **Text Primary**: `#0f172a` (Slate-900)
- **Text Muted**: `#64748b` (Slate-500)

## 3. Typography
- **Headings (Public)**: `Outfit` — Bold (700) to Black (900), tight letter-spacing. Use uppercase for high-impact hero sections and primary section headers.
- **Headings (Internal)**: `Outfit` — SemiBold (600) to Bold (700). Clean and readable for data grouping.
- **Body**: `Work Sans` — Regular/Medium (400/500), 16px, 1.6 line-height. Use for paragraphs, descriptions, and data tables.

## 4. Layout Architecture & Composition

Our layouts rely heavily on modern CSS Grid, Flexbox, and overlapping elements to break out of the "boring box" look.

### Public Pages (Goalz-Inspired)
- **Hero Sections:** Edge-to-edge layouts using `h-screen` or `min-h-[80vh]`. Use `absolute` positioning for background imagery/video, with a dark gradient overlay (`bg-gradient-to-t from-zinc-950/90 to-transparent`) to ensure text legibility.
- **Asymmetric Grids:** Break the standard 50/50 split. Use grid layouts like `grid-cols-12` where text takes up 5 columns (`col-span-5`) and visuals take up 7 columns (`col-span-7`).
- **Sticky Pillars:** In long scrolling sections, use `sticky top-24` on the text/header column while the adjacent column (e.g., feature cards or program details) scrolls normally.
- **Overlapping Elements:** Floating cards or statistics should break container boundaries. For example, use negative margins (`-mt-16`) or absolute positioning to pull elements up over the hero section's bottom edge.
- **Containers:** Keep text constrained for readability (`max-w-2xl`), but let images and background layers bleed to the edges of the parent grid.

### Internal Dashboard (Flexfollio-Inspired)
- **App Shell:** 
  - **Sidebar:** `w-64 fixed inset-y-0 left-0 z-50 overflow-y-auto border-r border-slate-200 bg-white`.
  - **Main Content:** `ml-64 flex-1 flex flex-col min-h-screen bg-slate-50`.
- **Top Header:** `sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center`.
- **Dash Grids:** Use CSS Grid for metric cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`.
- **Data Tables:** Wrap tables in an `overflow-x-auto` container with a white background, rounded corners (`rounded-xl`), and a subtle border. Use `sticky top-0` on `<th>` elements for long tables.

## 5. Motion & Animation System

Animations must look intentional, premium, and silky smooth. We rely heavily on `framer-motion`.

### 5.1 Public Pages (High-Energy & Athletic)
- **Scroll Reveals (Viewport Triggered):** Elements must not just fade in; they should slide and reveal.
  - Setup: `initial={{ opacity: 0, y: 40, rotateX: 10 }}`
  - Animate: `whileInView={{ opacity: 1, y: 0, rotateX: 0 }}`
  - Transition: `transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}`
- **Staggered Children:** When revealing a list of items (e.g., features, coaches), use `variants` to stagger the delay.
  - Parent: `transition: { staggerChildren: 0.1 }`
- **Text Reveal (Masking):** For main headlines, treat each line as a bounded box (`overflow-hidden`), and slide the text up from `y: "100%"` to `y: "0%"`.
- **Parallax Enhancements:** Background images or large typographic background elements should have a slight `useScroll` translation mapping.
- **Magnetic Buttons:** Primary CTAs can utilize a slight magnetic hover effect where the button interpolates towards the mouse pointer.

### 5.2 Internal Dashboard (Smooth & Functional)
- **Micro-Interactions:** 
  - **Tabs/Navigation:** Use Framer Motion's `layoutId` to animate active tab indicators. This creates a fluid sliding effect between active states.
  - **Hover Elevation:** Cards and rows should feel tactile. Instead of framer-motion, use Tailwind: `transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50`.
- **State Changes:** When data updates or items are deleted, use `AnimatePresence` with `layout` props to smoothly collapse white space rather than snapping abruptly.
- **Skeletons:** Data fetching should show pulsing skeletons (`animate-pulse bg-slate-200`) mapped to the exact layout structure, avoiding layout jumps when data arrives.
- **Dialogs & Drawers:** 
  - Drawers slide from the right: `initial={{ x: "100%" }} animate={{ x: 0 }}` with a spring transition.
  - Modals scale up slightly: `initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}`.

## 6. Pre-Delivery Checklist
Before completing any UI task, verify:
- [ ] Aesthetic aligns with the context (Dark/Athletic for Public, Light/Clean for Admin).
- [ ] No emojis are used as functional icons.
- [ ] Modals and dialogs are accessible and trap focus.
- [ ] Contrast ratios meet accessibility standards (> 4.5:1).
- [ ] Layout is responsive across mobile (flex-col) and desktop (grid).
- [ ] Hover and active states are present with appropriate transitions.
