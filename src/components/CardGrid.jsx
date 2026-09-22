import { Icon } from '../lib/icons'

export default function CardGrid({ id, heading, items }) {
  return (
    <section id={id} className="band">
      <div className="wrap">
        <h2>{heading}</h2>
        <div className="card-grid">
          {items.map((item) => (
            <article key={item.name} className="info-card">
              <Icon name={item.icon} className="card-icon" />
              <h3>{item.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
