# /git:pr

Create a pull request from the current branch.

## Usage
- `/git:pr` → target `main`
- `/git:pr dev` → target `dev`

## Workflow
1. Confirm latest checks are green.
2. Build PR title/body from template.
3. Attach relevant labels.
4. Return PR link.

## Output
- PR URL
- Base and head branches
- Applied labels
