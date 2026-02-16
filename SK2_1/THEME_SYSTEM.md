# Theme-Based Color System Implementation

## Overview

All colors in the game (backgrounds, icons, borders, text, etc.) are now based on the selected theme. The implementation uses CSS custom properties (CSS variables) to create a dynamic theming system.

## Themes Available

### 1. **Default Theme** (Cyan/Turquoise)

- Primary: `#78F2FF` (Bright Cyan)
- Accent: `#0C5E98` (Deep Blue)
- Perfect for a fresh, modern look

### 2. **Sunset Theme** (Red)

- Primary: `#E31E25` (Vibrant Red)
- Accent: `#8B0000` (Dark Red)
- Bold and energetic appearance

### 3. **Ocean Theme** (Blue)

- Primary: `#a1c4fd` (Sky Blue)
- Accent: `#1a365d` (Navy Blue)
- Calm and professional

### 4. **Forest Theme** (Green)

- Primary: `#d4fc79` (Light Green)
- Accent: `#22543d` (Forest Green)
- Natural and refreshing

### 5. **Royal Theme** (Purple)

- Primary: `#667eea` (Royal Purple)
- Accent: `#44337a` (Deep Purple)
- Elegant and sophisticated

### 6. **Gold Theme** (Orange/Yellow)

- Primary: `#f6d365` (Golden Yellow)
- Accent: `#d62828` (Orange Red)
- Warm and inviting

## What Changes with Each Theme

### Background & Gradients

- Main body background gradient
- Header background
- All container backgrounds

### Navigation & UI Elements

- Navigation buttons (back button, menu button)
- Dropdown menu buttons
- All button hover states

### Icons & SVG Elements

- All SVG icons automatically inherit theme colors
- Settings icon
- Sound icon
- Refresh icon
- Back arrow

### Game Elements

- **Grid Cells**: Background, border, and text colors
- **Word List Items**:
  - Pending words (not found yet)
  - Found words
- **Header Elements**: Timer, score, rank displays
- **Success Indicators**: Score badges, congratulations banners

### Text Colors

- Title text
- Header text
- Cell text
- All UI labels

### Borders

- Header borders
- Cell borders
- Word item borders
- Container borders

## CSS Custom Properties Structure

Each theme defines the following variables:

```css
--theme-primary          /* Main theme color */
--theme-secondary        /* Secondary accent */
--theme-accent          /* Tertiary accent */
--theme-dark            /* Dark variant */
--theme-light           /* Light variant */
--theme-bg              /* Background tint */
--theme-gradient-start  /* Gradient start color */
--theme-gradient-end    /* Gradient end color */

--cell-bg               /* Grid cell background */
--cell-border           /* Grid cell border */
--cell-text             /* Grid cell text */

--word-pending-bg       /* Unfound word background */
--word-pending-border   /* Unfound word border */
--word-pending-text     /* Unfound word text */
--word-found-bg         /* Found word background */
--word-found-border     /* Found word border */
--word-found-text       /* Found word text */

--nav-btn-bg            /* Navigation button background */
--nav-btn-color         /* Navigation button icon color */
--nav-btn-hover-bg      /* Navigation button hover state */

--header-bg-start       /* Header gradient start */
--header-bg-end         /* Header gradient end */
--header-border         /* Header border color */
--header-text           /* Header text color */

--title-color           /* Game title color */
--icon-color            /* Icon color */

--success-color         /* Success/achievement color */
--success-light         /* Success light variant */
```

## How to Change Themes

Themes are changed by adding a class to the `<body>` element:

```javascript
// Default theme (no class needed)
document.body.className = "";

// Apply sunset theme
document.body.className = "theme-sunset";

// Apply ocean theme
document.body.className = "theme-ocean";

// Apply forest theme
document.body.className = "theme-forest";

// Apply royal theme
document.body.className = "theme-royal";

// Apply gold theme
document.body.className = "theme-gold";
```

The game already has this functionality built into the settings modal.

## Benefits of This Approach

1. **Centralized Control**: All colors are defined in one place
2. **Easy Maintenance**: Change a theme by updating CSS variables
3. **Consistent Design**: All elements automatically match the theme
4. **Performance**: No JavaScript needed for color changes
5. **Extensibility**: Easy to add new themes
6. **Accessibility**: Can easily create high-contrast themes

## Adding a New Theme

To add a new theme, simply add a new CSS rule block:

```css
body.theme-newtheme {
  --theme-primary: #yourcolor;
  --theme-secondary: #yourcolor;
  /* ... define all other variables ... */
}
```

Then add the theme option to the settings modal in the HTML.

## Technical Implementation

### CSS Variables

All theme colors are defined using CSS custom properties at the `:root` level for the default theme, and overridden in `body.theme-*` selectors for each specific theme.

### Automatic Inheritance

SVG icons use `currentColor` and inherit from their parent elements, which use `var(--nav-btn-color)`, ensuring they automatically match the theme.

### Gradient Support

Background gradients use theme variables:

```css
background: linear-gradient(
  180deg,
  var(--theme-gradient-start) 0%,
  var(--theme-gradient-end) 100%
);
```

## Files Modified

- **style.css**: Complete theme system implementation with CSS custom properties
  - Lines 8-267: Theme color definitions
  - Throughout: Replaced all hardcoded colors with CSS variables

## Testing

Open the game and:

1. Click the menu button (three dots)
2. Click the settings icon
3. Scroll to "Themes"
4. Click different theme options
5. Observe all colors changing throughout the interface

All elements should smoothly transition to the new theme colors, including:

- Background gradients
- Navigation buttons and icons
- Game title
- Header (timer, score, rank)
- Grid cells
- Word list items
- Success banners and badges
