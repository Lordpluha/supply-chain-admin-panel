import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { cn } from 'cn'

function Drawer(props: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger(props: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose(props: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerBackdrop({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-backdrop"
      className={cn(
        'fixed inset-0 z-50 min-h-dvh bg-black [--backdrop-opacity:0.2] [--bleed:3rem] dark:[--backdrop-opacity:0.6]',
        // Fades with the swipe rather than only with the open state, so the
        // sheet feels attached to the finger dragging it.
        'opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
        'data-starting-style:opacity-0 data-ending-style:opacity-0 data-swiping:duration-0',
        className,
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props & { className?: string }) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerBackdrop />
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        className="fixed inset-0 z-50 flex items-end justify-center"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            'bg-popover text-popover-foreground border-border box-border w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-2xl border-t px-4 pt-3 outline-none [--bleed:3rem]',
            // The bleed is extra height below the fold, so an over-drag shows
            // more sheet rather than a gap under it.
            'mb-[calc(-1*var(--bleed))] max-h-[calc(85dvh+var(--bleed))] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+var(--bleed))]',
            'translate-y-(--drawer-swipe-movement-y) transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform motion-reduce:transition-none',
            'data-starting-style:translate-y-[calc(100%-var(--bleed)+2px)] data-ending-style:translate-y-[calc(100%-var(--bleed)+2px)]',
            className,
          )}
          {...props}
        >
          {/* The grip. Decorative — the sheet is dismissible by swipe, by the
              backdrop, by Escape and by its own buttons, so this is a hint
              rather than the only way out. */}
          <div className="bg-border mx-auto mb-3 h-1 w-12 rounded-full" aria-hidden="true" />
          {children}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn('flex flex-col gap-1 pb-3 text-center', className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('typo-label font-heading', className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('typo-caption text-muted-foreground', className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        'bg-popover border-border sticky bottom-0 -mx-4 mt-4 flex gap-2 border-t px-4 pt-3',
        className,
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
}
