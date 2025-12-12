// AR Scene setup for Quiz
export function setupQuizScene(quiz) {
    console.log('Setting up AR Quiz scene');

    document.addEventListener('DOMContentLoaded', function () {
        const sceneEl = document.querySelector('a-scene');

        sceneEl.addEventListener('loaded', function () {
            console.log('Scene loaded, setting up number targets');

            // Set up only number targets (0-9)
            for (let i = 0; i <= 9; i++) {
                const anchor = document.querySelector(`#anchor${i}`);
                if (anchor) {
                    setupNumberTarget(anchor, i, quiz);
                } else {
                    console.warn(`Anchor ${i} not found`);
                }
            }
        });

        sceneEl.addEventListener('arReady', function () {
            console.log('AR Ready');
        });

        sceneEl.addEventListener('arError', function (error) {
            console.error('AR Error:', error);
        });
    });
}

function setupNumberTarget(anchor, number, quiz) {
    let isCurrentlyVisible = false;
    let detectionTimer = null;

    // Target found
    anchor.addEventListener('targetFound', function () {
        anchor.setAttribute('visible', true);
        isCurrentlyVisible = true;

        console.log(`Number ${number} detected`);

        // Clear any existing timer
        if (detectionTimer) {
            clearTimeout(detectionTimer);
        }

        // Start detection timer
        detectionTimer = setTimeout(() => {
            if (isCurrentlyVisible) {
                quiz.onNumberDetected(number);
            }
        }, 300); // 300ms stable detection
    });

    // Target lost
    anchor.addEventListener('targetLost', function () {
        anchor.setAttribute('visible', false);
        isCurrentlyVisible = false;

        console.log(`Number ${number} lost`);

        // Clear detection timer
        if (detectionTimer) {
            clearTimeout(detectionTimer);
            detectionTimer = null;
        }
    });
}