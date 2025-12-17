import { House, RefreshCcw } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate } from 'react-router'
import PageOverlay from 'src/components/common/PageOverlay'
import MindARViewer from 'src/components/mindar/viewer'
import useQuizMode from 'src/hooks/useQuizMode'

const Quiz = () => {
  const sceneRef = useRef(null)
  const navigate = useNavigate()

  const {
    quizState,
    currentQuestionData,
    totalQuestions,
    maxTime,
    restartQuiz,
    isARReady,
  } = useQuizMode(sceneRef)

  // Calculate timer percentage
  const timerPercentage = (quizState.timeLeft / maxTime) * 100

  // Timer color classes
  const getTimerColorClass = () => {
    if (timerPercentage < 30)
      return 'bg-[linear-gradient(90deg,#ff4444,#cc0000)]'
    if (timerPercentage < 60)
      return 'bg-[linear-gradient(90deg,#ffaa00,#ff6600)]'
    return 'bg-[linear-gradient(90deg,#00ff88,#00cc66)]'
  }

  // Result message
  const getResultMessage = () => {
    const maxScore = totalQuestions * 15
    const percentage = (quizState.score / maxScore) * 100

    if (percentage >= 90) return '🌟 Xuất sắc! Em thật giỏi toán!'
    if (percentage >= 75) return '🎉 Làm rất lắm! Tiếp tục phát huy nha!'
    if (percentage >= 60) return '👍 Khá tốt! Cố gắng thêm nhé!'
    if (percentage >= 40) return '💪 Không tệ! Cần luyện tập đó!'
    return '📚 Cần cố gắng hơn! Lần tới đạt điểm cao hơn nha!'
  }

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden">
      {/* Quiz UI */}
      {isARReady && (
        <div className="fixed top-[40px] left-1/2 translate-x-[-50%] w-[90%] max-w-lg z-50 pointer-events-none">
          {/* Score and Progress */}
          <div className="flex justify-between items-center px-4 py-5 bg-[rgba(255,255,255,0.95)] rounded-lg mb-4 shadow-[0_5px_20px_rgba(0,0,0,0.2)]">
            <div className="text-2xl font-bold text-[#0b5599] flex items-center">
              <span className="mr-3 font-normal">Điểm số:</span>
              <span className="text-3xl text-orange-500">
                {quizState.score}
              </span>
            </div>
            <div className="text-xl font-medium text-gray-500">
              <span className="text-[#0b5599] font-bold">
                {quizState.currentQuestion + 1}
              </span>{' '}
              /
              <span className="text-[#6ba3d8] font-bold">
                {' '}
                {totalQuestions}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-[#0b5599]">
            {currentQuestionData?.type === 'math' ? (
              <div
                className="
                font-['Alfa_Slab_One']
                text-center
                font-normal
                text-4xl
                text-white
                mb-4
                [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]
              "
              >
                {currentQuestionData.text} = ?
              </div>
            ) : currentQuestionData?.type === 'count' ? (
              <>
                <div
                  className="
                  font-['Alfa_Slab_One']
                  text-center
                  font-normal
                  text-3xl
                  text-white
                  mb-6
                  [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]
                "
                >
                  {currentQuestionData.text}
                </div>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {Array.from({
                    length: currentQuestionData.objectCount || 0,
                  }).map((_, idx) => (
                    <div
                      key={idx}
                      className="text-6xl animate-[bounce_1s_ease-in-out_infinite]"
                      style={{
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    >
                      {currentQuestionData.objectType}
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <div className="text-xl text-[rgba(255,255,255,0.8)] mb-6 text-center">
              Giơ thẻ số lên để trả lời!
            </div>

            {/* Timer Bar */}
            <div className="w-full h-3 overflow-hidden rounded-full bg-[rgba(255,255,255,0.3)]">
              <div
                className={`h-full transition-[width] duration-100 ease-linear ${getTimerColorClass()}`}
                style={{ width: `${timerPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Feedback */}
          {quizState.feedback.show && (
            <div
              className={`
              fixed
              min-w-[350px]
              top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              px-[50px] py-[30px]
              rounded-[20px]
              text-[48px]
              font-bold
              text-white
              text-center
              z-[200]
              transition-all
              duration-300
              ease-in-out
              pointer-events-none
              ${quizState.feedback.isCorrect ? 'bg-[#4caf50]' : 'bg-[#f44336]'}
              scale-100 opacity-100
            `}
            >
              {quizState.feedback.message}
            </div>
          )}
        </div>
      )}

      {/* Result Screen */}
      <div
        className={`
          fixed inset-0
          flex items-center justify-center
          bg-gradient-to-br from-[#1e3c72] to-[#2a5298]
          z-[300]
          transition-opacity duration-500 ease-in-out
          ${
            quizState.showResults
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }
        `}
      >
        <div
          className="
            bg-white
            p-[50px]
            rounded-[30px]
            shadow-[0_20px_60px_rgba(0,0,0,0.3)]
            text-center
            max-w-[500px]
            w-[90%]
          "
        >
          <h2
            className="
              font-['Alfa_Slab_One']
              font-normal
              text-[48px]
              text-[#0b5599]
              mb-[30px]
              uppercase
            "
          >
            Hoàn thành!
          </h2>

          <div className="my-[30px]">
            <div
              className="
                inline-flex
                flex-col
                items-center
                justify-center
                w-[200px]
                h-[200px]
                rounded-full
                bg-[#0b5599]
                transition-all
                duration-1000
                ease-in-out
              "
            >
              <span
                className="
                  text-[72px]
                  font-bold
                  text-white
                  leading-none
                "
              >
                {quizState.score}
              </span>
            </div>
          </div>

          <div
            className="
              text-[24px]
              text-[#555]
              my-[30px]
              leading-relaxed
            "
          >
            {getResultMessage()}
          </div>

          <div
            className="
              flex
              gap-[20px]
              justify-center
              mt-[40px]
            "
          >
            <button
              onClick={restartQuiz}
              className="
                flex items-center gap-[10px]
                px-[30px] py-[15px]
                text-[18px]
                font-normal
                rounded-[10px]
                bg-[#c2dcff]
                text-[#00357a]
                transition-all
                duration-300
                hover:-translate-y-[3px]
                hover:shadow-[0_5px_20px_rgba(0,0,0,0.3)]
                pointer-events-auto
                cursor-pointer
              "
            >
              <RefreshCcw /> Chơi lại
            </button>

            <button
              onClick={() => navigate('/')}
              className="
                flex items-center gap-[10px]
                px-[30px] py-[15px]
                text-[18px]
                font-normal
                rounded-[10px]
                bg-[#0b5599]
                text-white
                transition-all
                duration-300
                hover:-translate-y-[3px]
                hover:shadow-[0_5px_20px_rgba(0,0,0,0.3)]
                pointer-events-auto
                cursor-pointer
              "
            >
              <House /> Trang chủ
            </button>
          </div>
        </div>
      </div>

      {/* AR View */}
      <div className="absolute inset-0 w-full h-full z-0">
        <MindARViewer sceneRef={sceneRef} />
      </div>

      <PageOverlay />
    </div>
  )
}

export default Quiz
