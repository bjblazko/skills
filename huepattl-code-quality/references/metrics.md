# Default thresholds (guidelines, not gates)

| Metric | Default |
|---|---|
| Function/method length | ~30 lines |
| Cyclomatic complexity | <= 10 |
| Cognitive complexity | <= 15 |
| Parameters | <= 4 |
| Nesting depth | <= 3 |
| Class/type length | ~300 lines, <= ~15 public methods |
| File length | ~400 lines |

On exceeding: report the number, propose a concrete split, ask whether to refactor or deviate. Generated code, tests with table data, and declarative config may exceed; say so instead of silently skipping.

## Precedence
1. Thresholds in project config (eslint `complexity`/`max-lines-per-function`, golangci `gocyclo`/`funlen`, detekt `LongMethod`/`CyclomaticComplexMethod`, checkstyle, clang-tidy `readability-function-size`, ...).
2. Documented project conventions (CLAUDE.md, CONTRIBUTING).
3. These defaults.

If the project config is looser than these defaults, follow the project and mention the difference once.
