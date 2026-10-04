---
name: huepattl-legal-check
description: Use when software, a container image, an installer or a website is about to be published, released or distributed, when asked whether a project is "legally OK", license-compatible, infringes patents or needs an imprint (Impressum) or privacy notice (Datenschutzerklärung), and when adding telemetry, network calls, server logging, fonts, maps, codecs or other third-party assets. Written for a private or hobby developer in Germany/the EU.
---

# Legal check

## Overview

A legal check is an audit of **what is actually shipped and actually running**,
not of what the README, a config comment or a privacy notice says. Every finding
carries evidence (a file and line, a command and its output, a live URL).
It is engineering guidance, not legal advice: say so once, and name a lawyer
for IT law where a case is borderline.

## When to use

- Before a release, a container push, a website deploy; on "are we violating anything?"
- A new dependency, vendored script, font, map, dataset, codec or bundled tool
- A new outbound network call, log, cookie/localStorage use, telemetry or update check
- Not for: contracts, tax, employment, or anything commercial at scale — refer to a lawyer.

## Workflow

Work through the areas in order; each has its checks and commands in
[references/checks.md](references/checks.md) and the law, with sources and
dates, in [references/law-de-eu.md](references/law-de-eu.md).

1. **Context** — jurisdiction; commercial or not (sales, paid support, recurring
   company donations change the answer); every artifact that leaves the machine:
   source repo, binaries/archives, installers, container images, published sites.
2. **Licenses** — inventory everything built in or shipped (transitive modules,
   vendored JS/CSS, fonts, icons, data, images) and every tool a container or
   installer carries. Check compatibility *and* notice duties: license texts in
   the binary, the archives, the image, and an in-app list. Attribution duties
   (e.g. OpenStreetMap/ODbL) on every map, screenshot and video frame. The fix
   for a missing notice is the "Licenses and thanks" pattern in checks.md:
   an About entry, a page that links each project and its license text, and
   a test that keeps the list complete.
3. **Patents** — a free license protects only against the contributors' own
   patents; private use is exempt, distribution is not. Look for codecs (HEVC,
   H.264, AAC) in what *you* distribute, including container images.
4. **Liability and EU product rules** — disclaimer present in app and site; check
   the non-commercial exemptions still hold.
5. **Website** — imprint, privacy notice, third-party loads, browser storage,
   processor agreement with the host. Verify the notice against the server:
   log fields, retention actually enforced, anonymization actually applied,
   the cron that does it actually present.
6. **Software privacy** — grep every outbound request; the app must say what
   leaves and when (and that there is no telemetry/update check, if true).
7. **Marks and people** — third-party names and logos; recognisable people in
   screenshots, videos, sample photos (consent).

## Output

One table, most severe first: **Area · Finding · Evidence · Risk (low/medium/high) ·
Fix**. Then open questions for the owner, batched. Ask before fixing; ask for
the *minimum* personal data a duty requires (imprint: name and postal address;
nothing more unless the owner wants it).

## Red flags — verify, don't trust

| Claim | Check instead |
|---|---|
| "Logs are anonymized / UA stripped" | Read the anonymizer code and a line of its output |
| "Kept 7 days" | Rotation config: a size-only roll keeps old files indefinitely; list the files with dates |
| "A daily cron does it" | `crontab -l`, `/etc/cron.d`, systemd timers on the server |
| "Attribution is shown" | Every map instance; `attributionControl: false` without a replacement |
| "Project X takes donations" | Sponsor URLs return 200 even when absent (GitHub redirects to the profile) — check the page content |
| "No external requests" | grep the code and the CSP; check generated output (published sites, exports) |
| "Only private use" | Anything public — a blog, product pages — is not "exclusively personal" |

## Fixing server-side findings

Before overwriting a live config, diff it against the repo copy; the live
state may hold hand-deployed changes. Keep a backup of data you rewrite only
until the result is verified when the backup itself holds the data you are
removing.

## Related

`huepattl-code-quality` checks a single dependency's license when it is added;
this skill audits the whole project and its surroundings.

## Updates

Source: https://github.com/bjblazko/skills (MIT). When this skill loads, run once per session (the check itself limits network calls to once per 7 days; `<skill dir>` is the base directory shown when the skill loads):

```bash
r=$(git -C "<skill dir>" rev-parse --show-toplevel 2>/dev/null) || { echo "no git clone"; exit 0; }
s="$r/.git/huepattl-last-update-check"
[ -n "$(find "$s" -mtime -7 2>/dev/null)" ] && { echo "checked recently"; exit 0; }
touch "$s"; git -C "$r" fetch -q origin 2>/dev/null && git -C "$r" status -sb | head -1
```

| Result | Action |
|---|---|
| `checked recently`, up to date, or fetch failed (offline) | Continue silently. |
| `[behind N]` and `git -C <repo> status --porcelain` is empty | `git -C <repo> pull --ff-only`, tell the user in one line what changed (`git -C <repo> log --oneline HEAD@{1}..HEAD`), re-read this SKILL.md. |
| `[behind N]` with local changes, or `[ahead …, behind …]` | Do not pull. Tell the user and ask how to proceed. |
| `no git clone` | Mention once that updates come from the URL above; offer to replace the copy with a clone. |
