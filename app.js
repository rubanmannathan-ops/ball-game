import {
  normalizeQuestion,
  validateQuestionBank,
  shuffleArray,
  pickRandomTeam,
  calculatePoints,
  computeLeaderboard,
  sessionToCSV,
  createId
} from "./game-core.js";
import { SAMPLE_QUESTIONS } from "./sample-data.js";

const STORAGE_KEY = "ballGameClassroom:v1";
const SESSION_KEY = "ballGameClassroom:activeSession:v1";

const translations = {
  en: {
    tagline: "A fast, inclusive classroom quiz game.",
    language: "Language",
    online: "Online", offline: "Offline ready",
    setupTitle: "Create a classroom game in minutes",
    setupDescription: "Add questions, choose teams, and run a fair turn-based quiz from any browser.",
    gameSettings: "Game settings", className: "Class / session name", teamCount: "Number of teams",
    timer: "Seconds per question", points: "Points for correct answer", shuffle: "Shuffle questions", streak: "Enable streak bonus",
    questionBank: "Question bank", question: "Question", answer: "Answer / teacher note", subject: "Subject", difficulty: "Difficulty",
    addQuestion: "Add question", loadDemo: "Load demo questions", importJson: "Import JSON", exportJson: "Export JSON",
    privacyTitle: "Privacy by design", privacyCopy: "Game data stays in this browser unless you export it.", startGame: "Start game",
    saveProgress: "Save progress", endGame: "End game", passBall: "Pass the ball", chooseTeam: "Press the ball to choose a team.",
    reveal: "Reveal answer", correct: "✓ Correct", incorrect: "✕ Incorrect", activity: "Activity", noStreak: "No streak",
    expectedAnswer: "Expected answer", time: "Time", results: "Game results", downloadCsv: "Download session CSV", playAgain: "Play again", newSetup: "New setup",
    questions: "questions", questionWord: "Question", liveSession: "LIVE SESSION", sessionComplete: "SESSION COMPLETE",
    addAtLeast: "Add at least one complete question before starting.", demoLoaded: "Demo question bank loaded.", imported: "Question bank imported.", exported: "Question bank exported.",
    saved: "Progress saved on this device.", correctLog: "answered correctly", incorrectLog: "answered incorrectly", timeout: "Time is up! The teacher can still judge the answer.",
    streakLabel: "streak", team: "Team", readyQuestion: "Choose a team to reveal the question.",
    resultSummary: "completed the session", rank: "Rank", score: "Score", correctCount: "Correct", incorrectCount: "Incorrect", bestStreak: "Best streak"
  },
  ms: {
    tagline: "Permainan kuiz bilik darjah yang pantas dan inklusif.", language: "Bahasa", online: "Dalam talian", offline: "Sedia luar talian",
    setupTitle: "Cipta permainan bilik darjah dalam beberapa minit", setupDescription: "Tambah soalan, pilih pasukan dan jalankan kuiz giliran yang adil melalui pelayar.",
    gameSettings: "Tetapan permainan", className: "Nama kelas / sesi", teamCount: "Bilangan pasukan", timer: "Saat bagi setiap soalan", points: "Mata bagi jawapan betul",
    shuffle: "Rawakkan soalan", streak: "Aktifkan bonus berturut-turut", questionBank: "Bank soalan", question: "Soalan", answer: "Jawapan / nota guru", subject: "Subjek", difficulty: "Aras",
    addQuestion: "Tambah soalan", loadDemo: "Muat soalan demo", importJson: "Import JSON", exportJson: "Eksport JSON", privacyTitle: "Privasi melalui reka bentuk",
    privacyCopy: "Data permainan kekal dalam pelayar ini kecuali anda mengeksportnya.", startGame: "Mula permainan", saveProgress: "Simpan kemajuan", endGame: "Tamat permainan",
    passBall: "Hantar bola", chooseTeam: "Tekan bola untuk memilih pasukan.", reveal: "Tunjuk jawapan", correct: "✓ Betul", incorrect: "✕ Salah", activity: "Aktiviti", noStreak: "Tiada rentetan",
    expectedAnswer: "Jawapan dijangka", time: "Masa", results: "Keputusan permainan", downloadCsv: "Muat turun CSV sesi", playAgain: "Main semula", newSetup: "Tetapan baharu",
    questions: "soalan", questionWord: "Soalan", liveSession: "SESI LANGSUNG", sessionComplete: "SESI SELESAI", addAtLeast: "Tambah sekurang-kurangnya satu soalan lengkap sebelum bermula.",
    demoLoaded: "Bank soalan demo dimuatkan.", imported: "Bank soalan berjaya diimport.", exported: "Bank soalan dieksport.", saved: "Kemajuan disimpan pada peranti ini.",
    correctLog: "menjawab dengan betul", incorrectLog: "menjawab dengan salah", timeout: "Masa tamat! Guru masih boleh menilai jawapan.", streakLabel: "rentetan", team: "Pasukan",
    readyQuestion: "Pilih pasukan untuk memaparkan soalan.", resultSummary: "telah menyelesaikan sesi", rank: "Kedudukan", score: "Mata", correctCount: "Betul", incorrectCount: "Salah", bestStreak: "Rentetan terbaik"
  },
  ta: {
    tagline: "வேகமான, அனைவரையும் உள்ளடக்கும் வகுப்பறை வினாடி வினா விளையாட்டு.", language: "மொழி", online: "இணையத்தில்", offline: "இணையமின்றியும் தயார்",
    setupTitle: "சில நிமிடங்களில் வகுப்பறை விளையாட்டை உருவாக்குங்கள்", setupDescription: "வினாக்களைச் சேர்த்து, அணிகளைத் தேர்ந்தெடுத்து, எந்த உலாவியிலும் நியாயமான சுற்று வினாடி வினாவை நடத்துங்கள்.",
    gameSettings: "விளையாட்டு அமைப்புகள்", className: "வகுப்பு / அமர்வு பெயர்", teamCount: "அணிகளின் எண்ணிக்கை", timer: "ஒவ்வொரு வினாவிற்கான வினாடிகள்", points: "சரியான பதிலுக்கான புள்ளிகள்",
    shuffle: "வினாக்களை கலக்குக", streak: "தொடர் வெற்றி கூடுதல் புள்ளி", questionBank: "வினா வங்கி", question: "வினா", answer: "பதில் / ஆசிரியர் குறிப்பு", subject: "பாடம்", difficulty: "கடினநிலை",
    addQuestion: "வினா சேர்க்க", loadDemo: "மாதிரி வினாக்கள்", importJson: "JSON இறக்குமதி", exportJson: "JSON ஏற்றுமதி", privacyTitle: "தனியுரிமை மைய வடிவமைப்பு",
    privacyCopy: "நீங்கள் ஏற்றுமதி செய்யாத வரை விளையாட்டு தரவு இந்த உலாவியிலேயே இருக்கும்.", startGame: "விளையாட்டை தொடங்கு", saveProgress: "முன்னேற்றத்தை சேமி", endGame: "விளையாட்டை முடி",
    passBall: "பந்தை அனுப்பு", chooseTeam: "அடுத்த அணியைத் தேர்ந்தெடுக்க பந்தை அழுத்துங்கள்.", reveal: "பதிலை காட்டு", correct: "✓ சரி", incorrect: "✕ தவறு", activity: "செயற்பாடு", noStreak: "தொடர் இல்லை",
    expectedAnswer: "எதிர்பார்க்கப்படும் பதில்", time: "நேரம்", results: "விளையாட்டு முடிவுகள்", downloadCsv: "அமர்வு CSV பதிவிறக்கு", playAgain: "மீண்டும் விளையாடு", newSetup: "புதிய அமைப்பு",
    questions: "வினாக்கள்", questionWord: "வினா", liveSession: "நேரடி அமர்வு", sessionComplete: "அமர்வு நிறைவு", addAtLeast: "தொடங்குவதற்கு முன் குறைந்தது ஒரு முழுமையான வினாவைச் சேர்க்கவும்.",
    demoLoaded: "மாதிரி வினா வங்கி ஏற்றப்பட்டது.", imported: "வினா வங்கி இறக்குமதி செய்யப்பட்டது.", exported: "வினா வங்கி ஏற்றுமதி செய்யப்பட்டது.", saved: "முன்னேற்றம் இந்த சாதனத்தில் சேமிக்கப்பட்டது.",
    correctLog: "சரியாக பதிலளித்தது", incorrectLog: "தவறாக பதிலளித்தது", timeout: "நேரம் முடிந்தது! ஆசிரியர் இன்னும் பதிலை மதிப்பிடலாம்.", streakLabel: "தொடர்", team: "அணி",
    readyQuestion: "வினாவைக் காண ஒரு அணியைத் தேர்ந்தெடுக்கவும்.", resultSummary: "அமர்வை முடித்தது", rank: "நிலை", score: "புள்ளிகள்", correctCount: "சரி", incorrectCount: "தவறு", bestStreak: "சிறந்த தொடர்"
  }
};

