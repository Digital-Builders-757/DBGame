# Digital Builders Brand Implementation Guide

**Last Updated:** December 2025

This guide documents how the Digital Builders brand style guide is implemented in the codebase.

---

## 🎨 Brand Colors

### Primary Colors

- **Magenta** (`#ff00ff`) - Primary CTA, buttons, highlights
- **Neon Green** (`#00ff55`) - Secondary elements, accents
- **Cyan Blue** (`#00c3ff`) - Tertiary elements, accents

### Usage in Tailwind

```tsx
// Direct color usage
<div className="bg-brand-magenta">Magenta background</div>
<div className="text-brand-green">Green text</div>
<div className="border-brand-cyan">Cyan border</div>

// Using aliases
<div className="bg-brand-primary">Primary (magenta)</div>
<div className="bg-brand-secondary">Secondary (green)</div>
<div className="bg-brand-tertiary">Tertiary (cyan)</div>
```

### Background Colors

- **Background Black** (`#070707`) - Main background
- **Card Background** (`#111111`) - Card/surface backgrounds
- **Border Color** (`#262626`) - Borders and dividers

### Text Colors

- **Primary Text** (`#fafafa`) - Main text content
- **Secondary Text** (`#a3a3a3`) - Secondary text, descriptions

---

## ✨ Neon Effects

### Text Glow Effects

```tsx
// Magenta neon glow
<h1 className="neon-glow-primary">Magenta Glow Text</h1>
<h1 className="neon-glow-magenta">Magenta Glow Text</h1>

// Green neon glow
<h2 className="neon-glow-secondary">Green Glow Text</h2>
<h2 className="neon-glow-green">Green Glow Text</h2>

// Cyan neon glow
<h3 className="neon-glow-tertiary">Cyan Glow Text</h3>
<h3 className="neon-glow-cyan">Cyan Glow Text</h3>
```

**⚠️ Use sparingly** - Only 1-2 neon glow elements per page/layout.

### Box Shadow Effects

```tsx
// Magenta shadow
<button className="neon-shadow-primary">Button</button>
<button className="neon-shadow-magenta">Button</button>

// Green shadow
<div className="neon-shadow-secondary">Card</div>
<div className="neon-shadow-green">Card</div>

// Cyan shadow
<div className="neon-shadow-tertiary">Card</div>
<div className="neon-shadow-cyan">Card</div>
```

---

## 🔤 Typography

### Font Families

- **Inter** (`font-sans`, `font-body`) - Body text, general content
- **Space Mono** (`font-mono`, `font-heading`) - Headings, buttons, emphasis

### Usage

```tsx
// Body text (Inter)
<p className="font-body">Body text content</p>

// Headings (Space Mono)
<h1 className="font-mono font-bold">Heading</h1>
<h2 className="font-heading font-bold">Heading</h2>

// Buttons (Space Mono)
<button className="font-mono font-bold">BUTTON TEXT</button>
```

### Heading Styles

- **H1**: 48px, Space Mono Bold, line-height 1.1
- **H2**: 32px, Space Mono Bold, line-height 1.2
- **H3**: 24px, Space Mono Bold, line-height 1.3
- **H4**: 20px, Space Mono Bold, line-height 1.4

---

## 🎴 Logo Usage

### Logo Mark: `{bl};`

```tsx
<div className="font-mono text-3xl font-bold">
  <span className="text-brand-green">{"{"}</span>
  <span className="text-brand-cyan">bl</span>
  <span className="text-brand-green">{"}"}</span>
  <span className="text-brand-magenta">;</span>
</div>
```

### Logo with Text

```tsx
<div className="flex items-center">
  <div className="font-mono text-3xl font-bold">
    <span className="text-brand-green">{"{"}</span>
    <span className="text-brand-cyan">bl</span>
    <span className="text-brand-green">{"}"}</span>
    <span className="text-brand-magenta">;</span>
  </div>
  <span className="ml-3 font-mono text-2xl font-bold">Digital Builders</span>
</div>
```

---

## 🎯 Brand Buttons

### Primary Button (Magenta)

```tsx
<button className="btn-brand-primary px-6 py-3 rounded-lg">
  PRIMARY BUTTON
</button>
```

### Secondary Button (Green)

```tsx
<button className="btn-brand-secondary px-6 py-3 rounded-lg">
  SECONDARY BUTTON
</button>
```

### Tertiary Button (Cyan)

```tsx
<button className="btn-brand-tertiary px-6 py-3 rounded-lg">
  TERTIARY BUTTON
</button>
```

---

## 📐 Layout Guidelines

### Background

Always use the brand background color:

```tsx
<div className="bg-brand-background">Content</div>
// or
<div className="bg-[#070707]">Content</div>
```

### Cards

Use brand card background:

```tsx
<div className="bg-brand-card border border-brand-border rounded-lg p-6">
  Card content
</div>
```

### Text Colors

```tsx
<p className="text-brand-text-primary">Primary text</p>
<p className="text-brand-text-secondary">Secondary text</p>
```

---

## 🎨 Component Examples

### Hero Section

```tsx
<section className="bg-brand-background text-brand-text-primary">
  <h1 className="font-mono text-5xl font-bold neon-glow-primary">
    Digital Builders
  </h1>
  <p className="text-brand-text-secondary">
    Build your career in creative tech
  </p>
  <button className="btn-brand-primary">
    GET STARTED
  </button>
</section>
```

### Event Card

```tsx
<div className="bg-brand-card border border-brand-border rounded-lg p-6">
  <h3 className="font-mono text-xl font-bold text-brand-text-primary">
    Event Title
  </h3>
  <p className="text-brand-text-secondary">
    Event description
  </p>
  <button className="btn-brand-primary mt-4">
    RSVP
  </button>
</div>
```

---

## ⚠️ Important Guidelines

1. **Neon Effects**: Use sparingly - only 1-2 per page
2. **Contrast**: Always maintain high contrast for accessibility
3. **Typography**: Use Space Mono for headings/buttons, Inter for body
4. **Colors**: Stick to the brand palette - don't create variations
5. **Background**: Always use `#070707` for main backgrounds
6. **Cards**: Use `#111111` for card backgrounds
7. **Layout Width**: We removed any global `max-width` on `body` in `app/globals.css`. Pages should no longer be capped to 80ch. If you want constrained copy, apply `max-w` on the specific text blocks (e.g., `max-w-3xl` on paragraphs), not on `body`.
8. **Full-Bleed Hero**: In `app/page.tsx`, the hero/feature/CTA wrappers use `max-w-none` so desktop fills the screen; keep padding (`px-4 sm:px-6 lg:px-10`) for breathing room.
9. **Create Account Visual**: `app/create-account/page.tsx` uses `SafeImage` at `/images/builder-team-hero.jpg` with a neon backlit gradient. Add the image to `public/images/builder-team-hero.jpg` (the illustrated builders image) for the intended look; fallback is `solo_logo.png` if missing.

---

## 📚 Reference Files

- **Brand Colors**: `app/globals.css` (lines 127-142)
- **Tailwind Config**: `tailwind.config.ts` (lines 64-76)
- **Typography**: `app/layout.tsx` (Inter & Space Mono setup)
- **Neon Effects**: `app/globals.css` (lines 1014-1068)

---

*Last Updated: December 2025*

