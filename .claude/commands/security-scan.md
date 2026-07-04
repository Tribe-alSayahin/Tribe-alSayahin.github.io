# /security-scan

Run security validation for secrets and vulnerable dependencies.

## Checks
- Gitleaks for committed secret detection
- Safety for Python dependency vulnerabilities

## Exit Criteria
- No exposed secrets
- No untriaged high/critical dependency findings
