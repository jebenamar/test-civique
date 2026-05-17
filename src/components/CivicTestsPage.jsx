import { useState } from 'react';
import { civicTestPassingScore, civicTests } from '../data/quizData';

export default function CivicTestsPage({ onHome }) {
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const selectedTest = civicTests.find((test) => test.id === selectedTestId);
  const questions = selectedTest?.questions || [];
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  function startTest(testId) {
    setSelectedTestId(testId);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setAnswers([]);
    setResults(null);
    setShowDetails(false);
  }

  function backToTests() {
    setSelectedTestId(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setAnswers([]);
    setResults(null);
    setShowDetails(false);
  }

  function handleSelectAnswer(optionIndex) {
    if (answered || !currentQuestion) return;

    const answer = {
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer: optionIndex,
      correctAnswer: currentQuestion.correct,
      isCorrect: optionIndex === currentQuestion.correct,
      sourceCategoryTitle: currentQuestion.sourceCategoryTitle,
      sourceCategoryIcon: currentQuestion.sourceCategoryIcon,
    };

    setSelectedAnswer(optionIndex);
    setAnswered(true);
    setAnswers((previousAnswers) => [...previousAnswers, answer]);
  }

  function handleNext() {
    if (!answered) return;

    if (currentIndex < questions.length - 1) {
      setSelectedAnswer(null);
      setAnswered(false);
      setCurrentIndex((index) => index + 1);
      return;
    }

    setResults({
      test: selectedTest,
      answers,
      totalQuestions: questions.length,
    });
  }

  function getOptionClass(index) {
    if (!answered) return 'option-btn';
    if (index === currentQuestion.correct) return 'option-btn correct';
    if (index === selectedAnswer) return 'option-btn incorrect';
    return 'option-btn dimmed';
  }

  if (results) {
    const score = results.answers.filter((answer) => answer.isCorrect).length;
    const percentage = Math.round((score / results.totalQuestions) * 100);
    const passed = score >= civicTestPassingScore;
    const incorrectAnswers = results.answers.filter((answer) => !answer.isCorrect);

    return (
      <div className="results-page civic-results-page">
        <div className="results-header">
          <button className="back-btn light" onClick={backToTests}>
            ← Tests civiques
          </button>
          <div className="results-category">
            <span>{results.test.title}</span>
            <span>{score}/{results.totalQuestions}</span>
          </div>
        </div>

        <div className="results-hero">
          <div className="score-circle" style={{ '--score-color': passed ? '#22c55e' : '#ef4444' }}>
            <svg viewBox="0 0 120 120" className="score-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={passed ? '#22c55e' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={`${(percentage / 100) * 314} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="score-text">
              <span className="score-percent">{percentage}%</span>
              <span className="score-fraction">{score}/{results.totalQuestions}</span>
            </div>
          </div>

          <div className="score-message">
            <h2 className="score-title">{passed ? 'Test réussi' : 'Test non validé'}</h2>
            <p className="score-description">
              Il faut au moins {civicTestPassingScore} bonnes réponses sur {results.totalQuestions}
              pour réussir ce test civique.
            </p>
          </div>

          <div className="score-stats">
            <div className="score-stat correct">
              <span className="score-stat-number">{score}</span>
              <span className="score-stat-label">Correctes</span>
            </div>
            <div className="score-stat incorrect">
              <span className="score-stat-number">{incorrectAnswers.length}</span>
              <span className="score-stat-label">Incorrectes</span>
            </div>
            <div className="score-stat total">
              <span className="score-stat-number">{civicTestPassingScore}</span>
              <span className="score-stat-label">Minimum</span>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button className="btn-retry" onClick={() => startTest(results.test.id)}>
            Recommencer ce test
          </button>
          <button className="btn-home" onClick={backToTests}>
            Choisir un autre test
          </button>
        </div>

        {incorrectAnswers.length > 0 && (
          <div className="review-section">
            <button
              className="toggle-review-btn"
              onClick={() => setShowDetails((visible) => !visible)}
            >
              {showDetails
                ? 'Masquer les corrections'
                : `Voir les ${incorrectAnswers.length} corrections`}
            </button>

            {showDetails && (
              <div className="incorrect-list">
                {incorrectAnswers.map((answer, index) => (
                  <div key={`${answer.question}-${index}`} className="incorrect-card">
                    <div className="incorrect-card-header">
                      <span className="incorrect-badge">
                        {answer.sourceCategoryIcon} {answer.sourceCategoryTitle}
                      </span>
                    </div>
                    <p className="incorrect-question">{answer.question}</p>
                    <div className="answer-comparison">
                      <div className="your-answer">
                        <span className="answer-label">Votre réponse :</span>
                        <span className="answer-value wrong">
                          {String.fromCharCode(65 + answer.selectedAnswer)}.{' '}
                          {answer.options[answer.selectedAnswer]}
                        </span>
                      </div>
                      <div className="correct-answer-review">
                        <span className="answer-label">Bonne réponse :</span>
                        <span className="answer-value right">
                          {String.fromCharCode(65 + answer.correctAnswer)}.{' '}
                          {answer.options[answer.correctAnswer]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (selectedTest && currentQuestion) {
    const lastAnswer = answers[answers.length - 1];

    return (
      <div className="quiz-page civic-quiz-page">
        <div className="quiz-header">
          <button className="back-btn" onClick={backToTests}>
            ← Tests civiques
          </button>
          <div className="quiz-header-center">
            <span className="quiz-category-name">{selectedTest.title}</span>
            <span className="quiz-theme-pill">
              {currentQuestion.sourceCategoryIcon} {currentQuestion.sourceCategoryTitle}
            </span>
          </div>
          <div className="quiz-counter">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="question-container fade-in">
          <div className="question-number">Question {currentIndex + 1}</div>
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-list">
            {currentQuestion.options.map((option, index) => (
              <button
                key={`${currentQuestion.id}-${index}`}
                className={getOptionClass(index)}
                onClick={() => handleSelectAnswer(index)}
                disabled={answered}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {answered && index === currentQuestion.correct && (
                  <span className="option-icon">✓</span>
                )}
                {answered && index === selectedAnswer && index !== currentQuestion.correct && (
                  <span className="option-icon">×</span>
                )}
              </button>
            ))}
          </div>

          {answered && (
            <div className={`feedback ${lastAnswer?.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
              {lastAnswer?.isCorrect ? (
                <span>Bonne réponse.</span>
              ) : (
                <span>
                  Mauvaise réponse. La bonne réponse est :{' '}
                  <strong>{currentQuestion.options[currentQuestion.correct]}</strong>
                </span>
              )}
            </div>
          )}

          {answered && (
            <button className="next-btn" onClick={handleNext}>
              {currentIndex < questions.length - 1 ? 'Question suivante →' : 'Voir le résultat'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="civic-tests-page">
      <header className="civic-tests-header">
        <button className="back-btn" onClick={onHome}>
          ← Accueil
        </button>
        <div>
          <h1>Tests civiques blancs</h1>
          <p>
            10 tests de 40 questions, avec des questions réparties sur tous les thèmes.
            Réussite à partir de {civicTestPassingScore} bonnes réponses.
          </p>
        </div>
      </header>

      <main className="civic-tests-list">
        {civicTests.map((test) => (
          <button key={test.id} className="civic-test-card" onClick={() => startTest(test.id)}>
            <span className="civic-test-index">{String(test.id).padStart(2, '0')}</span>
            <span className="civic-test-content">
              <strong>{test.title}</strong>
              <span>{test.description}</span>
            </span>
            <span className="civic-test-meta">
              {test.questionCount} questions · seuil {test.passingScore}/40
            </span>
          </button>
        ))}
      </main>
    </div>
  );
}
