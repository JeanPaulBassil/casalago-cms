import { useRef, useEffect, useCallback } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebouncedFunction = (...args: any[]) => void

const useDebouncedCallback = (callback: DebouncedFunction, delay: number): DebouncedFunction => {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const debouncedFunction = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }

      debounceTimeout.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  return debouncedFunction
}

export default useDebouncedCallback
