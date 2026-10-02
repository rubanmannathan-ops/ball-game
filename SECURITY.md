# Security Policy

Ball Game Classroom is a client-side application. It does not intentionally transmit classroom data to a backend.

## Reporting a vulnerability

Please do not publish an exploit that could expose classroom information before the maintainer has had a reasonable opportunity to review it. Use GitHub's private vulnerability reporting feature if enabled for this repository.

Useful reports include the affected file/version, steps to reproduce, impact and a suggested fix if you have one.

## Security priorities

- Keep core gameplay usable without accounts.
- Treat imported files as untrusted input.
- Avoid rendering user-entered text as executable HTML.
- Do not introduce third-party tracking scripts.
- Keep dependencies minimal.
