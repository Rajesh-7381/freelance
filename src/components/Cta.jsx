export default function Cta({ profile }) {
  return (
    <section className="cta">
      <div className="wrap cta-inner">
        <h2>
          {profile.cta_title}
          <span>{profile.cta_subtitle}</span>
        </h2>
        <a className="btn" href="#contact">
          {profile.cta_button}
        </a>
      </div>
    </section>
  )
}
