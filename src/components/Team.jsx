import { Icon } from '../lib/icons'

export default function Team({ heading, people }) {
  return (
    <section id="team" className="band">
      <div className="wrap">
        <h2>THE MINDS</h2>
        <div className="team-grid">
          {people.map((person) => (
            <article key={person.name} className="team-card">
              {person.photo ? (
                <img src={person.photo} alt={person.name} />
              ) : (
                <div className="avatar">
                  <Icon name="person" className="avatar-icon" />
                </div>
              )}
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
