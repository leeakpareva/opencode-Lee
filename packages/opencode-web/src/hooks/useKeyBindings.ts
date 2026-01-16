import { useEffect } from 'react'

interface KeyBinding {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
}

export function useKeyBindings(bindings: KeyBinding[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const binding of bindings) {
        const ctrlMatch = binding.ctrl ? e.ctrlKey : !e.ctrlKey
        const shiftMatch = binding.shift ? e.shiftKey : !e.shiftKey
        const altMatch = binding.alt ? e.altKey : !e.altKey
        const keyMatch = e.key.toLowerCase() === binding.key.toLowerCase()

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault()
          binding.action()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [bindings])
}