import { Icon } from '../lib/icons'

export default function WhyUs({ heading, items }) {
  return (
    <section className="band">
      <div className="wrap">
        <h2>{heading}</h2>
        <ul className="why-list">
          {items.map((item) => (
            <li key={item}>
              <Icon name="check" className="check-icon" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
