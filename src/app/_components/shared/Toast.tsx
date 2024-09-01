import { AnimatePresence, motion } from 'framer-motion'
import React, { FC, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Check, Info, OctagonX, TriangleAlert, X } from 'lucide-react'

type ToastProps = React.ComponentPropsWithRef<'div'> & {
  variant: 'success' | 'info' | 'warning' | 'error'
  message: string
  className?: string
  open: boolean
  close?: () => void
}

export const Toast: FC<ToastProps> = ({
  variant = 'info',
  message = '',
  className,
  open,
  close,
}) => {
  return (
    <motion.div
      className={clsx(
        'relative w-80 overflow-hidden rounded-md border shadow-lg dark:bg-secondary-800',
        variant === 'info' &&
          'border-primary-300 bg-primary-50 shadow-primary-100 dark:shadow-sm dark:shadow-primary-300',
        variant === 'success' &&
          'border-success-300 bg-success-50 shadow-success-100 dark:shadow-sm dark:shadow-success-300',
        variant === 'warning' &&
          'border-warning-300 bg-warning-50 shadow-warning-100 dark:shadow-sm dark:shadow-warning-300',
        variant === 'error' &&
          'border-danger-300 bg-danger-50 shadow-danger-100 dark:shadow-sm dark:shadow-danger-300',
        className
      )}
      initial={{ x: '100%', opacity: 0 }}
      animate={{
        x: open ? 0 : '100%',
        opacity: open ? 1 : 0,
      }}
      exit={{ x: '100%', opacity: 0 }}
      layout
      transition={{
        x: { duration: 0.3 },
        opacity: { duration: 0.3 },
      }}
    >
      <div
        className={clsx(
          'absolute bottom-0 left-0 top-0 h-full w-[3px] ',
          variant === 'info' && ' bg-primary-300',
          variant === 'success' && ' bg-success-300',
          variant === 'warning' && ' bg-warning-300',
          variant === 'error' && ' bg-danger-300'
        )}
      />
      <div className="flex h-full flex-row items-center justify-between px-3 py-2">
        <div className="flex flex-row items-center space-x-2">
          <div>
            {variant === 'info' && (
              <Info
                className="text-primary-700 dark:text-primary-400"
                aria-hidden="true"
                width={20}
                strokeWidth={1.2}
              />
            )}
            {variant === 'success' && (
              <Check
                className=" text-success-700 dark:text-success-400"
                aria-hidden="true"
                width={20}
                strokeWidth={1.2}
              />
            )}
            {variant === 'warning' && (
              <TriangleAlert
                className="text-warning-700 dark:text-warning-400"
                aria-hidden="true"
                width={20}
                strokeWidth={1.2}
              />
            )}
            {variant === 'error' && (
              <OctagonX
                className="text-danger-700 dark:text-danger-400"
                aria-hidden="true"
                width={20}
                strokeWidth={1.2}
              />
            )}
          </div>
          <p
            className={clsx(
              'text-xs font-semibold',
              variant === 'info' && 'text-primary-700 dark:text-primary-400',
              variant === 'success' && 'text-success-700 dark:text-success-400',
              variant === 'warning' && 'text-warning-700 dark:text-warning-400',
              variant === 'error' && 'text-danger-700 dark:text-danger-400'
            )}
          >
            {message}
          </p>
        </div>
        {close && (
          <button
            onClick={() => close()}
            type="button"
            className={clsx(
              'py-.5 group inline-flex items-center justify-center rounded-md px-1 transition-colors hover:bg-white dark:hover:bg-secondary-900'
            )}
          >
            <span className="sr-only">Dismiss</span>
            <X
              className="text-secondary-950 transition-colors dark:text-secondary-100 dark:group-hover:text-white"
              aria-hidden="true"
              width={16}
              strokeWidth={1.2}
            />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default Toast
