# Security review

Run on request, before a release, and whenever code takes input from a person,
a file, the network or another program. Check the touched code; for a full
review, the whole application. Report findings with file and line, how it is
exploited (one sentence), severity and the fix. Measure what tools can find,
then read what they cannot.

Sources: OWASP Top 10 (2025: A01 Broken Access Control, A02 Security
Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic
Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08
Software or Data Integrity Failures, A09 Logging and Alerting Failures, A10
Mishandling of Exceptional Conditions), OWASP ASVS for depth, CWE Top 25 for
naming findings.

## 1. Tools first, then triage

| Language | Commands |
|---|---|
| Go | `govulncheck ./...` (reachable CVEs, stdlib included); `golangci-lint run --enable-only gosec --max-issues-per-linter 0 --max-same-issues 0 ./...` |
| JS/npm | `npm audit`; `npx osv-scanner -r .` |
| Any | `gitleaks dir <path>` (secrets); `semgrep --config auto` when installed |

Ask before installing a tool. Group gosec output by rule (`sed -E 's/.*: (G[0-9]+).*/\1/' | sort | uniq -c`), leave tests out, and read every G2xx (SQL), G204 (subprocess), G203 (unescaped HTML), G7xx (taint: path traversal, SSRF, XSS, log injection), G112/G114 (timeouts). Most G104 (unchecked errors), G301–G306 (file modes) and G304 (file from a variable, already guarded) are noise; say so in one line rather than listing them.

## 2. What tools miss — read for these

**Injection (A05)**
- **HTML**: list every sink — `innerHTML`, `insertAdjacentHTML`, `outerHTML`, d3/jQuery `.html()`, tooltips, template literals put into them. Every value from a file, a name, EXIF/XMP, a server error message or a URL is escaped there; constants and numbers need not be. A scanner over `${…}` in HTML-bearing template literals, filtered to names that carry user data (name, title, label, path, message, error, value), finds the candidates; read each one.
- **One escape helper** for the whole UI. It escapes `& < > " '` — without the single quote, an attribute in single quotes (`onerror="…'${x}'"`) breaks out. Local copies that miss quotes are findings.
- **Translation and templates**: `t('… {name} …', { name })` puts the value in raw; the caller escapes it when the result goes into HTML.
- **SQL**: values only through placeholders; table/column names only from an allowlist or constants; `LIKE` patterns escaped (`ESCAPE '\'`).
- **Program arguments**: a configured or typed value that becomes an argument of `ssh`, `rsync`, `git`, `ffmpeg`, `curl` is read as an option when it starts with `-` (`-oProxyCommand=…` runs a command). Validate against what the value can be (host name, user name), reject a leading `-` and whitespace, never build a shell string; quote with single quotes for a remote shell; check options passed as one string (`rsync -e "ssh -i <file>"` splits on spaces).
- **Paths**: resolve symlinks before the prefix check, compare with a trailing separator, refuse anything outside the root.

**Access control and requests from elsewhere (A01, A07)**
- A server on `localhost` without login is reachable by every page the user opens: a cross-site `POST` (form, `fetch` with `mode: 'no-cors'`, `text/plain` body) runs without a preflight (CSRF). Refuse cross-origin unsafe methods (`Sec-Fetch-Site`/`Origin`; Go: `http.NewCrossOriginProtection()`), and make sure no `GET` changes anything.
- DNS rebinding: an attacker's name resolving to `127.0.0.1` makes their page same-origin. When the server listens only on loopback, answer only to loopback host names (`Host` header).
- Serving files the user did not write (a photo folder, uploads): a `.html` or `.svg` served from the app's origin is stored XSS. Serve only the expected types inline; everything else as `Content-Disposition: attachment`; always `X-Content-Type-Options: nosniff`.

**Misconfiguration (A02)**
- Security headers on every response: a Content-Security-Policy that names the hosts the app really uses (`connect-src`, `img-src`, `worker-src blob:` for map/WebGL workers), `frame-ancestors`, `nosniff`, `Referrer-Policy`. Inline scripts or handlers force `'unsafe-inline'` — note it as debt rather than skipping the CSP.
- Server timeouts: `ReadHeaderTimeout` against slow clients; no write timeout where streams (SSE) stay open.

**Supply chain and integrity (A03, A08)**
- Downloads the app makes at run time: pinned versions and checksums verified before use.
- Vendored libraries and the language runtime count as dependencies (see dependencies-licenses.md, Upgrading).

**Exceptional conditions and logging (A09, A10)**
- An operation that fails for every item must not report success or go on (an empty build uploaded over a good one). Partial failure is shown as such, with the reasons.
- Double submission: a second click or a repeating key while an operation runs must not start it again (an in-flight guard, `e.repeat`).
- Errors shown to people say what happened and what to do, without stack traces; logs carry no secrets.

## 3. Verify the fix

Each fix gets a test that fails without it: a cross-site request refused, a dangerous file name rendered as text, an argument with a leading `-` rejected, a missing file reported instead of an empty result. Re-run the tools and show the numbers before and after.

## Output

One table, most severe first: OWASP category · finding · evidence (file:line, command output) · severity · fix · test. Then what was checked and found clean, in one line each, so the reader knows the scope.
