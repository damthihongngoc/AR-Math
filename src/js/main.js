import { ARMathCalculator } from './core/calculator.js';
import { setupARScene, resetCalculator as resetCalc } from './ar/scene-setup.js';

// Initialize calculator
const calculator = new ARMathCalculator();

// Setup AR scene with calculator
setupARScene(calculator);

// Global function for HTML onclick (make it available to window)
window.resetCalculator = function () {
    resetCalc(calculator);
};

// Export calculator for debugging or external access
window.calculator = calculator;