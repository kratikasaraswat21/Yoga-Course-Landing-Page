import Link from "next/link"
import { Flower2 } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="login-brand" aria-label="Kratika Yoga home">
      <Flower2 aria-hidden="true" strokeWidth={1.5} className="login-brand-icon" />
      <span>Kratika Yoga</span>
    </Link>
  )
}
