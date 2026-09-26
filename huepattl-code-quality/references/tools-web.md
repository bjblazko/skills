# HTML / CSS

Structure and correctness only; visual design belongs to `huepattl-rams-design`.

- HTML validity: `npx html-validate <files>` or `vnu` (W3C validator)
- Semantics/a11y: semantic elements over div soup, labels for inputs, alt text; `npx @axe-core/cli <url>` or `npx lighthouse <url> --only-categories=accessibility`
- CSS lint: `npx stylelint "**/*.css"`
- CSS redundancy/unused: `npx jscpd --format css`, `npx purgecss` (report only), design tokens instead of repeated literals
- Prefer custom properties for repeated colors/spacing; avoid `!important`, deep selectors (>3 levels), ID selectors for styling
- Browser support/obsolete features: check MDN/Context7 for deprecated properties and elements
