import { useEffect, useState } from 'react'

export default function Nav({ logo, items }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(items[0]?.href ?? '#services')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
    <header className={`site-header${scrolled ? ' scrolling' : ''}`}>
      <div className="wrap header-inner">
        <a
          href="#home"
          className="logo"
          onClick={(event) => goTo(event, '#home')}
        >
          <img
            src="/svg/WhatsApp_Image_2026-09-20_at_3.20.00_PM-removebg-preview.png"
            alt="Studio"
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              background: '#101010'
            }}
          />
        </a>
        <nav>
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={active === item.href ? 'active' : ''}
                  onClick={(event) => goTo(event, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
