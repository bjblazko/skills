# C / C++

Prefer the project's `.clang-tidy`, `.clang-format`, CMake presets. Ask before installing tools.

- Static analysis: `clang-tidy -p build <files>` (checks: `readability-function-size`, `readability-function-cognitive-complexity`, `bugprone-*`, `modernize-*`)
- `cppcheck --enable=warning,style,performance --project=build/compile_commands.json`
- Format: `clang-format --dry-run -Werror <files>`
- Complexity: `lizard -C 10 -L 30 <paths>`
- Duplicates: `jscpd` or `pmd cpd --language cpp`
- Runtime checks in tests: build with `-Wall -Wextra -Wpedantic` and ASan/UBSan
- Deps: check vcpkg/conan/CMake FetchContent versions and licenses manually + `osv-scanner`
- LSP: clangd with `compile_commands.json`
- Module boundaries: one directory per module, public header separate from internals
