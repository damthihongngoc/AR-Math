import { toast, type ToastT } from 'sonner'

import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'

type ExternalToast = Omit<
  ToastT,
  'id' | 'type' | 'title' | 'jsx' | 'delete' | 'promise'
> & {
  id?: number | string
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
}

export const AppToast = {
  success: (message: string | React.ReactNode, data: ExternalToast = {}) =>
    toast.success(message, {
      ...data,
      position: data.position ?? 'top-center',
      duration: 3000,
    }),
  info: (message: string | React.ReactNode, data: ExternalToast = {}) =>
    toast.info(message, {
      ...data,
      position: data.position ?? 'top-center',
      duration: 3000,
    }),
  warning: (message: string | React.ReactNode, data: ExternalToast = {}) =>
    toast.warning(message, {
      ...data,
      position: data.position ?? 'top-center',
      duration: 3000,
    }),
  error: (message: string | React.ReactNode, data: ExternalToast = {}) =>
    toast.error(message ?? 500, {
      ...data,
      position: data.position ?? 'top-center',
      duration: 3000,
    }),
  message: (message: string | React.ReactNode, data: ExternalToast = {}) =>
    toast.message(message, {
      ...data,
      position: data.position ?? 'top-center',
      duration: 3000,
    }),
  loading: (message: string | React.ReactNode, data: ExternalToast = {}) =>
    toast.loading(message, {
      ...data,
      position: data.position ?? 'top-center',
      duration: 3000,
    }),
}

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': '#c2dcff',
          '--normal-text': '#00357a',
          '--normal-border': '#00357a',
          '--border-radius': '12px',
          '--font-family': 'Alfa Slab One, sans-serif',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