const $ = id => document.getElementById(id);
const els = {
  setup: $("setup-screen"), game: $("game-screen"), results: $("results-screen"),
  lang: $("language-select"), network: $("network-badge"), teamCount: $("team-count"), teamNames: $("team-name-fields"),
  className: $("class-name"), timer: $("timer-seconds"), basePoints: $("base-points"), shuffle: $("shuffle-questions"), streakBonus: $("streak-bonus"),
  qInput: $("question-input"), aInput: $("answer-input"), subjectInput: $("subject-input"), difficultyInput: $("difficulty-input"),
  questionList: $("question-list"), questionCount: $("question-count"), fileInput: $("file-input"), toast: $("toast"),
  scoreboard: $("scoreboard"), gameTitle: $("game-title"), roundCounter: $("round-counter"), difficultyBadge: $("difficulty-badge"),
  ballButton: $("ball-button"), selectedTeam: $("selected-team"), timerValue: $("timer-value"), timerBar: $("timer-bar"),
  questionSubject: $("question-subject"), activeQuestion: $("active-question"), answerBox: $("answer-box"), activeAnswer: $("active-answer"),
  reveal: $("reveal-answer"), correct: $("mark-correct"), incorrect: $("mark-incorrect"), activityLog: $("activity-log"), streakDisplay: $("streak-display"),
  resultsSummary: $("results-summary"), podium: $("podium"), resultsTableWrap: $("results-table-wrap")
};

