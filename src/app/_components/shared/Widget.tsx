import clsx from 'clsx'
import React from 'react'

interface WidgetProps {
  children: React.ReactNode
  className?: string
}

function Widget({ children, className }: WidgetProps) {
  return (
    <div className={clsx('rounded-lg bg-white dark:bg-secondary-900', className)}>{children}</div>
  )
}

export default Widget
