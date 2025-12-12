import { ExpressionProcessor } from './expression.js';

// Main Math Calculator System
export class ARMathCalculator {
    constructor() {
        this.activeTargets = new Map(); // targetIndex -> {position, type, value}
        this.trackingStarted = false;
        this.currentExpression = null;
        this.currentResult = null;
        this.updateInterval = null;

        // THREE.js temp objects
        this.tempPos = new THREE.Vector3();
        this.tempQuat = new THREE.Quaternion();
        this.tempScale = new THREE.Vector3();

        // Virtual result positioning
        this.virtualEqualAnchor = null;
        this.virtualResultAnchor = null;
        this.virtualEqualOffset = new THREE.Vector3(0.8, 0, 0);
        this.virtualResultOffset = new THREE.Vector3(1.5, 0, 0);

        // Target definitions
        this.targetTypes = {
            // Numbers
            0: { type: 'number', value: 0, symbol: '0' },
            1: { type: 'number', value: 1, symbol: '1' },
            2: { type: 'number', value: 2, symbol: '2' },
            3: { type: 'number', value: 3, symbol: '3' },
            4: { type: 'number', value: 4, symbol: '4' },
            5: { type: 'number', value: 5, symbol: '5' },
            6: { type: 'number', value: 6, symbol: '6' },
            7: { type: 'number', value: 7, symbol: '7' },
            8: { type: 'number', value: 8, symbol: '8' },
            9: { type: 'number', value: 9, symbol: '9' },
            // Operators
            10: { type: 'operator', value: '+', symbol: '+' },
            11: { type: 'operator', value: '-', symbol: '-' },
            12: { type: 'operator', value: '*', symbol: '×' },
            13: { type: 'operator', value: '/', symbol: '÷' }
        };

        this.resultModels = {
            0: '#zeroModel', 1: '#oneModel', 2: '#twoModel', 3: '#threeModel',
            4: '#fourModel', 5: '#fiveModel', 6: '#sixModel', 7: '#sevenModel',
            8: '#eightModel', 9: '#nineModel'
        };

        // Initialize processors
        this.expressionProcessor = new ExpressionProcessor();
    }

    getWorldPosition(anchor) {
        anchor.object3D.updateMatrixWorld(true);
        anchor.object3D.matrixWorld.decompose(this.tempPos, this.tempQuat, this.tempScale);
        return { x: this.tempPos.x, y: this.tempPos.y, z: this.tempPos.z };
    }

    addTarget(targetIndex, anchor) {
        const position = this.getWorldPosition(anchor);
        const targetInfo = this.targetTypes[targetIndex];

        this.activeTargets.set(targetIndex, {
            position,
            type: targetInfo.type,
            value: targetInfo.value,
            symbol: targetInfo.symbol,
            anchor: anchor
        });

        console.log(`➕ Added ${targetInfo.symbol} at (${position.x.toFixed(2)}, ${position.y.toFixed(2)})`);
        this.analyzeExpression();
    }

    removeTarget(targetIndex) {
        if (this.activeTargets.has(targetIndex)) {
            const target = this.activeTargets.get(targetIndex);
            console.log(`➖ Removed ${target.symbol}`);
            this.activeTargets.delete(targetIndex);
            this.hideVirtualResults();
            this.analyzeExpression();
        }
    }

    updateTargetPosition(targetIndex, anchor) {
        if (this.activeTargets.has(targetIndex)) {
            this.activeTargets.get(targetIndex).position = this.getWorldPosition(anchor);
        }
    }

    analyzeExpression() {
        if (this.activeTargets.size < 3) {
            this.currentExpression = null;
            this.currentResult = null;
            return;
        }

        // Get all active targets as array
        const targets = Array.from(this.activeTargets.entries()).map(([idx, data]) => ({
            index: idx,
            ...data
        }));

        // Sort by X position (left to right)
        targets.sort((a, b) => a.position.x - b.position.x);

        // Look for pattern: number + operator + number
        const expression = this.expressionProcessor.findExpressions(targets);

        if (expression) {
            this.currentExpression = expression;
            this.currentResult = this.expressionProcessor.calculateResult(expression);

            if (this.currentResult !== null) {
                this.displayVirtualResult(expression);
            }
        } else {
            this.currentExpression = null;
            this.currentResult = null;
        }
    }

