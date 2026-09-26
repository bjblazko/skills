# Go

Prefer the project's `.golangci.yml`. Check tools with `command -v`; ask before installing.

- Format/vet: `gofmt -l .`, `go vet ./...`
- Lint bundle: `golangci-lint run ./...` (enable `funlen`, `gocyclo`, `gocognit`, `dupl`, `unused`, `revive` if no config exists; propose, don't write config unasked)
- Vulnerabilities: `govulncheck ./...`
- Outdated modules: `go list -u -m all`; unused: `go mod tidy -diff`
- Import cycles/structure: `go list -deps ./...`, `go vet`; packages by domain, avoid `util`/`common`
- Licenses: `go-licenses report ./...`
- Tests: `go test ./...`

## No-install fallback
- Function length + cyclomatic complexity: `go -C ~/.claude/skills/huepattl-code-quality/scripts/gofuncmetrics run . <abs-src-dir> | sort -rn | head` (stdlib AST, exact; columns: lines, cyclomatic, file:line, name). Keep the output as the baseline file.
- Per-function coverage (where a refactoring has no safety net): `go test -coverprofile=cov.out ./pkg/ && go tool cover -func=cov.out`.

## Moving code between files
- After a move, prune imports with `go build -gcflags=-e ./pkg/` — without `-e` the compiler stops at 10 errors and hides the rest.
- Keep the stdlib / module import groups; flattening them makes gofmt merge both into one group.
- A moved file that needs no imports is left with an empty `import ()` block; delete it.
- To find where a split cuts, a file-level dependency graph (which file uses which top-level declaration, from `go/ast`) shows the clusters and the few knots to untie before moving code into packages.

## Moving code into a new package
Proven order, each step buildable and committed:
1. Untie knots first: a function that needs the other side's types moves to the side it serves.
2. Export in place with `gopls rename -w file.go:line:col NewName` (gopls may sit in `~/go/bin`, not on PATH), keeping names unique so the next step can qualify them mechanically.
3. `git mv` the files and their tests, change the package clause, qualify uses as `pkg.Name` (regex that skips `.Name` and composite keys), add the import, prune with `go vet` (it compiles tests; `go build` does not).
4. Remove stutter with gopls inside the new package (`site.SiteAlbum` → `site.Album`); gopls does not touch comments, so grep for the old names afterwards.
5. Count `func Test` before and after; the number must match and all must run.
Mixed test files split by section; a helper both sides need is copied, not exported from non-test code.

