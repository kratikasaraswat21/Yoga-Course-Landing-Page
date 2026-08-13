import Image from "next/image"
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react"

export type Course = {
  title: string
  description: string
  lessons: string
  completed: string
  progress: number
  imagePosition?: string
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <div className="course-image-wrap">
        <Image
          src="/images/auth/login-yoga.png"
          alt="Yoga practice in warm natural light"
          fill
          sizes="(max-width: 700px) 100vw, 340px"
          className="course-image"
          style={{ objectPosition: course.imagePosition ?? "center" }}
        />
        <span className="purchased-badge">Purchased</span>
      </div>
      <div className="course-card-body">
        <h3>{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="progress-meta"><span>{course.progress}%</span><span>{course.completed} of {course.lessons} lessons</span></div>
        <div className="progress-track"><span style={{ width: `${course.progress}%` }} /></div>
        <button className="primary-action">Continue course</button>
      </div>
    </article>
  )
}

export function PdfCard({ title, kind, pages, tone }: { title: string; kind: string; pages: string; tone: "clay" | "sage" }) {
  return (
    <article className="pdf-card">
      <div className={`pdf-cover ${tone}`}><span>{title}</span><small>{kind === "Workbook" ? "21-Day" : "Pranayama"}<br />Practice Guide</small></div>
      <div className="pdf-details"><h3>{title}</h3><span className="soft-badge">{kind}</span><p>{pages}</p><button className="primary-action">Open PDF</button><div className="pdf-purchased"><BookOpen size={17} /> Purchased</div></div>
    </article>
  )
}

export function ProductCard({ title, imagePosition = "center" }: { title: string; imagePosition?: string }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap"><Image src="/images/auth/login-yoga.png" alt="Yoga lifestyle product" fill sizes="300px" className="product-image" style={{ objectPosition: imagePosition }} /><span className="affiliate-badge">Affiliate</span></div>
      <div className="product-info"><h3>{title}</h3><button className="product-action">View product <ArrowRight size={16} /></button></div>
    </article>
  )
}

export function ExploreRow({ title, lessons, basePrice, discount, price, imagePosition }: { title: string; lessons: string; basePrice: string; discount: string; price: string; imagePosition?: string }) {
  return <article className="explore-row"><div className="explore-image"><Image src="/images/auth/login-yoga.png" alt={`${title} course`} fill sizes="220px" className="course-image" style={{ objectPosition: imagePosition ?? "center" }} /></div><div className="explore-copy"><h3>{title}</h3><span>{lessons} lessons</span><div className="explore-pricing"><del>{basePrice}</del><em>{discount} off</em><strong>{price}</strong></div><button>View course <ArrowRight size={15} /></button></div></article>
}

export function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="stat"><span className="stat-icon">{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>
}

export const completedIcon = <CheckCircle2 size={19} strokeWidth={1.5} />