let app = loadSettings();
let session = null;
let timerHandle = null;
let editingQuestionId = null;

function t(key) { return translations[app.language]?.[key] ?? translations.en[key] ?? key; }
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      language: saved?.language || "en", questions: Array.isArray(saved?.questions) ? saved.questions.map(normalizeQuestion) : [],
      teamNames: saved?.teamNames || ["Team A", "Team B", "Team C", "Team D"]
    };
  } catch { return { language: "en", questions: [], teamNames: ["Team A", "Team B", "Team C", "Team D"] }; }
}
function persistSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ language: app.language, questions: app.questions, teamNames: app.teamNames }));
}
function showToast(message) {
  els.toast.textContent = message; els.toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}
function download(filename, content, type) {
  const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
function renderTeamFields() {
  const count = Number(els.teamCount.value);
  els.teamNames.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const label = document.createElement("label");
    label.innerHTML = `<span>${escapeHtml(t("team"))} ${i + 1}</span><input data-team-index="${i}" maxlength="30" value="${escapeHtml(app.teamNames[i] || `${t("team")} ${i + 1}`)}">`;
    els.teamNames.append(label);
  }
}
function captureTeamNames() {
  document.querySelectorAll("[data-team-index]").forEach(input => { app.teamNames[Number(input.dataset.teamIndex)] = input.value.trim() || `${t("team")} ${Number(input.dataset.teamIndex) + 1}`; });
  persistSettings();
}
function renderQuestions() {
  els.questionCount.textContent = `${app.questions.length} ${t("questions")}`;
  if (!app.questions.length) {
    els.questionList.innerHTML = `<div class="empty-state">${escapeHtml(t("addAtLeast"))}</div>`; return;
  }
  els.questionList.innerHTML = app.questions.map((q, index) => `
    <article class="question-item">
      <div>
        <h4>${index + 1}. ${escapeHtml(q.question)}</h4>
        <p>${escapeHtml(q.answer)}</p>
        <div class="question-item-meta"><span class="badge badge-soft">${escapeHtml(q.subject)}</span><span class="badge">${escapeHtml(q.difficulty)}</span></div>
      </div>
      <div>
        <button class="icon-btn" data-edit="${q.id}" title="Edit" aria-label="Edit question">✎</button>
        <button class="icon-btn" data-delete="${q.id}" title="Delete" aria-label="Delete question">×</button>
      </div>
    </article>`).join("");
}
function resetQuestionEditor() {
  editingQuestionId = null; els.qInput.value = ""; els.aInput.value = ""; els.subjectInput.value = ""; els.difficultyInput.value = "medium";
  $("add-question").textContent = t("addQuestion");
}
function addOrUpdateQuestion() {
  const candidate = normalizeQuestion({
    id: editingQuestionId || createId(), question: els.qInput.value, answer: els.aInput.value,
    subject: els.subjectInput.value || "General", difficulty: els.difficultyInput.value
  });
  if (!candidate.question || !candidate.answer) return showToast(t("addAtLeast"));
  if (editingQuestionId) app.questions = app.questions.map(q => q.id === editingQuestionId ? candidate : q);
  else app.questions.push(candidate);
  persistSettings(); renderQuestions(); resetQuestionEditor();
}
function editQuestion(id) {
  const q = app.questions.find(item => item.id === id); if (!q) return;
  editingQuestionId = id; els.qInput.value = q.question; els.aInput.value = q.answer; els.subjectInput.value = q.subject; els.difficultyInput.value = q.difficulty;
  $("add-question").textContent = "Save question"; els.qInput.focus();
}
function deleteQuestion(id) {
  app.questions = app.questions.filter(q => q.id !== id); persistSettings(); renderQuestions();
}
function loadDemo() {
  const ids = new Set(app.questions.map(q => `${q.question}|${q.answer}`));
  for (const raw of SAMPLE_QUESTIONS) {
    const q = normalizeQuestion(raw); if (!ids.has(`${q.question}|${q.answer}`)) app.questions.push(q);
  }
  persistSettings(); renderQuestions(); showToast(t("demoLoaded"));
}
function exportQuestions() {
  const payload = { format: "ball-game-classroom/questions-v1", exportedAt: new Date().toISOString(), questions: app.questions };
  download("ball-game-questions.json", JSON.stringify(payload, null, 2), "application/json"); showToast(t("exported"));
}
async function importQuestions(file) {
  try {
    const parsed = JSON.parse(await file.text()); const bank = Array.isArray(parsed) ? parsed : parsed.questions;
    const validation = validateQuestionBank(bank); if (!validation.valid) throw new Error(validation.errors.join(" "));
    app.questions = bank.map(normalizeQuestion); persistSettings(); renderQuestions(); showToast(t("imported"));
  } catch (error) { showToast(`Import failed: ${error.message}`); }
}
function buildSession() {
  captureTeamNames();
  const validation = validateQuestionBank(app.questions); if (!validation.valid) { showToast(validation.errors[0]); return null; }
  const teamCount = Number(els.teamCount.value);
  const questions = els.shuffle.checked ? shuffleArray(app.questions) : [...app.questions];
  return {
    id: createId("session"), className: els.className.value.trim() || "Classroom Game", language: app.language,
    settings: { timerSeconds: Number(els.timer.value), basePoints: Number(els.basePoints.value), streakBonus: els.streakBonus.checked },
    questions, index: 0, selectedTeamIndex: null, previousTeamIndex: null, currentState: "awaiting_team", startedAt: new Date().toISOString(), completedAt: null,
    teams: Array.from({ length: teamCount }, (_, i) => ({ name: app.teamNames[i] || `${t("team")} ${i + 1}`, score: 0, correct: 0, incorrect: 0, streak: 0, bestStreak: 0 })),
    history: []
  };
}
function startGame() {
  const built = buildSession(); if (!built) return; session = built; saveSession();
  els.setup.classList.add("hidden"); els.results.classList.add("hidden"); els.game.classList.remove("hidden"); renderGame(); window.scrollTo({ top: 0 });
}
function saveSession() {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
function renderScoreboard() {
  els.scoreboard.innerHTML = session.teams.map((team, i) => `
    <article class="score-card ${i === session.selectedTeamIndex ? "active" : ""}">
      <span>${escapeHtml(team.name)}</span><strong>${team.score}</strong><small>${team.correct} ✓ · ${team.incorrect} ✕</small>
    </article>`).join("");
}
function renderGame() {
  const q = session.questions[session.index];
  els.gameTitle.textContent = session.className;
  els.roundCounter.textContent = `${t("questionWord")} ${Math.min(session.index + 1, session.questions.length)} / ${session.questions.length}`;
  renderScoreboard(); renderActivity(); updateStreakBadge();
  if (!q) return finishGame();
  els.difficultyBadge.textContent = q.difficulty;
  els.questionSubject.textContent = q.subject;
  if (session.currentState === "awaiting_team") {
    els.activeQuestion.textContent = t("readyQuestion"); els.activeAnswer.textContent = ""; els.answerBox.classList.add("hidden");
    els.selectedTeam.textContent = t("chooseTeam"); setJudgeEnabled(false); els.ballButton.disabled = false; resetTimerDisplay();
  } else {
    els.activeQuestion.textContent = q.question; els.activeAnswer.textContent = q.answer;
    els.answerBox.classList.toggle("hidden", session.currentState !== "answer_revealed"); setJudgeEnabled(true); els.ballButton.disabled = true;
    const team = session.teams[session.selectedTeamIndex]; els.selectedTeam.textContent = `${team.name} — ${t("questionWord")} ${session.index + 1}`;
  }
}
function setJudgeEnabled(enabled) {
  els.reveal.disabled = !enabled; els.correct.disabled = !enabled; els.incorrect.disabled = !enabled;
}
function passBall() {
  if (!session || session.currentState !== "awaiting_team") return;
  els.ballButton.classList.add("spinning"); els.ballButton.disabled = true;
  setTimeout(() => {
    session.selectedTeamIndex = pickRandomTeam(session.teams.length, session.previousTeamIndex);
    session.previousTeamIndex = session.selectedTeamIndex; session.currentState = "question_active";
    els.ballButton.classList.remove("spinning"); logActivity(`${session.teams[session.selectedTeamIndex].name} received the ball.`);
    startTimer(); saveSession(); renderGame();
  }, 650);
}
function revealAnswer() {
  if (!session || !["question_active", "answer_revealed"].includes(session.currentState)) return;
  session.currentState = "answer_revealed"; els.answerBox.classList.remove("hidden"); saveSession();
}
function judge(correct) {
  if (!session || session.selectedTeamIndex == null || !["question_active", "answer_revealed"].includes(session.currentState)) return;
  stopTimer(); const team = session.teams[session.selectedTeamIndex]; const q = session.questions[session.index]; let points = 0;
  if (correct) {
    team.streak += 1; team.bestStreak = Math.max(team.bestStreak, team.streak); team.correct += 1;
    points = calculatePoints({ basePoints: session.settings.basePoints, streak: team.streak - 1, streakBonus: session.settings.streakBonus }); team.score += points;
  } else { team.streak = 0; team.incorrect += 1; }
  session.history.push({ question: q.question, answer: q.answer, subject: q.subject, difficulty: q.difficulty, team: team.name, correct, points, answeredAt: new Date().toISOString() });
  logActivity(`${team.name} ${t(correct ? "correctLog" : "incorrectLog")}${points ? ` (+${points})` : ""}.`);
  session.index += 1; session.selectedTeamIndex = null; session.currentState = "awaiting_team"; saveSession();
  if (session.index >= session.questions.length) finishGame(); else renderGame();
}
function startTimer() {
  stopTimer(); const total = session.settings.timerSeconds; if (!total) return resetTimerDisplay();
  let remaining = total; updateTimer(remaining, total);
  timerHandle = setInterval(() => {
    remaining -= 1; updateTimer(remaining, total);
    if (remaining <= 0) { stopTimer(); showToast(t("timeout")); logActivity(t("timeout")); }
  }, 1000);
}
function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; }
function resetTimerDisplay() {
  const total = session?.settings?.timerSeconds || 0; els.timerValue.textContent = total || "∞"; els.timerBar.style.width = "100%"; els.timerBar.classList.remove("low");
}
function updateTimer(remaining, total) {
  els.timerValue.textContent = remaining; const pct = Math.max(0, remaining / total * 100); els.timerBar.style.width = `${pct}%`; els.timerBar.classList.toggle("low", pct <= 30);
}
function logActivity(message) {
  if (!session.activity) session.activity = [];
  session.activity.unshift({ message, time: new Date().toISOString() }); session.activity = session.activity.slice(0, 30);
}
function renderActivity() {
  const activity = session.activity || [];
  els.activityLog.innerHTML = activity.length ? activity.map(item => `<li>${escapeHtml(item.message)}<time>${new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></li>`).join("") : `<li>Game ready.</li>`;
}
function updateStreakBadge() {
  const best = Math.max(...session.teams.map(team => team.streak), 0);
  els.streakDisplay.textContent = best > 0 ? `${best} ${t("streakLabel")}` : t("noStreak");
}
function finishGame() {
  if (!session) return; stopTimer(); session.completedAt = new Date().toISOString(); saveSession();
  els.game.classList.add("hidden"); els.setup.classList.add("hidden"); els.results.classList.remove("hidden");
  renderResults(); window.scrollTo({ top: 0 });
}
function renderResults() {
  const board = computeLeaderboard(session.teams); const top = board.slice(0, 3);
  els.resultsSummary.textContent = `${session.className} ${t("resultSummary")} with ${session.history.length} ${t("questions")}.`;
  const classes = ["first", "second", "third"];
  const medals = ["🥇", "🥈", "🥉"];
  els.podium.innerHTML = top.map((team, i) => `<div class="podium-card ${classes[i]}"><div>${medals[i]}</div><strong>${escapeHtml(team.name)}</strong><span>${team.score}</span><small>${t("score")}</small></div>`).join("");
  els.resultsTableWrap.innerHTML = `<table class="results-table"><thead><tr><th>${t("rank")}</th><th>${t("team")}</th><th>${t("score")}</th><th>${t("correctCount")}</th><th>${t("incorrectCount")}</th><th>${t("bestStreak")}</th></tr></thead><tbody>${board.map((team,i) => `<tr><td>${i+1}</td><td>${escapeHtml(team.name)}</td><td><strong>${team.score}</strong></td><td>${team.correct}</td><td>${team.incorrect}</td><td>${team.bestStreak}</td></tr>`).join("")}</tbody></table>`;
}
function resetToSetup(clearSession = true) {
  stopTimer(); if (clearSession) localStorage.removeItem(SESSION_KEY); session = null;
  els.results.classList.add("hidden"); els.game.classList.add("hidden"); els.setup.classList.remove("hidden"); renderQuestions(); window.scrollTo({ top: 0 });
}
function playAgain() {
  const built = buildSession(); if (!built) return; session = built; saveSession(); els.results.classList.add("hidden"); els.game.classList.remove("hidden"); renderGame();
}
function applyLanguage() {
  document.documentElement.lang = app.language === "ta" ? "ta" : app.language === "ms" ? "ms" : "en";
  const mapping = {
    tagline:"tagline", "language-label":"language", "setup-title":"setupTitle", "setup-description":"setupDescription", "game-settings-title":"gameSettings", "class-name-label":"className",
    "team-count-label":"teamCount", "timer-label":"timer", "points-label":"points", "shuffle-label":"shuffle", "streak-label":"streak", "question-bank-title":"questionBank",
    "question-label":"question", "answer-label":"answer", "subject-label":"subject", "difficulty-label":"difficulty", "add-question":"addQuestion", "load-demo":"loadDemo",
    "import-json":"importJson", "export-json":"exportJson", "privacy-title":"privacyTitle", "privacy-copy":"privacyCopy", "start-game":"startGame", "save-session":"saveProgress", "end-game":"endGame",
    "ball-action-text":"passBall", "reveal-answer":"reveal", "mark-correct":"correct", "mark-incorrect":"incorrect", "activity-title":"activity", "expected-answer-label":"expectedAnswer",
    "timer-caption":"time", "results-title":"results", "download-csv":"downloadCsv", "play-again":"playAgain", "new-game":"newSetup", "game-session-label":"liveSession"
  };
  for (const [id,key] of Object.entries(mapping)) if ($(id)) $(id).textContent = t(key);
  els.lang.value = app.language; updateNetworkBadge(); renderTeamFields(); renderQuestions();
}
function updateNetworkBadge() {
  els.network.textContent = navigator.onLine ? t("online") : t("offline");
  els.network.classList.toggle("badge-warn", !navigator.onLine);
}

