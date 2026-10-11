export default function CoursesLoading() {
  return (
    <main className="paid-course-page paid-course-loading" aria-busy="true">
      <section className="paid-course-hero">
        <div className="kratika-yoga-container">
          <div className="course-loading-line wide" />
          <div className="course-loading-line" />
          <div className="course-loading-line short" />
        </div>
      </section>
      <section className="paid-course-list-section">
        <div className="kratika-yoga-container">
          <div className="paid-course-list-grid">
            {[1, 2, 3].map((item) => (
              <div className="paid-course-skeleton" key={item}>
                <div />
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
