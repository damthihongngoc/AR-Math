import { AlertCircle } from 'lucide-react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
}

const ErrorModal = ({ isOpen, onClose }: ErrorModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-[bounce_0.5s_ease-out]">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4 bg-white/20 rounded-full p-4">
            <AlertCircle size={64} className="text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">Lỗi Phép Toán!</h2>

          {/* Message */}
          <p className="text-white/90 text-lg mb-6 font-normal">
            Phép toán không hợp lệ,
            <br />
            vui lòng liên hệ với giáo viên
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-all hover:scale-105 active:scale-95 font-normal"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
