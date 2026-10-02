# Ball Game Classroom ⚽📚

**Ball Game Classroom** is a free, open-source, offline-first browser game for teachers who want to turn classroom questions into a fast team activity without requiring student accounts.

It is designed around a simple teaching flow: prepare a question bank → create teams → pass the virtual ball → ask the selected team → reveal the expected answer → award points → export the session results.

## Why this project exists

Many classroom quiz tools assume reliable internet, individual student devices, or paid accounts. Ball Game Classroom is intentionally lightweight: one teacher device and a browser are enough. Question banks and game progress stay on the local device by default.

The project is especially interested in multilingual classroom use. The interface currently supports **English, Bahasa Melayu and Tamil**, and question banks can contain Unicode text from any language.

## Features

- 🎓 Teacher-led team quiz workflow
- ⚽ Randomised “pass the ball” team selection that avoids immediately repeating the previous team
- 🧠 Custom question bank with subject and difficulty metadata
- 🌏 English, Bahasa Melayu and Tamil interface options
- ⏱️ Optional 15–60 second question timer
- 🔥 Optional streak-based bonus scoring
- 💾 Local persistence with no account required
- 📥 JSON question-bank import and export
- 📊 CSV session results export
- 📴 Progressive Web App service worker for offline use after first load
- ⌨️ Keyboard controls for classroom presentation
- ♿ Semantic HTML, focus states and reduced-motion support
- 🧪 Automated unit tests for core game logic
- 🚀 GitHub Pages deployment workflow

## Quick start

Because this is a static web app, there is no build step.

```bash
git clone https://github.com/rubanmannathan-ops/ball-game.git
cd ball-game
python -m http.server 8000
```

Then open `http://localhost:8000`.

For tests:

```bash
npm test
```

For syntax checks plus tests:

```bash
npm run verify
```

## Classroom workflow

1. Enter a class/session name.
2. Choose 2–4 teams and edit their names.
3. Add questions manually, load the demo bank, or import a JSON question bank.
4. Choose timer and scoring settings.
5. Start the game.
6. Press the ball (or Space) to select the next team.
7. Ask the displayed question and optionally reveal the expected answer.
8. Mark the response correct or incorrect.
9. At the end, export a CSV summary for reflection or formative assessment records.

## Question-bank JSON format

```json
{
  "format": "ball-game-classroom/questions-v1",
  "questions": [
    {
      "question": "What is 3/4 as a decimal?",
      "answer": "0.75",
      "subject": "Mathematics",
      "difficulty": "easy"
    }
  ]
}
```

A sample file is available at `data/sample-questions.json`.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| Space | Pass the ball / choose the next team |
| R | Reveal expected answer |
| C | Mark correct |
| X | Mark incorrect |

## Privacy

The application does not require an account and does not send question banks, team names, or session results to a server. Data is stored locally in the browser unless the teacher explicitly exports a file.

If future contributors add cloud or AI integrations, those features should be optional and clearly document what data leaves the device.

## Project structure

```text
ball-game/
├─ index.html
├─ styles.css
├─ manifest.webmanifest
├─ sw.js
├─ src/
│  ├─ app.js
│  ├─ game-core.js
│  └─ sample-data.js
├─ data/
│  └─ sample-questions.json
├─ tests/
│  └─ game-core.test.js
└─ .github/
   ├─ workflows/
   └─ ISSUE_TEMPLATE/
```

## Roadmap

The project roadmap intentionally focuses on real classroom usefulness rather than feature count:

- [ ] Teacher-created reusable question-bank library
- [ ] Optional image questions stored locally
- [ ] More interface languages and community translation files
- [ ] Accessibility audit using WCAG-oriented checks
- [ ] Configurable scoring modes for different teaching strategies
- [ ] Anonymous classroom analytics that work locally
- [ ] Optional AI-assisted question drafting with explicit teacher review
- [ ] Installable mobile-friendly PWA improvements

See [`ROADMAP.md`](ROADMAP.md) for milestones.

## Contributing

Contributions from teachers, student teachers, developers, translators and accessibility testers are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request.

Good first contributions include translations, accessibility improvements, documentation examples and new tests.

## Maintainer

Maintained by [@rubanmannathan-ops](https://github.com/rubanmannathan-ops).

## License

This repository includes a short permissive project license in [`LICENSE`](LICENSE). Please preserve the copyright and permission notice when redistributing modified versions.
