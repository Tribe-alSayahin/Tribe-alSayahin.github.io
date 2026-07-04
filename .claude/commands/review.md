# /review

Run local quality gates before pushing.

## Checks
- YAML lint for workflow files
- GitHub workflow schema validation
- Python syntax checks in skill directories
- Markdown link validation
- Optional dependency security audit

## Exit Criteria
- All mandatory checks pass
- Any failures include file-level diagnostics
