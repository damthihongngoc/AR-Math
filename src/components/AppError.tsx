import React from 'react'

interface AppErrorProps {
  title?: string
  message: string
  variant?: 'error' | 'warning' | 'info'
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

const VARIANT_STYLES = {
  error: {
    border: 'border-red-500',
    bg: 'bg-red-500/20',
    button: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-500/20',
    button: 'bg-yellow-500 hover:bg-yellow-600',
  },
  info: {
    border: 'border-blue-500',
    bg: 'bg-blue-500/20',
    button: 'bg-blue-500 hover:bg-blue-600',
  },
}

const AppError: React.FC<AppErrorProps> = ({
  title = 'Đã xảy ra lỗi',
  message,
  variant = 'error',
  primaryAction,
  secondaryAction,
}) => {
  const styles = VARIANT_STYLES[variant]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className={`max-w-md mx-4 rounded-xl border-2 p-6 text-white ${styles.border} ${styles.bg} z-[9999]`}
      >
        <h3 className="text-xl font-bold mb-2">{title}</h3>

        <p className="mb-6 text-white/90">{message}</p>

        <div className="flex flex-col gap-3">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`w-full rounded font-semibold py-2 transition-colors ${styles.button}`}
            >
              {primaryAction.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="w-full rounded border border-white/30 py-2 text-white/80 hover:bg-white/10 transition"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppError
