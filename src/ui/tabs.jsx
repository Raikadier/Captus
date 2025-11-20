import * as React from 'react'
import { cn } from '../lib/utils'

const TabsContext = React.createContext(null)

export function Tabs({ defaultValue, value: controlledValue, onValueChange, className, ...props }) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
  const setValue = React.useCallback(
    (v) => {
      if (controlledValue === undefined) setUncontrolledValue(v)
      // minimal diagnostic log to validate interactions
      // eslint-disable-next-line no-console
      console.log('[Tabs] value change:', v)
      onValueChange?.(v)
    },
    [controlledValue, onValueChange],
  )

  const ctx = React.useMemo(() => ({ value, setValue }), [value, setValue])

  return (
    <TabsContext.Provider value={ctx}>
      <div className={cn('w-full', className)} {...props} />
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ value, className, onClick, ...props }) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')

  const isActive = ctx.value === value

  return (
    <button
      type="button"
      data-state={isActive ? 'active' : 'inactive'}
      onClick={(e) => {
        onClick?.(e)
        ctx.setValue(value)
      }}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
        'data-[state=inactive]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ value, className, ...props }) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')

  const isActive = ctx.value === value

  return (
    <div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      hidden={!isActive}
      className={cn('mt-2 focus-visible:outline-none', className)}
      {...props}
    />
  )
}
