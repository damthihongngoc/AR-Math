// AR Math Quiz System
export class ARMathQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 10;
        this.questions = [];
        this.isAnswering = false;
        this.timer = null;
        this.timeLeft = 30; // seconds per question
        this.maxTime = 30;

        this.detectedNumber = null;
        this.detectionTimeout = null;

        // Generate questions
        this.generateQuestions();

        // UI elements
        this.scoreEl = document.getElementById('scoreValue');
        this.currentQuestionEl = document.getElementById('currentQuestion');
        this.totalQuestionsEl = document.getElementById('totalQuestions');
        this.questionTextEl = document.getElementById('questionText');
        this.feedbackEl = document.getElementById('feedback');
        this.timerFillEl = document.getElementById('timerFill');
        this.resultScreenEl = document.getElementById('resultScreen');

        // Audio elements
        this.soundCorrect = document.getElementById('sound-correct');
        this.soundWrong = document.getElementById('sound-wrong');
        this.soundTimeout = document.getElementById('sound-timeout');
        this.finishSound = document.getElementById('sound-finish');

        // Initialize UI
        this.totalQuestionsEl.textContent = this.totalQuestions;
        this.showQuestion();
    }

    generateQuestions() {
        const operators = ['+', '-', '*', '/'];
        const usedQuestions = new Set();

        while (this.questions.length < this.totalQuestions) {
            const operator = operators[Math.floor(Math.random() * operators.length)];
            let num1, num2, answer;

            if (operator === '+') {
                num1 = Math.floor(Math.random() * 10);  // 0–9
                num2 = Math.floor(Math.random() * 10);
                answer = num1 + num2;
            }
            else if (operator === '-') {
                num1 = Math.floor(Math.random() * 10);  // 0–9
                num2 = Math.floor(Math.random() * 10);

                if (num2 > num1) continue; // tránh số âm

                answer = num1 - num2;
            }
            else if (operator === '*') {
                num1 = Math.floor(Math.random() * 10);  // 0–9
                num2 = Math.floor(Math.random() * 10);
                answer = num1 * num2;
            }
            else if (operator === '/') {
                num2 = Math.floor(Math.random() * 9) + 1; // 1–9 để tránh chia 0

                // num1 phải ≤ 9
                answer = Math.floor(Math.random() * 10); // đáp án từ 0–9
                num1 = num2 * answer; // đảm bảo chia ra số nguyên

                if (num1 > 9) continue; // giữ tất cả số trong khoảng 0–9
            }

            // Đảm bảo đáp án chỉ 0–9
            if (answer < 0 || answer > 9 || !Number.isInteger(answer)) continue;

            const questionKey = `${num1}${operator}${num2}`;
            if (!usedQuestions.has(questionKey)) {
                usedQuestions.add(questionKey);

                const operatorSymbol = operator === '*' ? '×' : operator === '/' ? '÷' : operator;

                this.questions.push({
                    text: `${num1} ${operatorSymbol} ${num2}`,
                    answer: answer
                });
            }
        }
    }

    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.questionTextEl.textContent = `${question.text} = ?`;
        this.currentQuestionEl.textContent = this.currentQuestion + 1;

        this.isAnswering = true;
        this.startTimer();

        console.log(`Question ${this.currentQuestion + 1}: ${question.text} = ${question.answer}`);
    }

    startTimer() {
        this.timeLeft = this.maxTime;
        this.updateTimerBar();

        this.timer = setInterval(() => {
            this.timeLeft -= 0.1;

            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.checkAnswer(-1); // Timeout
            }

            this.updateTimerBar();
        }, 100);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimerBar() {
        const percentage = (this.timeLeft / this.maxTime) * 100;
        this.timerFillEl.style.width = `${percentage}%`;

        // Change color based on time left
        this.timerFillEl.classList.remove('warning', 'danger');
        if (percentage < 30) {
            this.timerFillEl.classList.add('danger');
        } else if (percentage < 60) {
            this.timerFillEl.classList.add('warning');
        }
    }

    onNumberDetected(number) {
        if (!this.isAnswering) return;

        // Clear previous timeout
        if (this.detectionTimeout) {
            clearTimeout(this.detectionTimeout);
        }

        // Store detected number
        this.detectedNumber = number;

        // Wait for stable detection (500ms)
        this.detectionTimeout = setTimeout(() => {
            if (this.detectedNumber === number && this.isAnswering) {
                this.checkAnswer(number);
            }
        }, 500);
    }

    checkAnswer(userAnswer) {
        if (!this.isAnswering) return;

        this.isAnswering = false;
        this.stopTimer();

        const question = this.questions[this.currentQuestion];
        const isCorrect = userAnswer === question.answer;

        if (isCorrect) {
            this.soundCorrect.currentTime = 0;
            this.soundCorrect.play();

            // Calculate bonus points based on time left
            const timeBonus = Math.floor((this.timeLeft / this.maxTime) * 5);
            const points = 10 + timeBonus;
            this.score += points;
            this.scoreEl.textContent = this.score;

            this.showFeedback(true, `+${points} điểm!`);
        } else {
            if (userAnswer === -1) {
                this.soundTimeout.currentTime = 0;
                this.soundTimeout.play();
                this.showFeedback(false, 'Hết giờ!');
            } else {
                this.soundWrong.currentTime = 0;
                this.soundWrong.play();
                this.showFeedback(false, 'Sai rồi!');
            }
        }

        // Move to next question
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 2000);
    }

    showFeedback(isCorrect, message) {
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = 'feedback show ' + (isCorrect ? 'correct' : 'incorrect');

        setTimeout(() => {
            this.feedbackEl.classList.remove('show');
        }, 1500);
    }

    showResults() {
        this.finishSound.currentTime = 0;
        this.finishSound.play();

        this.stopTimer();

        const finalScoreEl = document.getElementById('finalScore');
        const resultMessageEl = document.getElementById('resultMessage');

        finalScoreEl.textContent = this.score;

        // Calculate percentage
        const maxScore = this.totalQuestions * 15; // 10 base + 5 max bonus
        const percentage = (this.score / maxScore) * 100;

        let message = '';
        if (percentage >= 90) {
            message = '🌟 Xuất sắc! Bạn thật giỏi toán!';
        } else if (percentage >= 75) {
            message = '🎉 Làm rất tốt! Tiếp tục phát huy!';
        } else if (percentage >= 60) {
            message = '👍 Khá tốt! Cố gắng thêm nhé!';
        } else if (percentage >= 40) {
            message = '💪 Không tệ! Hãy luyện tập thêm!';
        } else {
            message = '📚 Cần cố gắng hơn! Bạn sẽ tiến bộ!';
        }

        resultMessageEl.textContent = message;
        this.resultScreenEl.classList.remove('hidden');
    }

    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.isAnswering = false;
        this.questions = [];
        this.detectedNumber = null;

        this.scoreEl.textContent = '0';
        this.resultScreenEl.classList.add('hidden');

        this.generateQuestions();
        this.showQuestion();
    }
}