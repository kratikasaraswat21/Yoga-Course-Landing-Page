import Image from "next/image"
import Link from "next/link"

import { logo } from "@/assets/image-assets"

export function Logo() {
  return (
    <Link href="/" className="login-brand" aria-label="Kratika Yoga home">
      <Image src={logo} alt="" width={48} height={48} className="login-brand-icon" priority />
      <span>Kratika Yoga</span>
    </Link>
  )
}
