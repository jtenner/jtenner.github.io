# Design System Strategy: The Editorial Architect

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Editorial Architect."** 

Unlike standard tech blogs that feel like documentation repos or generic bootstrap templates, this system treats code as art and technical prose as high-end journalism. We move beyond the "grid-of-cards" trope by embracing **Intentional Asymmetry**. By utilizing extreme whitespace (e.g., `spacing.20` and `spacing.24`) and high-contrast typography scales, we create a rhythm that guides the developer’s eye through complex technical concepts without cognitive overload. The layout should feel "constructed" rather than "poured," using overlapping elements and shifting containers to break the vertical monotony of standard web feeds.

## 2. Colors: Depth Through Tonality
Our palette is rooted in the deep obsidian of `surface` (#0b1326) and the electric clarity of `primary` (#7bd0ff). 

*   **The "No-Line" Rule:** We do not use 1px solid borders to separate sections. Structure is defined exclusively through background shifts. A sidebar might sit on `surface_container_low`, while the main article body lives on `surface`. This creates a sophisticated, "borderless" interface that feels expansive.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers. Use the `surface_container` tiers to create depth. For example, a code snippet block should be nested within a `surface_container_high` box, sitting atop a `surface_container` article body. This "nested" approach creates focus without the need for heavy-handed visual separators.
*   **The "Glass & Gradient" Rule:** For floating navigation or "Read More" overlays, use Glassmorphism. Apply `surface_bright` at 60% opacity with a `backdrop-filter: blur(12px)`. 
*   **Signature Textures:** Main CTAs and Hero backgrounds should leverage a subtle linear gradient from `primary` (#7bd0ff) to `on_primary_container` (#008abb) at a 135-degree angle. This adds a "lithographic" soul to the digital experience.

## 3. Typography: The High-Contrast Dialogue
We pair the geometric precision of **Space Grotesk** (Display/Headlines) with the utilitarian clarity of **Inter** (Body/Titles).

*   **Display & Headlines (Space Grotesk):** Use `display-lg` (3.5rem) for hero titles. The wide apertures of Space Grotesk communicate "Modern Tech" while maintaining an approachable, quirky personality.
*   **Body (Inter):** `body-lg` (1rem) is our workhorse. We prioritize legibility by using a generous line-height (1.6) to ensure long-form technical tutorials are breathable.
*   **Monospace Integration:** While not explicitly in the scale, all code blocks must use a high-contrast Monospace font (e.g., JetBrains Mono) at the `body-md` size. The contrast between the organic curves of Inter and the rigid grid of Monospace is the signature "Developer Editorial" look.

## 4. Elevation & Depth: Tonal Layering
We reject the 2014-era drop shadow. Hierarchy is achieved through **Tonal Layering**.

*   **The Layering Principle:** To lift a card, move it from `surface_container` to `surface_container_highest`. The eye perceives the lighter value as being closer to the light source.
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, use a "Deep Sea" shadow: `box-shadow: 0 20px 40px rgba(6, 14, 32, 0.4)`. The shadow color is a tinted version of our `surface_container_lowest`, making the shadow feel like part of the environment rather than a grey smudge.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast needs), use `outline_variant` (#45464d) at **15% opacity**. This creates a "suggestion" of a boundary that doesn't break the "No-Line" rule.

## 5. Components: Refined Utility

*   **Buttons:**
    *   *Primary:* Gradient-filled (Primary to On-Primary-Container) with `rounded.md` (0.375rem). No border.
    *   *Secondary:* `surface_container_high` background with `primary` text.
*   **Code Blocks (Custom Component):** Use `surface_container_highest` for the background. No borders. Use `spacing.4` for internal padding. Top-right corner should feature a `label-sm` language tag in `tertiary`.
*   **Cards:** Forbid dividers. Separate header, body, and footer using `spacing.5` vertical gaps. Use a subtle `surface_bright` hover state transition (200ms ease).
*   **Inputs:** Use `surface_container_low` for the field background. The active state is signaled not by a glow, but by a 2px bottom-border of `primary`.
*   **Progress Indicators:** A thin, 2px `primary` bar at the very top of the viewport to indicate reading progress—minimalist and functional.

## 6. Do's and Don'ts

### Do:
*   **Do** use `spacing.16` or `spacing.20` between major editorial sections to create a sense of luxury and focus.
*   **Do** use `tertiary` (#ffafd3) sparingly as a "highlighter" for key search terms or "New" badges.
*   **Do** leverage asymmetry—try placing a `display-md` headline off-center to the left, with the body text column shifted right.

### Don't:
*   **Don't** use `#000000` for shadows or text. Always use the provided `surface` and `on_surface` tokens to maintain the "Slate/Deep Blue" tonal integrity.
*   **Don't** use 1px solid lines to separate list items. Use a background shift to `surface_container_low` on hover or simply use `spacing.4` of whitespace.
*   **Don't** use `rounded.full` for anything other than circular avatars or status dots. We want the site to feel "constructed" (architectural), not "bubbly" (consumer social).