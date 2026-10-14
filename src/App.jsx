import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './hooks/useLanguage.jsx';
import { useGame } from './hooks/useGame.js';
import { GAME_STATES } from './utils/wordSanitizer.js';
import { getInitialWordPool } from './services/wordService.js';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import WordDisplay from './components/game/WordDisplay.jsx';
import LetterInput from './components/game/LetterInput.jsx';
import ScoreBoard from './components/game/ScoreBoard.jsx';
import UsedLetters from './components/game/UsedLetters.jsx';
import GameControls from './components/game/GameControls.jsx';
import Toast from './components/ui/Toast.jsx';
import Modal from './components/ui/Modal.jsx';

/** Pantalla de inicio con tutorial y botón COMENZAR */
function StartScreen({ onStart }) {
  const { t } = useLanguage();

  const steps = [
    { icon: 'bi-shuffle',            text: t('tutorial.step1') },
    { icon: 'bi-keyboard',           text: t('tutorial.step2') },
    { icon: 'bi-check-circle',       text: t('tutorial.step3') },
    { icon: 'bi-x-circle',          text: t('tutorial.step4') },
    { icon: 'bi-trophy',             text: t('tutorial.step5') },
  ];

  return (
    <div className="start-screen d-flex flex-column align-items-center py-4 fade-in">
      {/* Tutorial */}
      <div className="tutorial-card card border-0 shadow-sm w-100 mb-4" style={{ maxWidth: 520 }}>
        <div className="card-body px-4 py-3">
          <h2 className="tutorial-title text-center fw-bold mb-3 fs-6 text-uppercase text-secondary letter-spacing-wide">
            {t('tutorial.title')}
          </h2>
          <ol className="tutorial-steps list-unstyled mb-0 d-flex flex-column gap-2">
            {steps.map((step, i) => (
              <li key={i} className="tutorial-step d-flex align-items-start gap-3">
                <span className="tutorial-step-icon">
                  <i className={`bi ${step.icon} fs-5 text-primary`} aria-hidden="true"></i>
                </span>
                <span className="tutorial-step-text small text-secondary">{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Botón COMENZAR */}
      <button
        type="button"
        className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow btn-cta-main"
        onClick={onStart}
      >
        <i className="bi bi-play-circle-fill me-2" aria-hidden="true"></i>
        {t('cta.start')}
      </button>
    </div>
  );
}

function GameAppInner() {
  const { language, changeLanguage } = useLanguage();
  const game = useGame(language);

  const [pendingLanguage, setPendingLanguage] = useState(null);
  const [langModalOpen, setLangModalOpen] = useState(false);

  const handleLanguageSelect = (newLangCode) => {
    if (newLangCode === language) return;
    if (game.status === GAME_STATES.IN_PROGRESS) {
      setPendingLanguage(newLangCode);
      setLangModalOpen(true);
    } else {
      changeLanguage(newLangCode);
    }
  };

  const handleConfirmLanguageChange = () => {
    if (pendingLanguage) {
      changeLanguage(pendingLanguage);
      setPendingLanguage(null);
    }
    setLangModalOpen(false);
  };

  const isGameActive = game.status === GAME_STATES.IN_PROGRESS;
  const totalWords = getInitialWordPool(language).length;
  const hasStarted = game.status !== GAME_STATES.NOT_STARTED;

  return (
    <div className="game-app-wrapper">
      <div className="container app-content-container">
        {/* Cabecera */}
        <Header
          onLanguageSelect={handleLanguageSelect}
          isGameActive={isGameActive}
          onOpenRules={game.openRulesModal}
        />

        {/* Toast de feedback */}
        <Toast feedback={game.feedback} onDismiss={game.clearFeedback} />

        {/* Pantalla de inicio con tutorial */}
        {!hasStarted && <StartScreen onStart={game.startMatch} />}

        {/* UI de juego (visible tras COMENZAR) */}
        {hasStarted && (
          <div className="game-ui-container fade-in">
            <WordDisplay
              currentWord={game.currentWord}
              guessedLetters={game.guessedLetters}
              status={game.status}
              lastAction={game.lastAction}
            />

            <LetterInput
              onSubmitLetter={game.submitLetter}
              disabled={!isGameActive}
              lastAction={game.lastAction}
            />

            <GameControls
              status={game.status}
              remainingWords={game.remainingWordsCount}
              totalWords={totalWords}
              onStartMatch={game.startMatch}
              onRequestRestart={game.requestRestart}
              onResetSession={game.resetSession}
            />

            <ScoreBoard
              mistakes={game.mistakes}
              maxMistakes={game.maxMistakes}
              score={game.score}
            />

            <UsedLetters
              guessedLetters={game.guessedLetters}
              wrongLetters={game.wrongLetters}
            />
          </div>
        )}

        {/* Modales */}
        <Modal
          modalState={
            langModalOpen
              ? { isOpen: true, type: 'confirmChangeLanguage', data: {} }
              : game.modal
          }
          onClose={() => {
            if (langModalOpen) {
              setLangModalOpen(false);
              setPendingLanguage(null);
            } else {
              game.closeModal();
            }
          }}
          onConfirm={() => {
            if (langModalOpen) {
              handleConfirmLanguageChange();
            } else if (game.modal.type === 'confirmRestart') {
              game.confirmRestart();
            }
          }}
          onStartNext={game.startMatch}
          isSessionCompleted={game.remainingWordsCount === 0}
        />

        <Footer onOpenRules={game.openRulesModal} />
      </div>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <GameAppInner />
    </LanguageProvider>
  );
}

export default App;
