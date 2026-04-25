# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-04-25

### Added

- **Three configuration modes for "Set Folder Color Scheme"**:
  - **Preset Scheme** — Choose from 21 built-in color presets with color icons and theme type indicators
  - **Custom Color** — Select any installed theme and pick a custom color, with live preview
  - **Quick Config** — Keep current theme, change only UI accent colors
- **Light theme support** — Added 8 light color presets (Morning Mist, Soft Cream, Mint Breeze, Lavender Blush, Peach Sorbet, Sky Light, Sage Garden, Rose Quartz)
- **Theme type indicators** — Preset picker shows Light (☀️) / Dark (🌙) labels for each scheme
- **Dynamic theme discovery** — Automatically scans and lists all themes contributed by installed extensions
- **Theme type-aware color picker** — Color picker shows contextual guidance based on light/dark theme selection
- **Light mode decoration generation** — UI colors are now intelligently generated for both light and dark themes
- **First-run onboarding prompt** — New users are prompted to set up their first folder color on activation
- **Enhanced "List Folder Color Schemes"** — Added Apply Now / Enable / Disable / Remove actions for each mapping

### Changed

- Preset list now displays color icons alongside preset names
- Theme selection list now shows theme type icons
- Color decorations adapt foreground colors appropriately for light vs dark themes
- All 13 existing dark presets now include explicit `themeType: 'dark'` metadata

## [0.1.2] - 2026-03-22

### Changed
- Updated all documentation and command references to use new name

## [0.1.1] - 2026-03-22

### Changed
- "List Folder Color Schemes" now displays hex color code with preset name (e.g., `#1a4d1a Forest Green`) when using preset colors

## [0.1.0] - 2026-03-17

phase: public release

## [0.0.1] ~ [0.0.7] - 2026-03-13 ~ 2026-03-16

phase: internal dev
