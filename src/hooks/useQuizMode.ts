import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import AudioManager from 'src/services/audio-manager'

interface Question {
  type: 'math' | 'count'
  text: string
  answer: number
  objectType?: string
  objectCount?: number
}

interface QuizState {
  currentQuestion: number
  score: number
  timeLeft: number
  isAnswering: boolean
  feedback: {
    show: boolean
    isCorrect: boolean
    message: string
  }
  showResults: boolean
}

interface UseQuizModeReturn {
  quizState: QuizState
  currentQuestionData: Question | null
  totalQuestions: number
  maxTime: number
  restartQuiz: () => void
  isARReady: boolean
}

const MAX_TIME_PER_QUESTION = 15
const MAX_QUESTIONS = 10

const useQuizMode = (sceneRef: RefObject<any>): UseQuizModeReturn => {
  const audioManager = useRef<AudioManager>(AudioManager.getInstance())
  const detectedNumber = useRef<number | null>(null)
  const detectionTimeout = useRef<NodeJS.Timeout | null>(null)
  const timerInterval = useRef<NodeJS.Timeout | null>(null)

  const [isARReady, setIsARReady] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    timeLeft: MAX_TIME_PER_QUESTION,
    isAnswering: false,
    feedback: {
      show: false,
      isCorrect: false,
      message: '',
    },
    showResults: false,
  })

  const totalQuestions = MAX_QUESTIONS
  const maxTime = MAX_TIME_PER_QUESTION

  const countObjects = [
    { name: '🍎', label: 'quả táo' },
    { name: '⭐', label: 'ngôi sao' },
    { name: '🎈', label: 'quả bóng bay' },
    { name: '🌸', label: 'bông hoa' },
    { name: '🦋', label: 'con bướm' },
    { name: '🐟', label: 'con cá' },
    { name: '🎁', label: 'hộp quà' },
    { name: '🍪', label: 'chiếc bánh quy' },
    { name: '🚗', label: 'chiếc xe' },
    { name: '🐶', label: 'chú chó' },
    { name: '🐱', label: 'con mèo' },
    { name: '🌞', label: 'ông mặt trời' },
    { name: '🌙', label: 'ông mặt trăng' },
    { name: '⚽', label: 'quả bóng đá' },
    { name: '🏀', label: 'quả bóng rổ' },
    { name: '🎲', label: 'con xúc xắc' },
    { name: '📚', label: 'quyển sách' },
    { name: '✏️', label: 'cây bút chì' },
    { name: '🌈', label: 'cầu vồng' },
    { name: '🍄', label: 'cây nấm' },
    { name: '🍇', label: 'chùm nho' },
    { name: '🍉', label: 'quả dưa hấu' },
    { name: '🍓', label: 'quả dâu tây' },
    { name: '🍌', label: 'quả chuối' },
    { name: '🍍', label: 'quả dứa' },
    { name: '🥕', label: 'củ cà rốt' },
  ]

  const generateQuestions = () => {
    const newQuestions: Question[] = []
    const usedQuestions = new Set<string>()
    const operators = ['+', '-', '*', '/']

    while (newQuestions.length < totalQuestions) {
      const isMathQuestion = Math.random() < 0.5

      if (isMathQuestion) {
        const operator = operators[Math.floor(Math.random() * operators.length)]
        let num1: number, num2: number, answer: number

        if (operator === '+') {
          num1 = Math.floor(Math.random() * 10)
          num2 = Math.floor(Math.random() * 10)
          answer = num1 + num2
        } else if (operator === '-') {
          num1 = Math.floor(Math.random() * 10)
          num2 = Math.floor(Math.random() * 10)
          if (num2 > num1) continue
          answer = num1 - num2
        } else if (operator === '*') {
          num1 = Math.floor(Math.random() * 10)
          num2 = Math.floor(Math.random() * 10)
          answer = num1 * num2
        } else {
          num2 = Math.floor(Math.random() * 9) + 1
          answer = Math.floor(Math.random() * 10)
          num1 = num2 * answer
          if (num1 > 9) continue
        }

        if (answer < 0 || answer > 9 || !Number.isInteger(answer)) continue

        const questionKey = `${num1}${operator}${num2}`
        if (!usedQuestions.has(questionKey)) {
          usedQuestions.add(questionKey)
          const operatorSymbol =
            operator === '*' ? '×' : operator === '/' ? '÷' : operator
          newQuestions.push({
            type: 'math',
            text: `${num1} ${operatorSymbol} ${num2}`,
            answer: answer,
          })
        }
      } else {
        const objectData =
          countObjects[Math.floor(Math.random() * countObjects.length)]
        const count = Math.floor(Math.random() * 9) + 1

        const questionKey = `count-${objectData.name}-${count}`
        if (!usedQuestions.has(questionKey)) {
          usedQuestions.add(questionKey)
          newQuestions.push({
            type: 'count',
            text: `Có mấy ${objectData.label}?`,
            answer: count,
            objectType: objectData.name,
            objectCount: count,
          })
        }
      }
    }

    setQuestions(newQuestions)
  }

  const startTimer = () => {
    setQuizState((prev) => ({ ...prev, timeLeft: maxTime }))

    timerInterval.current = setInterval(() => {
      setQuizState((prev) => {
        const newTimeLeft = Math.max(0, prev.timeLeft - 0.1)

        if (newTimeLeft <= 0 && prev.isAnswering) {
          checkAnswer(-1)
          return { ...prev, timeLeft: 0 }
        }

        return { ...prev, timeLeft: newTimeLeft }
      })
    }, 100)
  }

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
      timerInterval.current = null
    }
  }

  const showQuestion = () => {
    setQuizState((prev) => ({
      ...prev,
      isAnswering: true,
      feedback: {
        show: false,
        isCorrect: false,
        message: '',
      },
    }))

    startTimer()
  }

  const checkAnswer = (userAnswer: number) => {
    setQuizState((prev) => {
      if (!prev.isAnswering) return prev

      const question = questions[prev.currentQuestion]
      const isCorrect = userAnswer === question.answer
      const isLastQuestion = prev.currentQuestion + 1 >= totalQuestions

      stopTimer()

      // Play sound using AudioManager
      if (isCorrect) {
        audioManager.current.play('sound-correct')
      } else {
        userAnswer === -1
          ? audioManager.current.play('sound-timeout')
          : audioManager.current.play('sound-wrong')
      }

      const timeBonus = isCorrect
        ? Math.floor((prev.timeLeft / maxTime) * 5)
        : 0
      const points = isCorrect ? 10 + timeBonus : 0

      if (isLastQuestion) {
        audioManager.current.play('sound-finish')

        return {
          ...prev,
          score: prev.score + points,
          isAnswering: false,
          feedback: {
            show: true,
            isCorrect,
            message: isCorrect
              ? `+${points} điểm!`
              : userAnswer === -1
              ? 'Hết giờ!'
              : 'Sai rồi!',
          },
          showResults: true,
        }
      }

      return {
        ...prev,
        score: prev.score + points,
        isAnswering: false,
        currentQuestion: prev.currentQuestion + 1,
        feedback: {
          show: true,
          isCorrect,
          message: isCorrect
            ? `+${points} điểm!`
            : userAnswer === -1
            ? 'Hết giờ!'
            : 'Sai rồi!',
        },
      }
    })
  }

  const restartQuiz = () => {
    stopTimer()
    setQuizState({
      currentQuestion: 0,
      score: 0,
      timeLeft: maxTime,
      isAnswering: false,
      feedback: { show: false, isCorrect: false, message: '' },
      showResults: false,
    })
    generateQuestions()
  }

  const onNumberDetected = (number: number) => {
    if (!quizState.isAnswering) return

    if (detectionTimeout.current) {
      clearTimeout(detectionTimeout.current)
    }

    detectedNumber.current = number

    detectionTimeout.current = setTimeout(() => {
      if (detectedNumber.current === number && quizState.isAnswering) {
        checkAnswer(number)
      }
    }, 800)
  }

  useEffect(() => {
    const sceneEl = sceneRef.current
    if (!sceneEl) return

    const handleARReady = () => {
      setIsARReady(true)
    }

    sceneEl.addEventListener('arReady', handleARReady)

    return () => {
      sceneEl.removeEventListener('arReady', handleARReady)
    }
  }, [sceneRef])

  useEffect(() => {
    // Create audios using AudioManager
    const manager = audioManager.current
    manager.createAudio('quiz-bg', {
      src: '/audios/background/quiz.mp3',
      loop: true,
      volume: 0.3,
      type: 'background',
    })

    manager.createAudio('sound-correct', {
      src: '/audios/bgm/correct.mp3',
      volume: 0.5,
      type: 'effect',
    })

    manager.createAudio('sound-wrong', {
      src: '/audios/bgm/wrong.mp3',
      volume: 0.5,
      type: 'effect',
    })

    manager.createAudio('sound-timeout', {
      src: '/audios/bgm/timeout.mp3',
      volume: 0.5,
      type: 'effect',
    })

    manager.createAudio('sound-finish', {
      src: '/audios/bgm/finish.mp3',
      volume: 0.5,
      type: 'effect',
    })

    manager.play('quiz-bg')
    generateQuestions()

    return () => {
      manager.stop('quiz-bg')
      manager.removeAudio('quiz-bg')
      manager.removeAudio('sound-correct')
      manager.removeAudio('sound-wrong')
      manager.removeAudio('sound-timeout')
      manager.removeAudio('sound-finish')

      stopTimer()
      if (detectionTimeout.current) {
        clearTimeout(detectionTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    if (
      questions.length > 0 &&
      quizState.currentQuestion < totalQuestions &&
      !quizState.showResults
    ) {
      setTimeout(() => {
        showQuestion()
      }, 1000)
    }
  }, [questions, quizState.currentQuestion])

  useEffect(() => {
    const sceneEl = sceneRef.current
    if (!sceneEl) return

    const handleTargetFound = async (e: Event): Promise<void> => {
      const target = e.target as HTMLElement
      const index = parseInt(target.id.replace('anchor', ''))

      if (index >= 0 && index <= 9) {
        onNumberDetected(index)
      }
    }

    const handleTargetLost = (e: Event): void => {
      const target = e.target as HTMLElement
      const index = parseInt(target.id.replace('anchor', ''))

      if (detectedNumber.current === index) {
        if (detectionTimeout.current) {
          clearTimeout(detectionTimeout.current)
          detectionTimeout.current = null
        }
        detectedNumber.current = null
      }
    }

    for (let i = 0; i <= 9; i++) {
      const anchor = document.getElementById(`anchor${i}`)
      if (!anchor) continue
      anchor.addEventListener('targetFound', handleTargetFound)
      anchor.addEventListener('targetLost', handleTargetLost)
    }

    return () => {
      for (let i = 0; i <= 9; i++) {
        const anchor = document.getElementById(`anchor${i}`)
        if (!anchor) continue
        anchor.removeEventListener('targetFound', handleTargetFound)
        anchor.removeEventListener('targetLost', handleTargetLost)
      }
    }
  }, [sceneRef, quizState.isAnswering])

  return {
    quizState,
    currentQuestionData: questions[quizState.currentQuestion] || null,
    totalQuestions,
    maxTime,
    restartQuiz,
    isARReady,
  }
}

export default useQuizMode
