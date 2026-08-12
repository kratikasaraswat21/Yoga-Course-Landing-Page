import type { HTMLAttributes, ReactNode } from "react"

type SectionContainerProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
}

export function SectionContainer({ children, className = "", ...props }: SectionContainerProps) {
  return <section className={`dashboard-section ${className}`} {...props}>{children}</section>
}
