#!/usr/bin/env python3
"""WCAG 2.x contrast ratio for color pairs.

Usage:
  contrast.py '#1E1F21' '#F4F4F0'             # one pair
  contrast.py --tokens                         # check huepattl-rams-design defaults

Text needs >= 4.5 (>= 3.0 for >= 24 px or >= 18.66 px bold);
UI component borders and graphical marks need >= 3.0.
"""
import sys


def luminance(hex_color):
    h = hex_color.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    channels = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(a, b):
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


# (foreground, background, required ratio, label)
DEFAULT_PAIRS = [
    ("#1E1F21", "#F4F4F0", 4.5, "light fg on bg"),
    ("#4A4C4E", "#F4F4F0", 4.5, "light fg-2 on bg"),
    ("#686A65", "#F4F4F0", 4.5, "light fg-3 on bg"),
    ("#686A65", "#EAEAE5", 4.5, "light fg-3 on bg-2"),
    ("#80817C", "#F4F4F0", 3.0, "light line-strong on bg"),
    ("#1E1F21", "#E85D04", 4.5, "light accent-fg on accent"),
    ("#B84A00", "#F4F4F0", 4.5, "light accent-ink on bg"),
    ("#1A6E37", "#F4F4F0", 4.5, "light confirm-ink on bg"),
    ("#1A6E37", "#DCE8DC", 4.5, "light confirm-ink on confirm tint"),
    ("#B91C1C", "#F0DCD8", 4.5, "light warning-ink on warning tint"),
    ("#8A5A00", "#F4E7CA", 4.5, "light time-ink on time tint"),
    ("#2A8C4A", "#F4F4F0", 3.0, "light confirm mark on bg"),
    ("#8A5A00", "#F4F4F0", 4.5, "light time-ink on bg"),
    ("#1E1F21", "#F5AA1C", 4.5, "fg on time fill"),
    ("#D62828", "#F4F4F0", 4.5, "light warning on bg"),
    ("#EDEDE8", "#161718", 4.5, "dark fg on bg"),
    ("#9C9E99", "#161718", 4.5, "dark fg-3 on bg"),
    ("#9C9E99", "#1E1F21", 4.5, "dark fg-3 on bg-2"),
    ("#6E706C", "#161718", 3.0, "dark line-strong on bg"),
    ("#1E1F21", "#F07A2A", 4.5, "dark accent-fg on accent"),
    ("#F07A2A", "#161718", 4.5, "dark accent-ink on bg"),
    ("#3FB765", "#161718", 4.5, "dark confirm on bg"),
    ("#F5AA1C", "#161718", 4.5, "dark time on bg"),
    ("#F0605A", "#161718", 4.5, "dark warning on bg"),
    ("#3FB765", "#1B2A21", 4.5, "dark confirm on confirm tint"),
    ("#F0605A", "#302020", 4.5, "dark warning on warning tint"),
]


def main(argv):
    if len(argv) == 3:
        print(f"{ratio(argv[1], argv[2]):.2f}:1")
        return 0
    if len(argv) == 2 and argv[1] == "--tokens":
        failed = 0
        for fg, bg, need, label in DEFAULT_PAIRS:
            r = ratio(fg, bg)
            ok = r >= need
            failed += not ok
            print(f"{'ok  ' if ok else 'FAIL'} {r:5.2f} (need {need}) {label}")
        return 1 if failed else 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
