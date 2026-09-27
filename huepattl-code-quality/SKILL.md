---
name: huepattl-code-quality
description: Use when writing, changing, refactoring or reviewing code in any language (Go, JS/TS, HTML, CSS, Kotlin, Java, C, C++, others), and whenever adding, upgrading or replacing a library/framework/dependency. Ensures short functions, domain-first structure, no redundancy, non-obsolete and license-compatible dependencies, measured with CLI tools and LSP. Asks instead of assuming.
---

# Code Quality

Measure, don't guess. Ask, don't assume. Touch only what the task touches.

## Core rules

1. **Ask when unclear.** Unknown project license, missing tests before a refactoring, a tool that would need installing, several valid designs: use AskUserQuestion. Never silently assume or install.
2. **Project config wins.** Existing lint/quality configs (eslint, golangci, detekt, checkstyle, clang-tidy, .editorconfig ...) and documented conventions override the defaults below.
3. **Guideline + question.** Defaults in `references/metrics.md` (e.g. function ~30 lines, cyclomatic <=10). On exceeding: report it and ask whether to refactor or deviate deliberately. Do not silently rewrite unrelated code.
4. **Scope discipline.** Check and change only touched files/modules (plus their tests, read-only for context). No repo-wide refactoring unasked.
5. **Never install silently.** A missing tool: name it, ask, and use the manual fallback meanwhile.
6. **Batch questions.** Group independent questions into one AskUserQuestion call; ask dependent ones in sequence.
7. **Combined tasks.** Refactoring plus a new dependency: refactor first, add the dependency as a separate step.

## Workflow

1. **Detect context**: languages, build tool, existing quality configs, test setup, project license (see `references/dependencies-licenses.md`). Unclear license: ask, then record the answer (e.g. in the project CLAUDE.md).
2. **Pick mode**: new code (apply rules while writing) or refactoring (`references/refactoring.md`: baseline, small steps, before/after metrics).
3. **Check** touched code with available CLI tools (`references/tools-<lang>.md`). Use the LSP tool for diagnostics, references and safe renames. If a tool is missing: name it, offer to install, fall back to manual review meanwhile.
4. **Dependencies**: before adding or upgrading any, run the obsolescence + license + vulnerability check. Use Context7 for current docs/deprecations. Name alternatives.
5. **Report**: findings by severity, each violation as a question or proposal, with numbers (before/after where refactored).

## What to enforce

- Short, single-purpose functions; low nesting; few parameters.
- **Short classes and files.** Split a class/file that grows very long along its responsibilities (by domain concept, not arbitrary halves); propose the split and ask before doing it. Do not let new code push an already-large file further; put it in a new cohesive unit instead.
- **Domain-first structure**: package/folder by business capability (`billing/`, `orders/`), not by technical layer (`controllers/`, `utils/`). Details: `references/principles.md`.
- No redundancy: duplicate detection; extract on the third repetition, not the second. No premature abstraction.
- **YAGNI for interfaces**: create an interface only when more than one implementation concretely exists; test doubles do not count. Details: `references/principles.md`.
- Smell checklist (god class, feature envy, primitive obsession, magic numbers, boolean flags, dead code) in `references/principles.md`.
- Dependencies: maintained, non-deprecated, license-compatible, no known CVEs, actually needed (prefer stdlib if trivial).
- Security basics: secrets scan, vulnerable dependencies.

## References (load only what is needed)

| File | When |
|---|---|
| `references/principles.md` | structure, smells, redundancy |
| `references/metrics.md` | thresholds and overriding via project config |
| `references/tools-go.md`, `tools-js-ts.md`, `tools-web.md`, `tools-jvm.md`, `tools-c-cpp.md`, `tools-generic.md` | CLI commands per language; generic for any other language |
| `references/dependencies-licenses.md` | adding/upgrading dependencies, license policy |
| `references/refactoring.md` | refactoring mode |

UI look and feel of HTML/CSS is out of scope here; `huepattl-rams-design` applies.

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
