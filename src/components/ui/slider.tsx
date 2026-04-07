import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-action-none select-none items-center py-4", className)}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-[6px] w-full grow overflow-hidden rounded-none"
      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,110,180,0.2)' }}
    >
      <SliderPrimitive.Range className="absolute h-full" style={{ background: 'var(--pink)' }} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block w-7 h-8 rounded-[2px] transition-transform hover:scale-y-110 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      style={{
        background: 'var(--pink)',
        boxShadow: '0 0 8px rgba(255,110,180,0.6), 2px 2px 0 rgba(0,0,0,0.4)',
        border: 'none',
        touchAction: 'none',
      }}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