$("add-question").addEventListener("click", addOrUpdateQuestion);
$("load-demo").addEventListener("click", loadDemo);
$("export-json").addEventListener("click", exportQuestions);
$("import-json").addEventListener("click", () => els.fileInput.click());
els.fileInput.addEventListener("change", e => { if (e.target.files?.[0]) importQuestions(e.target.files[0]); e.target.value = ""; });
els.questionList.addEventListener("click", e => { const edit = e.target.closest("[data-edit]"); const del = e.target.closest("[data-delete]"); if (edit) editQuestion(edit.dataset.edit); if (del) deleteQuestion(del.dataset.delete); });
els.teamCount.addEventListener("change", () => { captureTeamNames(); renderTeamFields(); });
els.teamNames.addEventListener("input", captureTeamNames);
els.lang.addEventListener("change", () => { app.language = els.lang.value; persistSettings(); applyLanguage(); });
$("start-game").addEventListener("click", startGame);
els.ballButton.addEventListener("click", passBall);
els.reveal.addEventListener("click", revealAnswer);
els.correct.addEventListener("click", () => judge(true));
els.incorrect.addEventListener("click", () => judge(false));
$("save-session").addEventListener("click", () => { saveSession(); showToast(t("saved")); });
$("end-game").addEventListener("click", finishGame);
$("download-csv").addEventListener("click", () => download("ball-game-session.csv", sessionToCSV(session), "text/csv;charset=utf-8"));
$("play-again").addEventListener("click", playAgain);
$("new-game").addEventListener("click", () => resetToSetup());
window.addEventListener("online", updateNetworkBadge); window.addEventListener("offline", updateNetworkBadge);
window.addEventListener("keydown", e => {
  if (!session || els.game.classList.contains("hidden") || ["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) return;
  const key = e.key.toLowerCase();
  if (e.code === "Space") { e.preventDefault(); passBall(); }
  else if (key === "r") revealAnswer(); else if (key === "c") judge(true); else if (key === "x") judge(false);
});

renderTeamFields(); renderQuestions(); applyLanguage();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
