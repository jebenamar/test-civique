import { useState } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import CivicTestsPage from './components/CivicTestsPage';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  function handleSelectQuiz(categoryId) {
    setSelectedCategoryId(categoryId);
    setScreen('quiz');
  }

  function handleOpenCivicTests() {
    setSelectedCategoryId(null);
    setQuizResults(null);
    setScreen('civic-tests');
  }

  function handleQuizFinish(results) {
    setQuizResults(results);
    setScreen('results');
  }

  function handleRetry() {
    setScreen('quiz');
  }

  function handleHome() {
    setSelectedCategoryId(null);
    setQuizResults(null);
    setScreen('home');
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomePage
          onSelectQuiz={handleSelectQuiz}
          onOpenCivicTests={handleOpenCivicTests}
        />
      )}
      {screen === 'civic-tests' && (
        <CivicTestsPage onHome={handleHome} />
      )}
      {screen === 'quiz' && (
        <QuizPage
          categoryId={selectedCategoryId}
          onFinish={handleQuizFinish}
          onBack={handleHome}
        />
      )}
      {screen === 'results' && (
        <ResultsPage
          results={quizResults}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
