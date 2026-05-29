---
name: Celestial Echo
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353435'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c6c6ca'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f9195'
  outline-variant: '#45474a'
  surface-tint: '#c5c6cb'
  primary: '#c5c6cb'
  on-primary: '#2e3134'
  primary-container: '#05070a'
  on-primary-container: '#76787d'
  inverse-primary: '#5c5e63'
  secondary: '#d2bcfa'
  on-secondary: '#38265a'
  secondary-container: '#4f3d72'
  on-secondary-container: '#c1abe8'
  tertiary: '#e9c400'
  on-tertiary: '#3a3000'
  tertiary-container: '#0a0700'
  on-tertiary-container: '#8e7700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e2e7'
  primary-fixed-dim: '#c5c6cb'
  on-primary-fixed: '#191c1f'
  on-primary-fixed-variant: '#44474b'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d2bcfa'
  on-secondary-fixed: '#231043'
  on-secondary-fixed-variant: '#4f3d72'
  tertiary-fixed: '#ffe16d'
  tertiary-fixed-dim: '#e9c400'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#544600'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353435'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1440px
---

## Brand & Style
The design system is built upon a "Mystic Cosmic" aesthetic, blending the infinite depth of deep space with the intricate, artisanal feel of tarot and astrology. It targets a passionate music community looking for an immersive, discovery-focused experience that feels both ancient and futuristic.

The visual style is a hybrid of **Glassmorphism** and **High-Contrast Luxury**. We utilize translucent layers to simulate nebular clouds, accented by razor-thin gold borders that evoke astronomical instruments. The emotional response should be one of wonder, exclusivity, and rhythmic harmony. Whitespace is used not just for clarity, but to represent the vastness of the void, allowing high-energy "starlight" elements to pop.

## Colors
The palette is rooted in a **Dark** color mode to represent the night sky.

*   **Primary (Deep Space Navy):** Used for the core canvas and deepest background layers.
*   **Secondary (Celestial Purple):** Used for glass surfaces, gradients, and mid-tone containers.
*   **Tertiary (Starlight Gold):** Used sparingly for interactive highlights, thin borders, and critical iconography to signify value and "magic."
*   **Nebula Teal:** An accent color for success states, active play-heads, and secondary highlights, providing a cool contrast to the warm gold.

Gradients should transition from the Deep Space Navy to Celestial Purple with a 45-degree inclination to create a sense of atmospheric depth.

## Typography
The typographic hierarchy relies on a high-contrast pairing. **Playfair Display** provides an editorial, sophisticated, and slightly mysterious feel for headlines, reminiscent of tarot card titles. 

**Inter** is used for all functional UI elements, body copy, and metadata to ensure maximum legibility against dark, complex backgrounds. For a more "mystical" effect, use the `label-caps` style for small headers or category tags to mimic the inscriptions found on vintage star charts.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column system for desktop and a 4-column system for mobile. 

The rhythm is generous, favoring large margins to prevent the "glass" elements from feeling cluttered. Spacing should follow an 8px incremental scale. Elements are often centered or arranged in "constellations"—small clusters of related information separated by significant whitespace. 

Use `margin-desktop` for outer page padding to create a letterboxed, cinematic feel on ultra-wide screens.

## Elevation & Depth
Depth is created through **Glassmorphism** and light rather than traditional shadows. 

1.  **Base Layer:** The Deep Space Navy background.
2.  **Nebula Layer:** Semi-transparent surfaces (10-20% opacity) with a `20px` to `40px` backdrop blur. 
3.  **Aura Layer:** Interactive elements feature a subtle outer glow (box-shadow) using the Starlight Gold or Nebula Teal at low opacity (15-30%) to simulate a celestial body’s corona.
4.  **Edge Definition:** Surfaces are defined by a `1px` inner or outer border in a semi-transparent Starlight Gold, mimicking the gold leaf on old-world maps.

## Shapes
The shape language is "Softly Geometric." We use a base roundedness of `0.5rem` to keep the UI feeling modern and approachable, but not overly bubbly. 

Circular shapes are reserved for "Orbital" elements (like profile pictures, play buttons, or music progress indicators) to reinforce the astronomical theme. Card elements, especially for artists or albums, use a vertical "Tarot" aspect ratio (2:3) with consistent corner radii.

## Components

*   **Tarot Music Cards:** Vertical containers with a `1px` gold border and a subtle purple-to-navy gradient fill. Imagery should have a soft vignette to bleed into the card background.
*   **Orbital Buttons:** Primary buttons are pill-shaped or circular. They feature a Nebula Teal glow and an animated gold border that "rotates" or pulses when hovered, simulating an orbit.
*   **Glass Inputs:** Text fields are transparent with a `1px` bottom-only gold border. On focus, a soft purple backdrop blur fills the container.
*   **Astronomical Overlays:** Modals and menus use a high-blur backdrop (`blur(50px)`) to completely isolate the user from the background, creating a focused "void" for interaction.
*   **Constellation Progress Bars:** Thin gold lines for the track, with a glowing "Star" (Nebula Teal) as the playhead.
*   **Celestial Chips:** Small, fully rounded tags with a Starlight Gold border and `label-caps` typography for genres or moods.