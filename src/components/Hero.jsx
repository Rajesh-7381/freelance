export default function Hero({ profile }) {
  const tags = String(profile.hero_tags || '')
    .split(/[•,|]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

  return (
    <section id="home" className="hero">
      <div className="wrap hero-inner">
        <h1>{profile.hero_title}</h1>
        <p className="hero-tags">
          {tags.map((tag, index) => (
            <span key={tag}>
              {index > 0 ? <span className="dot">•</span> : null}
              {tag}
            </span>
          ))}
        </p>
        <a className="btn" href="#contact">
          {profile.hero_cta}
        </a>
      </div>
    </section>
  )
}
