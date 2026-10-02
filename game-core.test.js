import test from "node:test";
import assert from "node:assert/strict";
import { normalizeQuestion, validateQuestionBank, shuffleArray, pickRandomTeam, calculatePoints, computeLeaderboard, sessionToCSV } from "../src/game-core.js";

test("normalizeQuestion trims and defaults fields", () => {
  const q = normalizeQuestion({ question: "  Hello?  ", answer: "  Yes  ", difficulty: "unknown" });
  assert.equal(q.question, "Hello?"); assert.equal(q.answer, "Yes"); assert.equal(q.subject, "General"); assert.equal(q.difficulty, "medium");
});

test("validateQuestionBank rejects incomplete questions", () => {
  const result = validateQuestionBank([{ question: "", answer: "A" }]);
  assert.equal(result.valid, false); assert.match(result.errors[0], /empty/i);
});

test("shuffleArray preserves all values", () => {
  const original = [1,2,3,4]; const shuffled = shuffleArray(original, () => 0.2);
  assert.deepEqual([...shuffled].sort(), original); assert.deepEqual(original, [1,2,3,4]);
});

test("pickRandomTeam avoids the previous team when possible", () => {
  assert.notEqual(pickRandomTeam(4, 2, () => 0.5), 2);
});

test("calculatePoints applies capped streak bonus", () => {
  assert.equal(calculatePoints({ basePoints: 10, streak: 0, streakBonus: true }), 10);
  assert.equal(calculatePoints({ basePoints: 10, streak: 2, streakBonus: true }), 15);
  assert.equal(calculatePoints({ basePoints: 10, streak: 10, streakBonus: true }), 18);
  assert.equal(calculatePoints({ basePoints: 10, streak: 2, streakBonus: false }), 10);
});

test("leaderboard sorts by score then correct answers", () => {
  const board = computeLeaderboard([
    { name: "A", score: 20, correct: 1 }, { name: "B", score: 20, correct: 2 }, { name: "C", score: 10, correct: 9 }
  ]);
  assert.deepEqual(board.map(t => t.name), ["B", "A", "C"]);
});

test("sessionToCSV escapes commas and includes history", () => {
  const csv = sessionToCSV({ className: "Year 6", teams: [{ name: "A, One", score: 10, correct: 1 }], history: [{ question: "Q?", answer: "A", subject: "S", difficulty: "easy", team: "A, One", correct: true, points: 10 }] });
  assert.match(csv, /"A, One"/); assert.match(csv, /Q\?/);
});
