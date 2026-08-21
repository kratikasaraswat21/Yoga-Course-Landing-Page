interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="platform-section-intro">
      {eyebrow && <p className="platform-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
