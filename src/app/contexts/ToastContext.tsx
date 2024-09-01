'use client'

import { createContext, useContext } from 'react'

export interface ToastProps {
  id: string
  message: string
  variant: 'success' | 'info' | 'warning' | 'error'
}

export interface ToastState {
  toasts: ToastProps[]
}

export const ToastContext = createContext<
  | {
      state: ToastState
      addToast: (toast: ToastProps) => void
      deleteToast: (id: string) => void
    }
  | undefined
>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  const { addToast, deleteToast } = context

  const addToastWithTimeout = (
    variant: 'success' | 'info' | 'warning' | 'error',
    message: string,
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    addToast({ id, message, variant })
    setTimeout(() => {
      deleteToast(id)
    }, duration)
  }

  const toast = {
    success: (message: string) => addToastWithTimeout('success', message),
    warning: (message: string) => addToastWithTimeout('warning', message),
    info: (message: string) => addToastWithTimeout('info', message),
    error: (message: string) => addToastWithTimeout('error', message),
  }

  return { ...toast }
}
