// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { Sparkles, Trophy, CheckCircle, XCircle, RotateCcw, Brain, ArrowRight } from "lucide-react";

export default function QuizPanel() {
  const [topic, setTopic] = useState("Solar System");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setStreak(0);
    setQuizFinished(false);
    setSelectedIdx(null);
    setSubmitted(false);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty })
      });

      if (!res.ok) throw new Error("Cosmos trivia communication error.");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      alert("Failed generating AI space quiz answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (submitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedIdx === null || submitted) return;
    setSubmitted(true);

    const isCorrect = selectedIdx === questions[currentIndex].correctIndex;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedIdx(null);
    setSubmitted(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left shadow-2xl">
      <div className="flex items-center space-x-2.5 mb-4">
        <Brain className="w-5 h-5 text-indigo-400" />
        <h4 className="font-bold text-white uppercase tracking-wider text-sm">
          Interactive Galactic Space Trivia
        </h4>
      </div>

      {/* Start screen parameters */}
      {questions.length === 0 && !loading && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Deploys the server-side Gemini API client to compile 5 custom-tailored multiple choice trivia queries based on any selected cosmic topic and difficulty level.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Cosmic Topic Focus
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Solar System, Exoplanets, Black Holes, Apollo Project..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 px-4 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Difficulty Class
              </label>
              <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(["Easy", "Medium", "Hard"] as const).map((diffOpt) => (
                  <button
                    key={diffOpt}
                    onClick={() => setDifficulty(diffOpt)}
                    className={`p-1.5 rounded-lg font-medium transition ${
                      difficulty === diffOpt
                        ? "bg-indigo-600 font-bold text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {diffOpt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={fetchQuiz}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs tracking-wider transition duration-300 shadow-lg shadow-indigo-600/20 uppercase"
          >
            Launch Quiz Generator
          </button>
        </div>
      )}

      {/* Generating loaders */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 text-indigo-400">
          <Brain className="w-8 h-8 animate-bounce mb-2" />
          <span className="font-mono text-xs animate-pulse">Consulting Gemini satellite archives...</span>
        </div>
      )}

      {/* Question presentation */}
      {questions.length > 0 && !quizFinished && (
        <div className="space-y-4">
          {/* Header indices */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-indigo-500/10 pb-2 text-slate-400">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex space-x-3 items-center">
              <span>Score: <strong className="text-white">{correctCount}/{questions.length}</strong></span>
              {streak > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                  Streak {streak} 🔥
                </span>
              )}
            </div>
          </div>

          {/* Active Question Title */}
          <h5 className="font-bold text-white leading-snug text-base">
            {questions[currentIndex].question}
          </h5>

          {/* Selectable Choice Options list */}
          <div className="space-y-2">
            {questions[currentIndex].options.map((opt, oIdx) => {
              const isSelected = selectedIdx === oIdx;
              const isCorrectO = oIdx === questions[currentIndex].correctIndex;

              let btnStyle = "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-indigo-500/30";
              if (submitted) {
                if (isCorrectO) {
                  btnStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/10 border-rose-500/40 text-rose-300 font-bold";
                } else {
                  btnStyle = "bg-slate-950/20 border-slate-900 text-slate-500 opacity-60";
                }
              } else if (isSelected) {
                btnStyle = "bg-indigo-500/10 border-indigo-500 text-white font-bold";
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={submitted}
                  className={`w-full p-3 rounded-xl border text-xs text-left transition duration-300 flex items-center justify-between group ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {submitted && isCorrectO && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {submitted && isSelected && !isCorrectO && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Dynamic Explanations and Footers */}
          {submitted && (
            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-2 animate-fadeIn text-xs leading-relaxed">
              <span className="font-bold text-indigo-300 block">System Explanation:</span>
              <p className="text-slate-300">{questions[currentIndex].explanation}</p>
            </div>
          )}

          {/* Action Footer triggers */}
          <div className="pt-2 flex justify-end">
            {!submitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedIdx === null}
                className="py-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs tracking-wider transition disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed shadow-md shadow-indigo-600/10"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 text-xs font-bold flex items-center border border-indigo-500/10"
              >
                {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Summary card */}
      {quizFinished && (
        <div className="text-center py-6 space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
          <div>
            <h5 className="font-bold text-white text-base">Quiz Completed!</h5>
            <p className="text-xs text-slate-400 mt-1">
              You correctly solved <strong className="text-white">{correctCount}</strong> out of <strong className="text-indigo-400">{questions.length}</strong> questions in topic **{topic}** ({difficulty}).
            </p>
          </div>

          <div className="flex space-x-3 max-w-[280px] mx-auto pt-2">
            <button
              onClick={fetchQuiz}
              className="flex-grow py-2 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs tracking-wider transition"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                setQuestions([]);
                setQuizFinished(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800 text-slate-300 text-xs font-semibold tracking-wide transition flex items-center justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
