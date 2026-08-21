export interface NavLink { label: string; href: string; }
export interface FreeCourse { image: string; title: string; description: string; metadata: string; }
export interface Testimonial { name: string; course: string; rating: number; content: string; }
export interface EssentialProduct { title: string; description: string; action: string; }
export interface FooterColumn { title: string; links: NavLink[]; }
