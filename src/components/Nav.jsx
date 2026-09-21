import { useEffect, useState } from 'react'
import { Icon } from '../lib/icons'

export default function Nav({ items }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(items[0]?.href ?? '#home')
  const [width, setWidth] = useState('80%')

  useEffect(() => {
    const maxScroll = 1000

    const updateNav = () => {
      if (window.scrollY > 0) {
        setScrolled(true)
        const progress = Math.min(window.scrollY / maxScroll, 1)
        const ease = 1 - Math.pow(1 - progress, 4)
        const minWidth = 528
        const maxWidth = window.innerWidth * 0.8
        const current = maxWidth - (maxWidth - minWidth) * ease
        setWidth(window.innerWidth >= 768 ? `${current}px` : '100%')
      } else {
        setScrolled(false)
        setWidth(window.innerWidth >= 768 ? '80%' : '100%')
      }
    }

    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    window.addEventListener('resize', updateNav)
    return () => {
      window.removeEventListener('scroll', updateNav)
      window.removeEventListener('resize', updateNav)
    }
  }, [])

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { threshold: 0.35 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  const goTo = (event, href) => {
    event.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      id="main-nav"
      className={`site-nav${scrolled ? ' scrolling' : ''}`}
      style={{ width }}
    >
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={active === item.href ? 'active' : ''}
              onClick={(event) => goTo(event, item.href)}
            >
              <span className="nav-indicator" />
              <span className="nav-icon">
                <Icon name={item.icon} />
              </span>
              <span className="nav-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
