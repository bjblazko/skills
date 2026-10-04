# Checks and commands

Each check names what to look at and the evidence to record. Adapt the
commands to the stack; keep the evidence in the findings table.

## 1. Context

- Project license: `LICENSE*`, SPDX headers, package metadata. None → ask.
- Commercial? Sales, paid support, ads, recurring donations from companies.
  Donations to *other* projects do not count.
- Artifacts: `gh release view --json assets`, `.goreleaser.yml` (`archives.files`),
  Dockerfile (base image, `apt-get install`), installers (`*.iss`, `.dmg`
  scripts, `install.sh`), CI workflows that push images (`ghcr.io`, Docker Hub).
- Is the repo public? `gh repo view --json visibility,licenseInfo`.

## 2. Licenses

**Inventory what is built in.**

- Go: `go list -deps -f '{{if .Module}}{{.Module.Path}}{{end}}' . | sort -u`, then
  the `LICENSE*`, `NOTICE`, `PATENTS` files in `$(go env GOMODCACHE)/<mod>@<ver>/`.
  Multi-file licenses (e.g. modernc `LICENSE-3RD-PARTY.md`) belong to the text.
- JS/npm: `npx license-checker --summary` (ask before installing); vendored files:
  `find . -path '*vendor*' -o -name '*.min.js'` — a minified header with only a
  copyright line lacks the permission text (ISC/MIT need it).
- Fonts: OFL needs `OFL.txt` beside the font files; Reserved Font Names.
- Data, icons, images, map styles, sample media: source and license each.

**Compatibility.** Permissive (MIT, BSD, ISC, Apache-2.0) fits nearly
everything. Separate programs called by exec (ffmpeg, exiftool) do not
combine licenses — "mere aggregation". GPL code *linked* into a non-GPL
binary does.

**Notice duties.** BSD/MIT/ISC/OFL: copyright + license text with every
binary distribution. Check: the binary (embedded and shown in an About or
Licenses page), release archives, container image (`/usr/share/doc/...`).
Guard it with a test: every built-in module appears in the credits list and
has its text.

**"Licenses and thanks" pattern** (the fix to propose; used in Unterlumen and
CaddyShack):

- `credits.json` beside the web assets, in groups such as *built in*,
  *programs it calls*, *maps and data*. Per entry: `name`, `version`, `use`
  (one line: what it does here), `license` (SPDX or plain name), `home`
  (project website), `text` (path of the embedded license text, or the
  license URL for data that is not shipped), optional `support` (only after
  checking it exists, see below), and for vendored assets `files` (the shipped
  files the entry covers).
- The license texts as files next to it (`licenses/<name>.txt`), copied from
  the exact released version; OFL fonts keep `OFL.txt` beside the font files.
  All embedded in the binary and served (`/licenses/…`); release archives get
  a `licenses/` folder when they ship more than the binary.
- An HTML page rendered from the JSON (not a `.txt` dump): an intro naming
  the project's own license and the no-warranty sentence, then per entry
  name + version, use, license, and links *Website*, *License text*,
  *Support the project*. Reached from the app's **About** dialog/page and its
  footer.
- **About** says who makes it (name; email only if the owner wants it),
  links the project website, the product page and the source repository,
  states what data leaves the machine (or that nothing does), the license and
  no-warranty statement, and links "Licenses and thanks".
- Tests: (1) every shipped third-party file / built-in module is covered by
  an entry — Go: compare `debug.ReadBuildInfo().Deps` with the `module`
  fields; vendored files: walk `vendor/`, `data/`, `fonts/` and match
  `files`; (2) every built-in entry has `license`, `home`, `text`, and the
  text is embedded. Check that each test fails when you add an unlisted file.
- Trademark note for names the product refers to ("X is a registered
  trademark of …; not affiliated") on that page when it applies.

**Attribution duties.** OpenStreetMap (ODbL): "© OpenStreetMap contributors"
on every map — grep `attributionControl: false` and check each instance adds
its own. Screenshots and videos of maps are "produced works": the credit must
be visible in the frame.

**Support links** in a thanks list: verify each. GitHub Sponsors redirects a
non-sponsorable user to the profile with 200:

```bash
curl -sL -w '\n%{url_effective}' https://github.com/sponsors/<user> | tail -1
# ends in /sponsors/<user> only when the profile exists
```

## 3. Patents

- Free licenses grant only the contributors' own patents (Apache-2.0 §3);
  third-party patents are untouched.
- Hotspots: video/audio codecs (HEVC/H.265 — HEIC photos —, H.264, AAC).
  Find what *you* distribute: `grep -rn "hevc\|x265\|libde265\|h264" Dockerfile`,
  packages in the image (`apt-get install ffmpeg libde265…`). Calling the
  user's own installed tool is not distribution.
- Assess: patent pools charge on sales; free non-commercial distributors are
  rarely pursued, but injunction and costs remain possible. Offer the
  option (drop the codec / document it), do not decide for the owner.

## 4. Liability and EU rules

- A "no warranty" statement in the app (prominent once, and readable at any
  time) and on the website; a sentence at destructive actions.
- Re-check the non-commercial exemptions of the Product Liability Directive
  and the Cyber Resilience Act whenever monetization changes.

## 5. Website

- **Imprint**: present, linked from every page (footer) within two clicks,
  including archived/static sections. Content: name, postal address
  (not a P.O. box); responsible person for editorial content; email optional
  for a non-commercial site.
- **Privacy notice** — verify each sentence against the server:

  ```bash
  ssh <host> 'cat /etc/caddy/Caddyfile'                 # log { output … roll_* }
  ssh <host> 'ls -la --time-style=long-iso /var/log/caddy/'   # oldest rolled file?
  ssh <host> 'crontab -l; ls /etc/cron.d; systemctl list-timers --all'
  ssh <host> 'head -c 600 /var/log/caddy/access-anon.jsonl'   # what is really kept
  ```

  Retention: a size-only roll (`roll_size`) keeps a file until the next roll;
  `roll_keep_for` acts only at a roll. Use a time roll (Caddy `roll_at`; check that your version has it)
  so "deleted after N days" is true.
- Third-party loads: the CSP header (`default-src 'none'` + `'self'` lists),
  fonts self-hosted, no embeds. Redirects to third parties (e.g. an install
  URL to GitHub) belong in the notice.
- Browser storage: cookies/localStorage only for what the visitor set
  (theme) is exempt from consent; say so.
- Processor agreement (AVV/DPA) with the host; the notice names the host.
- Before changing a live server config: `diff <(git show HEAD:<file>) <(ssh <host> cat <live file>)`.

## 6. Software privacy

```bash
# Go
grep -rn 'http\.Get\|http\.Post\|NewRequest\|client\.Do' --include='*.go' . | grep -v _test
grep -rn 'exec\.Command\(Context\)\?(.*"\(ssh\|rsync\|curl\|wget\|scp\)"' --include='*.go' .
# JS
grep -rhoE "https?://[a-z0-9.-]+\.[a-z]{2,}[^'\"\` )]*" --include='*.js' . | sort -u
```

For each: when it fires, what it sends, to whom. The app states this in a
page of its own, including "no telemetry / no update check" when true; a
project rule asks every new request to be added there. Map tiles reveal the
area shown — near where the user's photos or data are.

## 7. Marks and people

- Third-party names used descriptively (camera models, film simulations,
  "works with Lightroom") are fine; their logos are not.
- Recognisable people in screenshots, demo media, promo videos: consent
  (children: parents). Sample media: who took it, under which license — a
  repo license covers committed photos unless a separate note says otherwise.
- Own product name: suggest a DPMA/EUIPO search before investing in it.
