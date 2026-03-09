# Sport Club Management - UI/UX Design Guidelines

## 1. Style Identity
Vibrant block-based SaaS with a Community/Forum character. Professional but energetic — like a modern sports team hub. Clean layouts with generous spacing, bold headings, and subtle glassmorphism cards.

## 2. Color Palette (Enforced)
- **Primary (Brand Green)**: `#22c55e` (Emerald-500 / HSL 142 76% 36%)
- **Background**: `#ffffff` / `#f8fafc` (Slate-50)
- **Dark Sections / Hero**: `#0f172a` (Slate-900)
- **Text Primary**: `#0c1a0d` (Near-black green-tinted)
- **Text Muted**: `#6b7280`
- **Borders**: `#d1fae5` (Green-tinted light)
- **Destructive/Alerts**: `#ef4444`

## 3. Typography
- **Headings**: `Outfit` — Bold (700), tight letter-spacing. Use for titles, numbers, and stats.
- **Body**: `Work Sans` — Regular/Medium (400/500), 16px, 1.6 line-height. Use for paragraphs and descriptions.

## 4. Layout & Global Components
- **Sidebar**: Left, fixed, 240px wide, icons + labels. Active item gets `border-l-4 border-green-600`.
- **Top Header**: Breadcrumbs + user avatar (`<UserButton />`).
- **Cards**: `rounded-lg` (0.5rem), white background, `border border-green-100`, subtle `shadow-sm`.
- **Icons**: Always use `lucide-react` icons (outline style, 20–24px). **DO NOT use emojis as UI icons.**
- **Buttons**:
  - Primary: Solid green (`bg-primary text-primary-foreground rounded-md px-4 py-2`).
  - Secondary/Ghost: Transparent with subtle background fade on hover.
- **Badges / Status Pills**: `rounded-full` pill format, small text (12px), bold coloring (Green=Active/Admin, Blue=Pending).

## 5. Interactions & Animations
- **Hover States**: Smooth 200ms color/shadow transitions (`transition-all duration-200`). 
- **Transforms**: Use layout-safe transforms. Avoid scale transforms on grid elements to prevent layout shifts. Subtle `active:scale-95` on buttons is allowed.
- **Cursor**: All interactive elements must predictably display `cursor-pointer`.
- **Motion**: Use `framer-motion` for scroll-driven reveals (e.g. `whileInView={{ opacity: 1, y: 0 }}`) and presence animations. Keep durations between `0.3s` and `0.5s`.

## 6. Pre-Delivery Checklist
Before completing any UI task, verify:
- [ ] No emojis are used as functional icons.
- [ ] Modals and dialogs are accessible and trap focus.
- [ ] Light mode contrast is > 4.5:1 for legibility.
- [ ] Layout is responsive across mobile (flex-col) and desktop (grid).
- [ ] Hover and active states are present with 200ms transitions.
