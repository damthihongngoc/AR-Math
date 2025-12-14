import { Loader2 } from 'lucide-react'

const AppLoading = ({ message = 'Đang tải...' }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="text-center text-white">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
        <p className="text-xl font-semibold">{message}</p>
        <p className="text-sm mt-2 opacity-80">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  )
}

export default AppLoading
