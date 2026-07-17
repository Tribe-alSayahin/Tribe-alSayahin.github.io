```markdown
# Tribe-alSayahin.github.io Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides guidance for contributing to the `Tribe-alSayahin.github.io` repository, a TypeScript-based project with no detected framework. It covers the project's coding conventions, file organization, testing patterns, and typical workflows to ensure consistency and maintainability.

## Coding Conventions

### File Naming
- Use **camelCase** for all file and directory names.
  - Example: `userProfile.ts`, `dataFetcher.ts`

### Import Style
- Use **relative imports** for referencing modules within the project.
  - Example:
    ```typescript
    import { fetchData } from './dataFetcher';
    ```

### Export Style
- Both **named** and **default exports** are used.
  - Named export example:
    ```typescript
    export function getUser() { ... }
    ```
  - Default export example:
    ```typescript
    export default App;
    ```

### Commit Messages
- Freeform style, no strict prefixes.
- Average commit message length: ~42 characters.
  - Example: `fix user profile loading bug`

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new feature or module  
**Command:** `/add-feature`

1. Create a new TypeScript file using camelCase naming.
2. Implement the feature using relative imports for dependencies.
3. Export your module (named or default as appropriate).
4. Add or update corresponding test files (`*.test.ts`).
5. Commit changes with a clear, concise message.
6. Open a pull request for review.

### Bug Fixing
**Trigger:** When fixing a bug in the codebase  
**Command:** `/fix-bug`

1. Identify the bug and locate the relevant code.
2. Make necessary code changes, following coding conventions.
3. Update or add tests to cover the bug fix.
4. Commit with a descriptive message (e.g., `fix login redirect issue`).
5. Open a pull request for review.

### Running Tests
**Trigger:** To verify code correctness before pushing or merging  
**Command:** `/run-tests`

1. Locate test files matching the `*.test.*` pattern.
2. Use the project's test runner (framework unknown; check project docs or scripts).
3. Ensure all tests pass before merging changes.

## Testing Patterns

- Test files follow the `*.test.*` naming convention (e.g., `userProfile.test.ts`).
- The testing framework is not specified; check for scripts or documentation for running tests.
- Place tests alongside the modules they test or in a dedicated `tests` directory if present.

#### Example Test File
```typescript
// userProfile.test.ts
import { getUser } from './userProfile';

test('should return user data', () => {
  expect(getUser(1)).toEqual({ id: 1, name: 'Alice' });
});
```

## Commands
| Command        | Purpose                                   |
|----------------|-------------------------------------------|
| /add-feature   | Start the process for adding a new feature|
| /fix-bug       | Begin a bug fix workflow                  |
| /run-tests     | Run all tests in the codebase             |
```
