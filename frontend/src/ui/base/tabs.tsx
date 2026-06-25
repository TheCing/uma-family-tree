import * as React from 'react'

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`w-full ${className || ''}`} {...props} />
))
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={`inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ${className || ''}`}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean
  }
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="tab"
    aria-selected={isActive}
    tabIndex={isActive ? 0 : -1}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-card text-foreground shadow-sm' : 'hover:bg-card/50'
      } ${className || ''}`}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isActive?: boolean
  }
>(({ className, isActive, ...props }, ref) => (
  <div
    ref={ref}
    role="tabpanel"
    hidden={!isActive}
    tabIndex={0}
    className={`mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ''}`}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
