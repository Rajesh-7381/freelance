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
              <button
                type="button"
                className={`service-card${open ? ' open' : ''}`}
                onClick={() => setOpenItem(open ? null : service.category)}
              >
                <div className="service-head">
                  <Icon name={service.icon} className="service-icon" />
                  <span>{service.category}</span>
                  <Icon name="chevron" className={`chevron${open ? ' rotated' : ''}`} />
                </div>
                <ul className="service-items">
                  {service.items.map((item) => (
                    <li key={item}>
                      <span>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
