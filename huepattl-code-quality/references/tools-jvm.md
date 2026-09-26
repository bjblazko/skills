# Kotlin / Java

Detect build tool (`gradlew`, `pom.xml`) and use the project's wrapper and existing plugin config. Ask before adding plugins.

- Kotlin: `./gradlew detekt ktlintCheck` (rules `LongMethod`, `CyclomaticComplexMethod`, `LongParameterList`, `NestedBlockDepth`)
- Java: `./gradlew checkstyleMain pmdMain spotbugsMain` or `mvn checkstyle:check pmd:check spotbugs:check`
- Duplicates: `pmd cpd --minimum-tokens 100 --dir src` or jscpd
- Architecture/layering: ArchUnit tests (domain packages must not depend on each other cyclically); `jdeps`
- Outdated: `./gradlew dependencyUpdates` (ben-manes plugin), `mvn versions:display-dependency-updates`
- Vulns: `osv-scanner`, OWASP `dependency-check`
- Licenses: `./gradlew generateLicenseReport` (license plugin), `mvn license:aggregate-third-party-report`
- Tests: `./gradlew test` / `mvn test`
- LSP: kotlin-language-server / jdtls for references and rename
