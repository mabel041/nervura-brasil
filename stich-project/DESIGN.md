---
name: Nervura Brasil Design System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#414942'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#717971'
  outline-variant: '#c1c9bf'
  surface-tint: '#3b6848'
  primary: '#003016'
  on-primary: '#ffffff'
  primary-container: '#1a472a'
  on-primary-container: '#85b590'
  inverse-primary: '#a1d2ab'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#282a1a'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e402e'
  on-tertiary-container: '#abab95'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bdefc6'
  primary-fixed-dim: '#a1d2ab'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#234f32'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b0'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474836'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  price:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.01em
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1440px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The brand identity is built on the intersection of organic elegance and architectural precision. It targets a discerning audience that values slow fashion, craftsmanship, and quiet luxury. The visual language evokes a sense of serenity, confidence, and high-tier professionalism.

The design style is **Minimalism with a Editorial flair**. It prioritizes high-quality imagery and generous negative space to allow products to breathe. The interface acts as a silent gallery, using rigorous alignment and a restrained palette to elevate the merchandise. Touches of classic serif typography are juxtaposed with modern, balanced sans-serifs to create a "modern heritage" aesthetic that feels both timeless and forward-thinking.

## Colors

The palette is rooted in a naturalistic, premium spectrum. 
- **Primary (#1A472A):** A deep, forest green used for grounding the brand. It serves as the primary "dark" for headers, buttons, and high-impact messaging.
- **Secondary (#D4AF37):** A muted gold used sparingly for accents, highlights, and call-to-action indicators that require a touch of luxury.
- **Tertiary (#F5F5DC):** A warm beige used for large surface areas, section backgrounds, and to soften the starkness of pure white.
- **Neutral (#121212):** Used for primary body text and structural lines, ensuring high legibility and a sharp, professional finish.

## Typography

This design system utilizes a three-font strategy to balance editorial elegance with functional clarity. 

**Noto Serif** is the voice of the brand, reserved for large headings and storytelling elements. Its classic proportions convey heritage. **Manrope** provides a refined, legible experience for body copy and product descriptions. **Space Grotesk** is used for technical labels, SKU numbers, and utility navigation, adding a contemporary, structured edge that suggests precision.

Type should be set with ample leading to maintain a clean, airy feel. Headlines should use a slight negative letter-spacing, while uppercase labels require tracking for better breathability.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (12 columns) and a fluid model on mobile (4 columns). The "container-max" ensures that the high-end aesthetic is preserved on ultra-wide screens by maintaining white space in the margins.

A vertical rhythm based on an 8px scale is mandatory. Generous padding (`lg` and `xl`) should be used between major sections to emphasize exclusivity. Product grids should favor 2 or 3 columns rather than dense 4-column layouts to increase the perceived value of each item.

## Elevation & Depth

To maintain a minimalist aesthetic, this design system avoids heavy drop shadows. Depth is communicated through **Tonal Layers** and **Low-contrast outlines**.

- **Surfaces:** Use the Tertiary beige (#F5F5DC) to distinguish secondary content areas from the primary white background.
- **Borders:** Use 1px solid lines in a low-opacity version of the Primary color for dividers and input fields.
- **Shadows:** When necessary for interaction (e.g., a floating cart), use a single "Ambient Shadow"—extremely diffused, with 4% opacity and a 20px blur, tinted with the primary forest green.

## Shapes

The design system employs **Sharp (0px)** corners. This decision reinforces the architectural, high-fashion narrative of the brand. Every element—from primary CTA buttons to product cards and image containers—should feature crisp, right-angled edges. This creates a sense of luxury, precision, and formality.

## Components

- **Buttons:** Primary buttons are solid Primary Green (#1A472A) with white text, utilizing the `label-caps` typography style. Secondary buttons are outlined with 1px strokes. All buttons are sharp-edged.
- **Input Fields:** Minimalist design with only a bottom border that thickens or changes to Gold (#D4AF37) on focus. Labels should use `label-caps`.
- **Product Cards:** No borders or shadows. The image is the hero. The product name uses `body-md` and the price uses the `price` style, aligned to the left.
- **Chips/Filters:** Simple text-based triggers with a 1px underline for the active state, avoiding the "pill" container to maintain the formal aesthetic.
- **Checkboxes & Radios:** Custom-styled square boxes (0px radius) that use the Primary Green for the "checked" state.
- **Navigation:** A minimalist top bar with a centered logo. Hover states for menu items should be a subtle color shift to the Secondary Gold or a simple 1px underline.