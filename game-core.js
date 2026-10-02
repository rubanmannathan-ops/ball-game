export const DIFFICULTIES = new Set(["easy", "medium", "hard"]);

export function createId(prefix = "q") {
  const randomPart = Math.random().toString(36).slice(2, 9);
  const timePart = Date.now().toString(36);
  return `${prefix}_${timePart}_${randomPart}`;
}

export function normalizeQuestion(input = {}) {
  return {
    id: String(input.id || createId()),
    question: String(input.question || "").trim(),
    answer: String(input.answer || "").trim(),
    subject: String(input.subject || "General").trim().slice(0, 40) || "General",
    difficulty: DIFFICULTIES.has(input.difficulty) ? input.difficulty : "medium"
  };
}

export function validateQuestionBank(bank) {
  const errors = [];
  if (!Array.isArray(bank)) return { valid: false, errors: ["Question bank must be an array."] };
  if (bank.length < 1) errors.push("Add at least one question.");
  if (bank.length > 100) errors.push("Question bank cannot contain more than 100 questions.");

  bank.forEach((raw, index) => {
    const q = normalizeQuestion(raw);
    if (!q.question) errors.push(`Question ${index + 1} is empty.`);
    if (!q.answer) errors.push(`Answer ${index + 1} is empty.`);
    if (q.question.length > 240) errors.push(`Question ${index + 1} is too long.`);
    if (q.answer.length > 240) errors.push(`Answer ${index + 1} is too long.`);
  });
  return { valid: errors.length === 0, errors };
}

export function shuffleArray(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandomTeam(teamCount, previousIndex = null, rng = Math.random) {
  if (!Number.isInteger(teamCount) || teamCount < 1) throw new Error("teamCount must be a positive integer");
  if (teamCount === 1) return 0;
  const candidates = Array.from({ length: teamCount }, (_, i) => i).filter(i => i !== previousIndex);
  return candidates[Math.floor(rng() * candidates.length)];
}

export function calculatePoints({ basePoints = 10, streak = 0, streakBonus = true } = {}) {
  const base = Math.max(0, Number(basePoints) || 0);
  if (!streakBonus) return base;
  const safeStreak = Math.max(0, Number(streak) || 0);
  const multiplier = 1 + Math.min(safeStreak, 3) * 0.25;
  return Math.round(base * multiplier);
}

export function computeLeaderboard(teams = []) {
  return teams
    .map((team, index) => ({ ...team, originalIndex: index }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if ((b.correct || 0) !== (a.correct || 0)) return (b.correct || 0) - (a.correct || 0);
      return String(a.name).localeCompare(String(b.name));
    });
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function sessionToCSV(session) {
  const rows = [
    ["Session", session.className || "Classroom Game"],
    ["Completed at", session.completedAt || new Date().toISOString()],
    [],
    ["Team", "Score", "Correct", "Incorrect", "Best streak"]
  ];
  for (const team of computeLeaderboard(session.teams || [])) {
    rows.push([team.name, team.score, team.correct || 0, team.incorrect || 0, team.bestStreak || 0]);
  }
  rows.push([], ["Question", "Answer", "Subject", "Difficulty", "Team", "Result", "Points"]);
  for (const entry of session.history || []) {
    rows.push([
      entry.question,
      entry.answer,
      entry.subject,
      entry.difficulty,
      entry.team,
      entry.correct ? "Correct" : "Incorrect",
      entry.points || 0
    ]);
  }
  return rows.map(row => row.map(csvCell).join(",")).join("\n");
}
