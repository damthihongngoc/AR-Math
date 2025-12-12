import { ARMathQuiz } from './system.js';
import { setupQuizScene } from './scene-setup.js';

// Initialize quiz
const quiz = new ARMathQuiz();

// Setup AR scene with quiz
setupQuizScene(quiz);

// Global function for restart button
window.restartQuiz = function () {
    quiz.restart();
};

// Export quiz for debugging
window.quiz = quiz;

console.log('AR Math Quiz initialized');