# Language-neutral CLI tools

Check availability with `command -v <tool>` first. If missing, name it and ask before installing.

| Purpose | Tool | Example |
|---|---|---|
| Complexity, length, params (30+ languages) | lizard | `lizard -C 10 -L 30 -a 4 <paths>` |
| Duplicate code | jscpd | `npx jscpd --min-lines 6 <paths>` |
| Size overview | scc | `scc --by-file <paths>` |
| Static rules | semgrep | `semgrep --config auto <paths>` |
| Secrets | gitleaks | `gitleaks detect --no-git -s <path>` |
| Vulnerable deps | osv-scanner | `osv-scanner -r .` |
| Licenses | scancode-toolkit | `scancode -l <path>` |

Unknown language: use lizard + jscpd + semgrep, check LSP availability, and ask which linter the project uses.

LSP: use the LSP tool for diagnostics, find-references, rename and go-to-definition before manual edits across files.
