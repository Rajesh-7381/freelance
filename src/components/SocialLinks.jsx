import { Icon } from '../lib/icons'

export default function SocialLinks({ links, className = '' }) {
  return (
    <div className={`social-row ${className}`.trim()}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url || '#'}
          target={link.url.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          aria-label={link.label}
          className="icon-btn"
        >
          <Icon name={link.icon} className="social-icon" />
        </a>
      ))}
    </div>
  )
}
