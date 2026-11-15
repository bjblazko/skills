# Dependencies and licenses

Run before adding, upgrading or replacing any library/framework.

## 1. Need
Is it trivial with the stdlib or existing dependencies? Prefer that. Name the reason for each new dependency.

## 2. Project license
Find it: `LICENSE*`, `package.json` `license`, `go.mod`/repo, `pom.xml` `<licenses>`, Gradle config, SPDX headers.
Unclear or absent: **ask the user** which license applies (or that it is proprietary/internal), then record the answer (e.g. in project CLAUDE.md). Do not assume.

## 3. Compatibility
Derive allowed dependency licenses from the project license:
- Permissive (MIT, BSD, ISC, Apache-2.0): compatible with nearly everything.
- Weak copyleft (LGPL, MPL-2.0, EPL): depends on linking/distribution; ask if the project is proprietary or distributed.
- Strong copyleft (GPL, AGPL): only for projects under compatible copyleft; otherwise ask/reject.
- Proprietary project: avoid GPL/AGPL/SSPL; ask for LGPL/MPL.
- No license, unknown, "source available" (BSL, SSPL, Commons Clause): always ask.
Also check transitive dependencies with the license tools in the tools files. This is engineering guidance, not legal advice; say so when a case is borderline.

## 4. Obsolescence
- Registry metadata: last release date, deprecated flag, archived repo, open maintainer issues (`npm view`, `go list -m -u`, Maven Central, `gh repo view`).
- Context7 (MCP): resolve the library id, query current docs for deprecations, migration guides and recommended successors.
- Flag: no release for >2 years, deprecated/archived, EOL runtime/framework version, superseded by stdlib.
- Report alternatives with trade-offs; ask when more than one is viable.

## 5. Security
`osv-scanner`, `govulncheck`, `npm audit`, OWASP dependency-check. Report known CVEs for the chosen version.

## 6. Upgrading
- **Find everything that is a dependency**, not only the manifest: the language runtime and toolchain (a stdlib CVE is fixed only by a newer Go/Node/JDK; raise the version the build reads, e.g. `go` in `go.mod`, `.nvmrc`), vendored files (a `vendor/` or `lib/` folder with a version in its name or header), test tooling (Playwright, browsers), base images.
- **List what is behind**: `go list -m -u all`, `npm outdated`, the registry's latest version for each vendored file.
- **Read the release notes of every version between the old and the new one** before upgrading — GitHub releases (`gh release view <tag> -R <owner/repo>`), `CHANGELOG.md` in the repository (the published package may not carry it), the project's site. Look for breaking changes, changed defaults, removed files, and changes to behaviour the code relies on (file layout of a vendored build, URLs with new query strings, stricter parsing).
- **Pinned companions**: some libraries require an exact version of another (a transpiled C library and its libc); keep them as the release notes say.
- **Upgrade, then prove it**: build, run the full tests, and fix what the notes predicted. A test that only breaks on the new version is updated with the reason, not loosened blindly.
- **Report** per dependency: old → new, what the notes say that matters here, what changed in the code.

## Fallbacks
- Library cannot be resolved (typo, placeholder, private): ask for the exact name/source; do not guess.
- Context7 unavailable or has no entry: use registry metadata and the project's own docs/changelog, and say the docs check was limited.
- Vulnerability scanners cannot scan a module before it is in the manifest: check the registry advisory page or scan a scratch copy, and rescan after adding.

## Output
Short table per dependency: name, version, license, compatible?, last release, deprecated?, CVEs, verdict + open questions.
