'use client'

import { AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { ToastContext, ToastProps, ToastState } from '../app/contexts/ToastContext'
import Toast from '@/app/_components/shared/Toast'

const initialState: ToastState = {
  toasts: [],
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ToastState>(initialState)

  const addToast = (toast: ToastProps) => {
    setState((prevState) => ({
      ...prevState,
      toasts: [...prevState.toasts, toast],
    }))
  }

  const deleteToast = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      toasts: prevState.toasts.filter((toast) => toast.id !== id),
    }))
  }

  return (
    <ToastContext.Provider value={{ state, addToast, deleteToast }}>
      <div
        className="absolute top-4"
        style={{
          right: '1rem',
          // Set it manually because Modal overlay has a z-index of 50, and tailwind max z-index is 50
          zIndex: 100,
        }}
      >
        <div className="flex flex-col items-end gap-4">
          <AnimatePresence>
            {state.toasts.map((toast) => (
              <Toast
                key={toast.id}
                variant={toast.variant}
                message={toast.message}
                open={true}
                close={() => deleteToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      {children}
    </ToastContext.Provider>
  )
}
