# Principles

## Domain-first structure
- Organize by business capability, then by technical role inside it:
  `orders/{handler,service,repo}` rather than `handlers/orders`, `services/orders`.
- Go: package per domain concept, no `utils`/`common`/`helpers` dumping grounds. JVM: `com.acme.billing.*`, not `com.acme.service.*`. JS/TS: feature folders. C/C++: module directories with own public header.
- Dependencies point inward/downward; no cycles between domains. Check with dependency tools (see tools files).
- Existing project layout is technical? Do not reorganize unasked; follow it for new code and ask if a move is worthwhile.

## Cohesion and size
- A function does one thing at one abstraction level. Name it by that thing.
- Prefer early returns over deep nesting; extract named helpers over comments.
- A file/class with several unrelated reasons to change: split by responsibility.
- **Splitting long classes/files**: find the clusters (methods sharing the same fields, or the same domain concept) and extract each into its own class/file named after that concept (e.g. `OrderPricing`, `OrderValidation` out of `OrderService`). Keep the public API stable via delegation or re-export first, then migrate callers. Never split by line count alone (`Part1`, `Helpers`, `Utils`).
- Do not add to an already-oversized file; create a new cohesive unit for the new code and propose splitting the old one.
- Language notes: Go: split by file within the package (a package split is a design decision, ask); JVM/Kotlin: one top-level type per file; JS/TS: one module per concept; CSS: partials per component; C/C++: header/implementation pair per module.

## Redundancy
- Detect with a duplicate finder. Extract on the third occurrence (rule of three).
- Duplication that is coincidental (same shape, different reason to change) stays.
- Do not merge into flag-heavy generic functions; that trades redundancy for complexity.

## Smell checklist
- God class / long file
- Feature envy (method mostly uses another object's data)
- Primitive obsession (raw strings/ints for domain concepts)
- Magic numbers and strings
- Boolean flag parameters
- Long parameter lists (>4): introduce a parameter object
- Dead code, unused dependencies, commented-out code
- Swallowed errors, overly broad catch
- Global mutable state
