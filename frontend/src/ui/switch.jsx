import * as React from 'react'
import { cn } from '../lib/utils'

export const Switch = React.forwardRef(function Switch(
  { checked, defaultChecked, onCheckedChange, disabled = false, className, ...props },
  ref,
) {
  const isControlled = checked !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(!!defaultChecked)
  const isOn = isControlled ? !!checked : uncontrolled

  const toggle = () => {
    if (disabled) return
    if (!isControlled) setUncontrolled((v) => !v)
    onCheckedChange?.(!isOn)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      data-state={isOn ? 'checked' : 'unchecked'}
      aria-disabled={disabled}
      onClick={toggle}
      disabled={disabled}
      ref={ref}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
        isOn ? 'bg-green-600' : 'bg-muted',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow transition-transform',
          isOn ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
})