# Refactoring mode

1. **Scope**: confirm what is to be refactored. No repo-wide changes unasked.
2. **Safety net**: run existing tests; must be green. Check coverage per function you will touch, not per package. No tests: ask whether to add characterization tests first or proceed at own risk. A characterization test must pass against the old code too: swap the old file back in (`git show HEAD:<path> > <path>`), run, restore. Only then does it pin behaviour. Also break the code on purpose once (flip a comparison) and check that a test fails: tests that cannot fail pin nothing.
   - A characterization test that surprises you has found a quirk, often a bug. Pin the current behaviour with a comment saying so, keep refactoring, and report the quirk separately as a proposed fix.
   - When a shared helper would add error handling a copy lacked (e.g. `rows.Err()`), land that as its own `fix` commit first; the refactoring after it stays behaviour-preserving.
3. **Baseline**: measure touched code (lizard/linters from the tools files): function length, complexity, duplicates, cycles. Keep the numbers.
4. **Small steps**: one behavior-preserving change at a time (extract function, rename, move to domain package, replace conditional, remove duplication). Use LSP find-references/rename for cross-file changes. Run tests after each step.
5. **No mixing**: no feature or bugfix changes inside a refactoring step.
   - Prove a pure move (splitting a file): the sorted multiset of non-import code lines before and after must be identical.
   - Before merging near-duplicates into one helper, compare their failure paths (an error returned in one copy, ignored in the other). A difference is a behaviour change: keep both, report it as a question.
6. **Compare**: rerun measurements; report before/after and remaining violations as questions.
7. **Deviations**: where a threshold cannot reasonably be met, state why and ask instead of forcing it.
