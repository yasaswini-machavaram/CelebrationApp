# Project Rules – CelebrationApp

1. **Manual browser testing**: Do NOT use browser subagent for lengthy form-filling or UI testing. Leave that to the user for manual testing. Focus on writing code and fixing issues.
2. **Speed over perfection**: Don't take too much time on browser screenshots. If you need visual input, ask the user — they will provide it manually.
3. **Be fast**: Prioritize speed. Keep browser subagent usage minimal and focused. Use `read_url_content` for page analysis instead of slow browser scrolling when possible.
