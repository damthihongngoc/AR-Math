// AR Scene setup and event handling
export function setupARScene(calculator) {
    console.log('Setting up AR scene');

    // Wait for A-Frame scene to load
    document.addEventListener('DOMContentLoaded', function () {
        const sceneEl = document.querySelector('a-scene');

        sceneEl.addEventListener('loaded', function () {
            // Set up target tracking for all 14 targets (0-13)
            for (let i = 0; i <= 13; i++) {
                const anchor = document.querySelector(`#anchor${i}`);
                if (anchor) {
                    setupTargetEvents(anchor, i, calculator);
                }
            }
        });

        sceneEl.addEventListener('arReady', function () {
            calculator.trackingStarted = true;
        });

        sceneEl.addEventListener('arError', function (error) {
            console.error('AR Error:', error);
        });
    });
}

function setupTargetEvents(anchor, targetIndex, calculator) {
    // Target found
    anchor.addEventListener('targetFound', function (event) {
        anchor.setAttribute('visible', true);
        calculator.addTarget(targetIndex, anchor);

        // Start position tracking when first target is found
        if (calculator.activeTargets.size === 1) {
            calculator.startPositionTracking();
        }
    });

    // Target lost
    anchor.addEventListener('targetLost', function (event) {
        anchor.setAttribute('visible', false);
        calculator.removeTarget(targetIndex);

        // Stop tracking if no targets left
        if (calculator.activeTargets.size === 0) {
            calculator.stopPositionTracking();
        }
    });
}

// Global reset function for HTML onclick
export function resetCalculator(calculator) {
    calculator.reset();
    // Also hide all targets
    for (let i = 0; i <= 13; i++) {
        const anchor = document.querySelector(`#anchor${i}`);
        if (anchor) {
            anchor.setAttribute('visible', false);
        }
    }
}