    displayVirtualResult(expression) {
        if (this.currentResult === null) return;

        const equalEntity = document.getElementById('virtual-equal');
        const resultEntity = document.getElementById('virtual-result');

        // Update visibility
        equalEntity.object3D.visible = true;
        resultEntity.object3D.visible = true;

        // Don't recreate if same result
        if (resultEntity.dataset.currentResult === String(this.currentResult)) {
            return;
        }

        // Clear old model
        while (resultEntity.firstChild) {
            resultEntity.removeChild(resultEntity.firstChild);
        }

        const operand2Anchor = expression.operand2.anchor;

        this.virtualEqualAnchor = operand2Anchor;
        this.virtualResultAnchor = operand2Anchor;

        // Convert result to string to get individual digits
        const resultStr = String(Math.abs(this.currentResult));
        const digits = resultStr.split('');

        const digitSpacing = 0.6;

        digits.forEach((digit, index) => {
            const modelEl = document.createElement('a-gltf-model');
            modelEl.setAttribute('src', this.resultModels[parseInt(digit)]);
            modelEl.setAttribute('rotation', '90 0 0');
            modelEl.setAttribute('scale', '0.05 0.05 0.05');

            // Position each digit with offset
            const xOffset = index * digitSpacing;
            modelEl.setAttribute('position', `${xOffset} 0 0`);

            resultEntity.appendChild(modelEl);
        });

        // Handle negative sign if needed
        if (this.currentResult < 0) {
            const minusEl = document.createElement('a-gltf-model');
            minusEl.setAttribute('src', '#minusModel'); // Cần có model cho dấu trừ
            minusEl.setAttribute('rotation', '90 0 0');
            minusEl.setAttribute('scale', '0.05 0.05 0.05');
            minusEl.setAttribute('position', `-${digitSpacing} 0 0`);
            resultEntity.insertBefore(minusEl, resultEntity.firstChild);
        }

        resultEntity.dataset.currentResult = String(this.currentResult);
    }

    hideVirtualResults() {
        const equalEl = document.getElementById('virtual-equal');
        const resultEl = document.getElementById('virtual-result');

        // Stop matrix updates
        this.virtualEqualAnchor = null;
        this.virtualResultAnchor = null;

        // Hide immediately
        if (equalEl && equalEl.object3D) {
            equalEl.object3D.visible = false;
            equalEl.setAttribute('visible', false);
        }

        if (resultEl && resultEl.object3D) {
            resultEl.object3D.visible = false;
            resultEl.setAttribute('visible', false);
            // Clean up models
            while (resultEl.firstChild) resultEl.removeChild(resultEl.firstChild);
            delete resultEl.dataset.currentResult;
        }
    }

    startPositionTracking() {
        if (this.updateInterval) return;

        this.updateInterval = setInterval(() => {
            // Update positions of all active targets
            this.activeTargets.forEach((data, targetIndex) => {
                this.updateTargetPosition(targetIndex, data.anchor);
            });

            // Update virtual entities if operand2 still exists
            if (this.currentExpression) {
                const operand2Anchor = this.currentExpression.operand2.anchor;

                if (this.activeTargets.has(this.currentExpression.operand2.index)) {
                    // Equal
                    const equalEntity = document.getElementById('virtual-equal');
                    const equalMatrix = operand2Anchor.object3D.matrixWorld.clone();
                    equalMatrix.multiply(new THREE.Matrix4().makeTranslation(
                        this.virtualEqualOffset.x,
                        this.virtualEqualOffset.y,
                        this.virtualEqualOffset.z
                    ));
                    equalEntity.object3D.matrix.copy(equalMatrix);
                    equalEntity.object3D.matrixAutoUpdate = false;
                    equalEntity.object3D.visible = true;

                    // Result
                    const resultEntity = document.getElementById('virtual-result');
                    const resultMatrix = operand2Anchor.object3D.matrixWorld.clone();
                    resultMatrix.multiply(new THREE.Matrix4().makeTranslation(
                        this.virtualResultOffset.x,
                        this.virtualResultOffset.y,
                        this.virtualResultOffset.z
                    ));
                    resultEntity.object3D.matrix.copy(resultMatrix);
                    resultEntity.object3D.matrixAutoUpdate = false;
                    resultEntity.object3D.visible = true;
                }
            }

            // Reanalyze expression with updated positions
            if (this.activeTargets.size >= 3) {
                this.analyzeExpression();
            }
        }, 100);
    }

    stopPositionTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    reset() {
        this.activeTargets.clear();
        this.currentExpression = null;
        this.currentResult = null;
        this.hideVirtualResults();
    }
}