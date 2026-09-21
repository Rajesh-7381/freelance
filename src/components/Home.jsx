import LetterGlitch from './LetterGlitch'
import SkillsList from './SkillsList'
import SocialLinks from './SocialLinks'

function Bio({ text, highlight }) {
  if (!highlight || !text.includes('{highlight}')) {
    const parts = text.split(highlight)
    if (!highlight || parts.length === 1) return text
    return parts.flatMap((part, index) =>
      index === 0
        ? [part]
        : [
            <span key={index} className="shiny-sec">
              {highlight}
            </span>,
            part,
          ],
    )
  }

  const [before, after] = text.split('{highlight}')
  return (
    <>
      {before}
      <span className="shiny-sec">{highlight}</span>
      {after}
    </>
  )
}

export default function Home({ profile, social, skills, services }) {
  const titleLines = String(profile.title || '').split(/\r?\n|\\n/)
  const marquee = [...skills, ...skills]

  return (
    <section id="home" className="home">
      <div className="wrap home-inner">
        <p className="greeting shiny-white">{profile.greeting}</p>
        <div className="hero-row">
          <h1>
            {titleLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          <p className="bio">
            <Bio text={profile.bio || ''} highlight={profile.highlight} />
          </p>
        </div>
        <SocialLinks links={social} className="hero-social" />

        <div className="logo-wall">
          <div className="fade fade-left" />
          <div className="fade fade-right" />
          <div className="marquee">
            {marquee.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="tech"
                aria-hidden={index >= skills.length}
              >
                <img src={`/svg/${skill.icon}`} alt="" />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home-split">
          <SkillsList heading={profile.services_heading} services={services} />
          <div className="glitch-wrap">
            <LetterGlitch />
          </div>
        </div>
      </div>
    </section>
  )
}
