import { useState, useEffect } from 'react';
import { quizCategories, quizQuestions } from '../data/quizData';

export default function QuizPage({ categoryId, onFinish, onBack }) {
  const category = quizCategories.find((c) => c.id === categoryId);
  const questions = quizQuestions[categoryId] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [animating, setAnimating] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    setSelectedAnswer(null);
    setAnswered(false);
  }, [currentIndex]);

  function handleSelectAnswer(optionIndex) {
    if (answered) return;
    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correct;
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        options: currentQuestion.options,
        selectedAnswer: optionIndex,
        correctAnswer: currentQuestion.correct,
        isCorrect,
      },
    ]);
  }

  function handleNext() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        onFinish({
          category,
          answers: [
            ...answers,
          ],
          totalQuestions: questions.length,
        });
      }
      setAnimating(false);
    }, 300);
  }

  function getOptionClass(index) {
    if (!answered) return 'option-btn';
    if (index === currentQuestion.correct) return 'option-btn correct';
    if (index === selectedAnswer && !answers[answers.length - 1]?.isCorrect) return 'option-btn incorrect';
    return 'option-btn dimmed';
  }

  return (
    <div className="quiz-page" style={{ '--quiz-color': category?.color || '#3B82F6' }}>
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>
          ← Retour
        </button>
        <div className="quiz-header-center">
          <span className="quiz-category-icon">{category?.icon}</span>
          <span className="quiz-category-name">{category?.title}</span>
        </div>
        <div className="quiz-counter">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className={`question-container ${animating ? 'fade-out' : 'fade-in'}`}>
        <div className="question-number">Question {currentIndex + 1}</div>
        <h2 className="question-text">{currentQuestion?.question}</h2>

        <div className="options-list">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleSelectAnswer(index)}
              disabled={answered}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {answered && index === currentQuestion.correct && (
                <span className="option-icon">✓</span>
              )}
              {answered && index === selectedAnswer && index !== currentQuestion.correct && (
                <span className="option-icon">✗</span>
              )}
            </button>
          ))}
        </div>

        {answered && (
          <div className={`feedback ${answers[answers.length - 1]?.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
            {answers[answers.length - 1]?.isCorrect ? (
              <span>🎉 Bonne réponse !</span>
            ) : (
              <span>
                ❌ Mauvaise réponse. La bonne réponse est :{' '}
                <strong>{currentQuestion.options[currentQuestion.correct]}</strong>
              </span>
            )}
          </div>
        )}

        {answered && (
          <button className="next-btn" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Question suivante →' : 'Voir les résultats 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
