# 🎨 Digital Builders - Brand Implementation Guide

**Last Updated:** December 2025  
**Status:** Active Implementation

---

## ✅ What's Been Implemented

### **1. Brand Colors**
- ✅ Primary (CTA): `#ff00ff` (Magenta) - Added to Tailwind config
- ✅ Secondary: `#00ff55` (Green) - Added to Tailwind config
- ✅ Tertiary: `#00c3ff` (Cyan) - Added to Tailwind config
- ✅ Background: `#070707` - Set as default background
- ✅ Cards: `#111111` - Set as card background
- ✅ Borders: `#262626` - Set as border color
- ✅ Text Primary: `#fafafa` - Set as foreground
- ✅ Text Secondary: `#a3a3a3` - Set as muted foreground

### **2. Typography**
- ✅ Space Mono - Added for headings/buttons
- ✅ Inter - Set as body font
- ✅ Font sizes configured (H1: 48px, H2: 32px, H3: 24px, etc.)
- ✅ Line heights set according to brand guide

### **3. Neon Effects**
- ✅ Neon glow utility classes created
- ✅ Neon shadow effects for buttons/cards
- ✅ Glitch text animation (for hero/special announcements)

### **4. Layout Updates**
- ✅ Root layout updated with Digital Builders metadata
- ✅ Fonts loaded (Space Mono + Inter)
- ✅ Dark theme set as default
- ✅ Background color set to `#070707`

---

## 🎨 Using Brand Colors

### **Tailwind Classes**

```tsx
// Primary CTA (Magenta)
<button className="bg-brand-primary text-black">Click Me</button>

// Secondary (Green)
<div className="bg-brand-secondary">Secondary Element</div>

// Tertiary (Cyan)
<a className="text-brand-tertiary">Link</a>

// Background
<div className="bg-brand-background">Dark Background</div>

// Cards
<div className="bg-brand-card border-brand-border">Card</div>

// Text
<p className="text-brand-text-primary">Primary Text</p>
<p className="text-brand-text-secondary">Secondary Text</p>
```

### **CSS Variables**

```css
/* Available CSS variables */
--brand-primary: #ff00ff;
--brand-secondary: #00ff55;
--brand-tertiary: #00c3ff;
--brand-background: #070707;
--brand-card: #111111;
--brand-border: #262626;
--brand-text-primary: #fafafa;
--brand-text-secondary: #a3a3a3;
```

---

## ✨ Neon Effects Usage

### **Neon Glow Text**

```tsx
// Primary (Magenta)
<h1 className="neon-glow-primary">Hero Title</h1>

// Secondary (Green)
<h2 className="neon-glow-secondary">Subtitle</h2>

// Tertiary (Cyan)
<h3 className="neon-glow-tertiary">Section Title</h3>

// Generic (uses current color)
<span className="neon-glow">Glowing Text</span>
```

### **Neon Shadow (Buttons/Cards)**

```tsx
// Primary button
<button className="bg-brand-primary neon-shadow-primary">
  Get Started
</button>

// Secondary button
<button className="bg-brand-secondary neon-shadow-secondary">
  Learn More
</button>

// Card with glow
<div className="bg-brand-card neon-shadow-tertiary">
  Card Content
</div>
```

### **Glitch Text (Hero Only)**

```tsx
<h1 className="glitch-text" data-text="Digital Builders">
  Digital Builders
</h1>
```

**⚠️ Important:** Use glitch text sparingly - only for hero sections or special announcements!

---

## 📝 Typography Usage

### **Headings (Space Mono)**

```tsx
<h1>Main Heading</h1>  {/* 48px / 1.1 */}
<h2>Section Heading</h2>  {/* 32px / 1.2 */}
<h3>Subsection</h3>  {/* 24px / 1.3 */}
```

### **Body Text (Inter)**

```tsx
<p>Body text uses Inter font</p>
<span className="text-sm">Small text</span>
```

### **Buttons (Space Mono)**

```tsx
<button>Button Text</button>  {/* Automatically uses Space Mono */}
```

---

## 🎯 Layout Defaults

### **Background & Cards**

```tsx
// Main background
<div className="bg-brand-background">  {/* #070707 */}

// Card styling
<div className="bg-brand-card border border-brand-border rounded-lg">
  {/* #111111 background, #262626 border */}
</div>
```

### **CTA Buttons**

```tsx
// Primary CTA (Magenta)
<button className="bg-brand-primary text-black font-heading px-6 py-3 rounded-lg neon-shadow-primary">
  Get Started
</button>

// Secondary CTA (Green)
<button className="bg-brand-secondary text-black font-heading px-6 py-3 rounded-lg">
  Learn More
</button>
```

---

## 📋 Component Checklist

When creating new components:

- [ ] Use brand colors from Tailwind (`bg-brand-primary`, etc.)
- [ ] Apply Space Mono for headings and buttons
- [ ] Use Inter for body text
- [ ] Use neon effects sparingly (1-2 per layout)
- [ ] Maintain generous whitespace
- [ ] Use dark background (#070707) with card styling (#111111)
- [ ] Ensure clear CTA hierarchy
- [ ] Keep body text lines 60-80 characters wide

---

## 🚨 Important Rules

1. **Neon Effects:** Use sparingly - 1-2 elements per layout (hero + CTA)
2. **Glitch Text:** Only for hero sections or special announcements
3. **Whitespace:** Keep generous - avoid clutter
4. **Typography:** Space Mono for headings/buttons, Inter for body
5. **Colors:** Magenta for primary CTAs, Green for secondary, Cyan for links/details

---

## 📚 Related Documentation

- **Brand Style Guide:** `docs/digital-builders/BRAND_STYLE_GUIDE.md`
- **Launch Roadmap:** `docs/digital-builders/LAUNCH_ROADMAP.md`

---

**Remember:** Neon is a spark, not the whole fire. Keep it subtle and impactful!

*Last Updated: December 2025*

