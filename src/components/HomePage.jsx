import { quizCategories } from '../data/quizData';

export default function HomePage({ onSelectQuiz, onOpenCivicTests }) {
  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-content">
          <div className="hero-flag">🇫🇷</div>
          <h1 className="hero-title">Test de Naturalisation</h1>
          <p className="hero-subtitle">
            Préparez-vous au test civique pour l'obtention de la nationalité française
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10</span>
              <span className="stat-label">Thèmes</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">40</span>
              <span className="stat-label">Questions par thème</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">400</span>
              <span className="stat-label">Questions au total</span>
            </div>
          </div>
        </div>
      </header>

      <main className="quiz-grid-section">
        <section className="civic-entry-section">
          <div className="civic-entry-copy">
            <span className="civic-entry-kicker">Simulation complète</span>
            <h2>10 tests civiques blancs</h2>
            <p>
              Chaque test contient 40 questions sur l'ensemble des thèmes. Il faut
              32 bonnes réponses pour réussir.
            </p>
          </div>
          <button className="civic-entry-btn" onClick={onOpenCivicTests}>
            Commencer un test blanc
            <span>→</span>
          </button>
        </section>
        <h2 className="section-title">Choisissez un thème</h2>
        <p className="section-subtitle">
          Sélectionnez un QCM ci-dessous pour commencer votre entraînement
        </p>
        <div className="quiz-grid">
          {quizCategories.map((category) => (
            <button
              key={category.id}
              className="quiz-card"
              onClick={() => onSelectQuiz(category.id)}
              style={{ '--card-color': category.color }}
            >
              <div className="card-icon">{category.icon}</div>
              <div className="card-content">
                <h3 className="card-title">{category.title}</h3>
                <p className="card-description">{category.description}</p>
              </div>
              <div className="card-footer">
                <span className="card-badge">40 questions</span>
                <span className="card-arrow">→</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="home-footer">
        <p>Bonne préparation ! La naturalisation française, c'est aussi comprendre et partager les valeurs de la République.</p>
      </footer>
    </div>
  );
}
