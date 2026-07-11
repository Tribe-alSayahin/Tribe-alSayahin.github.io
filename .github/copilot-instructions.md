# Copilot instructions

- Use one tool call per assistant message.
- Do not use parallel or batched tool wrappers.
- If a task needs several checks, run them sequentially.
- Start with a short plan, then make the first tool call.
- For repository verification, use `npm install`, `npm run lint`, and `npm run build:pages`.
