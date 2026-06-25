import * as React from 'react'
import { Tooltip as TooltipPrimitive } from 'radix-ui'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
}

const Tooltip = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 100,
}: TooltipProps) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          className="z-50 px-2 py-1 rounded-md bg-popover text-popover-foreground border border-border text-xs shadow-lg"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-popover" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
)

export default Tooltip
