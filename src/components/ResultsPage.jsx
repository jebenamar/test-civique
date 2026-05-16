import { useState } from 'react';

export default function ResultsPage({ results, onRetry, onHome }) {
  const { category, answers, totalQuestions } = results;
  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectAnswers = answers.filter((a) => !a.isCorrect);

  const [showDetails, setShowDetails] = useState(false);

  function getScoreColor() {
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  }

  function getScoreMessage() {
    if (percentage >= 80) return { emoji: '🏆', title: 'Excellent !', message: 'Vous maîtrisez très bien ce thème !' };
    if (percentage >= 60) return { emoji: '👍', title: 'Bien !', message: 'Encore un peu de révision et vous serez prêt.' };
    if (percentage >= 40) return { emoji: '📚', title: 'À améliorer', message: 'Continuez à réviser ce thème pour progresser.' };
    return { emoji: '💪', title: 'À retravailler', message: 'Ne vous découragez pas, relisez vos notes et réessayez !' };
  }

  const scoreInfo = getScoreMessage();
  const scoreColor = getScoreColor();

  return (
    <div className="results-page">
      <div className="results-header" style={{ '--score-color': scoreColor }}>
        <button className="back-btn light" onClick={onHome}>
          ← Accueil
        </button>
        <div className="results-category">
          <span>{category?.icon}</span>
          <span>{category?.title}</span>
        </div>
      </div>

      <div className="results-hero">
        <div className="score-circle" style={{ '--score-color': scoreColor }}>
          <svg viewBox="0 0 120 120" className="score-svg">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={`${(percentage / 100) * 314} 314`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray 1.5s ease' }}
            />
          </svg>
          <div className="score-text">
            <span className="score-percent">{percentage}%</span>
            <span className="score-fraction">{score}/{totalQuestions}</span>
          </div>
        </div>

        <div className="score-message">
          <div className="score-emoji">{scoreInfo.emoji}</div>
          <h2 className="score-title">{scoreInfo.title}</h2>
          <p className="score-description">{scoreInfo.message}</p>
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
            <span className="score-stat-number">{totalQuestions}</span>
            <span className="score-stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button className="btn-retry" onClick={onRetry}>
          🔄 Réessayer ce QCM
        </button>
        <button className="btn-home" onClick={onHome}>
          🏠 Choisir un autre thème
        </button>
      </div>

      {incorrectAnswers.length > 0 && (
        <div className="review-section">
          <button
            className="toggle-review-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '▲ Masquer les corrections' : `▼ Voir les ${incorrectAnswers.length} réponses incorrectes`}
          </button>

          {showDetails && (
            <div className="incorrect-list">
              {incorrectAnswers.map((answer, index) => (
                <div key={index} className="incorrect-card">
                  <div className="incorrect-card-header">
                    <span className="incorrect-badge">❌ Question {index + 1}</span>
                  </div>
                  <p className="incorrect-question">{answer.question}</p>
                  <div className="answer-comparison">
                    <div className="your-answer">
                      <span className="answer-label">Votre réponse :</span>
                      <span className="answer-value wrong">
                        {String.fromCharCode(65 + answer.selectedAnswer)}. {answer.options[answer.selectedAnswer]}
                      </span>
                    </div>
                    <div className="correct-answer-review">
                      <span className="answer-label">Bonne réponse :</span>
                      <span className="answer-value right">
                        {String.fromCharCode(65 + answer.correctAnswer)}. {answer.options[answer.correctAnswer]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {incorrectAnswers.length === 0 && (
        <div className="perfect-score">
          <p>🌟 Score parfait ! Vous avez répondu correctement à toutes les questions !</p>
        </div>
      )}
    </div>
  );
}
