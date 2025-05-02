import * as React from "react"

const ChartStyle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="dark:text-white" ref={ref} {...props} />,
)
ChartStyle.displayName = "ChartStyle"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className="rounded-md border bg-popover p-4 text-sm shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-0 data-[state=open]:fade-in-100"
      ref={ref}
      {...props}
    />
  ),
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="space-y-1" ref={ref} {...props} />,
)
ChartTooltip.displayName = "ChartTooltip"

const ChartLegendContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="flex flex-wrap gap-2" ref={ref} {...props} />,
)
ChartLegendContent.displayName = "ChartLegendContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="hidden md:block" ref={ref} {...props} />,
)
ChartLegend.displayName = "ChartLegend"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="rounded-md border" ref={ref} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} {...props} />
))
Chart.displayName = "Chart"

export { Chart, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, ChartStyle }

