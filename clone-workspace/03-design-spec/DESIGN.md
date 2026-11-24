# Design Token Specification — `https://jjettas.com/`

## 1. Typography
- **Display & Numeric (`--font-display`)**:
  - Family: `beachwood-variable, "Helvetica Neue", Arial, sans-serif`
  - Source: `/fonts/beachwood-variable.woff2`
  - Default Variation Settings: `"wdth" 50, "wght" 700, "slnt" 0`
  - Wide Variation Settings: `"wdth" 75, "wght" 700, "slnt" 0`
- **Body (`--font-body`)**:
  - Family: `fontBody, "fontBody Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
  - Sources: `/_next/static/media/34310d7f0559b2f8-s.p.woff2` (400), `/_next/static/media/45f4bf9bd5d902fa-s.p.woff2` (800)
  - Base Size (Desktop 1440×900): `15.12px`, Line Height `23.436px`, Letter Spacing `0.1512px`
- **Monospace (`--font-mono`, `--font-nu-mono`)**:
  - Sources: `/_next/static/media/0ad3faa61cd26fd6-s.p.woff2` (500), `/_next/static/media/c39007f2e37cc928-s.p.otf` (400)

## 2. Color Palette & Theme Tokens
- `--color-obsidian`: `#0B0A0F` (`rgb(11, 10, 15)`)
- `--color-ink`: `#171220` (`rgb(23, 18, 32)`)
- `--color-charcoal`: `#2D2D2D` (`rgb(45, 45, 45)`)
- `--color-purple-deep`: `#1E1035` (`rgb(30, 16, 53)`)
- `--color-purple-royal`: `#3D246C` (`rgb(61, 36, 108)`)
- `--color-lavender`: `#9E6DE9` (`rgb(158, 109, 233)`)
- `--color-gold`: `#D4A24A` (`rgb(212, 162, 74)`)
- `--color-sand`: `#DFD9D0` (`rgb(223, 217, 208)`)
- `--color-bone`: `#F4EFE6` (`rgb(244, 239, 230)`)
- `--color-ivory`: `#F6F3EF` (`rgb(246, 243, 239)`)

## 3. Layout & Viewport Units
- `--content-max`: `1728px`
- `--page-w`: `min(100vw, 1728px)`
- `--page-x`: `max(0px, calc((100vw - 1728px) / 2))`
- `--vu`: `min(calc(var(--page-w) / 100), calc(1.8 * max(1vh, var(--min-h) / 100)))`
- `--pebble-tile`: `480px`
- `--leather-tile`: `560px`
