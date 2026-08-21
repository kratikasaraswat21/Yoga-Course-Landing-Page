export default function AffiliateProductsLoading() {
  return (
    <main className="pdf-landing-page" aria-busy="true">
      <section className="pdf-landing-hero">
        <div className="kratika-yoga-container">
          <div className="course-loading-line wide" />
          <div className="course-loading-line" />
        </div>
      </section>
      <section className="pdf-landing-list-section">
        <div className="kratika-yoga-container pdf-landing-grid">
          {[1, 2, 3, 4].map((item) => <div className="paid-course-skeleton" key={item}><div /><span /><span /><span /></div>)}
        </div>
      </section>
    </main>
  );
}
