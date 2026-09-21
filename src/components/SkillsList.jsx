import { useState } from 'react'
import { Icon } from '../lib/icons'

export default function SkillsList({ heading, services }) {
  const [openItem, setOpenItem] = useState(null)

  return (
    <div className="services">
      <h3>{heading}</h3>
      <ul className="service-list">
        {services.map((service) => {
          const open = openItem === service.category
          return (
            <li key={service.category}>
              <div className={`service-card${open ? ' open' : ''}`}>
                <button
                  type="button"
                  className="service-head"
                  onClick={() => setOpenItem(open ? null : service.category)}
                  aria-expanded={open}
                >
                  <Icon name={service.icon} className="service-icon" />
                  <span>{service.category}</span>
                  <Icon name="chevron" className={`chevron${open ? ' rotated' : ''}`} />
                </button>
                <div className="service-items">
                  <ul>
                    {service.items.map((item) => (
                      <li key={item}>
                        <span>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
